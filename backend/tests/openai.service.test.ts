import { describe, it, expect, vi } from 'vitest'
import OpenAI from 'openai'
import { OpenAIService, LLMAnalysisResult } from '../src/services/openai.service'

const validLLMResult: LLMAnalysisResult = {
  sentiment: 'positive',
  sentimentSummary: 'Productive planning session.',
  actionItems: [
    {
      description: 'Draft the Q3 roadmap',
      owner: 'Alex',
      deadline: 'next Friday',
      priority: 'high',
    },
  ],
  decisions: [
    { description: 'Adopt trunk-based development', type: 'made', context: null },
  ],
}

/** Build a service whose OpenAI client returns the given message content. */
function serviceReturning(content: string | null | undefined) {
  const service = new OpenAIService('test-key')
  const create = vi.fn().mockResolvedValue({
    choices: [{ message: { content } }],
  })
  ;(service as any).client = { chat: { completions: { create } } }
  return { service, create }
}

function serviceRejecting(error: unknown) {
  const service = new OpenAIService('test-key')
  const create = vi.fn().mockRejectedValue(error)
  ;(service as any).client = { chat: { completions: { create } } }
  return { service, create }
}

describe('estimateTokens', () => {
  const service = new OpenAIService('test-key')

  it('estimates 1 token per 4 characters, rounding up', () => {
    expect(service.estimateTokens('abcd')).toBe(1)
    expect(service.estimateTokens('abcde')).toBe(2)
  })

  it('returns 0 for an empty string', () => {
    expect(service.estimateTokens('')).toBe(0)
  })
})

describe('isWithinTokenLimit', () => {
  const service = new OpenAIService('test-key')

  it('accepts a transcript at exactly the 12,000-token default limit', () => {
    expect(service.isWithinTokenLimit('a'.repeat(48_000))).toBe(true)
  })

  it('rejects a transcript one character over the default limit', () => {
    expect(service.isWithinTokenLimit('a'.repeat(48_001))).toBe(false)
  })

  it('honours a custom token limit', () => {
    expect(service.isWithinTokenLimit('a'.repeat(41), 10)).toBe(false)
    expect(service.isWithinTokenLimit('a'.repeat(40), 10)).toBe(true)
  })
})

describe('AnalyseTranscript', () => {
  it('returns the validated result for a well-formed LLM response', async () => {
    const { service, create } = serviceReturning(JSON.stringify(validLLMResult))
    const result = await service.AnalyseTranscript('The team met to plan Q3.')
    expect(result).toEqual(validLLMResult)
    expect(create).toHaveBeenCalledOnce()
    const call = create.mock.calls[0][0]
    expect(call.response_format).toEqual({ type: 'json_object' })
    expect(call.messages[1].content).toContain('The team met to plan Q3.')
  })

  it('throws a clear error when the LLM returns no content', async () => {
    const { service } = serviceReturning(null)
    await expect(service.AnalyseTranscript('x'.repeat(20))).rejects.toThrow(
      'No response from OpenAI'
    )
  })

  it('throws a clear error when the LLM returns invalid JSON', async () => {
    const { service } = serviceReturning('```json\n{"sentiment": "positive"}\n```')
    await expect(service.AnalyseTranscript('x'.repeat(20))).rejects.toThrow(
      'AI generated invalid JSON'
    )
  })

  it('throws a clear error when the LLM response fails schema validation', async () => {
    // Valid JSON, but actionItems items are missing required fields
    const { service } = serviceReturning(
      JSON.stringify({ sentiment: 'positive', actionItems: [{}], decisions: [] })
    )
    await expect(service.AnalyseTranscript('x'.repeat(20))).rejects.toThrow(
      'AI generated invalid response format'
    )
  })

  it('wraps OpenAI API errors with a user-facing message', async () => {
    const apiError = Object.create(OpenAI.APIError.prototype)
    Object.defineProperty(apiError, 'message', {
      value: 'rate limited',
      enumerable: true,
    })
    const { service } = serviceRejecting(apiError)
    await expect(service.AnalyseTranscript('x'.repeat(20))).rejects.toThrow(
      'AI service error: rate limited'
    )
  })

  it('re-throws unknown errors untouched', async () => {
    const { service } = serviceRejecting(new Error('socket hang up'))
    await expect(service.AnalyseTranscript('x'.repeat(20))).rejects.toThrow(
      'socket hang up'
    )
  })
})
