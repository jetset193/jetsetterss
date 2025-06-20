import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 AMADEUS BOOKING API DEBUG SCRIPT\n');

async function debugAmadeusBooking() {
    try {
        // Step 1: Get a fresh token
        console.log('1️⃣ Getting fresh Amadeus token...');
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', process.env.AMADEUS_API_KEY);
        params.append('client_secret', process.env.AMADEUS_API_SECRET);
        
        const tokenResponse = await axios.post(
            'https://api.amadeus.com/v1/security/oauth2/token',
            params.toString(),
            { 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 10000
            }
        );
        
        const token = tokenResponse.data.access_token;
        console.log('✅ Token obtained:', token.substring(0, 20) + '...');
        console.log('   Expires in:', tokenResponse.data.expires_in, 'seconds\n');

        // Step 2: Test a simple API first (flight search) to verify token works
        console.log('2️⃣ Testing token with flight search API...');
        try {
            const searchResponse = await axios.get('https://api.amadeus.com/v2/shopping/flight-offers', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.amadeus+json'
                },
                params: {
                    originLocationCode: 'DEL',
                    destinationLocationCode: 'JAI',
                    departureDate: '2025-06-29',
                    adults: 1,
                    max: 1
                },
                timeout: 15000
            });
            console.log('✅ Flight search works - Token is valid for search APIs');
            console.log('   Found', searchResponse.data.data?.length || 0, 'flights\n');
            
            // Step 3: Get real flight offer for booking test
            const realFlightOffer = searchResponse.data.data?.[0];
            if (!realFlightOffer) {
                throw new Error('No flight offers found for booking test');
            }
            
            console.log('3️⃣ Testing booking API with real flight offer...');
            console.log('   Flight:', realFlightOffer.itineraries[0].segments[0].carrierCode + realFlightOffer.itineraries[0].segments[0].number);
            console.log('   Price:', realFlightOffer.price.total, realFlightOffer.price.currency);
            
            // Step 4: Price the flight offer first (required for booking)
            console.log('\n4️⃣ Pricing flight offer (required step)...');
            const pricingResponse = await axios.post(
                'https://api.amadeus.com/v1/shopping/flight-offers/pricing',
                {
                    data: {
                        type: 'flight-offers-pricing',
                        flightOffers: [realFlightOffer]
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/vnd.amadeus+json',
                        'Accept': 'application/vnd.amadeus+json'
                    },
                    timeout: 15000
                }
            );
            
            const pricedOffer = pricingResponse.data.data.flightOffers[0];
            console.log('✅ Flight offer priced successfully');
            console.log('   Final price:', pricedOffer.price.total, pricedOffer.price.currency);
            
            // Step 5: Test booking with properly priced offer
            console.log('\n5️⃣ Testing flight order creation...');
            const bookingPayload = {
                data: {
                    type: 'flight-order',
                    flightOffers: [pricedOffer],
                    travelers: [{
                        id: '1',
                        dateOfBirth: '1990-01-01',
                        name: {
                            firstName: 'TEST',
                            lastName: 'USER'
                        },
                        gender: 'MALE',
                        contact: {
                            emailAddress: 'test@example.com',
                            phones: [{
                                deviceType: 'MOBILE',
                                countryCallingCode: '1',
                                number: '5551234567'
                            }]
                        },
                        documents: [{
                            documentType: 'PASSPORT',
                            number: 'T12345678',
                            expiryDate: '2030-01-01',
                            issuanceCountry: 'US',
                            validityCountry: 'US',
                            nationality: 'US',
                            holder: true
                        }]
                    }]
                }
            };
            
            const bookingResponse = await axios.post(
                'https://api.amadeus.com/v1/booking/flight-orders',
                bookingPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/vnd.amadeus+json',
                        'Accept': 'application/vnd.amadeus+json'
                    },
                    timeout: 30000
                }
            );
            
            console.log('🎉 SUCCESS! Real PNR created:');
            console.log('   Order ID:', bookingResponse.data.data.id);
            console.log('   PNR:', bookingResponse.data.data.associatedRecords?.[0]?.reference);
            console.log('   Status:', bookingResponse.data.data.status);
            
        } catch (apiError) {
            const status = apiError.response?.status;
            const errorCode = apiError.response?.data?.errors?.[0]?.code;
            const errorDetail = apiError.response?.data?.errors?.[0]?.detail;
            const errorTitle = apiError.response?.data?.errors?.[0]?.title;
            
            console.log('❌ API Test Failed:');
            console.log('   HTTP Status:', status);
            console.log('   Error Code:', errorCode);
            console.log('   Error Title:', errorTitle);
            console.log('   Error Detail:', errorDetail);
            
            // Provide specific solutions based on error codes
            console.log('\n🔧 SOLUTION ANALYSIS:');
            
            if (errorCode === '38187') {
                console.log('❌ PERMISSION DENIED - Flight Create Orders not enabled');
                console.log('📝 To fix this:');
                console.log('   1. Go to https://developers.amadeus.com/my-apps');
                console.log('   2. Select your app and click "API Requests"');
                console.log('   3. Find "Flight Create Orders" and click "Request"');
                console.log('   4. Complete the production access form');
                console.log('   5. Sign consolidator agreement');
                console.log('   6. Wait 24-72 hours for approval');
                
            } else if (errorCode === '38190') {
                console.log('❌ TOKEN ISSUE - Invalid or expired token');
                console.log('📝 Possible causes:');
                console.log('   1. API credentials are for test environment only');
                console.log('   2. Token format issue in authorization header');
                console.log('   3. Network/timing issue during token validation');
                console.log('📝 To fix this:');
                console.log('   1. Verify your API keys are PRODUCTION keys');
                console.log('   2. Check token is properly formatted');
                console.log('   3. Ensure consistent base URL usage');
                
            } else if (errorCode === '477' || errorCode === '1797') {
                console.log('✅ ACCESS GRANTED - Data format issue');
                console.log('📝 This means you CAN create bookings, just need to:');
                console.log('   1. Use properly formatted flight offers');
                console.log('   2. Price offers before booking');
                console.log('   3. Include all required traveler fields');
                
            } else if (errorCode === '4926') {
                console.log('✅ ACCESS GRANTED - Flight availability issue');
                console.log('📝 This means you CAN create bookings, but:');
                console.log('   1. Flight may no longer be available');
                console.log('   2. Price may have changed');
                console.log('   3. Need to search again for fresh offers');
                
            } else {
                console.log('⚠️ UNKNOWN ERROR - Check Amadeus documentation');
                console.log('   Error code reference: https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides/common-errors');
            }
        }
        
    } catch (tokenError) {
        console.log('❌ Token Error:', tokenError.response?.data || tokenError.message);
        console.log('🔧 Check your API credentials in .env file');
    }
}

debugAmadeusBooking().catch(console.error); 