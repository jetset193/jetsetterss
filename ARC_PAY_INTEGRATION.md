# ARC Pay Integration Guide

## Overview

This document outlines the integration of ARC Pay payment gateway into the JetSet Go travel booking application. ARC Pay provides secure payment processing for travel-related transactions with support for various payment methods.

## 🔑 Credentials

Based on the email received from ARC Pay Support, here are the sandbox credentials:

### Test Environment
- **Merchant ID**: `TESTARC05511704`
- **Portal URL**: `https://api.arcpay.travel/ma/`
- **API URL**: `https://api.arcpay.travel/api/rest/version/77/merchant/TESTARC05511704`
- **Username**: `TESTARC05511704`
- **Password**: `SHc9CiplHyjfIKeFKyCSH/78fjw=`

### Production Environment
- **Merchant ID**: `ARC05511704`
- **Portal URL**: `https://api.arcpay.travel/ma/`
- **Username**: `Administrator`
- **Password**: `pqiUhfYMWhqUCAiKAKoQtCs5frc=`

## 🏗️ Architecture

The ARC Pay integration follows a secure server-side approach:

```
Frontend (React) → Backend API → ARC Pay Gateway
```

### Components

1. **Frontend Service** (`resources/js/Services/ArcPayService.js`)
   - Handles client-side payment interactions
   - Validates card details before submission
   - Communicates with backend API

2. **Backend Routes** (`backend/routes/payment.routes.js`)
   - Secure server-side ARC Pay API integration
   - Handles authentication with ARC Pay
   - Processes payments and manages orders

3. **Flight Payment Component** (`resources/js/Pages/Common/flights/FlightPayment.jsx`)
   - User interface for payment processing
   - Form validation and user experience

## 🔧 Features Supported

Based on the ARC Pay setup, the following features are available:

### Required Features
- ✅ Payment Types: Visa, Mastercard, American Express
- ✅ Checkout: Session or Hosted
- ✅ Direct API (Non-UI)
- ✅ Mobile SDK support
- ✅ Purchase transactions
- ✅ Transaction operations: Authorize, Capture, Pay, Refund, Void
- ✅ Reporting API
- ✅ Transaction Source: Internet, Mail Order, Telephone Order
- ✅ API Password-based authentication

### Optional Features
- ✅ Tokenization
- ✅ Device Payments (wallet provider keys)
- ✅ EMV 3DS support
- ✅ Address Verification Service (AVS)
- ✅ Click to Pay
- ✅ Risk Management
- ✅ Payment Link (embedded links for text/email transactions)

## 📋 API Endpoints

### Backend Endpoints

All endpoints are prefixed with `/api/payments`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gateway/status` | Check ARC Pay gateway operational status |
| POST | `/session/create` | Create a payment session |
| POST | `/order/create` | Create a payment order |
| POST | `/payment/process` | Process credit card payment |
| GET | `/payment/verify/:orderId` | Verify payment status |
| POST | `/payment/refund` | Process payment refund |
| POST | `/test` | Run integration tests |

### ARC Pay API Reference

Based on the ARC Pay documentation:

- **Gateway Check**: `GET https://api.arcpay.travel/api/rest/version/100/information`
- **Order Management**: `PUT /order/{orderId}`
- **Payment Processing**: `PUT /order/{orderId}/transaction/{transactionId}`

## 🧪 Testing

### Running Tests

1. **Backend Integration Test**:
   ```bash
   node test-arc-pay-integration.js
   ```

2. **API Endpoint Test**:
   ```bash
   curl -X POST http://localhost:5001/api/payments/test
   ```

3. **Gateway Status Check**:
   ```bash
   curl -X GET http://localhost:5001/api/payments/gateway/status
   ```

### Test Credit Cards

For sandbox testing, use these standard test credit card numbers:

| Card Type | Number | CVV | Expiry |
|-----------|--------|-----|--------|
| Visa | 4111111111111111 | 123 | 12/25 |
| Mastercard | 5555555555554444 | 123 | 12/25 |
| American Express | 378282246310005 | 1234 | 12/25 |

## 🔒 Security

### Authentication
- Uses HTTP Basic Authentication with merchant credentials
- API password is securely stored in environment variables
- All communications use HTTPS

### PCI Compliance
- Card details are transmitted securely to ARC Pay
- No sensitive card data is stored on our servers
- Tokenization available for recurring payments

### Environment Variables

Add these to your `.env` file:

```env
# ARC Pay Configuration
ARC_PAY_API_URL=https://api.arcpay.travel/api/rest/version/77/merchant/TESTARC05511704
ARC_PAY_MERCHANT_ID=TESTARC05511704
ARC_PAY_API_USERNAME=TESTARC05511704
ARC_PAY_API_PASSWORD=SHc9CiplHyjfIKeFKyCSH/78fjw=
```

## 🚀 Implementation Steps

### 1. Backend Setup

The backend routes are already implemented in `backend/routes/payment.routes.js` and integrated into the main server.

### 2. Frontend Integration

The frontend service (`ArcPayService.js`) communicates with the backend API for secure payment processing.

### 3. Payment Flow

1. **Gateway Status Check**: Verify ARC Pay is operational
2. **Order Creation**: Create order with flight booking details
3. **Payment Processing**: Process credit card payment
4. **Verification**: Confirm payment success
5. **Redirect**: Navigate to booking confirmation

### 4. Error Handling

The integration includes comprehensive error handling:
- Gateway unavailability
- Invalid card details
- Payment processing failures
- Network timeouts

## 📱 Payment Methods

### Credit Card
- Visa, Mastercard, American Express
- Real-time validation
- Secure tokenization available

### Alternative Methods (Future)
- UPI (India)
- Digital wallets
- Bank transfers
- Buy now, pay later

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify merchant credentials in environment variables
   - Check API username and password

2. **Gateway Unavailable**
   - Check gateway status endpoint
   - Verify network connectivity

3. **Payment Declined**
   - Use test credit card numbers
   - Check card details validation

4. **Session Timeout**
   - Implement session refresh
   - Handle timeout gracefully

### Debug Mode

Enable debug logging by setting `NODE_ENV=development`:

```javascript
console.log('🔍 ARC Pay Debug Info:', response.data);
```

## 📊 Monitoring

### Key Metrics
- Payment success rate
- Average processing time
- Error rates by type
- Gateway uptime

### Logging
- All payment attempts are logged
- Error details captured for debugging
- Transaction IDs tracked for reconciliation

## 🔄 Production Deployment

### Before Going Live

1. **Complete Certification**
   - Test all payment scenarios
   - Verify error handling
   - Complete ARC Pay certification process

2. **Switch to Production**
   - Update merchant ID to `ARC05511704`
   - Use production API endpoints
   - Update environment variables

3. **Monitoring Setup**
   - Implement payment monitoring
   - Set up alerting for failures
   - Track key performance metrics

## 📞 Support

### ARC Pay Support
- **Email**: ARCPay@arccorp.com
- **Portal**: https://api.arcpay.travel/ma/
- **Documentation**: [ARC Pay API Docs](https://api.arcpay.travel/api/documentation/)

### Internal Support
- Check application logs for detailed error messages
- Use the test integration script for diagnostics
- Review the ARC Pay merchant portal for transaction details

## 📚 Additional Resources

- [ARC Pay API Documentation](https://api.arcpay.travel/api/documentation/apiDocumentation/rest-json/version/100/operation/Gateway:%20%20Check%20Gateway.html?locale=en_US)
- [ARC Pay Postman Collection (v70)](https://api.arcpay.travel/api/documentation/)
- [Merchant Admin Portal User Guide](https://api.arcpay.travel/ma/)

---

*Last Updated: January 2025*
*Integration Status: ✅ Sandbox Ready* 