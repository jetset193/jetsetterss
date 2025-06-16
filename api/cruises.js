export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Return sample cruise data
    const cruises = [
      {
        id: 1,
        name: "Caribbean Paradise",
        cruise_line: "Royal Caribbean",
        ship: "Symphony of the Seas",
        duration: 7,
        departure_port: "Miami, FL",
        destinations: ["Cozumel", "Jamaica", "Bahamas"],
        departure_date: "2024-07-15",
        return_date: "2024-07-22",
        price_per_person: 899,
        image: "/images/cruises/caribbean-paradise.svg",
        description: "Experience the ultimate Caribbean adventure with stops at pristine beaches and vibrant cultures.",
        amenities: ["Pool deck", "Spa", "Casino", "Multiple restaurants", "Entertainment shows"],
        cabin_types: [
          { type: "Interior", price: 899 },
          { type: "Ocean View", price: 1199 },
          { type: "Balcony", price: 1599 },
          { type: "Suite", price: 2499 }
        ]
      },
      {
        id: 2,
        name: "Mediterranean Explorer",
        cruise_line: "Norwegian Cruise Line",
        ship: "Norwegian Epic",
        duration: 10,
        departure_port: "Barcelona, Spain",
        destinations: ["Rome", "Naples", "Santorini", "Mykonos"],
        departure_date: "2024-08-10",
        return_date: "2024-08-20",
        price_per_person: 1299,
        image: "/images/cruises/mediterranean-explorer.svg",
        description: "Discover ancient history and stunning Mediterranean coastlines on this unforgettable journey.",
        amenities: ["Multiple pools", "Rock climbing wall", "Broadway shows", "Specialty dining"],
        cabin_types: [
          { type: "Interior", price: 1299 },
          { type: "Ocean View", price: 1699 },
          { type: "Balcony", price: 2199 },
          { type: "Suite", price: 3499 }
        ]
      },
      {
        id: 3,
        name: "Alaska Wilderness",
        cruise_line: "Princess Cruises",
        ship: "Majestic Princess",
        duration: 8,
        departure_port: "Seattle, WA",
        destinations: ["Juneau", "Ketchikan", "Skagway", "Glacier Bay"],
        departure_date: "2024-06-20",
        return_date: "2024-06-28",
        price_per_person: 1599,
        image: "/images/cruises/alaska-wilderness.svg",
        description: "Witness breathtaking glaciers and wildlife in America's last frontier.",
        amenities: ["Observation deck", "Naturalist programs", "Fine dining", "Spa services"],
        cabin_types: [
          { type: "Interior", price: 1599 },
          { type: "Ocean View", price: 1999 },
          { type: "Balcony", price: 2599 },
          { type: "Suite", price: 3999 }
        ]
      }
    ];

    res.status(200).json({
      success: true,
      data: cruises,
      total: cruises.length
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 