import { LoadingSpinnerProps } from '@/types'
import { Card } from 'primereact/card'
import { ProgressSpinner } from 'primereact/progressspinner'

export function LoadingSpinner({
  message = 'Loading...',
}: LoadingSpinnerProps) {
  return (
    <Card className="w-full">
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <ProgressSpinner
          style={{ width: '60px', height: '60px' }}
          strokeWidth="4"
          animationDuration="1s"
        />
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-gray-700">{message}</p>
          <p className="text-sm text-gray-500">
            This usually takes 5-10 seconds
          </p>
        </div>
      </div>
    </Card>
  )
}
