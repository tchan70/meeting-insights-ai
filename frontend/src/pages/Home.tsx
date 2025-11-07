import { useState } from 'react'
import { TranscriptInput } from '../components/TranscriptInput'
import { AnalysisResults } from '../components/AnalysisResults'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { apiQuery } from '../lib/api-query'
import { z } from 'zod'
import { AnalysisResponseSchema } from '../lib/contract'

type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>

export function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [lastTranscript, setLastTranscript] = useState<string>('') // For retry functionality

  const analyseMutation = apiQuery.analyseTranscript.useMutation({
    onSuccess: (data) => {
      if (data.status === 200) {
        setAnalysis(data.body)
      }
    },
  })

  const handleSubmit = (transcript: string) => {
    setLastTranscript(transcript) // Save for retry
    setAnalysis(null) // Clear previous analysis
    analyseMutation.mutate({
      body: { transcript },
    })
  }

  const handleRetry = () => {
    if (lastTranscript) {
      analyseMutation.reset()
      analyseMutation.mutate({
        body: { transcript: lastTranscript },
      })
    }
  }

  const handleNewAnalysis = () => {
    setAnalysis(null)
    setLastTranscript('')
    analyseMutation.reset()
  }

  const handleDismissError = () => {
    analyseMutation.reset()
  }

  return (
    <div className="space-y-6">
      {/* Show input if no analysis yet */}
      {!analysis && (
        <TranscriptInput
          onSubmit={handleSubmit}
          isLoading={analyseMutation.isPending}
        />
      )}

      {/* Loading State */}
      {analyseMutation.isPending && (
        <LoadingSpinner message="Analyzing transcript with AI..." />
      )}

      {/* Error State with Retry */}
      {analyseMutation.isError && (
        <ErrorAlert
          error={
            analyseMutation.error instanceof Error
              ? analyseMutation.error
              : 'Failed to analyse transcript. Please try again.'
          }
          onRetry={handleRetry}
          onDismiss={handleDismissError}
        />
      )}

      {/* Success State - Show Results */}
      {analysis && analyseMutation.isSuccess && (
        <AnalysisResults
          analysis={analysis}
          onNewAnalysis={handleNewAnalysis}
        />
      )}
    </div>
  )
}
