# Backend Quick Start Guide

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install all the required packages including:
- Express, ts-rest, Zod
- Prisma and PostgreSQL client
- OpenAI SDK
- TypeScript and development tools

### 2. Start PostgreSQL Database

**Using Docker (Recommended):**
```bash
# Start the database using docker-compose
docker-compose up -d

# Verify it's running
docker ps | grep meeting-insights-db
```

**Or using local PostgreSQL:**
```bash
# Make sure PostgreSQL is installed and running
# Create the database
createdb meeting_insights
```

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual values
# You'll need:
# - DATABASE_URL (already set for docker-compose)
# - OPENAI_API_KEY (get from https://platform.openai.com/api-keys)
```

**Example .env for Docker setup:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/meeting_insights?schema=public"
OPENAI_API_KEY="sk-your-actual-openai-key-here"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### 4. Set Up Database Schema

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

You should see output like:
```
✔ Generated Prisma Client
✔ Database schema synchronized
```

### 5. Start the Development Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📝 API available at http://localhost:3001/api
💚 Health check: http://localhost:3001/health
```

### 6. Test the API

**Test 1: Health Check**
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-11-04T..."}
```

**Test 2: Analyze a Transcript**
```bash
curl -X POST http://localhost:3001/api/transcripts/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Hey team, thanks for joining. Sarah, you mentioned last week you'\''d have the API design doc ready - do you have an update? Sarah: Yes, I finished it yesterday. The main decision we need to make is whether to use REST or GraphQL. Mike: I agree with REST. Sarah can you start implementation next Monday? Sarah: Will do, I'\''ll need about 2 weeks."
  }'
```

Expected response structure:
```json
{
  "id": "clxxx...",
  "transcriptId": "clxxx...",
  "sentiment": "productive",
  "sentimentSummary": "The meeting was constructive with clear decisions and action items.",
  "actionItems": [
    {
      "id": "...",
      "description": "Start API implementation",
      "owner": "Sarah",
      "deadline": "next Monday",
      "priority": "high"
    }
  ],
  "decisions": [
    {
      "id": "...",
      "description": "Use REST instead of GraphQL",
      "type": "made",
      "context": "For simplicity"
    }
  ],
  "createdAt": "2024-11-04T..."
}
```

**Test 3: Get Analysis by ID**
```bash
# Use the ID from the previous response
curl http://localhost:3001/api/analyses/YOUR_ANALYSIS_ID
```

**Test 4: List All Analyses**
```bash
curl http://localhost:3001/api/analyses
```

## Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**
```bash
# Check if PostgreSQL is running
docker ps | grep meeting-insights-db

# Or for local PostgreSQL
pg_isready

# Restart database
docker-compose restart
```

### OpenAI API Issues

**Error: "Incorrect API key"**
- Verify your API key is correct in `.env`
- Check you have credits: https://platform.openai.com/usage

**Error: "Rate limit exceeded"**
- Wait a few seconds and try again
- Consider upgrading your OpenAI plan

### TypeScript/Build Issues

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma Client
npm run db:generate
```

## Database Management

**View data in Prisma Studio:**
```bash
npm run db:studio
```
Opens at http://localhost:5555

**Reset database (WARNING: Deletes all data):**
```bash
npx prisma migrate reset
npm run db:push
```

**Backup data:**
```bash
docker exec meeting-insights-db pg_dump -U postgres meeting_insights > backup.sql
```

## Development Tips

1. **Watch mode**: `npm run dev` automatically restarts on file changes

2. **Check logs**: The server logs all errors to console

3. **Test different transcripts**:
   - Short meetings (< 1000 chars)
   - Long meetings (test 50k limit)
   - Meetings with/without clear action items
   - Different sentiment tones

4. **Monitor OpenAI costs**: Check https://platform.openai.com/usage
   - GPT-4o-mini is ~$0.15 per 1M input tokens
   - Typical analysis costs ~$0.001-0.003

## Next Steps

Once the backend is running successfully:

1. ✅ Test all three endpoints
2. ✅ Verify database is storing data correctly (use Prisma Studio)
3. ✅ Test error cases (empty transcript, no API key, etc.)
4. 🎯 Move on to building the frontend!

## Common Commands Reference

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm start                # Run production build

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Sync schema (dev)
npm run db:migrate       # Run migrations (prod)
npm run db:studio        # Open Prisma Studio GUI

# Docker
docker-compose up -d     # Start database
docker-compose down      # Stop database
docker-compose logs      # View logs
```
