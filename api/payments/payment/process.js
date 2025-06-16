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
    const { orderId, cardDetails, billingAddress } = req.body;
    
    // Simple validation
    if (!orderId || !cardDetails || !cardDetails.cardNumber) {
      return res.status(400).json({
        success: false,
        error: 'Order ID and card details are required'
      });
    }

    // Mock payment processing logic
    const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
    
    // Simulate different card responses for testing
    let paymentResult = {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'completed',
      message: 'Payment processed successfully'
    };

    // Test card numbers for different scenarios
    if (cardNumber === '4000000000000002') {
      // Declined card
      paymentResult = {
        success: false,
        error: 'Card declined',
        status: 'declined'
      };
    } else if (cardNumber === '4000000000000119') {
      // Processing error
      paymentResult = {
        success: false,
        error: 'Processing error',
        status: 'error'
      };
    }

    // Simulate processing delay
    setTimeout(() => {
      if (paymentResult.success) {
        res.status(200).json({
          success: true,
          message: paymentResult.message,
          transactionId: paymentResult.transactionId,
          orderId: orderId,
          status: paymentResult.status,
          processedAt: new Date().toISOString(),
          amount: req.body.amount || '0.00',
          currency: req.body.currency || 'USD'
        });
      } else {
        res.status(400).json({
          success: false,
          error: paymentResult.error,
          status: paymentResult.status,
          orderId: orderId
        });
      }
    }, 1000); // 1 second delay to simulate processing

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 