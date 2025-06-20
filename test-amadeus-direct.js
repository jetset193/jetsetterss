import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;
const AMADEUS_BASE_URL = 'https://api.amadeus.com';

async function getAmadeusToken() {
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', AMADEUS_API_KEY);
        params.append('client_secret', AMADEUS_API_SECRET);
        
        const response = await axios.post(
            `${AMADEUS_BASE_URL}/v1/security/oauth2/token`, 
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error('❌ Error getting token:', error.response?.data || error.message);
        throw error;
    }
}

async function testAmadeusFlightSearch() {
    try {
        console.log('🔑 Getting Amadeus token...');
        const token = await getAmadeusToken();
        console.log('✅ Token obtained successfully');

        console.log('🔍 Searching for flights...');
        const searchResponse = await axios.get(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.amadeus+json'
            },
            params: {
                originLocationCode: 'DEL',
                destinationLocationCode: 'JAI',
                departureDate: '2025-06-29',
                adults: 1,
                max: 1,
                currencyCode: 'USD'
            }
        });

        const offers = searchResponse.data.data;
        console.log(`✅ Found ${offers.length} offers`);
        
        if (offers.length > 0) {
            const offer = offers[0];
            console.log('\n📋 First flight offer details:');
            console.log('   ID:', offer.id);
            console.log('   Type:', offer.type);
            console.log('   Price:', offer.price.total, offer.price.currency);
            console.log('   Segments:', offer.itineraries[0].segments.length);
            
            // Step 2: Test flight pricing
            console.log('\n💰 Testing flight pricing...');
            const pricingResponse = await axios.post(
                `${AMADEUS_BASE_URL}/v1/shopping/flight-offers/pricing`,
                {
                    data: {
                        type: 'flight-offers-pricing',
                        flightOffers: [offer]
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/vnd.amadeus+json',
                        'Accept': 'application/vnd.amadeus+json'
                    }
                }
            );
            
            const pricedOffer = pricingResponse.data.data.flightOffers[0];
            console.log('✅ Flight pricing successful');
            console.log('   Final Price:', pricedOffer.price.total, pricedOffer.price.currency);
            
            // Step 3: Test flight order creation
            console.log('\n🎫 Testing flight order creation...');
            
            const orderData = {
                data: {
                    type: 'flight-order',
                    flightOffers: [pricedOffer], // Use priced offer
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
                    contacts: {
                        emailAddress: "john.doe@example.com",
                        phones: [{
                            deviceType: "MOBILE",
                            countryCallingCode: "91",
                            number: "9876543210"
                        }]
                    }
                }
            };
            
            console.log('📋 Creating flight order...');
            const orderResponse = await axios.post(
                `${AMADEUS_BASE_URL}/v1/booking/flight-orders`,
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/vnd.amadeus+json',
                        'Accept': 'application/vnd.amadeus+json'
                    }
                }
            );
            
            const order = orderResponse.data.data;
            console.log('\n🎉 SUCCESS! Flight order created:');
            console.log('   Order ID:', order.id);
            console.log('   Status:', order.status);
            console.log('   PNR:', order.associatedRecords?.[0]?.reference);
            console.log('   Booking Reference:', order.id);
            console.log('   Total Price:', order.flightOffers[0].price.total, order.flightOffers[0].price.currency);
            
            return {
                success: true,
                orderId: order.id,
                pnr: order.associatedRecords?.[0]?.reference,
                status: order.status
            };
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response?.data?.errors) {
            console.error('Detailed errors:', JSON.stringify(error.response.data.errors, null, 2));
        }
        return { success: false, error: error.message };
    }
}

// Run the test
testAmadeusFlightSearch().then(result => {
    console.log('\n📊 Final Result:', result);
    process.exit(result.success ? 0 : 1);
}); 