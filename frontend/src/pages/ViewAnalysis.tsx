import { useParams, useNavigate } from 'react-router-dom'
import { AnalysisResults } from '../components/AnalysisResults'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { apiQuery } from '../lib/api-query'

export function ViewAnalysis() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Fetch the analysis by ID
  const { data, isLoading, isError, error, refetch } =
    apiQuery.getAnalysis.useQuery(['analysis', id], { params: { id: id! } })

  const handleNewAnalysis = () => {
    navigate('/')
  }

  const handleRetry = () => {
    refetch()
  }

  // Loading State
  if (isLoading) {
    return <LoadingSpinner message="Loading analysis..." />
  }

  // Error State
  if (isError) {
    return (
      <ErrorAlert
        error={
          error instanceof Error
            ? error
            : 'Failed to load analysis. It may have been deleted or the ID is invalid.'
        }
        onRetry={handleRetry}
        onDismiss={handleNewAnalysis}
      />
    )
  }

  // Not Found State
  if (!data || data.status !== 200) {
    return (
      <ErrorAlert
        error="Analysis not found."
        onRetry={handleRetry}
        onDismiss={handleNewAnalysis}
      />
    )
  }

  // Success State - Show Results
  return (
    <AnalysisResults analysis={data.body} onNewAnalysis={handleNewAnalysis} />
  )
}
