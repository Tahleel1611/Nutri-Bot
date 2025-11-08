#!/bin/bash

# NutriBot Smoke Test Script
# Basic tests to verify the application is functioning

set -e

echo "=========================================="
echo "NutriBot Smoke Tests"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=$3
    
    echo -n "Testing $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected HTTP $expected_status, got $response)"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is not installed${NC}"
    exit 1
fi

echo "Testing Node.js API Server..."
echo "----------------------------"

# Test Node.js API
test_endpoint "API Root" "http://localhost:5000/" "200"
test_endpoint "API Health Check" "http://localhost:5000/health" "200"
test_endpoint "Auth Signup (no data)" "http://localhost:5000/api/auth/signup" "400"
test_endpoint "Auth Signin (no data)" "http://localhost:5000/api/auth/signin" "400"

echo ""
echo "Testing Python AI Service..."
echo "----------------------------"

# Test Python AI Service
test_endpoint "AI Service Root" "http://localhost:5001/" "200"
test_endpoint "AI Service Health" "http://localhost:5001/health" "200"
test_endpoint "Meal Recommendations (no data)" "http://localhost:5001/api/recommend/meals" "400"

echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed!${NC}"
    echo ""
    echo "Make sure both services are running:"
    echo "  - Node.js API: npm start (port 5000)"
    echo "  - Python AI: python3 app.py (port 5001)"
    exit 1
fi
