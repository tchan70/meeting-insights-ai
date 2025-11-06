import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TranscriptInput } from './components/TranscriptInput';
import { AnalysisResults } from './components/AnalysisResults';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
import { apiQuery } from './lib/api-query';
import { z } from 'zod';
import { AnalysisResponseSchema } from './lib/contract';

type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  const analyzeMutation = apiQuery.analyzeTranscript.useMutation({
    onSuccess: (data) => {
      if (data.status === 200) {
        setAnalysis(data.body);
      }
    },
  });

  const handleSubmit = (transcript: string) => {
    analyzeMutation.mutate({
      body: { transcript },
    });
  };

  const handleNewAnalysis = () => {
    setAnalysis(null);
    analyzeMutation.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <i className="pi pi-comments text-4xl text-blue-600"></i>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Meeting Insights AI
              </h1>
              <p className="text-gray-600 mt-1">
                Analyze meeting transcripts and extract actionable insights
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Show input if no analysis yet */}
          {!analysis && (
            <TranscriptInput
              onSubmit={handleSubmit}
              isLoading={analyzeMutation.isPending}
            />
          )}

          {/* Loading State */}
          {analyzeMutation.isPending && (
            <Card className="text-center py-8">
              <ProgressSpinner />
              <p className="mt-4 text-gray-600 text-lg">
                Analyzing transcript with AI...
              </p>
              <p className="text-gray-500 text-sm mt-2">
                This may take 5-10 seconds
              </p>
            </Card>
          )}

          {/* Error State */}
          {analyzeMutation.isError && (
            <div className="space-y-4">
              <Message
                severity="error"
                text={
                  analyzeMutation.error instanceof Error
                    ? analyzeMutation.error.message
                    : 'Failed to analyze transcript. Please try again.'
                }
                className="w-full"
              />
              <Card className="text-center py-6">
                <i className="pi pi-exclamation-triangle text-5xl text-red-500 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Analysis Failed
                </h3>
                <p className="text-gray-600 mb-4">
                  {analyzeMutation.error instanceof Error
                    ? analyzeMutation.error.message
                    : 'Something went wrong while analyzing your transcript.'}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Please check your transcript and try again. If the problem persists,
                  make sure the backend server is running.
                </p>
              </Card>
            </div>
          )}

          {/* Success State - Show Results */}
          {analysis && analyzeMutation.isSuccess && (
            <AnalysisResults analysis={analysis} onNewAnalysis={handleNewAnalysis} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 text-sm">
          <p>
            Built with React, TypeScript, PrimeReact, and OpenAI •{' '}
            <a
              href="https://github.com/yourusername/meeting-insights-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
