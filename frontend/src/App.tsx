import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Home } from './pages/Home'
import { ViewAnalysis } from './pages/ViewAnalysis'
import { ViewPastAnalyses } from './pages/ViewPastAnalyses'
import Sidebar from './components/SideBar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <i className="pi pi-comments text-4xl text-blue-400"></i>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Meeting Insights AI
              </h1>
              <p className="text-gray-600 mt-1">
                analyse meeting transcripts and extract actionable insights
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analyses" element={<ViewPastAnalyses />} />
              <Route path="/analyses/:id" element={<ViewAnalysis />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 text-sm">
          <p>
            Built with React, TypeScript, PrimeReact, and OpenAI •{' '}
            <a
              href="https://github.com/tchan70/meeting-insights-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-300"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
