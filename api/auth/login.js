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
    const { email, password } = req.body;
    
    // Simple validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // For now, return a success response (you can integrate with Supabase later)
    res.status(200).json({
      success: true,
      message: 'Login endpoint working',
      user: {
        email: email,
        id: 'test-user-id'
      },
      token: 'test-jwt-token'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 