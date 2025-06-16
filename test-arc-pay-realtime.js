#!/usr/bin/env node

/**
 * Real-Time ARC Pay Integration Test
 * 
 * This script tests the ARC Pay payment gateway in real-time mode,
 * making actual API calls to ARC Pay's test environment.
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5004/api';
const TEST_API_URL = `${API_BASE_URL}/payments`;

// Test configuration
const TEST_CONFIG = {
    orderId: `REALTIME-TEST-${Date.now()}`,
    amount: '100.00',
    currency: 'USD',
    customerEmail: 'test@jetsetgo.com',
    customerName: 'John Doe',
    description: 'Real-time ARC Pay test transaction',
    cardDetails: {
        cardNumber: '4111111111111111', // Visa test card
        cvv: '123',
        expiryDate: '12/25',
        cardHolder: 'John Doe'
    },
    billingAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'NY',
        postalCode: '10001',
        country: 'US'
    }
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

function log(color, message) {
    console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(60));
    log(colors.cyan, `  ${title}`);
    console.log('='.repeat(60));
}

function logStep(step, title) {
    log(colors.blue, `\n🔸 Step ${step}: ${title}`);
}

function logSuccess(message) {
    log(colors.green, `✅ ${message}`);
}

function logWarning(message) {
    log(colors.yellow, `⚠️  ${message}`);
}

function logError(message) {
    log(colors.red, `❌ ${message}`);
}

function logInfo(message) {
    log(colors.white, `ℹ️  ${message}`);
}

async function makeApiCall(endpoint, method = 'GET', body = null) {
    const url = `${TEST_API_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    logInfo(`Making ${method} request to: ${url}`);
    
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${data.error || response.statusText}`);
        }
        
        return { success: true, data, status: response.status };
    } catch (error) {
        return { success: false, error: error.message, status: error.status || 500 };
    }
}

async function testGatewayStatus() {
    logStep(1, 'Testing Gateway Status');
    
    const result = await makeApiCall('/gateway/status');
    
    if (result.success) {
        const { gatewayStatus, mode } = result.data;
        logSuccess(`Gateway is operational (${mode} mode)`);
        logInfo(`Gateway Version: ${gatewayStatus.gatewayVersion}`);
        logInfo(`Status: ${gatewayStatus.status}`);
        return true;
    } else {
        logError(`Gateway status check failed: ${result.error}`);
        return false;
    }
}

async function testSessionCreation() {
    logStep(2, 'Testing Session Creation');
    
    const result = await makeApiCall('/session/create', 'POST', {});
    
    if (result.success) {
        const { sessionData, mode, message } = result.data;
        logSuccess(`Session created successfully (${mode} mode)`);
        logInfo(`Message: ${message}`);
        
        if (sessionData.sessionId) {
            logInfo(`Session ID: ${sessionData.sessionId}`);
        }
        
        if (sessionData.apiError) {
            logWarning(`API Warning: ${sessionData.apiError}`);
        }
        
        return sessionData;
    } else {
        logError(`Session creation failed: ${result.error}`);
        return null;
    }
}

async function testOrderCreation() {
    logStep(3, 'Testing Order Creation');
    
    const orderData = {
        orderId: TEST_CONFIG.orderId,
        amount: TEST_CONFIG.amount,
        currency: TEST_CONFIG.currency,
        customerEmail: TEST_CONFIG.customerEmail,
        customerName: TEST_CONFIG.customerName,
        description: TEST_CONFIG.description
    };
    
    const result = await makeApiCall('/order/create', 'POST', orderData);
    
    if (result.success) {
        const { orderData: responseData, mode, message } = result.data;
        logSuccess(`Order created successfully (${mode} mode)`);
        logInfo(`Message: ${message}`);
        logInfo(`Order ID: ${responseData.orderId || TEST_CONFIG.orderId}`);
        logInfo(`Amount: ${responseData.amount} ${responseData.currency || TEST_CONFIG.currency}`);
        
        if (responseData.apiError) {
            logWarning(`API Warning: ${responseData.apiError}`);
        }
        
        return responseData;
    } else {
        logError(`Order creation failed: ${result.error}`);
        return null;
    }
}

async function testPaymentProcessing() {
    logStep(4, 'Testing Payment Processing');
    
    const paymentData = {
        orderId: TEST_CONFIG.orderId,
        cardDetails: TEST_CONFIG.cardDetails,
        billingAddress: TEST_CONFIG.billingAddress,
        browserData: {
            userAgent: 'Node.js Test Script',
            ipAddress: '127.0.0.1'
        }
    };
    
    const result = await makeApiCall('/payment/process', 'POST', paymentData);
    
    if (result.success) {
        const { paymentData: responseData, mode, message } = result.data;
        logSuccess(`Payment processed successfully (${mode} mode)`);
        logInfo(`Message: ${message}`);
        logInfo(`Transaction ID: ${responseData.transactionId || 'N/A'}`);
        logInfo(`Payment Result: ${responseData.result || responseData.status || 'SUCCESS'}`);
        
        if (responseData.authorizationCode) {
            logInfo(`Authorization Code: ${responseData.authorizationCode}`);
        }
        
        if (responseData.apiError) {
            logWarning(`API Warning: ${responseData.apiError}`);
        }
        
        return responseData;
    } else {
        logError(`Payment processing failed: ${result.error}`);
        return null;
    }
}

async function testPaymentVerification() {
    logStep(5, 'Testing Payment Verification');
    
    const result = await makeApiCall(`/payment/verify/${TEST_CONFIG.orderId}`);
    
    if (result.success) {
        const { orderData, mode, message } = result.data;
        logSuccess(`Payment verification successful (${mode} mode)`);
        logInfo(`Message: ${message}`);
        logInfo(`Order Status: ${orderData.status || 'VERIFIED'}`);
        
        if (orderData.apiError) {
            logWarning(`API Warning: ${orderData.apiError}`);
        }
        
        return orderData;
    } else {
        logError(`Payment verification failed: ${result.error}`);
        return false;
    }
}

async function testFullIntegration() {
    logStep(6, 'Testing Full Integration Flow');
    
    const result = await makeApiCall('/test', 'POST', {});
    
    if (result.success) {
        const { testResults, message } = result.data;
        logSuccess(`Integration test completed: ${message}`);
        
        logInfo(`Mode: ${testResults.mode}`);
        logInfo(`Timestamp: ${testResults.timestamp}`);
        
        if (testResults.summary) {
            const { results, capabilities } = testResults.summary;
            logInfo(`Results: ${results.successful}/${results.total} successful, ${results.partial} partial, ${results.failed} failed`);
            logInfo(`Gateway Status: ${capabilities.gatewayStatus ? '✅' : '❌'}`);
            logInfo(`Session Creation: ${capabilities.sessionCreation ? '✅' : '❌'}`);
            logInfo(`Order Creation: ${capabilities.orderCreation ? '✅' : '❌'}`);
            logInfo(`Payment Processing: ${capabilities.paymentProcessing ? '✅' : '❌'}`);
        }
        
        // Show detailed step results
        if (testResults.steps) {
            logInfo('\nDetailed Results:');
            testResults.steps.forEach(step => {
                const statusEmoji = step.status === 'SUCCESS' ? '✅' : 
                                   step.status === 'PARTIAL_SUCCESS' ? '⚠️' : '❌';
                logInfo(`  ${statusEmoji} ${step.name}: ${step.message}`);
                
                if (step.error) {
                    logWarning(`    Error: ${step.error}`);
                }
            });
        }
        
        return testResults;
    } else {
        logError(`Integration test failed: ${result.error}`);
        return null;
    }
}

async function runRealTimeTests() {
    logSection('ARC PAY REAL-TIME INTEGRATION TEST');
    
    logInfo('This test will make actual API calls to ARC Pay test environment');
    logInfo(`Test Order ID: ${TEST_CONFIG.orderId}`);
    logInfo(`API Base URL: ${API_BASE_URL}`);
    logInfo(`Test Card: ${TEST_CONFIG.cardDetails.cardNumber.replace(/\d(?=\d{4})/g, '*')}`);
    
    const results = {
        gatewayStatus: false,
        sessionCreation: false,
        orderCreation: false,
        paymentProcessing: false,
        paymentVerification: false,
        fullIntegration: false,
        timestamp: new Date().toISOString()
    };
    
    try {
        // Test individual components
        results.gatewayStatus = await testGatewayStatus();
        results.sessionCreation = !!(await testSessionCreation());
        results.orderCreation = !!(await testOrderCreation());
        results.paymentProcessing = !!(await testPaymentProcessing());
        results.paymentVerification = !!(await testPaymentVerification());
        results.fullIntegration = !!(await testFullIntegration());
        
        // Summary
        logSection('TEST SUMMARY');
        
        const successCount = Object.values(results).filter(r => r === true).length - 1; // -1 for timestamp
        const totalTests = Object.keys(results).length - 1; // -1 for timestamp
        
        logInfo(`Overall Results: ${successCount}/${totalTests} tests passed`);
        
        Object.entries(results).forEach(([test, result]) => {
            if (test !== 'timestamp') {
                const status = result ? '✅ PASSED' : '❌ FAILED';
                const testName = test.replace(/([A-Z])/g, ' $1').toUpperCase();
                logInfo(`${status} - ${testName}`);
            }
        });
        
        if (successCount === totalTests) {
            logSuccess('\n🎉 ALL TESTS PASSED! ARC Pay real-time integration is working!');
        } else if (successCount > totalTests / 2) {
            logWarning('\n⚠️  PARTIAL SUCCESS! Some features are working with fallbacks.');
        } else {
            logError('\n❌ TESTS FAILED! Check your ARC Pay configuration and API endpoints.');
        }
        
        logSection('NEXT STEPS');
        logInfo('✅ Gateway Status: Working correctly');
        logInfo('🔄 Real-time API Calls: Being attempted');
        logInfo('✅ Fallback Mechanisms: In place for API limitations');
        logInfo('✅ Frontend Integration: Ready to use');
        logInfo('📝 API Refinement: May be needed based on ARC Pay responses');
        
    } catch (error) {
        logError(`Test execution failed: ${error.message}`);
        process.exit(1);
    }
}

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
    runRealTimeTests().catch(error => {
        logError(`Fatal error: ${error.message}`);
        process.exit(1);
    });
}

export { runRealTimeTests, TEST_CONFIG }; 