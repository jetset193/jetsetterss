import axios from 'axios';

const API_BASE = 'http://localhost:5005/api';

async function testREALPNRCreation() {
    try {
        console.log('🧪 Testing REAL PNR Creation with Amadeus API (NO SIMULATION)...\n');

        // Step 1: Search for real flights
        console.log('1️⃣ Searching for REAL flights DEL → JAI...');
        const searchResponse = await axios.post(`${API_BASE}/flights/search`, {
            from: 'DEL',
            to: 'JAI', 
            departDate: '2025-06-29',
            travelers: 1,
            max: 1
        });

        if (!searchResponse.data.success || !searchResponse.data.data.length) {
            throw new Error('No real flights found in search');
        }

        const flight = searchResponse.data.data[0];
        console.log(`✅ Found REAL flight: ${flight.airline} ${flight.flightNumber} - $${flight.price.total}`);
        console.log(`   Departure: ${flight.departure.time} from ${flight.departure.airport}`);
        console.log(`   Arrival: ${flight.arrival.time} at ${flight.arrival.airport}\n`);

        // Step 2: Get the original offer for booking
        const originalOffer = flight.originalOffer;
        if (!originalOffer) {
            throw new Error('No original offer found for real booking');
        }

        console.log('2️⃣ Creating REAL flight order with Amadeus API (NO SIMULATION)...');
        
        // Step 3: Create REAL flight order
        const orderPayload = {
            flightOffers: [originalOffer],
            travelers: [{
                id: "1",
                dateOfBirth: "1990-01-01",
                name: {
                    firstName: "John",
                    lastName: "Doe"
                },
                gender: "MALE",
                contact: {
                    emailAddress: "john.doe@example.com",
                    phones: [{
                        deviceType: "MOBILE",
                        countryCallingCode: "91",
                        number: "9876543210"
                    }]
                }
            }],
            contactEmail: "john.doe@example.com",
            contactPhone: "9876543210"
        };

        console.log('📋 Attempting REAL booking with Amadeus...');
        const orderResponse = await axios.post(`${API_BASE}/flights/order`, orderPayload);

        if (orderResponse.data.success && orderResponse.data.mode === 'LIVE_AMADEUS_BOOKING') {
            console.log('\n🎉 SUCCESS! REAL PNR created with Amadeus API:');
            console.log(`   Order ID: ${orderResponse.data.data.id}`);
            console.log(`   REAL PNR: ${orderResponse.data.pnr}`);
            console.log(`   Status: ${orderResponse.data.data.status}`);
            console.log(`   Mode: ${orderResponse.data.mode}`);
            console.log(`   Message: ${orderResponse.data.message}\n`);

            // Step 4: Test REAL order details retrieval
            console.log('3️⃣ Testing REAL order details retrieval...');
            const orderDetailsResponse = await axios.get(`${API_BASE}/flights/order/${orderResponse.data.data.id}`);
            
            if (orderDetailsResponse.data.success) {
                console.log('✅ REAL order details retrieved successfully:');
                console.log(`   REAL PNR: ${orderDetailsResponse.data.pnr}`);
                console.log(`   Status: ${orderDetailsResponse.data.data.status}`);
                console.log(`   Mode: ${orderDetailsResponse.data.mode}`);
            } else {
                console.log('❌ Failed to retrieve REAL order details:', orderDetailsResponse.data.error);
            }

            return {
                success: true,
                mode: 'REAL_AMADEUS_BOOKING',
                orderId: orderResponse.data.data.id,
                pnr: orderResponse.data.pnr
            };

        } else {
            throw new Error('Booking response indicates simulation or failure');
        }

    } catch (error) {
        console.error('❌ REAL booking test failed:', error.response?.data || error.message);
        
        if (error.response?.data) {
            const errorData = error.response.data;
            console.log('\n🔧 ERROR ANALYSIS:');
            console.log(`   Error: ${errorData.error}`);
            console.log(`   Solution: ${errorData.solution}`);
            console.log(`   Amadeus Error: ${errorData.amadeusError}`);
            console.log(`   Details: ${errorData.details}`);
            
            if (errorData.amadeusError === '38190' || errorData.amadeusError === '38187') {
                console.log('\n🚨 BOOKING API ACCESS DENIED:');
                console.log('   You need Flight Create Orders production access from Amadeus');
                console.log('   Steps to fix:');
                console.log('   1. Go to https://developers.amadeus.com/my-apps');
                console.log('   2. Request Flight Create Orders production access');
                console.log('   3. Complete consolidator agreement');
                console.log('   4. Wait for approval (1-3 weeks)');
                console.log('   5. Contact: amadeus4developers@amadeus.com');
            }
        }
        
        return { 
            success: false, 
            mode: 'REAL_BOOKING_FAILED',
            error: error.response?.data?.error || error.message 
        };
    }
}

// Run the REAL test
testREALPNRCreation().then(result => {
    console.log('\n📊 REAL PNR Test Result:', result);
    if (result.success) {
        console.log('🎉 REAL PNR GENERATION IS WORKING!');
    } else {
        console.log('❌ REAL PNR GENERATION FAILED - NO SIMULATION AVAILABLE');
    }
    process.exit(result.success ? 0 : 1);
}); 