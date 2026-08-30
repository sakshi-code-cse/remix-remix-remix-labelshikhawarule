import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyRazorpayWebhookSignature,
  getRazorpayClient,
} from './src/server/razorpay-service';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON middleware
  app.use(express.json());

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Route: Get Public Razorpay Configuration
  app.get('/api/payment/config', (req, res) => {
    const { keyId, isConfigured } = getRazorpayClient();
    res.json({
      keyId,
      isConfigured,
      currency: 'INR',
    });
  });

  // API Route: Create Razorpay Order
  app.post('/api/payment/create-order', async (req, res) => {
    try {
      const payload = req.body;
      if (!payload || !payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
        return res.status(400).json({ success: false, error: 'Your cart is empty or invalid.' });
      }

      const orderData = await createRazorpayOrder(payload);
      return res.status(200).json({
        success: true,
        ...orderData,
      });
    } catch (error: any) {
      console.error('API /api/payment/create-order error:', error);
      return res.status(400).json({
        success: false,
        error: error?.message || 'Failed to create Razorpay order',
      });
    }
  });

  // API Route: Verify Razorpay Signature
  app.post('/api/payment/verify', (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          verified: false,
          error: 'Missing required Razorpay payment verification fields.',
        });
      }

      const verification = verifyRazorpaySignature({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      if (!verification.isValid) {
        return res.status(400).json({
          success: false,
          verified: false,
          error: verification.reason || 'Cryptographic signature mismatch.',
        });
      }

      return res.status(200).json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('API /api/payment/verify error:', error);
      return res.status(500).json({
        success: false,
        verified: false,
        error: error?.message || 'Server error during payment verification',
      });
    }
  });

  // API Route: Razorpay Webhook Handler
  app.post('/api/payment/webhook', (req, res) => {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const rawBody = JSON.stringify(req.body);

      const isValid = verifyRazorpayWebhookSignature(rawBody, signature);
      if (!isValid) {
        return res.status(400).json({ status: 'error', message: 'Invalid webhook signature' });
      }

      const event = req.body;
      console.log(`[Razorpay Webhook] Event: ${event?.event}`);

      return res.status(200).json({ status: 'ok', event: event?.event });
    } catch (error: any) {
      console.error('API /api/payment/webhook error:', error);
      return res.status(500).json({ status: 'error', message: error?.message || 'Webhook failed' });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Label Shikha Warule Server running on port ${PORT}`);
  });
}

startServer();
