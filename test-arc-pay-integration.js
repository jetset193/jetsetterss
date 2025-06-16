import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ARC Pay configuration based on your credentials
const ARC_PAY_CONFIG = {
    API_URL: 'https://api.arcpay.travel/api/rest/version/77/merchant/TESTARC05511704',
    MERCHANT_ID: 'TESTARC05511704',
    API_USERNAME: 'TESTARC05511704',
    API_PASSWORD: 'SHc9CiplHyjfIKeFKyCSH/78fjw=', // Portal password from your email
    CHECK_GATEWAY_URL: 'https://api.arcpay.travel/api/rest/version/100/information'
};

// Test data for flight booking
const testFlightData = {
    bookingDetails: {
        flight: {
            departureCity: "Hyderabad",
            arrivalCity: "Delhi",
            departureDate: "2025-06-15",
            airline: "Air India",
            duration: "2h 30m",
            flightNumber: "AI-101"
        }
    },
    passengerData: [{
        firstName: "Test",
        lastName: "User",
        email: "test@jetsetgo.com",
        mobile: "9876543210",
        dateOfBirth: "1990-01-01",
        gender: "MALE",
        nationality: "IN"
    }],
    calculatedFare: {
        baseFare: 150.00,
        tax: 25.00,
        addonsTotal: 0,
        vipServiceFee: 0,
        totalAmount: 175.00,
        currency: "USD"
    }
};

// Helper function for authentication
const getAuthConfig = () => {
    return {
        auth: {
            username: ARC_PAY_CONFIG.API_USERNAME,
            password: ARC_PAY_CONFIG.API_PASSWORD
        },
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        timeout: 30000 // 30 second timeout
    };
};

// Test 1: Check Gateway Status
async function testGatewayStatus() {
    console.log('\n🔍 Testing ARC Pay Gateway Status...');
    try {
        const response = await axios.get(ARC_PAY_CONFIG.CHECK_GATEWAY_URL, {
            timeout: 10000
        });
        
        console.log('✅ Gateway Status Response:', JSON.stringify(response.data, null, 2));
        
        if (response.data.status === 'OPERATING') {
            console.log('✅ Gateway is operational and ready for transactions');
            return true;
        } else {
            console.log('⚠️ Gateway status:', response.data.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Gateway status check failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
        return false;
    }
}

// Test 2: Create Payment Order
async function testCreateOrder() {
    console.log('\n💳 Testing Order Creation...');
    
    const orderId = `FLIGHT-TEST-${Date.now()}`;
    
    try {
        // Based on ARC Pay documentation, the correct payload structure
        const orderPayload = {
            order: {
                amount: testFlightData.calculatedFare.totalAmount,
                currency: testFlightData.calculatedFare.currency,
                id: orderId,
                description: `Flight: ${testFlightData.bookingDetails.flight.flightNumber} - ${testFlightData.bookingDetails.flight.departureCity} to ${testFlightData.bookingDetails.flight.arrivalCity}`
            },
            customer: {
                email: testFlightData.passengerData[0].email,
                firstName: testFlightData.passengerData[0].firstName,
                lastName: testFlightData.passengerData[0].lastName,
                phone: testFlightData.passengerData[0].mobile
            },
            billing: {
                address: {
                    street: "123 Test Street",
                    city: "Hyderabad",
                    state: "Telangana",
                    country: "IN",
                    postcodeZip: "500001"
                }
            }
        };
        
        console.log('Order payload:', JSON.stringify(orderPayload, null, 2));
        
        // Use PUT method for order creation as per ARC Pay API
        const response = await axios.put(
            `${ARC_PAY_CONFIG.API_URL}/order/${orderId}`,
            orderPayload,
            getAuthConfig()
        );
        
        console.log('✅ Order created successfully:');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
        return {
            success: true,
            orderId: orderId,
            orderData: response.data
        };
    } catch (error) {
        console.error('❌ Order creation failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
        return {
            success: false,
            error: error.message
        };
    }
}

// Test 3: Process Test Payment
async function testProcessPayment(orderId) {
    console.log('\n💳 Testing Payment Processing...');
    
    try {
        // Test credit card details (these are standard test numbers)
        const paymentPayload = {
            apiOperation: "PAY",
            order: {
                reference: orderId
            },
            sourceOfFunds: {
                type: "CARD",
                provided: {
                    card: {
                        number: "4111111111111111", // Visa test card
                        securityCode: "123",
                        expiry: {
                            month: "12",
                            year: "2025"
                        }
                    }
                }
            },
            transaction: {
                reference: `TXN-${orderId}-${Date.now()}`
            }
        };
        
        console.log('Payment payload:', JSON.stringify(paymentPayload, null, 2));
        
        const response = await axios.put(
            `${ARC_PAY_CONFIG.API_URL}/order/${orderId}/transaction/${paymentPayload.transaction.reference}`,
            paymentPayload,
            getAuthConfig()
        );
        
        console.log('✅ Payment processed successfully:');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
        // Check if payment was successful
        const isSuccess = response.data.result === 'SUCCESS';
        
        return {
            success: isSuccess,
            transactionId: paymentPayload.transaction.reference,
            paymentData: response.data
        };
    } catch (error) {
        console.error('❌ Payment processing failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
        return {
            success: false,
            error: error.message
        };
    }
}

// Test 4: Verify Payment Status
async function testVerifyPayment(orderId) {
    console.log('\n🔍 Testing Payment Verification...');
    
    try {
        const response = await axios.get(
            `${ARC_PAY_CONFIG.API_URL}/order/${orderId}`,
            getAuthConfig()
        );
        
        console.log('✅ Payment verification successful:');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
        return {
            success: true,
            orderStatus: response.data
        };
    } catch (error) {
        console.error('❌ Payment verification failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
        return {
            success: false,
            error: error.message
        };
    }
}

// Main test runner
async function runArcPayTests() {
    console.log('🚀 Starting ARC Pay Integration Tests...');
    console.log('========================================');
    
    // Test flight booking data
    console.log('\n📋 Test Data:');
    console.log('Flight:', JSON.stringify(testFlightData.bookingDetails.flight, null, 2));
    console.log('Passenger:', JSON.stringify(testFlightData.passengerData[0], null, 2));
    console.log('Fare:', `${testFlightData.calculatedFare.totalAmount} ${testFlightData.calculatedFare.currency}`);
    
    let testResults = {
        gatewayStatus: false,
        orderCreation: false,
        paymentProcessing: false,
        paymentVerification: false
    };
    
    // Step 1: Test Gateway Status
    testResults.gatewayStatus = await testGatewayStatus();
    
    if (!testResults.gatewayStatus) {
        console.log('\n❌ Gateway is not operational. Skipping other tests.');
        return testResults;
    }
    
    // Step 2: Test Order Creation
    const orderResult = await testCreateOrder();
    testResults.orderCreation = orderResult.success;
    
    if (!orderResult.success) {
        console.log('\n❌ Order creation failed. Skipping payment tests.');
        return testResults;
    }
    
    // Step 3: Test Payment Processing
    const paymentResult = await testProcessPayment(orderResult.orderId);
    testResults.paymentProcessing = paymentResult.success;
    
    // Step 4: Test Payment Verification (regardless of payment success)
    const verificationResult = await testVerifyPayment(orderResult.orderId);
    testResults.paymentVerification = verificationResult.success;
    
    // Summary
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`Gateway Status: ${testResults.gatewayStatus ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Order Creation: ${testResults.orderCreation ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Payment Processing: ${testResults.paymentProcessing ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Payment Verification: ${testResults.paymentVerification ? '✅ PASS' : '❌ FAIL'}`);
    
    const passedTests = Object.values(testResults).filter(Boolean).length;
    const totalTests = Object.keys(testResults).length;
    
    console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! ARC Pay integration is working correctly.');
    } else {
        console.log('⚠️ Some tests failed. Please check the error messages above.');
    }
    
    return testResults;
}

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
    runArcPayTests().catch(console.error);
}

export { runArcPayTests, testGatewayStatus, testCreateOrder, testProcessPayment, testVerifyPayment }; 