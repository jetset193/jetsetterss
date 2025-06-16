#!/usr/bin/env node

/**
 * Vercel Deployment Test Script
 * Tests API endpoints to ensure deployment is working correctly
 */

import fetch from 'node-fetch';

const VERCEL_API_BASE = 'https://prod-six-phi.vercel.app/api';
const JETSETTERSS_DOMAIN = 'https://www.jetsetterss.com/api';

console.log('🚀 Testing Vercel Deployment API Endpoints...\n');

// Test endpoints
const endpoints = [
  {
    name: 'Vercel Gateway Status',
    url: `${VERCEL_API_BASE}/payments/gateway/status`,
    method: 'GET'
  },
  {
    name: 'Vercel Flight Search',
    url: `${VERCEL_API_BASE}/flights/search`,
    method: 'POST',
    body: {
      from: 'DEL',
      to: 'LHR',
      departDate: '2025-06-20',
      travelers: 1
    }
  },
  {
    name: 'Vercel Payment Test',
    url: `${VERCEL_API_BASE}/payments/test`,
    method: 'POST',
    body: {}
  },
  {
    name: 'JetSetterss Flight Search (Should Fail)',
    url: `${JETSETTERSS_DOMAIN}/flights/search`,
    method: 'POST',
    body: {
      from: 'DEL',
      to: 'LHR',
      departDate: '2025-06-20',
      travelers: 1
    }
  }
];

async function testEndpoint(endpoint) {
  const { name, url, method, body } = endpoint;
  
  console.log(`🧪 Testing: ${name}`);
  console.log(`📡 URL: ${url}`);
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    };
    
    if (body && method === 'POST') {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    
    console.log(`📥 Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log(`✅ SUCCESS: ${name}`);
      
      // Show relevant data for each endpoint type
      if (url.includes('/payments/gateway/status')) {
        console.log(`   Gateway: ${data.gatewayVersion || 'Unknown'} (${data.status || 'Unknown'})`);
      } else if (url.includes('/flights/search')) {
        console.log(`   Flights Found: ${data.data?.length || 0}`);
      } else if (url.includes('/payments/test')) {
        console.log(`   Tests Passed: ${data.testResults?.successful || 0}/${data.testResults?.total || 0}`);
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ FAILED: ${name}`);
      console.log(`   Error: ${errorText.substring(0, 200)}${errorText.length > 200 ? '...' : ''}`);
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${name}`);
    console.log(`   ${error.message}`);
  }
  
  console.log(''); // Empty line for readability
}

async function runTests() {
  console.log('Starting deployment verification tests...\n');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('🏁 Test Summary:');
  console.log('✅ = Working correctly');
  console.log('❌ = Needs attention');
  console.log('\n💡 If Vercel endpoints are working but JetSetterss fails,');
  console.log('   then the API configuration fix is working correctly!');
}

// Run the tests
runTests().catch(console.error); 