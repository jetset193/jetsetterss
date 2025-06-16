import express from 'express';
import Amadeus from 'amadeus';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Amadeus client with fallback options for different environment variable formats
const getAmadeusCredentials = () => {
  // Try backend variables first (recommended for server-side code)
  const apiKey = process.env.AMADEUS_API_KEY || process.env.REACT_APP_AMADEUS_API_KEY;
  const apiSecret = process.env.AMADEUS_API_SECRET || process.env.REACT_APP_AMADEUS_API_SECRET;
  
  // Log which variables we're using
  const keySource = process.env.AMADEUS_API_KEY ? 'AMADEUS_API_KEY' : 
                  (process.env.REACT_APP_AMADEUS_API_KEY ? 'REACT_APP_AMADEUS_API_KEY' : 'None');
  const secretSource = process.env.AMADEUS_API_SECRET ? 'AMADEUS_API_SECRET' : 
                     (process.env.REACT_APP_AMADEUS_API_SECRET ? 'REACT_APP_AMADEUS_API_SECRET' : 'None');
  
  console.log(`Using Amadeus credentials from: key=${keySource}, secret=${secretSource}`);
  
  return { apiKey, apiSecret };
};

const { apiKey, apiSecret } = getAmadeusCredentials();

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: apiKey,
  clientSecret: apiSecret
});

console.log('Amadeus client initialized with:', {
  clientId: apiKey,
  clientSecret: apiSecret?.substring(0, 4) + '...' // Log only first 4 chars of secret
});

// Flight search endpoint
router.post('/search', async (req, res) => {
  try {
    // Check if Amadeus credentials are available
    const { apiKey, apiSecret } = getAmadeusCredentials();
    console.log('Checking Amadeus credentials:', {
      key: apiKey ? 'Available' : 'Missing',
      secret: apiSecret ? 'Available' : 'Missing'
    });
    
    if (!apiKey || !apiSecret) {
      console.error('Missing Amadeus API credentials');
      
      // Return mock data when credentials are missing
      return res.json({
        success: true,
        data: [{
          id: "1",
          price: { total: "126.99", amount: 126.99, currency: "EUR" },
          itineraries: [{
            duration: "PT3H",
            segments: [{
              departure: { at: "2025-05-29T06:00:00", iataCode: "DEL", terminal: "3" },
              arrival: { at: "2025-05-29T08:00:00", iataCode: "DXB", terminal: "2" },
              carrierCode: "EK",
              number: "517",
              aircraft: { code: "77W" },
              operating: { carrierCode: "EK" }
            }]
          }],
          travelerPricings: [{
            travelerId: "1",
            fareDetailsBySegment: [{
              cabin: "ECONOMY",
              class: "K"
            }]
          }]
        }]
      });
    }
    
    const { from, to, departDate, returnDate, tripType, travelers } = req.body;

    // Log request payload for debugging
    console.log('Flight search request body:', req.body);

    // Validate required fields
    if (!from || !to || !departDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: from, to, and departDate are required'
      });
    }

    console.log('Searching flights with params:', { from, to, departDate, returnDate, tripType, travelers });

    // Prepare Amadeus API parameters
    const amadeusParams = {
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate: departDate,
      adults: parseInt(travelers) || 1,
      max: 10
    };

    // Only add returnDate if it's provided and not empty
    if (returnDate && returnDate.trim() !== '') {
      amadeusParams.returnDate = returnDate;
    }

    console.log('Calling Amadeus API with params:', amadeusParams);

    try {
      // Call Amadeus API
      const response = await amadeus.shopping.flightOffersSearch.get(amadeusParams);
      console.log('Amadeus API response:', response);

      if (!response.data || response.data.length === 0) {
        return res.json({
          success: true,
          data: []
        });
      }

      // Transform Amadeus response to our format
      const flights = response.data.map(offer => {
        try {
          return {
            id: offer.id,
            price: {
              total: offer.price?.total || '0',
              amount: parseFloat(offer.price?.total || '0'),
              currency: offer.price?.currency || 'USD',
              base: offer.price?.base || '0',
              fees: offer.price?.fees || []
            },
            itineraries: offer.itineraries.map(itinerary => ({
              duration: itinerary.duration,
              segments: itinerary.segments.map(segment => ({
                departure: {
                  at: segment.departure.at,
                  iataCode: segment.departure.iataCode,
                  terminal: segment.departure.terminal || 'T1',
                  city: segment.departure.iataCode
                },
                arrival: {
                  at: segment.arrival.at,
                  iataCode: segment.arrival.iataCode,
                  terminal: segment.arrival.terminal || 'T1',
                  city: segment.arrival.iataCode
                },
                duration: segment.duration,
                carrierCode: segment.carrierCode,
                number: segment.number,
                aircraft: segment.aircraft?.code || 'Unknown',
                operating: segment.operating,
                cabin: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY',
                class: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class || 'ECONOMY',
                baggage: {
                  checked: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags || { weight: 0, weightUnit: 'KG' },
                  cabin: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCabinBags || { weight: 0, weightUnit: 'KG' }
                }
              }))
            })),
            travelerPricings: offer.travelerPricings?.map(pricing => ({
              travelerId: pricing.travelerId,
              fareDetailsBySegment: pricing.fareDetailsBySegment?.map(segment => ({
                segmentId: segment.segmentId,
                cabin: segment.cabin || 'ECONOMY',
                class: segment.class || 'ECONOMY',
                includedCheckedBags: segment.includedCheckedBags || { weight: 0, weightUnit: 'KG' },
                includedCabinBags: segment.includedCabinBags || { weight: 0, weightUnit: 'KG' },
                amenities: segment.amenities || []
              })) || []
            })) || []
          };
        } catch (transformError) {
          console.error('Error transforming flight offer:', transformError);
          return null;
        }
      }).filter(Boolean); // Remove any null entries from failed transformations

      res.json({
        success: true,
        data: flights
      });
    } catch (amadeusError) {
      console.error('Amadeus API error:', amadeusError);
      console.error('Error details:', {
        message: amadeusError.message,
        code: amadeusError.code,
        response: amadeusError.response?.data
      });
      
      return res.status(500).json({
        success: false,
        error: amadeusError.message || 'Error calling Amadeus API',
        details: amadeusError.response?.data || {}
      });
    }
  } catch (error) {
    console.error('Error in flight search:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Flight booking endpoint
router.post('/booking/flight-orders', async (req, res) => {
  try {
    const { travelerDetails, contactInfo, flightOffer } = req.body;

    // Validate required fields
    if (!contactInfo || !flightOffer) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: contactInfo and flightOffer are required'
      });
    }

    console.log('Creating flight order with:', { travelerDetails, contactInfo, flightOffer });

    // Check if travelerDetails is empty and provide defaults
    let travelers = travelerDetails;
    if (!travelerDetails || travelerDetails.length === 0) {
      console.log('No traveler details provided, using defaults');
      travelers = [{
        id: "1",
        firstName: "Test",
        lastName: "User",
        dateOfBirth: "1990-01-01",
        gender: "MALE"
      }];
    }

    // For testing purposes, simulate successful booking since full Amadeus booking 
    // requires production credentials and specific valid flight offer IDs
    console.log('✅ Flight booking created successfully (simulated)');
    
    const bookingReference = `BOOK-${Date.now()}`;
    const pnr = `PNR${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Return simulated booking confirmation
    res.json({
      success: true,
      data: {
        pnr: pnr,
        bookingReference: bookingReference,
        status: 'CONFIRMED',
        travelers: travelers.map(traveler => ({
          id: traveler.id,
          name: {
            firstName: traveler.firstName,
            lastName: traveler.lastName
          },
          dateOfBirth: traveler.dateOfBirth,
          gender: traveler.gender
        })),
        flightOffers: [flightOffer],
        createdAt: new Date().toISOString(),
        ticketingAgreement: {
          option: 'CONFIRM',
          delay: 'P1D'
        },
        contacts: [{
          addresseeName: {
            firstName: travelers[0].firstName,
            lastName: travelers[0].lastName
          },
          companyName: 'JetSet Go',
          purpose: 'STANDARD',
          phones: [{
            deviceType: 'MOBILE',
            countryCallingCode: contactInfo.countryCode,
            number: contactInfo.phoneNumber
          }],
          emailAddress: contactInfo.email
        }]
      }
    });
  } catch (error) {
    console.error('Error in flight booking:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

export default router;
