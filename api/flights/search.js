export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method for flight search
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    console.log('🔍 Flight search request received');
    console.log('Request body:', req.body);
    
    const { from, to, departDate, returnDate, tripType, travelers, max = 10 } = req.body;

    // Validate required fields
    if (!from || !to || !departDate) {
      console.log('❌ Missing required fields:', { from, to, departDate });
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: from, to, and departDate are required'
      });
    }

    // Validate IATA codes (3-letter airport codes)
    if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid airport codes. Airport codes must be 3-letter IATA codes (e.g., DEL, JAI)',
        details: {
          from: !/^[A-Z]{3}$/.test(from) ? 'Invalid origin airport code' : null,
          to: !/^[A-Z]{3}$/.test(to) ? 'Invalid destination airport code' : null
        }
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(departDate)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD format'
      });
    }

    // Check if departure date is in the future
    const today = new Date();
    const depDate = new Date(departDate);
    if (depDate < today.setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        success: false,
        error: 'Departure date must be today or in the future'
      });
    }

    console.log('✅ Validation passed. Searching flights...');

    // For now, return mock flight data since we don't have Amadeus API configured
    // This matches the format expected by the frontend
    const mockFlights = [
      {
        id: "flight_1",
        airline: "IndiGo",
        airlineCode: "6E",
        flightNumber: "6E-2135",
        price: {
          total: "4,250",
          amount: 4250,
          currency: "INR"
        },
        duration: "1h 25m",
        departure: {
          time: "06:00",
          airport: from,
          terminal: "T3",
          date: departDate
        },
        arrival: {
          time: "07:25",
          airport: to,
          terminal: "T1",
          date: departDate
        },
        stops: 0,
        stopDetails: [],
        aircraft: "A320",
        cabin: "Economy",
        baggage: "15kg",
        refundable: false,
        seats: 89
      },
      {
        id: "flight_2",
        airline: "SpiceJet",
        airlineCode: "SG",
        flightNumber: "SG-8709",
        price: {
          total: "3,890",
          amount: 3890,
          currency: "INR"
        },
        duration: "1h 30m",
        departure: {
          time: "08:30",
          airport: from,
          terminal: "T3",
          date: departDate
        },
        arrival: {
          time: "10:00",
          airport: to,
          terminal: "T1",
          date: departDate
        },
        stops: 0,
        stopDetails: [],
        aircraft: "B737",
        cabin: "Economy",
        baggage: "15kg",
        refundable: true,
        seats: 67
      },
      {
        id: "flight_3",
        airline: "Air India",
        airlineCode: "AI",
        flightNumber: "AI-9613",
        price: {
          total: "5,120",
          amount: 5120,
          currency: "INR"
        },
        duration: "1h 20m",
        departure: {
          time: "11:15",
          airport: from,
          terminal: "T3",
          date: departDate
        },
        arrival: {
          time: "12:35",
          airport: to,
          terminal: "T1",
          date: departDate
        },
        stops: 0,
        stopDetails: [],
        aircraft: "A321",
        cabin: "Economy",
        baggage: "25kg",
        refundable: true,
        seats: 42
      },
      {
        id: "flight_4",
        airline: "GoAir",
        airlineCode: "G8",
        flightNumber: "G8-2766",
        price: {
          total: "4,650",
          amount: 4650,
          currency: "INR"
        },
        duration: "1h 35m",
        departure: {
          time: "14:45",
          airport: from,
          terminal: "T3",
          date: departDate
        },
        arrival: {
          time: "16:20",
          airport: to,
          terminal: "T1",
          date: departDate
        },
        stops: 0,
        stopDetails: [],
        aircraft: "A320",
        cabin: "Economy",
        baggage: "15kg",
        refundable: false,
        seats: 123
      },
      {
        id: "flight_5",
        airline: "Vistara",
        airlineCode: "UK",
        flightNumber: "UK-961",
        price: {
          total: "6,890",
          amount: 6890,
          currency: "INR"
        },
        duration: "1h 15m",
        departure: {
          time: "18:00",
          airport: from,
          terminal: "T3",
          date: departDate
        },
        arrival: {
          time: "19:15",
          airport: to,
          terminal: "T1",
          date: departDate
        },
        stops: 0,
        stopDetails: [],
        aircraft: "A320",
        cabin: "Economy",
        baggage: "25kg",
        refundable: true,
        seats: 78
      }
    ];

    // Sort flights by price (cheapest first)
    const sortedFlights = mockFlights.sort((a, b) => a.price.amount - b.price.amount);

    // Limit results based on max parameter
    const limitedFlights = sortedFlights.slice(0, parseInt(max) || 10);

    console.log(`✅ Returning ${limitedFlights.length} flights`);

    return res.status(200).json({
      success: true,
      data: limitedFlights,
      meta: {
        searchParams: {
          from,
          to,
          departDate,
          returnDate: returnDate || null,
          travelers: parseInt(travelers) || 1,
          tripType: tripType || 'oneWay'
        },
        resultCount: limitedFlights.length,
        totalResults: mockFlights.length
      }
    });

  } catch (error) {
    console.error('❌ Flight search error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while searching flights',
      details: error.message
    });
  }
} 