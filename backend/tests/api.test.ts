import { describe, it, expect, vi, beforeEach } from 'vitest'
import express from 'express'
import request from 'supertest'
import { createExpressEndpoints } from '@ts-rest/express'

const mocks = vi.hoisted(() => ({
  AnalyseTranscript: vi.fn(),
  isWithinTokenLimit: vi.fn(),
  saveAnalysis: vi.fn(),
  getAnalysisById: vi.fn(),
  listAnalyses: vi.fn(),
  formatAnalysisResponse: vi.fn(),
}))

vi.mock('../src/services/openai.service', () => ({
  OpenAIService: class {
    AnalyseTranscript = mocks.AnalyseTranscript
    isWithinTokenLimit = mocks.isWithinTokenLimit
  },
}))

vi.mock('../src/services/database.service', () => ({
  DatabaseService: class {
    saveAnalysis = mocks.saveAnalysis
    getAnalysisById = mocks.getAnalysisById
    listAnalyses = mocks.listAnalyses
    formatAnalysisResponse = mocks.formatAnalysisResponse
  },
}))

import { contract, AnalysisResponseSchema } from '../src/contract'
import { router } from '../src/router'

function buildApp() {
  const app = express()
  app.use(express.json({ limit: '10mb' }))
  createExpressEndpoints(contract, router, app)
  return app
}

const app = buildApp()

const formattedResponse = {
  id: 'an-1',
  transcriptId: 'tr-1',
  sentiment: 'positive',
  sentimentSummary: 'Constructive.',
  actionItems: [
    {
      id: 'ai-1',
      description: 'Send the notes',
      owner: 'Sam',
      deadline: null,
      priority: 'medium',
    },
  ],
  decisions: [
    { id: 'd-1', description: 'Adopt Vitest', type: 'made', context: null },
  ],
  createdAt: '2026-02-01T10:30:00.000Z',
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.isWithinTokenLimit.mockReturnValue(true)
})

describe('POST /api/transcripts/Analyse', () => {
  it('returns 200 with a contract-valid body on the happy path', async () => {
    mocks.AnalyseTranscript.mockResolvedValue({})
    mocks.saveAnalysis.mockResolvedValue({ analysis: { id: 'an-1' } })
    mocks.formatAnalysisResponse.mockReturnValue(formattedResponse)

    const res = await request(app)
      .post('/api/transcripts/Analyse')
      .send({ transcript: 'We met to plan the Q3 roadmap in detail.' })

    expect(res.status).toBe(200)
    expect(res.body).toEqual(formattedResponse)
    // The wire format must satisfy the shared contract schema
    expect(AnalysisResponseSchema.safeParse(res.body).success).toBe(true)
  })

  it('returns 400 when the transcript fails contract validation (too short)', async () => {
    const res = await request(app)
      .post('/api/transcripts/Analyse')
      .send({ transcript: 'short' })

    expect(res.status).toBe(400)
    expect(mocks.AnalyseTranscript).not.toHaveBeenCalled()
  })

  it('returns 400 with a helpful message when over the token limit', async () => {
    mocks.isWithinTokenLimit.mockReturnValue(false)

    const res = await request(app)
      .post('/api/transcripts/Analyse')
      .send({ transcript: 'a'.repeat(49_000) })

    expect(res.status).toBe(400)
    expect(res.body.error).toContain('split it into smaller sections')
    expect(mocks.AnalyseTranscript).not.toHaveBeenCalled()
  })

  it('returns 400 when the AI service reports a user-facing error', async () => {
    mocks.AnalyseTranscript.mockRejectedValue(
      new Error('AI generated invalid JSON')
    )

    const res = await request(app)
      .post('/api/transcripts/Analyse')
      .send({ transcript: 'We met to plan the Q3 roadmap in detail.' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('AI generated invalid JSON')
  })

  it('returns 500 with a generic message when persistence fails', async () => {
    mocks.AnalyseTranscript.mockResolvedValue({})
    mocks.saveAnalysis.mockRejectedValue(new Error('connection refused'))

    const res = await request(app)
      .post('/api/transcripts/Analyse')
      .send({ transcript: 'We met to plan the Q3 roadmap in detail.' })

    expect(res.status).toBe(500)
    expect(res.body.error).toContain('Failed to Analyse transcript')
    // Internal error details must not leak to the client
    expect(JSON.stringify(res.body)).not.toContain('connection refused')
  })
})

describe('GET /api/analyses/:id', () => {
  it('returns 404 for an unknown analysis id', async () => {
    mocks.getAnalysisById.mockResolvedValue(null)

    const res = await request(app).get('/api/analyses/nope')

    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Analysis not found')
  })

  it('returns 200 with the formatted analysis when found', async () => {
    mocks.getAnalysisById.mockResolvedValue({ id: 'an-1' })
    mocks.formatAnalysisResponse.mockReturnValue(formattedResponse)

    const res = await request(app).get('/api/analyses/an-1')

    expect(res.status).toBe(200)
    expect(res.body).toEqual(formattedResponse)
  })

  it('returns 500 when the lookup throws', async () => {
    mocks.getAnalysisById.mockRejectedValue(new Error('db down'))

    const res = await request(app).get('/api/analyses/an-1')

    expect(res.status).toBe(500)
    expect(res.body.error).toBe('Failed to fetch analysis')
  })
})

describe('GET /api/analyses', () => {
  it('returns 200 with the analysis summaries', async () => {
    const summaries = [
      {
        id: 'an-1',
        transcriptId: 'tr-1',
        sentiment: 'neutral',
        createdAt: '2026-02-01T10:30:00.000Z',
        actionItemsCount: 3,
        decisionsCount: 1,
      },
    ]
    mocks.listAnalyses.mockResolvedValue(summaries)

    const res = await request(app).get('/api/analyses')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ analyses: summaries })
  })

  it('returns 500 when listing throws', async () => {
    mocks.listAnalyses.mockRejectedValue(new Error('db down'))

    const res = await request(app).get('/api/analyses')

    expect(res.status).toBe(500)
    expect(res.body.error).toBe('Failed to list analyses')
  })
})
