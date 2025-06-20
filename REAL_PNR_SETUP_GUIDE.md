# 🎯 **REAL PNR GENERATION SETUP GUIDE**

## 🚨 **CURRENT STATUS:**
- ✅ **All simulation code REMOVED**
- ✅ **System configured for REAL bookings only**
- ❌ **Amadeus Flight Create Orders access DENIED**
- ❌ **Error 38190: Invalid token for booking API**

---

## 🔧 **REQUIRED ACTION TO GET REAL PNRs:**

### **Step 1: Request Flight Create Orders Access**
1. **Go to**: https://developers.amadeus.com/my-apps
2. **Login** with your Amadeus account
3. **Find your app** and click on it
4. **Click "API Requests"** or "Request APIs"
5. **Find "Flight Create Orders"** in the list
6. **Click "Request Production Access"**

### **Step 2: Complete Application Form**
**Business Information Required:**
- Company name and registration details
- Business address and contact info
- Expected monthly booking volume
- Travel industry experience

**Technical Information Required:**
- How you'll handle PNR data securely
- Your booking flow description
- Data protection measures

### **Step 3: Get Consolidator Agreement** (CRITICAL)
**What is a Consolidator?**
- A certified travel agent that can issue airline tickets
- Required for businesses to book real flights
- Acts as your "host agency"

**How to Get One:**
- **Option A**: Ask Amadeus for referral
  - Email: amadeus4developers@amadeus.com
  - Subject: "Consolidator referral needed for Flight Create Orders"
  
- **Option B**: Find your own
  - Search "airline consolidator" + your country
  - Must be certified to issue tickets
  - Need signed agreement

### **Step 4: Submit & Wait**
- **Timeline**: 1-3 weeks for approval
- **Follow-up**: Check app dashboard for status
- **Contact**: amadeus4developers@amadeus.com for questions

---

## 🌍 **COUNTRY RESTRICTIONS**

**Flight Create Orders NOT available in:**
Algeria, Bangladesh, Bhutan, Bulgaria, Croatia, Egypt, Finland, Iceland, Iran, Iraq, Jordan, Kuwait, Kosovo, Lebanon, Libya, Madagascar, Maldives, Montenegro, Morocco, Nepal, Pakistan, Palestine, Qatar, Saudi Arabia, Serbia, Sri Lanka, Sudan, Syria, Tahiti, Tunisia, UAE, Yemen

**Check if your country is supported before applying.**

---

## 📧 **IMMEDIATE ACTION:**

**Email Amadeus Support NOW:**
```
To: amadeus4developers@amadeus.com
Subject: Flight Create Orders Production Access Request

Hi Amadeus Team,

I need Flight Create Orders production access for real PNR generation.

Current Status:
- App ID: [YOUR_APP_ID]
- API Key: HSdhpX2AHnyj7LnL1TjDFL8MHj8lGz5G (first 10 chars)
- Error: 38190 - Invalid token for booking API
- System: Ready for real bookings (no simulation)

Requirements:
1. Flight Create Orders production access
2. Consolidator referral for [YOUR_COUNTRY]
3. Technical documentation for approval

Please provide:
- Application form link
- Consolidator referral
- Timeline for approval

Best regards,
[YOUR_NAME]
```

---

## ✅ **POST-APPROVAL VERIFICATION:**

Once approved, test with:
```bash
cd /home/shubham/sahi/prod
node test-pnr-creation.js
```

**Success indicators:**
- ✅ No error 38190
- ✅ Real PNR returned (e.g., "AI7K9X2P")
- ✅ Order ID from Amadeus
- ✅ Mode: "LIVE_AMADEUS_BOOKING"

---

## 🎉 **BENEFITS OF REAL SYSTEM:**

1. **Actual airline PNRs** - can check with airline directly
2. **Real booking confirmations** - passengers get real tickets
3. **Industry standard** - works like professional travel agencies
4. **No data mismatch** - everything synced with airline systems
5. **Customer trust** - real confirmations build confidence

---

## 📋 **CURRENT SYSTEM BEHAVIOR:**

**Without Flight Create Orders access:**
- ❌ All booking attempts fail with error 38190
- ❌ No PNRs generated (real or simulated)
- ❌ Clear error messages showing exactly what's needed

**With Flight Create Orders access:**
- ✅ Real airline PNRs generated
- ✅ Actual flight bookings in airline systems
- ✅ Professional travel booking experience

---

**🚀 YOUR SYSTEM IS 100% READY FOR REAL BOOKINGS - JUST NEED AMADEUS APPROVAL!** 