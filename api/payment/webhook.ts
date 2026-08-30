import { verifyRazorpayWebhookSignature } from '../../src/server/razorpay-service';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const isValid = verifyRazorpayWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('Razorpay webhook signature verification failed.');
      return res.status(400).json({ status: 'error', message: 'Invalid webhook signature' });
    }

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log(`Received Razorpay webhook event: ${event?.event}`, event?.payload?.payment?.entity?.id);

    switch (event?.event) {
      case 'payment.captured':
      case 'order.paid': {
        const paymentEntity = event?.payload?.payment?.entity;
        console.log(`Razorpay Payment Captured: ${paymentEntity?.id}, Amount: ₹${(paymentEntity?.amount || 0) / 100}`);
        break;
      }
      case 'payment.failed': {
        const failedEntity = event?.payload?.payment?.entity;
        console.warn(`Razorpay Payment Failed: ${failedEntity?.id}, Reason: ${failedEntity?.error_description}`);
        break;
      }
      default:
        console.log(`Unhandled Razorpay event: ${event?.event}`);
    }

    return res.status(200).json({ status: 'ok', event: event?.event });
  } catch (error: any) {
    console.error('Error processing Razorpay webhook:', error);
    return res.status(500).json({ status: 'error', message: error?.message || 'Webhook error' });
  }
}
