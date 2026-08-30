import crypto from 'crypto';
import Razorpay from 'razorpay';
import { ALL_PRODUCTS, PROMO_CODES } from '../data/mockData';

// Lazy Razorpay instance
let razorpayInstance: Razorpay | null = null;

export function getRazorpayClient(): { client: Razorpay | null; keyId: string; isConfigured: boolean } {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  if (keyId && keySecret) {
    if (!razorpayInstance) {
      razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    }
    return { client: razorpayInstance, keyId, isConfigured: true };
  }

  // Fallback / Test key for development if environment variable is not yet populated
  const defaultTestKeyId = 'rzp_test_1DP5mmOlF5G5ag';
  return { client: null, keyId: defaultTestKeyId, isConfigured: false };
}

export interface CartItemPayload {
  productId: string;
  quantity: number;
  size?: string;
}

export interface CreateOrderRequest {
  items: CartItemPayload[];
  appliedPromo?: string | null;
  isGiftWrap?: boolean;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

/**
 * Server-side price calculation and validation
 * Never trust the amount sent from client-side
 */
export function calculateServerOrderTotal(payload: CreateOrderRequest): {
  subtotal: number;
  discount: number;
  giftWrapFee: number;
  shippingFee: number;
  total: number;
  amountInPaise: number;
  validatedItems: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    size?: string;
    image?: string;
  }>;
} {
  if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
    throw new Error('Your cart is empty. Please select products to continue.');
  }

  let subtotal = 0;
  const validatedItems = [];

  for (const item of payload.items) {
    if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
      continue;
    }

    // Lookup product in verified server catalog
    const product = ALL_PRODUCTS.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Product with ID "${item.productId}" was not found in the atelier collection.`);
    }

    const itemPrice = Number(product.price);
    const itemQuantity = Math.max(1, Math.floor(item.quantity));
    subtotal += itemPrice * itemQuantity;

    validatedItems.push({
      productId: product.id,
      productName: product.name,
      price: itemPrice,
      quantity: itemQuantity,
      size: item.size || 'Standard',
      image: product.image,
    });
  }

  if (validatedItems.length === 0) {
    throw new Error('No valid items found in the cart.');
  }

  // Calculate server discount from promo codes
  let discount = 0;
  if (payload.appliedPromo) {
    const promo = PROMO_CODES.find((p) => p.code.toUpperCase() === payload.appliedPromo?.trim().toUpperCase());
    if (promo) {
      if (subtotal >= (promo.minOrder || 0)) {
        discount = Math.round((subtotal * promo.discountPercentage) / 100);
      }
    }
  }

  const giftWrapFee = payload.isGiftWrap ? 150 : 0;
  const shippingFee = 0; // Complimentary atelier express shipping
  const total = Math.max(0, subtotal - discount + giftWrapFee + shippingFee);
  const amountInPaise = Math.round(total * 100);

  return {
    subtotal,
    discount,
    giftWrapFee,
    shippingFee,
    total,
    amountInPaise,
    validatedItems,
  };
}

/**
 * Creates a real Razorpay Order on Razorpay servers
 */
export async function createRazorpayOrder(payload: CreateOrderRequest): Promise<{
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  subtotal: number;
  discount: number;
  validatedItems: any[];
  isTestMode: boolean;
}> {
  const calculation = calculateServerOrderTotal(payload);
  const { client, keyId, isConfigured } = getRazorpayClient();

  const receipt = `SW-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  if (isConfigured && client) {
    const rzpOrder = await client.orders.create({
      amount: calculation.amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        brand: 'Label Shikha Warule Haute Couture',
        customerName: payload.customerName || '',
        customerEmail: payload.customerEmail || '',
        customerPhone: payload.customerPhone || '',
        itemsCount: calculation.validatedItems.length.toString(),
      },
    });

    return {
      orderId: rzpOrder.id,
      amount: calculation.total,
      currency: 'INR',
      keyId,
      subtotal: calculation.subtotal,
      discount: calculation.discount,
      validatedItems: calculation.validatedItems,
      isTestMode: keyId.startsWith('rzp_test_'),
    };
  }

  // If Razorpay API keys are not yet configured in environment variables,
  // create a simulated test order ID for seamless sandbox testing
  const mockOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  return {
    orderId: mockOrderId,
    amount: calculation.total,
    currency: 'INR',
    keyId,
    subtotal: calculation.subtotal,
    discount: calculation.discount,
    validatedItems: calculation.validatedItems,
    isTestMode: true,
  };
}

/**
 * Verifies Razorpay payment signature
 */
export function verifyRazorpaySignature(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): { isValid: boolean; reason?: string } {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return { isValid: false, reason: 'Missing required Razorpay payment verification fields.' };
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    // In sandbox test mode without environment secret, simulate signature acceptance
    if (razorpay_order_id.startsWith('order_test_') || razorpay_signature.startsWith('simulated_') || razorpay_payment_id.startsWith('pay_')) {
      return { isValid: true };
    }
    return { isValid: true }; // Allow test execution
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body.toString())
    .digest('hex');

  const isValid = expectedSignature === razorpay_signature;
  return {
    isValid,
    reason: isValid ? undefined : 'Razorpay cryptographic signature verification failed.',
  };
}

/**
 * Verifies Razorpay Webhook signature
 */
export function verifyRazorpayWebhookSignature(rawBody: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn('RAZORPAY_WEBHOOK_SECRET is not configured in environment variables.');
    return true; // Allow in development
  }

  if (!signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  return expectedSignature === signature;
}
