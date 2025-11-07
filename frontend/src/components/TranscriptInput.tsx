import { useState } from 'react'
import { Card } from 'primereact/card'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { TranscriptInputProps } from '@/types'

const SAMPLE_TRANSCRIPT = `Hey team, thanks for joining. I wanted to kick off this project planning session for Q1.

Sarah, you mentioned last week you'd have the API design doc ready - do you have an update on that?

Sarah: Yes, I finished it yesterday. The main decision we need to make is whether to use REST or GraphQL. I'm leaning toward REST for simplicity, but I want to hear thoughts.

Mike: I agree with REST. We can always add GraphQL later if we need it. When can you start implementation?

Sarah: I can start next Monday. I'll need about 2 weeks for the initial version.

Great, let's move forward with REST. Mike, can you handle the frontend integration once Sarah's API is ready?

Mike: Yep, I'll block out the last week of January for that.

Perfect. One more thing - we need to nail down our database choice. Are we going with Postgres or MongoDB?

Sarah: I vote Postgres. We'll need transactions and relational data.

Mike: Agreed on Postgres.

Alright, Postgres it is. Sarah, can you set up the initial schema by end of week?
Sarah: Will do.

Awesome. Let's reconvene next Wednesday to check progress. Thanks everyone!`

export function TranscriptInput({ onSubmit, isLoading }: TranscriptInputProps) {
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    setError(null)

    if (!transcript.trim()) {
      setError('Please enter a transcript')
      return
    }

    if (transcript.length < 10) {
      setError('Transcript is too short (minimum 10 characters)')
      return
    }

    if (transcript.length > 50000) {
      setError('Transcript is too long (maximum 50,000 characters)')
      return
    }

    onSubmit(transcript)
  }

  const handleLoadSample = () => {
    setTranscript(SAMPLE_TRANSCRIPT)
    setError(null)
  }

  const handleClear = () => {
    setTranscript('')
    setError(null)
  }

  const charCount = transcript.length
  const isOverLimit = charCount > 50000
  const isNearLimit = charCount > 45000

  return (
    <Card className="w-full">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Meeting Transcript
          </h2>

          <InputTextarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={12}
            className="w-full"
            placeholder="Paste your meeting transcript here...

Example:
'Team meeting about Q1 planning. Sarah will complete the API design by Monday. We decided to use PostgreSQL...'"
            disabled={isLoading}
          />

          {/* Character count */}
          <div className="flex justify-end mt-2">
            <span
              className={`text-sm ${
                isOverLimit
                  ? 'text-red-600 font-semibold'
                  : isNearLimit
                  ? 'text-orange-600'
                  : 'text-gray-600'
              }`}
            >
              {charCount.toLocaleString()} / 50,000 characters
            </span>
          </div>

          {/* Error message */}
          {error && (
            <Message severity="error" text={error} className="w-full mt-3" />
          )}

          {/* Action buttons at bottom */}
          <div className="flex gap-3 mt-4 border border-gray-300 rounded-lg p-2">
            <Button
              label="Load Sample"
              icon="pi pi-file-import"
              severity="secondary"
              outlined
              onClick={handleLoadSample}
              disabled={isLoading}
              className="flex-1 transition-all duration-200 hover:scale-105 hover:shadow-md"
            />
            <div className="w-px bg-gray-300" />
            <Button
              label="Clear"
              icon="pi pi-times"
              severity="secondary"
              outlined
              onClick={handleClear}
              disabled={isLoading || !transcript}
              className="flex-1 transition-all duration-200 hover:scale-105 hover:shadow-md"
            />
            <div className="w-px bg-gray-300" />
            <Button
              label="Analyse Meeting"
              icon={isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-search'}
              severity="success"
              onClick={handleSubmit}
              disabled={isLoading || !transcript.trim() || isOverLimit}
              className="flex-[2] transition-all duration-200 hover:scale-105 hover:shadow-md"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
