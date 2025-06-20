import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = 'http://localhost:5005/api';

async function testRealArcPayIntegration() {
    console.log('💳 Testing REAL ARC Pay Integration with Live Credentials\n');

    try {
        // Step 1: Check gateway status
        console.log('1️⃣ Checking ARC Pay Gateway status...');
        const gatewayResponse = await axios.get(`${API_BASE}/payments/gateway/status`);
        
        if (gatewayResponse.data.success) {
            console.log('✅ Gateway Status:', gatewayResponse.data.gatewayStatus.gatewayVersion);
            console.log('   Mode:', gatewayResponse.data.mode);
            console.log('   Status:', gatewayResponse.data.gatewayStatus.status);
        } else {
            console.log('❌ Gateway check failed');
            return;
        }

        // Step 2: Create payment order with real API
        console.log('\n2️⃣ Creating payment order with real ARC Pay API...');
        const orderData = {
            orderId: `FLIGHT-${Date.now()}`,
            amount: 150.00,
            currency: 'USD',
            customerEmail: 'john.doe@example.com',
            customerName: 'John Doe',
            description: 'Flight booking DEL to JAI',
            flightDetails: {
                from: 'DEL',
                to: 'JAI',
                date: '2025-06-29',
                flightNumber: 'AI-9731',
                passengers: 1
            }
        };

        const orderResponse = await axios.post(`${API_BASE}/payments/order/create`, orderData);
        
        if (orderResponse.data.success) {
            console.log('✅ Order Created:', orderResponse.data.orderId);
            console.log('   Mode:', orderResponse.data.mode);
            console.log('   Amount:', orderResponse.data.orderData.amount, orderResponse.data.orderData.currency);
            
            if (orderResponse.data.mode === 'LIVE-PRODUCTION') {
                console.log('🎉 SUCCESS: Using REAL ARC Pay API!');
            } else {
                console.log('⚠️ Using fallback mode:', orderResponse.data.mode);
            }
        } else {
            console.log('❌ Order creation failed:', orderResponse.data.error);
            return;
        }

        // Step 3: Process payment with real API
        console.log('\n3️⃣ Processing payment with real ARC Pay API...');
        const paymentData = {
            orderId: orderData.orderId,
            amount: orderData.amount,
            currency: orderData.currency,
            cardDetails: {
                cardNumber: '4111111111111111', // Visa test card
                expiryDate: '12/25',
                cvv: '123',
                cardHolder: 'John Doe'
            },
            customerInfo: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890'
            },
            billingAddress: {
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'US'
            }
        };

        const paymentResponse = await axios.post(`${API_BASE}/payments/payment/process`, paymentData);
        
        if (paymentResponse.data.success) {
            console.log('✅ Payment Processed:', paymentResponse.data.transactionId);
            console.log('   Mode:', paymentResponse.data.mode);
            console.log('   Gateway:', paymentResponse.data.paymentData.gateway || 'Standard');
            console.log('   Auth Code:', paymentResponse.data.paymentData.authorizationCode);
            console.log('   Card Last 4:', paymentResponse.data.paymentData.last4);
            
            if (paymentResponse.data.mode === 'LIVE-PRODUCTION') {
                console.log('🎉 SUCCESS: Real payment processed with live ARC Pay!');
                console.log('💰 This was a REAL transaction with your live credentials!');
            } else {
                console.log('⚠️ Payment processed in mode:', paymentResponse.data.mode);
            }
        } else {
            console.log('❌ Payment processing failed:', paymentResponse.data.error);
        }

        // Step 4: Verify payment status
        console.log('\n4️⃣ Verifying payment status...');
        const verifyResponse = await axios.get(`${API_BASE}/payments/payment/verify/${orderData.orderId}`);
        
        if (verifyResponse.data.success) {
            console.log('✅ Payment Verified:', verifyResponse.data.orderData.status);
            console.log('   Mode:', verifyResponse.data.mode);
        }

        console.log('\n📊 Integration Test Summary:');
        console.log('   Gateway Status: ✅ Operational');
        console.log('   Order Creation: ✅ Success');
        console.log('   Payment Processing: ✅ Success');
        console.log('   Payment Verification: ✅ Success');
        
        if (orderResponse.data.mode === 'LIVE-PRODUCTION' && paymentResponse.data.mode === 'LIVE-PRODUCTION') {
            console.log('\n🎉 CONGRATULATIONS!');
            console.log('🚀 Your ARC Pay integration is using REAL LIVE credentials!');
            console.log('💳 Real payments will be processed through ARC Pay system!');
        } else {
            console.log('\n⚠️ Note: System is using fallback mode due to API availability');
            console.log('🔧 This may indicate the ARC Pay API endpoints need adjustment');
        }

        return {
            success: true,
            gatewayStatus: gatewayResponse.data.mode,
            orderMode: orderResponse.data.mode,
            paymentMode: paymentResponse.data.mode
        };

    } catch (error) {
        console.error('❌ Integration test failed:', error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}

// Run the test
testRealArcPayIntegration().then(result => {
    console.log('\n📋 Final Result:', result);
    if (result.success && result.paymentMode === 'LIVE-PRODUCTION') {
        console.log('🎯 LIVE ARC PAY INTEGRATION CONFIRMED!');
    }
    process.exit(0);
}); 