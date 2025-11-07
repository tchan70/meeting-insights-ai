import { initServer } from '@ts-rest/express'
import { contract } from './contract'
import { OpenAIService } from './services/openai.service'
import { DatabaseService } from './services/database.service'

const openAIService = new OpenAIService(process.env.OPENAI_API_KEY!)
const dbService = new DatabaseService()

const s = initServer()

export const router = s.router(contract, {
  AnalyseTranscript: async ({ body }) => {
    try {
      const { transcript } = body

      // Check token limits
      if (!openAIService.isWithinTokenLimit(transcript)) {
        return {
          status: 400,
          body: {
            error:
              'Transcript is too long. Please split it into smaller sections or reduce the content.',
          },
        }
      }

      // Analyse with OpenAI
      const analysisResult = await openAIService.AnalyseTranscript(transcript)

      // Save to database
      const saved = await dbService.saveAnalysis(transcript, analysisResult)

      if (!saved.analysis) {
        throw new Error('Failed to save analysis')
      }

      // Format response
      const response = dbService.formatAnalysisResponse({
        ...saved.analysis,
        transcript: saved,
      })

      return {
        status: 200,
        body: response,
      }
    } catch (error) {
      console.error('Error analyzing transcript:', error)

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'

      // Check if it's a validation or user error vs system error
      if (errorMessage.includes('AI') || errorMessage.includes('invalid')) {
        return {
          status: 400,
          body: { error: errorMessage },
        }
      }

      return {
        status: 500,
        body: { error: 'Failed to Analyse transcript. Please try again.' },
      }
    }
  },

  getAnalysis: async ({ params }) => {
    try {
      const analysis = await dbService.getAnalysisById(params.id)

      if (!analysis) {
        return {
          status: 404,
          body: { error: 'Analysis not found' },
        }
      }

      const response = dbService.formatAnalysisResponse(analysis)

      return {
        status: 200,
        body: response,
      }
    } catch (error) {
      console.error('Error fetching analysis:', error)
      return {
        status: 500,
        body: { error: 'Failed to fetch analysis' },
      }
    }
  },

  listAnalyses: async () => {
    try {
      const analyses = await dbService.listAnalyses()

      return {
        status: 200,
        body: { analyses },
      }
    } catch (error) {
      console.error('Error listing analyses:', error)
      return {
        status: 500,
        body: { error: 'Failed to list analyses' },
      }
    }
  },
})
