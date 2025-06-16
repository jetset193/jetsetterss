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
    // Simulate gateway status check
    // In a real implementation, this would check the actual ARC Pay gateway
    const gatewayStatus = {
      status: 'OPERATING',
      lastChecked: new Date().toISOString(),
      version: '1.0.0',
      services: {
        payment: 'OPERATING',
        refund: 'OPERATING',
        verification: 'OPERATING'
      },
      uptime: '99.9%'
    };

    res.status(200).json({
      success: true,
      gatewayStatus,
      message: 'Gateway status retrieved successfully'
    });

  } catch (error) {
    console.error('Gateway status check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check gateway status',
      details: error.message
    });
  }
} 