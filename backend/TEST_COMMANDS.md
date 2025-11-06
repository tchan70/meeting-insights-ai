# Quick Test Commands

## Test 1: Health Check
```bash
curl http://localhost:3001/health
```

## Test 2: Analyze Sample Transcript
```bash
curl -X POST http://localhost:3001/api/transcripts/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Team meeting for Q1 planning. Sarah will complete the API design doc by Monday. We decided to use REST API and PostgreSQL for the database. Mike will handle frontend integration last week of January."
  }'
```

## Test 3: Get Analysis by ID
```bash
# Replace ANALYSIS_ID with actual ID from previous response
curl http://localhost:3001/api/analyses/ANALYSIS_ID
```

## Test 4: List All Analyses
```bash
curl http://localhost:3001/api/analyses
```

## Test 5: Error Case - Empty Transcript
```bash
curl -X POST http://localhost:3001/api/transcripts/analyze \
  -H "Content-Type: application/json" \
  -d '{"transcript": ""}'
```

## Test 6: Error Case - Too Long (50k+ chars)
```bash
# This will be rejected
curl -X POST http://localhost:3001/api/transcripts/analyze \
  -H "Content-Type: application/json" \
  -d "{\"transcript\": \"$(printf 'a%.0s' {1..51000})\"}"
```

## Pretty Print with jq
Add ` | jq '.'` to any command for formatted JSON:
```bash
curl http://localhost:3001/health | jq '.'
```

## Save Response to File
```bash
curl http://localhost:3001/api/analyses > analyses.json
```

## Check Response Time
```bash
curl -w "\nTime: %{time_total}s\n" http://localhost:3001/api/transcripts/analyze \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Quick meeting. Sarah will finish docs by Friday."}'
```
