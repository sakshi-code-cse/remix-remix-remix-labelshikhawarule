import { verifyRazorpaySignature } from '../../src/server/razorpay-service';

export default async function handler(req: any, res: any) {
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
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing Razorpay signature verification parameters',
      });
    }

    const verificationResult = verifyRazorpaySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!verificationResult.isValid) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: verificationResult.reason || 'Invalid Razorpay payment signature',
      });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return res.status(500).json({
      success: false,
      verified: false,
      error: error?.message || 'Server error during payment verification',
    });
  }
}
