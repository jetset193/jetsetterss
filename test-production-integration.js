import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Test configuration
const TEST_CONFIG = {
    // Test endpoints
    LOCAL_API_BASE: 'http://localhost:5001/api',
    VERCEL_API_BASE: 'https://prod-six-phi.vercel.app/api',
    
    // Test flight search parameters
    flightSearch: {
        from: 'DEL', // Delhi
        to: 'DXB',   // Dubai
        departDate: '2025-07-15',
        travelers: 1,
        max: 5
    },
    
    // Test payment data
    payment: {
        amount: 150.00,
        currency: 'USD',
        customerEmail: 'test@jetsetgo.com',
        customerName: 'Test User'
    }
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Logging functions
const logStep = (step, message) => {
    console.log(`\n${colors.blue}${colors.bright}=== STEP ${step}: ${message} ===${colors.reset}`);
};

const logSuccess = (message) => {
    console.log(`${colors.green}✅ ${message}${colors.reset}`);
};

const logError = (message) => {
    console.log(`${colors.red}❌ ${message}${colors.reset}`);
};

const logWarning = (message) => {
    console.log(`${colors.yellow}⚠️ ${message}${colors.reset}`);
};

const logInfo = (message) => {
    console.log(`${colors.cyan}ℹ️ ${message}${colors.reset}`);
};

// Test functions
async function testAmadeusCredentials() {
    logStep(1, 'Testing Amadeus Credentials');
    
    const credentials = {
        apiKey: process.env.AMADEUS_API_KEY || process.env.REACT_APP_AMADEUS_API_KEY,
        apiSecret: process.env.AMADEUS_API_SECRET || process.env.REACT_APP_AMADEUS_API_SECRET
    };
    
    if (credentials.apiKey && credentials.apiSecret) {
        logSuccess(`Amadeus credentials found`);
        logInfo(`API Key: ${credentials.apiKey.substring(0, 8)}...`);
        logInfo(`API Secret: ${credentials.apiSecret.length} characters`);
        return true;
    } else {
        logError('Amadeus credentials not found in environment variables');
        return false;
    }
}

async function testFlightSearch(baseUrl) {
    logStep(2, `Testing Flight Search API - ${baseUrl}`);
    
    try {
        const response = await axios.post(`${baseUrl}/flights/search`, TEST_CONFIG.flightSearch, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        
        if (response.data.success) {
            logSuccess(`Flight search successful`);
            logInfo(`Found ${response.data.data?.length || 0} flights`);
            
            if (response.data.data && response.data.data.length > 0) {
                const firstFlight = response.data.data[0];
                logInfo(`Sample flight: ${firstFlight.airline} ${firstFlight.flightNumber}`);
                logInfo(`Price: ${firstFlight.price?.currency} ${firstFlight.price?.amount}`);
                logInfo(`Duration: ${firstFlight.duration}`);
                logInfo(`Source: ${response.data.meta?.source || 'unknown'}`);
            }
            
            return {
                success: true,
                flights: response.data.data,
                meta: response.data.meta
            };
        } else {
            logError(`Flight search failed: ${response.data.error}`);
            return { success: false, error: response.data.error };
        }
        
    } catch (error) {
        logError(`Flight search request failed: ${error.message}`);
        if (error.response?.data) {
            logError(`Error details: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        return { success: false, error: error.message };
    }
}

async function testArcPayConfiguration() {
    logStep(3, 'Testing ARC Pay Configuration');
    
    const config = {
        apiUrl: process.env.ARC_PAY_API_URL,
        merchantId: process.env.ARC_PAY_MERCHANT_ID,
        username: process.env.ARC_PAY_API_USERNAME,
        password: process.env.ARC_PAY_API_PASSWORD
    };
    
    logInfo(`API URL: ${config.apiUrl || 'Not configured'}`);
    logInfo(`Merchant ID: ${config.merchantId || 'Not configured'}`);
    logInfo(`Username: ${config.username || 'Not configured'}`);
    logInfo(`Password: ${config.password ? 'Configured' : 'Not configured'}`);
    
    if (config.apiUrl && config.merchantId && config.username && config.password) {
        logSuccess('ARC Pay configuration looks complete');
        return true;
    } else {
        logWarning('ARC Pay configuration incomplete');
        return false;
    }
}

async function testPaymentFlow(baseUrl) {
    logStep(4, `Testing Payment Flow - ${baseUrl}`);
    
    try {
        // Test payment initialization
        const orderData = {
            orderId: `TEST-${Date.now()}`,
            amount: TEST_CONFIG.payment.amount,
            currency: TEST_CONFIG.payment.currency,
            customerEmail: TEST_CONFIG.payment.customerEmail,
            customerName: TEST_CONFIG.payment.customerName,
            description: 'Test flight booking payment'
        };
        
        const response = await axios.post(`${baseUrl}/payments?action=order-create`, orderData, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 15000
        });
        
        if (response.data.success) {
            logSuccess('Payment order created successfully');
            logInfo(`Order ID: ${response.data.orderId}`);
            return { success: true, orderId: response.data.orderId };
        } else {
            logError(`Payment order creation failed: ${response.data.error}`);
            return { success: false, error: response.data.error };
        }
        
    } catch (error) {
        logError(`Payment flow test failed: ${error.message}`);
        if (error.response?.data) {
            logError(`Error details: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        return { success: false, error: error.message };
    }
}

async function testFlightHealthCheck(baseUrl) {
    logStep(5, `Testing Flight API Health - ${baseUrl}`);
    
    try {
        const response = await axios.get(`${baseUrl}/flights/health`, {
            timeout: 10000
        });
        
        if (response.data.success) {
            logSuccess('Flight API health check passed');
            logInfo(`Service: ${response.data.service}`);
            logInfo(`Status: ${response.data.status}`);
            logInfo(`Credentials configured: ${response.data.credentials?.configured}`);
            return { success: true };
        } else {
            logError('Flight API health check failed');
            return { success: false };
        }
        
    } catch (error) {
        logError(`Health check failed: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function runIntegrationTests() {
    console.log(`${colors.magenta}${colors.bright}`);
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║              PRODUCTION INTEGRATION TEST SUITE              ║');
    console.log('║           Amadeus API + ARC Pay Integration Test            ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log(`${colors.reset}\n`);
    
    const results = {
        timestamp: new Date().toISOString(),
        tests: []
    };
    
    // Test 1: Credentials
    const credentialsResult = await testAmadeusCredentials();
    results.tests.push({ name: 'Amadeus Credentials', success: credentialsResult });
    
    // Test 2: ARC Pay Configuration
    const arcPayResult = await testArcPayConfiguration();
    results.tests.push({ name: 'ARC Pay Configuration', success: arcPayResult });
    
    // Test 3: Local API tests (if available)
    logStep(3, 'Testing Local API Endpoints');
    try {
        const localHealthResult = await testFlightHealthCheck(TEST_CONFIG.LOCAL_API_BASE);
        results.tests.push({ name: 'Local Flight Health', success: localHealthResult.success });
        
        if (localHealthResult.success) {
            const localFlightResult = await testFlightSearch(TEST_CONFIG.LOCAL_API_BASE);
            results.tests.push({ name: 'Local Flight Search', success: localFlightResult.success });
            
            const localPaymentResult = await testPaymentFlow(TEST_CONFIG.LOCAL_API_BASE);
            results.tests.push({ name: 'Local Payment Flow', success: localPaymentResult.success });
        }
    } catch (error) {
        logWarning('Local API tests skipped (server not running?)');
        results.tests.push({ name: 'Local API Tests', success: false, error: 'Server not available' });
    }
    
    // Test 4: Vercel API tests
    logStep(4, 'Testing Vercel Deployment');
    try {
        const vercelHealthResult = await testFlightHealthCheck(TEST_CONFIG.VERCEL_API_BASE);
        results.tests.push({ name: 'Vercel Flight Health', success: vercelHealthResult.success });
        
        if (vercelHealthResult.success) {
            const vercelFlightResult = await testFlightSearch(TEST_CONFIG.VERCEL_API_BASE);
            results.tests.push({ name: 'Vercel Flight Search', success: vercelFlightResult.success });
            
            const vercelPaymentResult = await testPaymentFlow(TEST_CONFIG.VERCEL_API_BASE);
            results.tests.push({ name: 'Vercel Payment Flow', success: vercelPaymentResult.success });
        }
    } catch (error) {
        logWarning('Vercel API tests failed');
        results.tests.push({ name: 'Vercel API Tests', success: false, error: error.message });
    }
    
    // Summary
    logStep('SUMMARY', 'Test Results');
    const passedTests = results.tests.filter(test => test.success).length;
    const totalTests = results.tests.length;
    
    console.log('\n📊 Test Results Summary:');
    results.tests.forEach(test => {
        const status = test.success ? logSuccess : logError;
        status(`${test.name}: ${test.success ? 'PASSED' : 'FAILED'}`);
        if (test.error) {
            logError(`  Error: ${test.error}`);
        }
    });
    
    console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        logSuccess('🎉 ALL TESTS PASSED! Production integration is ready.');
    } else if (passedTests > totalTests / 2) {
        logWarning('⚠️ Some tests failed, but core functionality appears to work.');
    } else {
        logError('❌ Multiple critical tests failed. Integration needs attention.');
    }
    
    // Save results to file
    try {
        const fs = await import('fs');
        fs.writeFileSync(
            'production-integration-test-results.json', 
            JSON.stringify(results, null, 2)
        );
        logInfo('📁 Test results saved to production-integration-test-results.json');
    } catch (error) {
        logWarning('Could not save test results to file');
    }
    
    return results;
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runIntegrationTests()
        .then(() => {
            console.log('\n✅ Integration test suite completed.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Integration test suite failed:', error);
            process.exit(1);
        });
}

export { runIntegrationTests, testFlightSearch, testPaymentFlow }; 