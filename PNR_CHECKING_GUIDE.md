# 🎫 **PNR Checking Guide - Complete Manual**

## 📋 **What is a PNR?**

**PNR (Passenger Name Record)** is a unique reference code that airlines generate when you successfully book a flight. It's your confirmation that the booking exists in the airline's system and can be used to:

- ✅ Check flight status
- ✅ Make changes to your booking  
- ✅ Check-in online
- ✅ Access your booking details

---

## 🔍 **How to Check PNR - Multiple Methods**

### **Method 1: Through Backend API (Primary)**

#### **Step 1: Check if Flight Order was Created Successfully**
```bash
curl -X GET "http://localhost:5005/api/flights/order/YOUR_ORDER_ID" | jq
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "eJzTd9f3NjIwNDEAAAp%2BAmI%3D",
    "status": "CONFIRMED",
    "pnr": "ABCD12",  // ← Your PNR is here!
    "bookingReference": "BOOK-1750359670583",
    "flightOffers": [...],
    "travelers": [...],
    "totalPrice": {
      "amount": "29.60",
      "currency": "USD"
    }
  }
}
```

#### **Step 2: Extract PNR from Response**
The PNR will be in the `associatedRecords[0].reference` field in the raw Amadeus response, or in the `pnr` field in our processed response.

---

### **Method 2: Real-Time Flight Search and Booking Test**

#### **Search for Real Flights:**
```bash
curl -X POST "http://localhost:5005/api/flights/search" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "DEL",
    "to": "JAI", 
    "departDate": "2025-06-29",
    "travelers": 1,
    "max": 5
  }' | jq
```

#### **Create Flight Order (This attempts real PNR generation):**
```bash
curl -X POST "http://localhost:5005/api/flights/order" \
  -H "Content-Type: application/json" \
  -d '{
    "flightOffers": [FLIGHT_OFFER_FROM_SEARCH],
    "travelers": [{
      "id": "1",
      "dateOfBirth": "1990-01-01",
      "name": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "gender": "MALE",
      "contact": {
        "emailAddress": "john.doe@example.com",
        "phones": [{
          "deviceType": "MOBILE",
          "countryCallingCode": "91",
          "number": "9876543210"
        }]
      }
    }]
  }' | jq
```

---

### **Method 3: Frontend Integration Check**

If you're using the frontend application:

1. **Navigate to Flight Search:** `http://localhost:5173/flights`
2. **Search for flights:** DEL → JAI, Date: 2025-06-29
3. **Select a flight and proceed to booking**
4. **Complete payment process**
5. **Check browser developer console** for API responses containing PNR

---

## 🎯 **Payment System Status**

### **Current Configuration:**
- ✅ **ARC Pay Gateway Status:** OPERATING (Live)
- ✅ **Gateway Version:** 25.4.1.2-2R
- ✅ **Mode:** REAL-TIME 
- ⚠️ **Order Creation:** Secure Fallback Mode
- ⚠️ **Payment Processing:** Secure Test Fallback Mode

### **Real vs Test Mode Identification:**

#### **✅ REAL LIVE PAYMENTS (What we want):**
```json
{
  "mode": "LIVE-PRODUCTION",
  "gateway": "ARC-PAY-LIVE",
  "message": "Real payment processed successfully with ARC Pay"
}
```

#### **⚠️ FALLBACK MODE (Current state):**
```json
{
  "mode": "SECURE-TEST-FALLBACK", 
  "message": "Payment processed in secure test mode (ARC Pay API unavailable)"
}
```

---

## 💳 **Test Payment Cards for Real ARC Pay Testing**

When the system falls back to secure test mode, use these cards:

### **✅ Success Cards:**
- **Visa Test:** `4111111111111111`
- **Mastercard Test:** `5555555555554444` 
- **Amex Test:** `378282246310005`

### **❌ Decline Test Cards:**
- **Generic Decline:** `4000000000000002`
- **Insufficient Funds:** `4000000000009995`
- **Lost Card:** `4000000000009987`
- **Stolen Card:** `4000000000009979`

**CVV:** Any 3-4 digit number  
**Expiry:** Any future date (MM/YY format)

---

## 🧪 **Testing Complete Flow**

### **Run Complete Integration Test:**
```bash
node test-real-arc-pay.js
```

**Expected Output for Real Payments:**
```
✅ Gateway Status: 25.4.1.2-2R (OPERATING)
✅ Order Created: FLIGHT-1750360478949 (LIVE-PRODUCTION)
✅ Payment Processed: TXN-FLIGHT-1750360478949-1750360479369 (LIVE-PRODUCTION)  
🎉 LIVE ARC PAY INTEGRATION CONFIRMED!
```

---

## 🚨 **Troubleshooting PNR Issues**

### **Problem: "Invalid access token" Error**
```
ERROR 38190: The access token provided in the Authorization header is invalid
```

**Solutions:**
1. Token expired (valid for 30 minutes) - system will auto-refresh
2. Check Amadeus production credentials are correctly set
3. Verify API permissions for booking endpoints

### **Problem: "flightOrderId not found"**
```
ERROR 1797: NOT FOUND - flightOrderId not found
```

**Solutions:**
1. The order ID doesn't exist in Amadeus system
2. Use the order ID returned from successful flight booking
3. Check if the booking was actually created successfully

### **Problem: No PNR in Response**
**Check these fields in order:**
1. `data.pnr` (our processed response)
2. `data.associatedRecords[0].reference` (raw Amadeus response)
3. `data.bookingReference` (our generated reference)

---

## 📊 **Complete PNR Workflow Example**

### **Step 1: Search Flights**
```bash
curl -X POST "http://localhost:5005/api/flights/search" \
  -H "Content-Type: application/json" \
  -d '{"from": "DEL", "to": "JAI", "departDate": "2025-06-29", "travelers": 1}'
```

### **Step 2: Extract Flight Offer**
```json
{
  "success": true,
  "data": [{
    "id": "1",
    "airline": "Air India", 
    "flightNumber": "AI-9731",
    "price": "29.60",
    "currency": "USD"
    // ... rest of flight data
  }]
}
```

### **Step 3: Create Booking with PNR**
```bash
curl -X POST "http://localhost:5005/api/flights/order" \
  -H "Content-Type: application/json" \
  -d '{
    "flightOffers": [COMPLETE_FLIGHT_OFFER],
    "travelers": [PASSENGER_DETAILS]
  }'
```

### **Step 4: Extract PNR from Booking Response**
```json
{
  "success": true,
  "data": {
    "orderId": "eJzTd9f3NjIwNDEAAAp%2BAmI%3D",
    "pnr": "ABCD12",  // ← This is your real airline PNR!
    "status": "CONFIRMED"
  }
}
```

---

## 📞 **Getting Help**

### **Check System Status:**
```bash
curl -X GET "http://localhost:5005/api/health" | jq
```

### **Check Payment Gateway:**
```bash
curl -X GET "http://localhost:5005/api/payments/gateway/status" | jq
```

### **Logs to Monitor:**
- Backend server logs in terminal
- Browser developer console
- Network tab for API responses

---

## 🎉 **Success Indicators**

### **✅ PNR Successfully Generated When:**
- Flight search returns real Amadeus data
- Order creation returns `status: "CONFIRMED"`
- PNR field contains alphanumeric code (e.g., "ABCD12")
- Payment processing succeeds
- Booking reference is generated

### **⚠️ Test Mode Indicators:**
- `mode: "SECURE-TEST-FALLBACK"`
- Simulated PNR codes
- Fallback error messages

---

**💡 Pro Tip:** Always save the Order ID when a booking is created - you can use it later to retrieve the PNR and booking details even if the initial response was missed! 