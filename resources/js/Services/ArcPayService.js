import axios from 'axios';

// Use the backend API for ARC Pay integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

class ArcPayService {
    constructor() {
        this.apiUrl = `${API_BASE_URL}/payments`;
        this.api = axios.create({
            baseURL: this.apiUrl,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Check ARC Pay Gateway Status
    async checkGatewayStatus() {
        try {
            console.log('🔍 Checking ARC Pay Gateway status...');
            const response = await this.api.get('/gateway/status');
            return {
                success: true,
                data: response.data,
                gatewayOperational: response.data.gatewayStatus?.status === 'OPERATING'
            };
        } catch (error) {
            console.error('Gateway status check failed:', error);
            return {
                success: false,
                error: error.response?.data || error.message,
                gatewayOperational: false
            };
        }
    }

    // Create Payment Session
    async createSession() {
        try {
            console.log('🚀 Creating payment session...');
            const response = await this.api.post('/session/create');
            return {
                success: true,
                sessionData: response.data.sessionData,
                message: response.data.message
            };
        } catch (error) {
            console.error('Session creation failed:', error);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Initialize Payment (Create Order)
    async initializePayment(paymentData) {
        try {
            console.log('💳 Initializing payment with data:', paymentData);
            
            const orderPayload = {
                amount: paymentData.amount,
                currency: paymentData.currency || 'USD',
                orderId: paymentData.orderId,
                customerEmail: paymentData.customerEmail,
                customerName: paymentData.customerName,
                description: paymentData.description || `Payment for ${paymentData.orderId}`,
                returnUrl: paymentData.returnUrl,
                cancelUrl: paymentData.cancelUrl
            };

            const response = await this.api.post('/order/create', orderPayload);
            
            return {
                success: true,
                orderId: response.data.orderId,
                orderData: response.data.orderData,
                message: response.data.message
            };
        } catch (error) {
            console.error('Payment initialization failed:', error);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Process Payment
    async processPayment(orderId, paymentData) {
        try {
            console.log('💳 Processing payment for order:', orderId);
            
            const paymentPayload = {
                orderId: orderId,
                cardDetails: {
                    cardNumber: paymentData.cardDetails?.cardNumber,
                    expiryDate: paymentData.cardDetails?.expiryDate,
                    cvv: paymentData.cardDetails?.cvv,
                    cardHolder: paymentData.cardDetails?.cardHolder
                },
                billingAddress: paymentData.billingAddress,
                browserData: paymentData.browserData
            };

            const response = await this.api.post('/payment/process', paymentPayload);
            
            return {
                success: response.data.success,
                paymentData: response.data.paymentData,
                transactionId: response.data.transactionId,
                message: response.data.message
            };
        } catch (error) {
            console.error('Payment processing failed:', error);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Verify Payment Status
    async verifyPayment(orderId) {
        try {
            console.log('🔍 Verifying payment for order:', orderId);
            
            const response = await this.api.get(`/payment/verify/${orderId}`);
            
            return {
                success: true,
                orderData: response.data.orderData,
                message: response.data.message
            };
        } catch (error) {
            console.error('Payment verification failed:', error);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Refund Payment
    async refundPayment(orderId, transactionId, amount, reason = 'Customer request') {
        try {
            console.log('💰 Processing refund for order:', orderId);
            
            const refundPayload = {
                orderId: orderId,
                transactionId: transactionId,
                amount: amount,
                reason: reason
            };

            const response = await this.api.post('/payment/refund', refundPayload);
            
            return {
                success: response.data.success,
                refundData: response.data.refundData,
                refundReference: response.data.refundReference,
                message: response.data.message
            };
        } catch (error) {
            console.error('Refund processing failed:', error);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Test ARC Pay Integration
    async testIntegration() {
        try {
            console.log('🧪 Testing ARC Pay integration...');
            
            const response = await this.api.post('/test');
            
            return {
                success: true,
                testResults: response.data.testResults,
                message: response.data.message
            };
        } catch (error) {
            console.error('Integration test failed:', error);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    // Helper method to format amount for ARC Pay
    formatAmount(amount) {
        // ARC Pay expects amounts in the smallest currency unit (e.g., cents for USD)
        return Math.round(parseFloat(amount) * 100);
    }

    // Helper method to format card number
    formatCardNumber(cardNumber) {
        return cardNumber.replace(/\s/g, '');
    }

    // Helper method to validate card details
    validateCardDetails(cardDetails) {
        const errors = [];
        
        if (!cardDetails.cardNumber || !this.formatCardNumber(cardDetails.cardNumber).match(/^\d{13,19}$/)) {
            errors.push('Invalid card number');
        }
        
        if (!cardDetails.expiryDate || !cardDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            errors.push('Invalid expiry date (MM/YY format required)');
        }
        
        if (!cardDetails.cvv || !cardDetails.cvv.match(/^\d{3,4}$/)) {
            errors.push('Invalid CVV');
        }
        
        if (!cardDetails.cardHolder || cardDetails.cardHolder.trim().length < 2) {
            errors.push('Invalid cardholder name');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Helper method to get card type
    getCardType(cardNumber) {
        const cleanNumber = this.formatCardNumber(cardNumber);
        
        if (cleanNumber.match(/^4/)) return 'Visa';
        if (cleanNumber.match(/^5[1-5]/)) return 'Mastercard';
        if (cleanNumber.match(/^3[47]/)) return 'American Express';
        if (cleanNumber.match(/^6/)) return 'Discover';
        
        return 'Unknown';
    }
}

export default new ArcPayService(); 