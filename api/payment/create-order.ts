import { createRazorpayOrder, CreateOrderRequest } from '../../src/server/razorpay-service';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const payload: CreateOrderRequest = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    if (!payload || !payload.items) {
      return res.status(400).json({ success: false, error: 'Missing cart items payload' });
    }

    const orderData = await createRazorpayOrder(payload);

    return res.status(200).json({
      success: true,
      ...orderData,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return res.status(400).json({
      success: false,
      error: error?.message || 'Failed to create Razorpay order',
    });
  }
}
