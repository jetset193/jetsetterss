export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required'
      });
    }

    // Simulate order verification
    // In a real implementation, this would query the ARC Pay API or database
    
    const orderData = {
      orderId,
      status: 'COMPLETED',
      amount: 299.99,
      currency: 'USD',
      paymentMethod: 'CREDIT_CARD',
      transactionId: `txn_${Date.now()}_verified`,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      completedAt: new Date().toISOString(),
      customerEmail: 'customer@example.com',
      merchantId: 'TESTARC05511704',
      authCode: `AUTH${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };

    res.status(200).json({
      success: true,
      orderData,
      message: 'Payment verification successful'
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      details: error.message
    });
  }
} 