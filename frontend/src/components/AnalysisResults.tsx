import { z } from 'zod'
import { AnalysisResponseSchema } from '../lib/contract'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import { Divider } from 'primereact/divider'
import { Button } from 'primereact/button'

type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>

interface AnalysisResultsProps {
  analysis: AnalysisResponse
  onNewAnalysis: () => void
}

export function AnalysisResults({
  analysis,
  onNewAnalysis,
}: AnalysisResultsProps) {
  const getSentimentColor = (
    sentiment: string
  ): 'success' | 'info' | 'warning' | 'danger' => {
    const lower = sentiment.toLowerCase()
    if (
      lower.includes('positive') ||
      lower.includes('productive') ||
      lower.includes('constructive')
    ) {
      return 'success'
    }
    if (
      lower.includes('negative') ||
      lower.includes('tense') ||
      lower.includes('conflict')
    ) {
      return 'danger'
    }
    if (lower.includes('neutral')) {
      return 'info'
    }
    return 'info'
  }

  const getPriorityColor = (
    priority: string | null
  ): 'danger' | 'warning' | 'info' | undefined => {
    if (!priority) return undefined
    if (priority === 'high') return 'danger'
    if (priority === 'medium') return 'warning'
    if (priority === 'low') return 'info'
    return undefined
  }

  const getPriorityIcon = (priority: string | null): string => {
    if (!priority) return 'pi-circle'
    if (priority === 'high') return 'pi-exclamation-circle'
    if (priority === 'medium') return 'pi-exclamation-triangle'
    return 'pi-info-circle'
  }

  return (
    <div className="space-y-4">
      {/* Header with New Analysis button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Analysis Results
        </h2>
        <Button
          label="New Analysis"
          icon="pi pi-plus"
          onClick={onNewAnalysis}
          className="bg-green-200 text-green-700 border-green-300 hover:bg-green-200 p-3"
        />
      </div>

      {/* Sentiment Card */}
      <Card>
        <div className="flex items-start gap-3">
          <i className="pi pi-chart-line text-3xl text-blue-500 mt-1"></i>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Meeting Sentiment
              </h3>
              <Tag
                value={
                  analysis.sentiment.charAt(0).toUpperCase() +
                  analysis.sentiment.slice(1)
                }
                severity={getSentimentColor(analysis.sentiment)}
                rounded
                className="p-1.5 pl-2 pr-2"
              />
            </div>
            {analysis.sentimentSummary && (
              <p className="text-gray-700">{analysis.sentimentSummary}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Action Items Card */}
      <Card>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <i className="pi pi-check-square text-2xl text-green-600"></i>
            <h3 className="text-lg font-semibold text-gray-800">
              Action Items{' '}
              {analysis.actionItems.length > 0 &&
                `(${analysis.actionItems.length})`}
            </h3>
          </div>

          {analysis.actionItems.length === 0 ? (
            <p className="text-gray-500 italic">No action items identified</p>
          ) : (
            <div className="space-y-3">
              {analysis.actionItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {item.priority && (
                      <i
                        className={`pi ${getPriorityIcon(
                          item.priority
                        )} text-lg mt-0.5`}
                        style={{
                          color:
                            item.priority === 'high'
                              ? '#ef4444'
                              : item.priority === 'medium'
                              ? '#f97316'
                              : '#3b82f6',
                        }}
                      ></i>
                    )}
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium mb-2">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.owner && (
                          <Tag
                            icon="pi pi-user"
                            value={item.owner}
                            severity="info"
                            className="p-1.5 pl-2 pr-2"
                          />
                        )}
                        {item.deadline && (
                          <Tag
                            icon="pi pi-calendar"
                            value={item.deadline}
                            severity="warning"
                            className="p-1.5 pl-2 pr-2"
                          />
                        )}
                        {item.priority && (
                          <Tag
                            value={item.priority.toUpperCase()}
                            severity={getPriorityColor(item.priority)}
                            className="p-1.5 pl-2 pr-2"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Decisions Card */}
      <Card>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <i className="pi pi-flag text-2xl text-purple-600"></i>
            <h3 className="text-lg font-semibold text-gray-800">
              Decisions{' '}
              {analysis.decisions.length > 0 &&
                `(${analysis.decisions.length})`}
            </h3>
          </div>

          {analysis.decisions.length === 0 ? (
            <p className="text-gray-500 italic">No decisions identified</p>
          ) : (
            <div className="space-y-3">
              {analysis.decisions.map((decision) => (
                <div
                  key={decision.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <i
                      className={`pi ${
                        decision.type === 'made'
                          ? 'pi-check-circle'
                          : 'pi-clock'
                      } text-lg mt-0.5`}
                      style={{
                        color: decision.type === 'made' ? '#10b981' : '#f59e0b',
                      }}
                    ></i>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-gray-800 font-medium flex-1">
                          {decision.description}
                        </p>
                        <Tag
                          value={
                            decision.type === 'made' ? 'DECIDED' : 'PENDING'
                          }
                          severity={
                            decision.type === 'made' ? 'success' : 'warning'
                          }
                          rounded
                          className="p-1.5 pl-2 pr-2"
                        />
                      </div>
                      {decision.context && (
                        <p className="text-sm text-gray-600 mt-1">
                          {decision.context}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Divider />

      {/* Metadata */}
      <div className="text-sm text-gray-500 text-center">
        Analysis ID: {analysis.id} • Generated:{' '}
        {new Date(analysis.createdAt).toLocaleString()}
      </div>
    </div>
  )
}
