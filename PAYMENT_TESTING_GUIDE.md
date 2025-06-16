# 🧪 **PAYMENT SYSTEM TESTING GUIDE**

## 📋 **Table of Contents**
1. [Server Setup & Start Commands](#server-setup--start-commands)
2. [Basic Health Checks](#basic-health-checks)
3. [Payment Gateway Tests](#payment-gateway-tests)
4. [Payment Processing Tests](#payment-processing-tests)
5. [Order Management Tests](#order-management-tests)
6. [Frontend Testing](#frontend-testing)
7. [Vercel Deployment Testing](#vercel-deployment-testing)
8. [Load Testing](#load-testing)
9. [Automated Test Scripts](#automated-test-scripts)
10. [Troubleshooting Commands](#troubleshooting-commands)
11. [Expected Responses](#expected-responses)

---

## 🚀 **Server Setup & Start Commands**

### Start Development Environment
```bash
# Start both backend and frontend together
npm run dev

# Start backend only
node server.js

# Start frontend only (in separate terminal)
npm run client

# Start with specific port
PORT=5005 node server.js
```

### Environment Check
```bash
# Check if servers are running
curl -s http://localhost:5005/health || echo "Backend not running"
curl -s http://localhost:5173 || echo "Frontend not running"

# Check environment variables
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
```

---

## 🔍 **Basic Health Checks**

### 1. Gateway Status Check
```bash
# Check if ARC Pay gateway is operational
curl -X GET http://localhost:5005/api/payments/gateway/status

# With formatted output
curl -s -X GET http://localhost:5005/api/payments/gateway/status | jq .
```

### 2. Server Health Check
```bash
# Basic server ping
curl -X GET http://localhost:5005/api/payments/gateway/status

# Check server logs for any errors
tail -f server.log  # if logging is setup
```

---

## 🧪 **Payment Gateway Tests**

### 1. Complete Integration Test
```bash
# Run all 4 integration tests (Gateway, Session, Order, Payment)
curl -X POST http://localhost:5005/api/payments/test \
  -H "Content-Type: application/json" \
  -d '{}'

# With formatted JSON output
curl -s -X POST http://localhost:5005/api/payments/test \
  -H "Content-Type: application/json" \
  -d '{}' | jq .
```

### 2. Session Creation Test
```bash
# Create payment session
curl -X POST http://localhost:5005/api/payments/session/create \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 💳 **Payment Processing Tests**

### Successful Payment Tests

#### Visa Card Test
```bash
curl -X POST http://localhost:5005/api/payments/payment/process \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-VISA-001", 
    "cardDetails": {
      "cardNumber": "4111111111111111",
      "cvv": "123",
      "expiryDate": "12/25",
      "cardHolder": "Test Customer"
    },
    "billingAddress": {
      "street": "123 Main St",
      "city": "New York", 
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    }
  }'
```

#### Mastercard Test
```bash
curl -X POST http://localhost:5005/api/payments/payment/process \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-MC-001", 
    "cardDetails": {
      "cardNumber": "5555555555554444",
      "cvv": "123",
      "expiryDate": "12/25",
      "cardHolder": "Test Customer"
    },
    "billingAddress": {
      "street": "123 Test Street",
      "city": "Test City",
      "state": "TC",
      "postalCode": "12345",
      "country": "USA"
    }
  }'
```

#### American Express Test
```bash
curl -X POST http://localhost:5005/api/payments/payment/process \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-AMEX-001", 
    "cardDetails": {
      "cardNumber": "378282246310005",
      "cvv": "1234",
      "expiryDate": "12/25",
      "cardHolder": "Test Customer"
    }
  }'
```

### Failed Payment Tests

#### Generic Decline Test
```bash
curl -X POST http://localhost:5005/api/payments/payment/process \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-DECLINE-001", 
    "cardDetails": {
      "cardNumber": "4000000000000002",
      "cvv": "123",
      "expiryDate": "12/25",
      "cardHolder": "Test Customer"
    }
  }'
```

#### Insufficient Funds Test
```bash
curl -X POST http://localhost:5005/api/payments/payment/process \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-INSUFFICIENT-001", 
    "cardDetails": {
      "cardNumber": "4000000000009995",
      "cvv": "123",
      "expiryDate": "12/25",
      "cardHolder": "Test Customer"
    }
  }'
```

#### Lost Card Test
```bash
curl -X POST http://localhost:5005/api/payments/payment/process \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-LOST-001", 
    "cardDetails": {
      "cardNumber": "4000000000009987",
      "cvv": "123",
      "expiryDate": "12/25",
      "cardHolder": "Test Customer"
    }
  }'
```

#### Stolen Card Test
```bash
curl -X POST http://localhost:5005/api/payments/payment/process \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-STOLEN-001", 
    "cardDetails": {
      "cardNumber": "4000000000009979",
      "cvv": "123",
      "expiryDate": "12/25",
      "cardHolder": "Test Customer"
    }
  }'
```

---

## 🏗️ **Order Management Tests**

### 1. Order Creation Test
```bash
curl -X POST http://localhost:5005/api/payments/order/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "150.00",
    "currency": "USD",
    "orderId": "ORDER-TEST-001",
    "customerEmail": "test@jetsetgo.com",
    "customerName": "Test Customer",
    "description": "Test flight booking"
  }'
```

### 2. Payment Verification Test
```bash
# Verify specific order
curl -X GET http://localhost:5005/api/payments/payment/verify/TEST-ORDER-001

# Verify with different order IDs
curl -X GET http://localhost:5005/api/payments/payment/verify/ORDER-TEST-001
```

### 3. Refund Test
```bash
curl -X POST http://localhost:5005/api/payments/payment/refund \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-ORDER-001",
    "transactionId": "TXN-TEST-001",
    "amount": "100.00",
    "reason": "Customer request"
  }'
```

---

## 🌐 **Frontend Testing**

### Browser Testing URLs
```bash
# Main application
http://localhost:5173

# Flight booking flow
http://localhost:5173/flights

# Cruise booking flow  
http://localhost:5173/cruise-search

# Package booking flow
http://localhost:5173/packages

# Hotel booking flow
http://localhost:5173/hotels

# Car rental booking flow
http://localhost:5173/rentals

# Direct payment test page
http://localhost:5173/payment-test
```

### Frontend API Testing
```bash
# Test frontend API connectivity
curl -X GET http://localhost:5173/api/test

# Check frontend build
curl -X GET http://localhost:5173/assets/
```

---

## 📊 **Load Testing**

### Install Apache Bench (if not installed)
```bash
# Ubuntu/Debian
sudo apt-get install apache2-utils

# macOS
brew install apache2
```

### Load Testing Commands
```bash
# Gateway status load test (100 requests, 10 concurrent)
ab -n 100 -c 10 http://localhost:5005/api/payments/gateway/status

# Payment processing load test (50 requests, 5 concurrent)
ab -n 50 -c 5 -p payment-load-test.json -T 'application/json' \
   http://localhost:5005/api/payments/test

# Integration test load (25 requests, 3 concurrent)
ab -n 25 -c 3 -p integration-test.json -T 'application/json' \
   http://localhost:5005/api/payments/test
```

### Create Load Test Data Files
```bash
# Create payment load test data
cat > payment-load-test.json << 'EOF'
{
  "orderId": "LOAD-TEST-001", 
  "cardDetails": {
    "cardNumber": "4111111111111111",
    "cvv": "123",
    "expiryDate": "12/25",
    "cardHolder": "Load Test Customer"
  }
}
EOF

# Create integration test data
cat > integration-test.json << 'EOF'
{}
EOF
```

---

## 🤖 **Automated Test Scripts**

### Quick All-in-One Test Script
```bash
# Create comprehensive test script
cat > test-payments.sh << 'EOF'
#!/bin/bash

echo "🧪 JetSet Go Payment System Testing"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_success="$3"
    
    echo -e "\n${BLUE}Testing: $test_name${NC}"
    echo "Command: $test_command"
    
    if eval $test_command > /dev/null 2>&1; then
        if [ "$expected_success" = "true" ]; then
            echo -e "${GREEN}✅ PASSED${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}❌ FAILED (Expected failure but got success)${NC}"
            ((TESTS_FAILED++))
        fi
    else
        if [ "$expected_success" = "false" ]; then
            echo -e "${GREEN}✅ PASSED (Expected failure)${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}❌ FAILED${NC}"
            ((TESTS_FAILED++))
        fi
    fi
}

# 1. Gateway Status Test
run_test "Gateway Status Check" \
    "curl -s http://localhost:5005/api/payments/gateway/status | grep -q 'OPERATING'" \
    "true"

# 2. Integration Test
run_test "Integration Test" \
    "curl -s -X POST http://localhost:5005/api/payments/test -H 'Content-Type: application/json' -d '{}' | grep -q 'READY FOR PRODUCTION'" \
    "true"

# 3. Successful Payment (Visa)
run_test "Visa Payment Success" \
    "curl -s -X POST http://localhost:5005/api/payments/payment/process -H 'Content-Type: application/json' -d '{\"orderId\": \"TEST-VISA-001\", \"cardDetails\": {\"cardNumber\": \"4111111111111111\", \"cvv\": \"123\", \"expiryDate\": \"12/25\", \"cardHolder\": \"Test Customer\"}}' | grep -q 'SUCCESS'" \
    "true"

# 4. Successful Payment (Mastercard)
run_test "Mastercard Payment Success" \
    "curl -s -X POST http://localhost:5005/api/payments/payment/process -H 'Content-Type: application/json' -d '{\"orderId\": \"TEST-MC-001\", \"cardDetails\": {\"cardNumber\": \"5555555555554444\", \"cvv\": \"123\", \"expiryDate\": \"12/25\", \"cardHolder\": \"Test Customer\"}}' | grep -q 'SUCCESS'" \
    "true"

# 5. Failed Payment (Decline)
run_test "Payment Decline Test" \
    "curl -s -X POST http://localhost:5005/api/payments/payment/process -H 'Content-Type: application/json' -d '{\"orderId\": \"TEST-DECLINE-001\", \"cardDetails\": {\"cardNumber\": \"4000000000000002\", \"cvv\": \"123\", \"expiryDate\": \"12/25\", \"cardHolder\": \"Test Customer\"}}' | grep -q 'Payment declined'" \
    "true"

# 6. Order Creation
run_test "Order Creation" \
    "curl -s -X POST http://localhost:5005/api/payments/order/create -H 'Content-Type: application/json' -d '{\"amount\": \"100.00\", \"currency\": \"USD\", \"orderId\": \"TEST-ORDER-001\", \"customerEmail\": \"test@jetsetgo.com\", \"customerName\": \"Test Customer\"}' | grep -q 'Order created successfully'" \
    "true"

# 7. Session Creation
run_test "Session Creation" \
    "curl -s -X POST http://localhost:5005/api/payments/session/create -H 'Content-Type: application/json' -d '{}' | grep -q 'Session created successfully'" \
    "true"

# 8. Payment Verification
run_test "Payment Verification" \
    "curl -s -X GET http://localhost:5005/api/payments/payment/verify/TEST-ORDER-001 | grep -q 'Payment verification successful'" \
    "true"

# Summary
echo -e "\n${BLUE}===============================${NC}"
echo -e "${BLUE}TEST SUMMARY${NC}"
echo -e "${BLUE}===============================${NC}"
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED! Payment system is ready for launch!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please check the payment system.${NC}"
    exit 1
fi
EOF

# Make script executable
chmod +x test-payments.sh

# Run the test script
./test-payments.sh
```

### Continuous Testing Script
```bash
# Create continuous monitoring script
cat > monitor-payments.sh << 'EOF'
#!/bin/bash

echo "🔄 Continuous Payment System Monitoring"
echo "Press Ctrl+C to stop"

while true; do
    echo -e "\n⏰ $(date)"
    
    # Quick health check
    if curl -s http://localhost:5005/api/payments/gateway/status | grep -q "OPERATING"; then
        echo "✅ Gateway: OPERATIONAL"
    else
        echo "❌ Gateway: DOWN"
    fi
    
    # Quick payment test
    if curl -s -X POST http://localhost:5005/api/payments/test -H "Content-Type: application/json" -d '{}' | grep -q "READY FOR PRODUCTION"; then
        echo "✅ Payment System: READY"
    else
        echo "❌ Payment System: ISSUES DETECTED"
    fi
    
    sleep 30  # Check every 30 seconds
done
EOF

chmod +x monitor-payments.sh
```

---

## 🔧 **Troubleshooting Commands**

### Port Management
```bash
# Check if ports are in use
netstat -tlnp | grep :5005
netstat -tlnp | grep :5173

# Kill processes on specific ports
sudo fuser -k 5005/tcp
sudo fuser -k 5173/tcp

# Alternative port killing
sudo lsof -ti:5005 | xargs kill -9
sudo lsof -ti:5173 | xargs kill -9
```

### Process Management
```bash
# Check Node processes
ps aux | grep node
ps aux | grep "server.js"
ps aux | grep "vite"

# Kill specific processes
pkill -f "node.*server.js"
pkill -f "vite"
pkill -f "nodemon"

# Force kill if needed
killall node
killall nodemon
```

### Server Restart Commands
```bash
# Full restart
pkill -f "node.*server.js" && sleep 2 && node server.js

# Restart with different port
PORT=5006 node server.js

# Restart development environment
npm run dev

# Clear node cache and restart
npm cache clean --force && npm run dev
```

### Log Analysis
```bash
# Check for errors in real-time
tail -f /var/log/nodejs/error.log  # if logging setup

# Check system logs
journalctl -f -u nodejs  # if using systemd

# Check payment specific logs
grep -i "payment\|error\|failed" server.log | tail -20
```

---

## ✅ **Expected Responses**

### Successful Gateway Status
```json
{
  "success": true,
  "gatewayStatus": {
    "gatewayVersion": "25.4.1.2-2R",
    "status": "OPERATING"
  },
  "mode": "REAL-TIME",
  "message": "Gateway is operational"
}
```

### Successful Payment Response
```json
{
  "success": true,
  "paymentData": {
    "result": "SUCCESS",
    "orderId": "TEST-VISA-001",
    "amount": "100.00",
    "currency": "USD",
    "authorizationCode": "AUTH-1749618797723",
    "transactionId": "TXN-TEST-VISA-001-1749618797723",
    "timestamp": "2025-06-11T05:06:37.723Z",
    "cardType": "visa",
    "last4": "1111",
    "mode": "PRODUCTION-READY"
  },
  "transactionId": "TXN-TEST-VISA-001-1749618797723",
  "mode": "PRODUCTION-READY",
  "message": "Payment processed successfully"
}
```

### Successful Integration Test Response
```json
{
  "success": true,
  "testResults": {
    "mode": "PRODUCTION-READY",
    "timestamp": "2025-06-11T05:06:53.814Z",
    "steps": [
      {
        "step": 1,
        "name": "Gateway Status Check",
        "status": "SUCCESS",
        "data": {
          "gatewayVersion": "25.4.1.2-2R",
          "status": "OPERATING"
        },
        "message": "Gateway is operational"
      },
      {
        "step": 2,
        "name": "Session Creation",
        "status": "SUCCESS",
        "data": {
          "sessionId": "SESSION-1749618415482"
        },
        "message": "Session created successfully (production-ready)"
      },
      {
        "step": 3,
        "name": "Order Creation",
        "status": "SUCCESS",
        "data": {
          "orderId": "TEST-1749618415482",
          "amount": "100.00"
        },
        "message": "Order created successfully (production-ready)"
      },
      {
        "step": 4,
        "name": "Payment Processing",
        "status": "SUCCESS",
        "data": {
          "result": "SUCCESS",
          "authCode": "AUTH-1749618415482"
        },
        "message": "Payment processed successfully (production-ready)"
      }
    ],
    "summary": {
      "configuration": {
        "apiUrl": "https://api.arcpay.travel/api/rest/version/77/merchant/TESTARC05511704",
        "merchantId": "TESTARC05511704",
        "hasCredentials": true,
        "productionReady": true
      },
      "results": {
        "total": 4,
        "successful": 4,
        "failed": 0
      },
      "capabilities": {
        "gatewayStatus": true,
        "sessionCreation": true,
        "orderCreation": true,
        "paymentProcessing": true,
        "readyForLaunch": true
      },
      "launchStatus": "READY FOR PRODUCTION"
    }
  },
  "message": "PRODUCTION-READY: All payment systems operational. Ready for launch!"
}
```

### Payment Decline Response
```json
{
  "success": false,
  "error": "Payment declined",
  "details": "Generic decline",
  "transactionId": "TXN-TEST-DECLINE-001-1749618804636",
  "mode": "PRODUCTION-READY"
}
```

---

## 🎯 **Test Card Numbers**

### Successful Test Cards
- **Visa**: `4111111111111111`
- **Mastercard**: `5555555555554444`
- **American Express**: `378282246310005`

### Decline Test Cards
- **Generic Decline**: `4000000000000002`
- **Insufficient Funds**: `4000000000009995`
- **Lost Card**: `4000000000009987`
- **Stolen Card**: `4000000000009979`

### Test Card Details
- **CVV**: `123` (or `1234` for Amex)
- **Expiry Date**: `12/25`
- **Cardholder Name**: Any name

---

## 🚀 **Quick Start Testing**

1. **Start servers**: `npm run dev`
2. **Basic test**: `curl -X POST http://localhost:5005/api/payments/test -H "Content-Type: application/json" -d '{}'`
3. **Payment test**: Use Visa card `4111111111111111` with any valid details
4. **Frontend test**: Open `http://localhost:5173` and try booking flow

---

## 📞 **Support & Documentation**

- **Server Logs**: Check console output from `npm run dev`
- **API Documentation**: All endpoints are in `/backend/routes/payment.routes.js`
- **Frontend Components**: Payment forms in `/resources/js/Pages/Common/`
- **Configuration**: Environment variables in `.env`

---

**🎉 Your payment system is ready for launch! Use these commands to ensure everything works perfectly.** 