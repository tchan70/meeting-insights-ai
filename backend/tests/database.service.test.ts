import { describe, it, expect, vi, beforeEach } from 'vitest'

const prismaMock = vi.hoisted(() => ({
  transcript: { create: vi.fn() },
  analysis: { findUnique: vi.fn(), findMany: vi.fn() },
}))

vi.mock('../src/lib/prisma', () => ({ prisma: prismaMock }))

import { DatabaseService } from '../src/services/database.service'

const service = new DatabaseService()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('saveAnalysis', () => {
  it('creates the transcript with nested analysis, action items, and decisions', async () => {
    prismaMock.transcript.create.mockResolvedValue({ id: 'tr-1' })

    await service.saveAnalysis('We agreed to ship on Friday.', {
      sentiment: 'positive',
      sentimentSummary: 'Focused.',
      actionItems: [
        { description: 'Ship it', owner: 'Sam', deadline: 'Friday', priority: 'high' },
      ],
      decisions: [{ description: 'Ship Friday', type: 'made', context: null }],
    })

    expect(prismaMock.transcript.create).toHaveBeenCalledOnce()
    const args = prismaMock.transcript.create.mock.calls[0][0]
    expect(args.data.content).toBe('We agreed to ship on Friday.')
    expect(args.data.analysis.create.sentiment).toBe('positive')
    expect(args.data.analysis.create.actionItems.create).toHaveLength(1)
    expect(args.data.analysis.create.decisions.create).toHaveLength(1)
    // The response must include the nested rows the API formats from
    expect(args.include.analysis.include).toEqual({
      actionItems: true,
      decisions: true,
    })
  })
})

describe('listAnalyses', () => {
  it('maps rows to summary objects with counts and ISO dates', async () => {
    prismaMock.analysis.findMany.mockResolvedValue([
      {
        id: 'an-1',
        transcriptId: 'tr-1',
        sentiment: 'neutral',
        createdAt: new Date('2026-02-01T10:30:00Z'),
        _count: { actionItems: 3, decisions: 2 },
      },
    ])

    const result = await service.listAnalyses()

    expect(result).toEqual([
      {
        id: 'an-1',
        transcriptId: 'tr-1',
        sentiment: 'neutral',
        createdAt: '2026-02-01T10:30:00.000Z',
        actionItemsCount: 3,
        decisionsCount: 2,
      },
    ])
  })
})

describe('formatAnalysisResponse', () => {
  it('shapes a DB row into the API response with ISO createdAt', () => {
    const formatted = service.formatAnalysisResponse({
      id: 'an-1',
      transcriptId: 'tr-1',
      sentiment: 'positive',
      sentimentSummary: 'Upbeat.',
      createdAt: new Date('2026-02-01T10:30:00Z'),
      actionItems: [
        {
          id: 'ai-1',
          description: 'Send notes',
          owner: null,
          deadline: null,
          priority: 'low',
        },
      ],
      decisions: [
        { id: 'd-1', description: 'Adopt Vitest', type: 'made', context: 'CI' },
      ],
    } as any)

    expect(formatted).toEqual({
      id: 'an-1',
      transcriptId: 'tr-1',
      sentiment: 'positive',
      sentimentSummary: 'Upbeat.',
      createdAt: '2026-02-01T10:30:00.000Z',
      actionItems: [
        {
          id: 'ai-1',
          description: 'Send notes',
          owner: null,
          deadline: null,
          priority: 'low',
        },
      ],
      decisions: [
        { id: 'd-1', description: 'Adopt Vitest', type: 'made', context: 'CI' },
      ],
    })
  })
})
