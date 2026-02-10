#!/bin/bash
# Test script to verify Nutricion IA is operational
# This script tests the backend API endpoints

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="http://127.0.0.1:8000"
PASSED=0
FAILED=0

echo "🧪 Testing Nutricion IA API"
echo "============================"
echo ""

# Test 1: Health check
echo -n "Test 1: Health check... "
RESPONSE=$(curl -s "$BASE_URL/health")
if echo "$RESPONSE" | grep -q "healthy"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

# Test 2: Root endpoint
echo -n "Test 2: Root endpoint... "
RESPONSE=$(curl -s "$BASE_URL/")
if echo "$RESPONSE" | grep -q "Bienvenido"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
fi

# Test 3: Register user
echo -n "Test 3: User registration... "
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "testpass123",
    "password_confirm": "testpass123",
    "objetivo_calorias": 2000
  }')

if echo "$REGISTER_RESPONSE" | grep -q "access_token"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
    TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null || echo "")
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "Response: $REGISTER_RESPONSE"
    ((FAILED++))
    TOKEN=""
fi

if [ -n "$TOKEN" ]; then
    # Test 4: Create diet
    echo -n "Test 4: Create diet... "
    CREATE_DIET_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/dieta/" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "nombre": "Test Diet",
        "descripcion": "A test diet"
      }')
    
    if echo "$CREATE_DIET_RESPONSE" | grep -q "Test Diet"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
        DIET_ID=$(echo "$CREATE_DIET_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
        DIET_ID=""
    fi
    
    # Test 5: List diets
    echo -n "Test 5: List diets... "
    LIST_DIETS_RESPONSE=$(curl -s "$BASE_URL/api/v1/dieta/" \
      -H "Authorization: Bearer $TOKEN")
    
    if echo "$LIST_DIETS_RESPONSE" | grep -q "Test Diet"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
    
    # Test 6: Create recipe
    echo -n "Test 6: Create recipe... "
    CREATE_RECIPE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/recetas/" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "nombre": "Test Recipe",
        "descripcion": "A test recipe",
        "ingredientes": {"items": ["ingredient1", "ingredient2"]},
        "instrucciones": "Test instructions",
        "calorias": 300,
        "proteina": 20.0,
        "carbohidratos": 30.0,
        "grasas": 10.0
      }')
    
    if echo "$CREATE_RECIPE_RESPONSE" | grep -q "Test Recipe"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
    
    # Test 7: List recipes
    echo -n "Test 7: List recipes... "
    LIST_RECIPES_RESPONSE=$(curl -s "$BASE_URL/api/v1/recetas/" \
      -H "Authorization: Bearer $TOKEN")
    
    if echo "$LIST_RECIPES_RESPONSE" | grep -q "Test Recipe"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
else
    echo "⚠️  Skipping authenticated tests (no token)"
    FAILED=$((FAILED + 4))
fi

echo ""
echo "============================"
echo -e "Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! The API is operational.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please check the backend logs.${NC}"
    exit 1
fi
