import { describe, it, expect } from 'vitest'
import {
  TranscriptInputSchema,
  ActionItemSchema,
  DecisionSchema,
  AnalysisResponseSchema,
} from '../src/contract'

describe('TranscriptInputSchema', () => {
  it('rejects a transcript under 10 characters with a helpful message', () => {
    const result = TranscriptInputSchema.safeParse({ transcript: 'too short' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 10 characters')
    }
  })

  it('accepts a transcript of exactly 10 characters', () => {
    expect(
      TranscriptInputSchema.safeParse({ transcript: 'a'.repeat(10) }).success
    ).toBe(true)
  })

  it('accepts a transcript of exactly 50,000 characters', () => {
    expect(
      TranscriptInputSchema.safeParse({ transcript: 'a'.repeat(50_000) }).success
    ).toBe(true)
  })

  it('rejects a transcript over 50,000 characters with a helpful message', () => {
    const result = TranscriptInputSchema.safeParse({
      transcript: 'a'.repeat(50_001),
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('too long')
    }
  })

  it('rejects a missing transcript field', () => {
    expect(TranscriptInputSchema.safeParse({}).success).toBe(false)
  })
})

describe('ActionItemSchema', () => {
  const base = {
    id: 'ai-1',
    description: 'Send the report',
    owner: 'Sam',
    deadline: 'Friday',
    priority: 'high',
  }

  it('accepts a fully populated action item', () => {
    expect(ActionItemSchema.safeParse(base).success).toBe(true)
  })

  it('accepts null owner, deadline, and priority', () => {
    expect(
      ActionItemSchema.safeParse({
        ...base,
        owner: null,
        deadline: null,
        priority: null,
      }).success
    ).toBe(true)
  })

  it('rejects a priority outside the enum', () => {
    expect(
      ActionItemSchema.safeParse({ ...base, priority: 'urgent' }).success
    ).toBe(false)
  })
})

describe('DecisionSchema', () => {
  const base = {
    id: 'd-1',
    description: 'Ship v2 next sprint',
    type: 'made',
    context: null,
  }

  it('accepts made and pending decision types', () => {
    expect(DecisionSchema.safeParse(base).success).toBe(true)
    expect(
      DecisionSchema.safeParse({ ...base, type: 'pending' }).success
    ).toBe(true)
  })

  it('rejects a decision type outside the enum', () => {
    expect(
      DecisionSchema.safeParse({ ...base, type: 'deferred' }).success
    ).toBe(false)
  })
})

describe('AnalysisResponseSchema', () => {
  const valid = {
    id: 'an-1',
    transcriptId: 'tr-1',
    sentiment: 'positive',
    sentimentSummary: 'Constructive discussion.',
    actionItems: [
      {
        id: 'ai-1',
        description: 'Send the report',
        owner: null,
        deadline: null,
        priority: null,
      },
    ],
    decisions: [
      { id: 'd-1', description: 'Ship v2', type: 'made', context: null },
    ],
    createdAt: new Date('2026-01-01T09:00:00Z').toISOString(),
  }

  it('accepts a complete analysis response', () => {
    expect(AnalysisResponseSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts empty action item and decision lists', () => {
    expect(
      AnalysisResponseSchema.safeParse({
        ...valid,
        actionItems: [],
        decisions: [],
      }).success
    ).toBe(true)
  })

  it('rejects a response missing actionItems', () => {
    const { actionItems: _drop, ...rest } = valid
    expect(AnalysisResponseSchema.safeParse(rest).success).toBe(false)
  })
})
