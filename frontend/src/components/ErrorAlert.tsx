import { Message } from 'primereact/message'
import { Button } from 'primereact/button'
import { ErrorAlertProps } from '@/types'

export function ErrorAlert({ error, onRetry, onDismiss }: ErrorAlertProps) {
  const errorMessage = error instanceof Error ? error.message : error

  // Extract user-friendly message
  const getUserFriendlyMessage = (msg: string): string => {
    if (msg.includes('quota') || msg.includes('429')) {
      return 'OpenAI API quota exceeded. Please check your billing details or try again later.'
    }
    if (msg.includes('network') || msg.includes('fetch')) {
      return 'Network error. Please check your connection and ensure the backend server is running.'
    }
    if (msg.includes('timeout')) {
      return 'Request timed out. The transcript might be too long or the server is busy.'
    }
    if (msg.includes('401') || msg.includes('unauthorized')) {
      return 'Authentication error. Please check your API key configuration.'
    }
    if (msg.includes('Invalid JSON') || msg.includes('parse')) {
      return 'AI generated an invalid response. Please try again.'
    }
    return msg
  }

  const displayMessage = getUserFriendlyMessage(errorMessage)
  const showDetails = errorMessage !== displayMessage

  return (
    <div className="w-full space-y-3">
      <Message
        severity="error"
        className="w-full"
        content={
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
              <i className="pi pi-exclamation-triangle text-xl"></i>
              <span className="font-semibold">Analysis Failed</span>
            </div>
            <p className="text-sm">{displayMessage}</p>
            {showDetails && (
              <details className="text-xs opacity-75 mt-1">
                <summary className="cursor-pointer hover:opacity-100">
                  Technical details
                </summary>
                <pre className="mt-2 p-2 bg-red-50 rounded border border-red-200 overflow-x-auto">
                  {errorMessage}
                </pre>
              </details>
            )}
          </div>
        }
      />

      <div className="flex gap-3">
        {onRetry && (
          <Button
            label="Retry Analysis"
            icon="pi pi-refresh"
            severity="danger"
            outlined
            onClick={onRetry}
            className="flex-1"
          />
        )}
        {onDismiss && (
          <Button
            label="Dismiss"
            icon="pi pi-times"
            severity="secondary"
            text
            onClick={onDismiss}
          />
        )}
      </div>
    </div>
  )
}
