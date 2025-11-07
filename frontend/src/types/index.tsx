export interface LoadingSpinnerProps {
  message?: string
}

export interface TranscriptInputProps {
  onSubmit: (transcript: string) => void
  isLoading: boolean
}

export interface ErrorAlertProps {
  error: string | Error
  onRetry?: () => void
  onDismiss?: () => void
}
