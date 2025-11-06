# Meeting Insights AI 🤖

An AI-powered meeting transcript analyzer that extracts actionable insights including action items, decisions, and sentiment analysis.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)

## 📋 Overview

This full-stack application uses OpenAI's GPT-4o-mini to analyze meeting transcripts and automatically extract:

- **Action Items** with owners, deadlines, and priorities
- **Key Decisions** (both made and pending)
- **Meeting Sentiment** and tone analysis

Built as a technical assessment for Ambr, showcasing modern full-stack development practices with TypeScript, type-safe APIs, and AI integration.

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **API**: ts-rest (type-safe REST)
- **Validation**: Zod schemas
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI GPT-4o-mini

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: PrimeReact
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query
- **API Client**: ts-rest React Query

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (or Docker)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/meeting-insights-ai.git
cd meeting-insights-ai
```

### 2. Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start PostgreSQL (using Docker)
docker-compose up -d

# Initialize database
npm run db:generate
npm run db:push

# Start the server
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Test the Application

1. Open `http://localhost:5173` in your browser
2. Click "Load Sample" to populate with example transcript
3. Click "Analyze Transcript"
4. View the AI-generated insights!

## 📁 Project Structure

```
meeting-insights-ai/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server
│   │   ├── contract.ts           # API contract (shared with frontend)
│   │   ├── router.ts             # Route handlers
│   │   ├── lib/
│   │   │   └── prisma.ts        # Prisma client
│   │   └── services/
│   │       ├── openai.service.ts    # OpenAI integration
│   │       └── database.service.ts  # Database operations
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TranscriptInput.tsx
│   │   │   └── AnalysisResults.tsx
│   │   ├── lib/
│   │   │   ├── contract.ts      # Shared API contract
│   │   │   ├── api-client.ts
│   │   │   └── api-query.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── README.md
```

## 🎯 Features

### Backend Features
- ✅ Type-safe REST API with ts-rest
- ✅ Comprehensive input validation with Zod
- ✅ AI-powered transcript analysis
- ✅ PostgreSQL database with Prisma
- ✅ Robust error handling
- ✅ Token limit validation
- ✅ CORS support
- ✅ Health check endpoint

### Frontend Features
- ✅ Clean, modern UI with PrimeReact
- ✅ Real-time character counter
- ✅ Sample transcript loader
- ✅ Loading and error states
- ✅ Color-coded priorities and sentiments
- ✅ Responsive design
- ✅ Type-safe API calls
- ✅ Copy and clear functionality

### AI Analysis Features
- ✅ Professional prompt engineering
- ✅ Structured JSON output
- ✅ Action item extraction with:
  - Task descriptions
  - Assigned owners
  - Deadlines
  - Priority levels (high/medium/low)
- ✅ Decision tracking:
  - Made vs pending
  - Context information
- ✅ Sentiment analysis:
  - Overall tone
  - Brief summary

## 📝 API Endpoints

### POST `/api/transcripts/analyze`
Analyze a meeting transcript.

**Request:**
```json
{
  "transcript": "Meeting transcript text..."
}
```

**Response:**
```json
{
  "id": "abc123",
  "transcriptId": "xyz789",
  "sentiment": "productive",
  "sentimentSummary": "The meeting was productive...",
  "actionItems": [...],
  "decisions": [...],
  "createdAt": "2024-11-04T10:00:00Z"
}
```

### GET `/api/analyses/:id`
Retrieve a specific analysis by ID.

### GET `/api/analyses`
List all past analyses (summary view).

### GET `/health`
Health check endpoint.

## 🎨 Design Decisions

### Prompt Engineering Strategy
The AI uses a carefully crafted prompt that:
- Sets context as a "professional meeting minutes specialist"
- Removes filler words and corporate jargon
- Extracts structured, actionable insights
- Uses temperature 0.3 for consistent output
- Enforces JSON mode for parseable responses

### Type Safety Approach
- Shared `contract.ts` between frontend and backend
- Zod schemas validate all inputs/outputs
- Full TypeScript coverage
- Compile-time error detection

### Error Handling
- Input validation errors (400)
- AI service failures with retry
- Database errors (500)
- Clear, user-friendly messages
- Proper logging for debugging

### UI/UX Decisions
- Card-based layout for visual hierarchy
- Color coding for priorities and statuses
- Icons for context (PrimeIcons)
- Progressive disclosure (expandable cards)
- Loading states prevent double submission

### Database Schema
```
Transcript (1) → Analysis (1)
  ├── ActionItems (many)
  └── Decisions (many)
```

Clean relational model with cascade deletes.

## 🔧 Configuration

### Backend Environment Variables
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/meeting_insights"
OPENAI_API_KEY="sk-..."
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### Frontend Environment Variables
```env
VITE_API_URL="http://localhost:3001"  # Optional, defaults to localhost:3001
```

## 🧪 Testing

### Manual Testing

**Test with sample transcript:**
```bash
curl -X POST http://localhost:3001/api/transcripts/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Team meeting. Sarah will complete API design by Monday. We decided on PostgreSQL."
  }'
```

**Check health:**
```bash
curl http://localhost:3001/health
```

### Test Scenarios
1. ✅ Empty transcript (should error)
2. ✅ Very long transcript (>50k chars, should error)
3. ✅ Normal transcript (should extract insights)
4. ✅ Transcript with no action items (should handle gracefully)
5. ✅ Transcript with multiple priorities (should categorize correctly)

## 📚 Database Schema

```prisma
model Transcript {
  id        String    @id @default(cuid())
  content   String    @db.Text
  createdAt DateTime  @default(now())
  analysis  Analysis?
}

model Analysis {
  id               String   @id @default(cuid())
  transcriptId     String   @unique
  sentiment        String
  sentimentSummary String?  @db.Text
  actionItems      ActionItem[]
  decisions        Decision[]
}

model ActionItem {
  id          String   @id @default(cuid())
  description String   @db.Text
  owner       String?
  deadline    String?
  priority    String?
}

model Decision {
  id          String   @id @default(cuid())
  description String   @db.Text
  type        String   # "made" or "pending"
  context     String?  @db.Text
}
```

## 🚧 Future Improvements

With more time, I would add:

### High Priority
- [ ] Authentication and user accounts
- [ ] View past analyses (list view with search)
- [ ] Export results (PDF, Markdown, CSV)
- [ ] Transcript chunking for very long meetings (>50k chars)

### Medium Priority
- [ ] Real-time analysis progress updates
- [ ] Dark mode support
- [ ] File upload for transcripts
- [ ] Integration with task trackers (Trello, Asana)
- [ ] Email notifications for action items

### Low Priority
- [ ] Multiple LLM provider support
- [ ] Custom prompt templates
- [ ] Analytics dashboard
- [ ] Share analyses via URL
- [ ] Audio transcription integration

## 🎯 Assessment Requirements Checklist

### Core Requirements
- ✅ Backend API accepting transcript via POST
- ✅ LLM integration (OpenAI GPT-4o-mini)
- ✅ Extract action items with owners/deadlines
- ✅ Extract key decisions
- ✅ Extract meeting sentiment
- ✅ Store results in PostgreSQL
- ✅ Return structured, typed responses
- ✅ React frontend with transcript input
- ✅ Display insights clearly
- ✅ Handle loading and error states

### Tech Stack
- ✅ ts-rest for API
- ✅ Zod for validation
- ✅ Prisma + PostgreSQL
- ✅ React with Vite
- ✅ TanStack Query
- ✅ TypeScript throughout
- ✅ PrimeReact for UI

### Quality Criteria
- ✅ Works reliably
- ✅ Clean, typed, well-structured code
- ✅ Thoughtful UX decisions
- ✅ Comprehensive error handling
- ✅ Clear decision documentation

## 🤔 Design Decisions Explained

### Why GPT-4o-mini instead of GPT-4?
- 10x cheaper (~$0.15 vs $1.50 per 1M tokens)
- Faster response times (better UX)
- Sufficient for structured extraction tasks
- JSON mode ensures parseable output

### Why ts-rest instead of tRPC?
- More familiar REST patterns
- Easier to document and test
- Better for API-first design
- Still fully type-safe!

### Why PrimeReact?
- Rich component library out of the box
- Professional UI with minimal effort
- Good TypeScript support
- Perfect for MVPs

### How to Handle Long Transcripts?
Current approach: Reject transcripts over 50,000 characters with clear error message.

Alternative approaches considered:
1. **Chunking**: Split into segments and analyze separately
2. **Summarization**: Pre-summarize then extract insights
3. **Streaming**: Process in chunks with progress updates

Chose simple rejection for MVP; would implement chunking with more time.

## 📖 Documentation

- [Backend README](./backend/README.md) - Detailed backend documentation
- [Frontend README](./frontend/README.md) - Detailed frontend documentation
- [API Contract](./backend/src/contract.ts) - Shared type definitions

## 🐛 Troubleshooting

**Backend not starting?**
```bash
# Check PostgreSQL is running
docker-compose ps

# Regenerate Prisma client
npm run db:generate

# Check environment variables
cat .env
```

**Frontend not connecting to backend?**
- Ensure backend is running on port 3001
- Check CORS settings in backend/src/index.ts
- Verify API URL in frontend/.env

**OpenAI errors?**
- Check API key is correct
- Ensure you have credits
- Review rate limits

**Database errors?**
```bash
# Reset database
docker-compose down -v
docker-compose up -d
npm run db:push
```

## 👨‍💻 Development

### Running Both Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - Database GUI (optional)
cd backend && npm run db:studio
```

### Making Changes
1. Backend changes: Server auto-reloads
2. Frontend changes: HMR (Hot Module Replacement)
3. Schema changes: Run `npm run db:generate` and `npm run db:push`

## 📄 License

MIT

## 👤 Author

Built by [Your Name] for Ambr Technical Assessment

## 🙏 Acknowledgments

- Ambr team for the interesting challenge
- OpenAI for GPT-4o-mini
- PrimeReact for the UI components
- The TypeScript community

---

**Time Spent**: ~3-4 hours (as specified)

**Questions?** Email: your.email@example.com
