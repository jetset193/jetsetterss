export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { amount, currency, booking_type, booking_details } = req.body;
    
    // Simple validation
    if (!amount || !currency || !booking_type) {
      return res.status(400).json({
        success: false,
        error: 'Amount, currency, and booking_type are required'
      });
    }

    // Generate a mock order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock payment order creation response
    res.status(200).json({
      success: true,
      message: 'Payment order created successfully',
      order: {
        id: orderId,
        amount: amount,
        currency: currency,
        status: 'pending',
        booking_type: booking_type,
        booking_details: booking_details,
        created_at: new Date().toISOString(),
        payment_url: `https://prod-shubhams-projects-4a867368.vercel.app/payment/${orderId}`,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 