import { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';

interface TranscriptInputProps {
  onSubmit: (transcript: string) => void;
  isLoading: boolean;
}

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

Awesome. Let's reconvene next Wednesday to check progress. Thanks everyone!`;

export function TranscriptInput({ onSubmit, isLoading }: TranscriptInputProps) {
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);

    if (!transcript.trim()) {
      setError('Please enter a transcript');
      return;
    }

    if (transcript.length < 10) {
      setError('Transcript is too short (minimum 10 characters)');
      return;
    }

    if (transcript.length > 50000) {
      setError('Transcript is too long (maximum 50,000 characters)');
      return;
    }

    onSubmit(transcript);
  };

  const handleLoadSample = () => {
    setTranscript(SAMPLE_TRANSCRIPT);
    setError(null);
  };

  const handleClear = () => {
    setTranscript('');
    setError(null);
  };

  return (
    <Card className="w-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            Meeting Transcript
          </h2>
          <div className="flex gap-2">
            <Button
              label="Load Sample"
              icon="pi pi-file"
              outlined
              size="small"
              onClick={handleLoadSample}
              disabled={isLoading}
            />
            <Button
              label="Clear"
              icon="pi pi-times"
              outlined
              severity="secondary"
              size="small"
              onClick={handleClear}
              disabled={isLoading || !transcript}
            />
          </div>
        </div>

        <div>
          <InputTextarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={12}
            className="w-full"
            placeholder="Paste your meeting transcript here...&#10;&#10;Example:&#10;'Team meeting about Q1 planning. Sarah will complete the API design by Monday. We decided to use PostgreSQL...'"
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
            <span>{transcript.length.toLocaleString()} characters</span>
            <span className={transcript.length > 50000 ? 'text-red-600' : ''}>
              Max: 50,000 characters
            </span>
          </div>
        </div>

        {error && (
          <Message severity="error" text={error} className="w-full" />
        )}

        <Button
          label={isLoading ? 'Analyzing...' : 'Analyze Transcript'}
          icon={isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-search'}
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading || !transcript.trim()}
          className="w-full"
          size="large"
        />
      </div>
    </Card>
  );
}
