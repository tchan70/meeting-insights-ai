# Meeting Insights AI - Backend

Backend API for analyzing meeting transcripts using AI.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **API**: ts-rest (type-safe REST API)
- **Validation**: Zod
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI (GPT-4o-mini)

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/meeting_insights?schema=public"
OPENAI_API_KEY="sk-your-api-key-here"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### 3. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb meeting_insights
```

**Option B: Docker**
```bash
docker run --name meeting-insights-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=meeting_insights \
  -p 5432:5432 \
  -d postgres:15
```

### 4. Run Database Migrations

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### POST `/api/transcripts/analyze`
Analyze a meeting transcript and extract insights.

**Request Body:**
```json
{
  "transcript": "Meeting transcript text here..."
}
```

**Response (200):**
```json
{
  "id": "abc123",
  "transcriptId": "xyz789",
  "sentiment": "productive",
  "sentimentSummary": "The meeting was productive with clear decisions made.",
  "actionItems": [
    {
      "id": "item1",
      "description": "Complete API design doc",
      "owner": "Sarah",
      "deadline": "next Monday",
      "priority": "high"
    }
  ],
  "decisions": [
    {
      "id": "dec1",
      "description": "Use REST API instead of GraphQL",
      "type": "made",
      "context": "For simplicity and faster implementation"
    }
  ],
  "createdAt": "2024-11-04T10:30:00Z"
}
```

### GET `/api/analyses/:id`
Retrieve a specific analysis by ID.

### GET `/api/analyses`
List all past analyses (summary view).

### GET `/health`
Health check endpoint.

## Database Schema

```prisma
Transcript (1) → Analysis (1)
Analysis (1) → ActionItems (many)
Analysis (1) → Decisions (many)
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database (dev)
- `npm run db:migrate` - Run migrations (prod)
- `npm run db:studio` - Open Prisma Studio GUI

## Error Handling

The API handles various error cases:

- **400 Bad Request**: Invalid input, transcript too long
- **404 Not Found**: Analysis not found
- **500 Internal Server Error**: AI service failure, database errors

## Design Decisions

### Why ts-rest?
- Type-safe API with shared contract between frontend/backend
- Better DX than plain Express
- Zod integration for validation

### Why GPT-4o-mini?
- Cost-effective for transcript analysis
- Fast response times
- Good balance of quality and speed
- JSON mode for structured output

### Transcript Length Handling
- Current limit: 50,000 characters (~12,000 tokens)
- Validates before sending to OpenAI
- Returns clear error message if too long
- Future: Could implement chunking strategy

### Prompt Strategy
- System prompt: Sets role as "meeting minutes specialist"
- User prompt: Clear instructions for structured extraction
- Temperature: 0.3 for consistent output
- JSON mode: Ensures parseable response

## Future Improvements

- [ ] Add authentication/authorization
- [ ] Implement rate limiting
- [ ] Add transcript chunking for very long meetings
- [ ] Support multiple LLM providers
- [ ] Add webhook support for async processing
- [ ] Implement caching layer
- [ ] Add more detailed analytics
- [ ] Support file upload (audio transcription)

## Testing

Example test with curl:

```bash
curl -X POST http://localhost:3001/api/transcripts/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Team meeting about Q1 planning. Sarah will complete the API design by Monday. We decided to use PostgreSQL for the database."
  }'
```
