import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

// Zod schemas for validation
export const ActionItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  owner: z.string().nullable(),
  deadline: z.string().nullable(),
  priority: z.enum(['high', 'medium', 'low']).nullable(),
});

export const DecisionSchema = z.object({
  id: z.string(),
  description: z.string(),
  type: z.enum(['made', 'pending']),
  context: z.string().nullable(),
});

export const AnalysisResponseSchema = z.object({
  id: z.string(),
  transcriptId: z.string(),
  sentiment: z.string(),
  sentimentSummary: z.string().nullable(),
  actionItems: z.array(ActionItemSchema),
  decisions: z.array(DecisionSchema),
  createdAt: z.string(),
});

export const TranscriptInputSchema = z.object({
  transcript: z
    .string()
    .min(10, 'Transcript must be at least 10 characters')
    .max(50000, 'Transcript is too long. Please limit to 50,000 characters'),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});

// API Contract
export const contract = c.router({
  analyzeTranscript: {
    method: 'POST',
    path: '/api/transcripts/analyze',
    responses: {
      200: AnalysisResponseSchema,
      400: ErrorResponseSchema,
      500: ErrorResponseSchema,
    },
    body: TranscriptInputSchema,
    summary: 'Analyze a meeting transcript',
  },
  getAnalysis: {
    method: 'GET',
    path: '/api/analyses/:id',
    responses: {
      200: AnalysisResponseSchema,
      404: ErrorResponseSchema,
      500: ErrorResponseSchema,
    },
    summary: 'Get analysis by ID',
  },
  listAnalyses: {
    method: 'GET',
    path: '/api/analyses',
    responses: {
      200: z.object({
        analyses: z.array(
          z.object({
            id: z.string(),
            transcriptId: z.string(),
            sentiment: z.string(),
            createdAt: z.string(),
            actionItemsCount: z.number(),
            decisionsCount: z.number(),
          })
        ),
      }),
      500: ErrorResponseSchema,
    },
    summary: 'List all analyses',
  },
});

export type Contract = typeof contract;
