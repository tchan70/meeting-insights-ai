#!/bin/bash

# Backend API Test Script
# Run this after starting the backend server (npm run dev)

API_URL="http://localhost:3001"
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Meeting Insights AI - Backend API Tests ===${NC}\n"

# Test 1: Health Check
echo -e "${BLUE}Test 1: Health Check${NC}"
HEALTH_RESPONSE=$(curl -s "${API_URL}/health")
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "$HEALTH_RESPONSE" | jq '.'
else
    echo -e "${RED}✗ Health check failed${NC}"
    echo "$HEALTH_RESPONSE"
fi
echo ""

# Test 2: Analyze Transcript
echo -e "${BLUE}Test 2: Analyze Transcript${NC}"
ANALYZE_RESPONSE=$(curl -s -X POST "${API_URL}/api/transcripts/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Hey team, thanks for joining. I wanted to kick off this project planning session for Q1. Sarah, you mentioned last week you'\''d have the API design doc ready - do you have an update on that? Sarah: Yes, I finished it yesterday. The main decision we need to make is whether to use REST or GraphQL. I'\''m leaning toward REST for simplicity, but I want to hear thoughts. Mike: I agree with REST. We can always add GraphQL later if we need it. When can you start implementation? Sarah: I can start next Monday. I'\''ll need about 2 weeks for the initial version. Great, let'\''s move forward with REST. Mike, can you handle the frontend integration once Sarah'\''s API is ready? Mike: Yep, I'\''ll block out the last week of January for that. Perfect. One more thing - we need to nail down our database choice. Are we going with Postgres or MongoDB? Sarah: I vote Postgres. We'\''ll need transactions and relational data. Mike: Agreed on Postgres. Alright, Postgres it is. Sarah, can you set up the initial schema by end of week? Sarah: Will do. Awesome. Let'\''s reconvene next Wednesday to check progress. Thanks everyone!"
  }')

if echo "$ANALYZE_RESPONSE" | grep -q "id"; then
    echo -e "${GREEN}✓ Transcript analysis succeeded${NC}"
    ANALYSIS_ID=$(echo "$ANALYZE_RESPONSE" | jq -r '.id')
    echo "Analysis ID: $ANALYSIS_ID"
    echo "$ANALYZE_RESPONSE" | jq '.'
else
    echo -e "${RED}✗ Transcript analysis failed${NC}"
    echo "$ANALYZE_RESPONSE"
    exit 1
fi
echo ""

# Test 3: Get Analysis by ID
echo -e "${BLUE}Test 3: Get Analysis by ID${NC}"
if [ ! -z "$ANALYSIS_ID" ]; then
    GET_RESPONSE=$(curl -s "${API_URL}/api/analyses/${ANALYSIS_ID}")
    if echo "$GET_RESPONSE" | grep -q "id"; then
        echo -e "${GREEN}✓ Get analysis succeeded${NC}"
        echo "$GET_RESPONSE" | jq '{id, sentiment, actionItemsCount: (.actionItems | length), decisionsCount: (.decisions | length)}'
    else
        echo -e "${RED}✗ Get analysis failed${NC}"
        echo "$GET_RESPONSE"
    fi
else
    echo -e "${RED}✗ Skipping (no analysis ID from previous test)${NC}"
fi
echo ""

# Test 4: List All Analyses
echo -e "${BLUE}Test 4: List All Analyses${NC}"
LIST_RESPONSE=$(curl -s "${API_URL}/api/analyses")
if echo "$LIST_RESPONSE" | grep -q "analyses"; then
    ANALYSES_COUNT=$(echo "$LIST_RESPONSE" | jq '.analyses | length')
    echo -e "${GREEN}✓ List analyses succeeded${NC}"
    echo "Total analyses: $ANALYSES_COUNT"
    echo "$LIST_RESPONSE" | jq '.analyses[] | {id, sentiment, createdAt, actionItemsCount, decisionsCount}'
else
    echo -e "${RED}✗ List analyses failed${NC}"
    echo "$LIST_RESPONSE"
fi
echo ""

# Test 5: Error Handling - Empty Transcript
echo -e "${BLUE}Test 5: Error Handling - Empty Transcript${NC}"
ERROR_RESPONSE=$(curl -s -X POST "${API_URL}/api/transcripts/analyze" \
  -H "Content-Type: application/json" \
  -d '{"transcript": ""}')

if echo "$ERROR_RESPONSE" | grep -q "error"; then
    echo -e "${GREEN}✓ Empty transcript properly rejected${NC}"
    echo "$ERROR_RESPONSE" | jq '.'
else
    echo -e "${RED}✗ Error handling failed${NC}"
    echo "$ERROR_RESPONSE"
fi
echo ""

# Test 6: Error Handling - Very Long Transcript
echo -e "${BLUE}Test 6: Error Handling - Very Long Transcript${NC}"
LONG_TEXT=$(printf 'a%.0s' {1..51000})  # 51k characters
LONG_RESPONSE=$(curl -s -X POST "${API_URL}/api/transcripts/analyze" \
  -H "Content-Type: application/json" \
  -d "{\"transcript\": \"$LONG_TEXT\"}")

if echo "$LONG_RESPONSE" | grep -q "too long"; then
    echo -e "${GREEN}✓ Long transcript properly rejected${NC}"
    echo "$LONG_RESPONSE" | jq '.'
else
    echo -e "${RED}✗ Long transcript handling failed${NC}"
    echo "$LONG_RESPONSE"
fi
echo ""

echo -e "${BLUE}=== All Tests Complete ===${NC}"
