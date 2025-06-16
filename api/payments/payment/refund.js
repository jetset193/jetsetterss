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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      orderId,
      transactionId,
      amount,
      reason = 'Customer request'
    } = req.body;

    // Validate required fields
    if (!orderId || !transactionId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: orderId, transactionId, amount'
      });
    }

    // Validate amount
    const refundAmount = parseFloat(amount);
    if (isNaN(refundAmount) || refundAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid refund amount'
      });
    }

    // Generate refund reference
    const refundReference = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate refund processing
    // In a real implementation, this would integrate with ARC Pay API
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const refundData = {
      refundReference,
      orderId,
      transactionId,
      amount: refundAmount,
      currency: 'USD',
      reason,
      status: 'COMPLETED',
      processedAt: new Date().toISOString(),
      estimatedSettlement: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
      merchantId: 'TESTARC05511704'
    };

    res.status(200).json({
      success: true,
      refundData,
      refundReference,
      message: 'Refund processed successfully'
    });

  } catch (error) {
    console.error('Refund processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Refund processing failed',
      details: error.message
    });
  }
} 