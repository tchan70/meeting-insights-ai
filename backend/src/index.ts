import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createExpressEndpoints } from '@ts-rest/express'
import { contract } from './contract'
import { router } from './router'

// Load environment variables
dotenv.config()

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'OPENAI_API_KEY']
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' })) // Support large transcripts

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Create ts-rest endpoints
createExpressEndpoints(contract, router, app)

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Unhandled error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 API available at http://localhost:${PORT}/api`)
  console.log(`💚 Health check: http://localhost:${PORT}/health`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...')
  process.exit(0)
})
