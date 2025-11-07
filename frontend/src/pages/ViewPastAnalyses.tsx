import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorAlert } from '../components/ErrorAlert'
import { apiQuery } from '../lib/api-query'
import { Calendar, FileText, TrendingUp } from 'lucide-react'

export function ViewPastAnalyses() {
  const navigate = useNavigate()

  // Fetch all analyses
  const { data, isLoading, isError, error, refetch } =
    apiQuery.listAnalyses.useQuery(['analyses'])

  const handleRetry = () => {
    refetch()
  }

  const handleNewAnalysis = () => {
    navigate('/')
  }

  const handleViewAnalysis = (id: string) => {
    navigate(`/analyses/${id}`)
  }

  // Loading State
  if (isLoading) {
    return <LoadingSpinner message="Loading past analyses..." />
  }

  // Error State
  if (isError) {
    return (
      <ErrorAlert
        error={
          error instanceof Error
            ? error
            : 'Failed to load analyses. Please try again.'
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
        error="Failed to load analyses."
        onRetry={handleRetry}
        onDismiss={handleNewAnalysis}
      />
    )
  }

  const analyses = data.body.analyses

  // Empty State
  if (analyses.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No analyses yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by analyzing your first meeting transcript.
        </p>
        <div className="mt-6">
          <button
            onClick={handleNewAnalysis}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Create New Analysis
          </button>
        </div>
      </div>
    )
  }

  // Success State - Show List
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Past Analyses</h2>
        <button
          onClick={handleNewAnalysis}
          className="inline-flex items-center rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-300"
        >
          New Analysis
        </button>
      </div>

      <div className="grid gap-4">
        {analyses.map((analysis) => (
          <div
            key={analysis.id}
            onClick={() => handleViewAnalysis(analysis.id)}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium text-gray-900">
                    Sentiment: {analysis.sentiment}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>
                    {analysis.actionItemsCount} action item
                    {analysis.actionItemsCount !== 1 ? 's' : ''}
                  </span>
                  <span>
                    {analysis.decisionsCount} decision
                    {analysis.decisionsCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="text-blue-400 hover:text-blue-500">
                <span className="text-sm font-medium">View →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
