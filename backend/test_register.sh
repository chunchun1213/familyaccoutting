#!/bin/bash
# Test the register API endpoint

echo "=== Testing Register API ==="
echo ""

# Test data
EMAIL="test@example.com"
NAME="測試使用者"
PASSWORD="TestPass123"

echo "Sending registration request..."
curl -X POST \
  http://127.0.0.1:54321/functions/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$NAME\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"confirmPassword\": \"$PASSWORD\"
  }" \
  -v

echo ""
echo "=== Test Complete ==="
