import OpenAI from 'openai'
import { z } from 'zod'

// Schema for LLM response validation
const LLMResponseSchema = z.object({
  sentiment: z.string(),
  sentimentSummary: z.string(),
  actionItems: z.array(
    z.object({
      description: z.string(),
      owner: z.string().nullable(),
      deadline: z.string().nullable(),
      priority: z.enum(['high', 'medium', 'low']).nullable(),
    })
  ),
  decisions: z.array(
    z.object({
      description: z.string(),
      type: z.enum(['made', 'pending']),
      context: z.string().nullable(),
    })
  ),
})

export type LLMAnalysisResult = z.infer<typeof LLMResponseSchema>

export class OpenAIService {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async AnalyseTranscript(transcript: string): Promise<LLMAnalysisResult> {
    const systemPrompt = `You are an expert meeting minutes specialist and executive assistant. Your role is to Analyse meeting transcripts and extract actionable insights in a clear, concise manner.

Guidelines:
- Remove filler words and redundant content
- Focus on concrete outcomes and decisions
- Identify specific action items with clear ownership
- Note when decisions are pending or require follow-up
- Assess the overall tone professionally
- Be concise and avoid corporate jargon

Return your analysis in structured JSON format.`

    const userPrompt = `Analyse this meeting transcript and extract:

1. **Action Items**: Specific tasks with:
   - Clear description (concise, actionable)
   - Assigned owner (if mentioned, otherwise null)
   - Deadline (if mentioned, otherwise null)
   - Priority level: "high", "medium", "low", or null (infer from context - urgent language, explicit priority mentions, or deadlines suggest high priority)

2. **Decisions**: Both made and pending:
   - What was decided or needs deciding
   - Type: "made" or "pending"
   - Brief context if relevant (otherwise null)

3. **Sentiment/Tone**: Overall meeting atmosphere:
   - One word: positive, negative, neutral, constructive, tense, productive, etc.
   - Brief 1-2 sentence summary of the tone

Be specific and actionable. Avoid vague statements.

Transcript:
${transcript}

Return ONLY valid JSON matching this exact structure (no markdown, no code blocks):
{
  "sentiment": "string",
  "sentimentSummary": "string",
  "actionItems": [{"description": "string", "owner": "string or null", "deadline": "string or null", "priority": "high or medium or low or null"}],
  "decisions": [{"description": "string", "type": "made or pending", "context": "string or null"}]
}`

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini', // Cost-effective and fast
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3, // Lower temperature for more consistent output
        response_format: { type: 'json_object' }, // Ensures JSON response
      })

      const content = completion.choices[0]?.message?.content

      if (!content) {
        throw new Error('No response from OpenAI')
      }

      // Parse and validate the JSON response
      const parsed = JSON.parse(content)
      const validated = LLMResponseSchema.parse(parsed)

      return validated
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('LLM response validation failed:', error.errors)
        throw new Error('AI generated invalid response format')
      }

      if (error instanceof SyntaxError) {
        console.error('Failed to parse LLM response as JSON:', error)
        throw new Error('AI generated invalid JSON')
      }

      if (error instanceof OpenAI.APIError) {
        console.error('OpenAI API error:', error.message)
        throw new Error(`AI service error: ${error.message}`)
      }

      throw error
    }
  }

  /**
   * Estimate token count for a transcript
   * Rough estimate: 1 token ≈ 4 characters
   */
  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4)
  }

  /**
   * Check if transcript is within token limits
   */
  isWithinTokenLimit(transcript: string, maxTokens: number = 12000): boolean {
    return this.estimateTokens(transcript) <= maxTokens
  }
}
