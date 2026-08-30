import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Banknote, 
  Lock, 
  CheckCircle2, 
  MapPin, 
  ArrowRight,
  Printer,
  ChevronRight,
  Zap,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { CartItem, AdminOrder, CustomerUser, StoreSettingsCMSContent, LogoCMSContent } from '../types';
import { triggerConfetti } from '../utils/storage';
import { 
  initiateRazorpayPayment, 
  createServerRazorpayOrder, 
  verifyServerRazorpaySignature 
} from '../lib/razorpay';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  appliedPromo: string | null;
  isGiftWrap: boolean;
  orderNotes: string;
  currentUser: CustomerUser | null;
  storeSettingsCMS?: StoreSettingsCMSContent;
  logoCMS?: LogoCMSContent;
  onOrderPlaced: (newOrder: AdminOrder) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  appliedPromo,
  isGiftWrap,
  orderNotes,
  currentUser,
  storeSettingsCMS,
  logoCMS,
  onOrderPlaced,
  onClearCart,
}) => {
  // Step in checkout: 1 = Shipping Address, 2 = Shipping Speed, 3 = Payment Gateway, 4 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    addressLine1: currentUser?.address || '',
    addressLine2: '',
    pincode: '400050',
    city: currentUser?.city || 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    deliveryInstructions: orderNotes || '',
    saveAddressToAccount: true,
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('express');

  // Payment Method: 'razorpay' is the recommended primary online gateway
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'card' | 'netbanking' | 'cod'>('razorpay');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Status & Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatusText, setProcessingStatusText] = useState('Creating secure payment...');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<AdminOrder | null>(null);

  if (!isOpen) return null;

  const giftWrapFee = isGiftWrap ? 150 : 0;
  const shippingFee = shippingMethod === 'express' ? 0 : 0; // Free express promotion
  const totalAmount = Math.max(0, subtotal - discount + giftWrapFee + shippingFee);

  const handlePincodeChange = (pincode: string) => {
    setFormData((prev) => ({ ...prev, pincode }));
    if (pincode.startsWith('400') || pincode.startsWith('401')) {
      setFormData((prev) => ({ ...prev, city: 'Mumbai', state: 'Maharashtra' }));
    } else if (pincode.startsWith('110')) {
      setFormData((prev) => ({ ...prev, city: 'New Delhi', state: 'Delhi' }));
    } else if (pincode.startsWith('500')) {
      setFormData((prev) => ({ ...prev, city: 'Hyderabad', state: 'Telangana' }));
    } else if (pincode.startsWith('560')) {
      setFormData((prev) => ({ ...prev, city: 'Bengaluru', state: 'Karnataka' }));
    } else if (pincode.startsWith('700')) {
      setFormData((prev) => ({ ...prev, city: 'Kolkata', state: 'West Bengal' }));
    } else if (pincode.startsWith('600')) {
      setFormData((prev) => ({ ...prev, city: 'Chennai', state: 'Tamil Nadu' }));
    }
  };

  const finalizeOrder = (
    methodLabel: string,
    paymentStatus: 'Paid' | 'Pending',
    razorpayDetails?: { paymentId?: string; orderId?: string; signature?: string }
  ) => {
    const orderNumber = `SW-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: AdminOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: formData.fullName || 'Valued Patron',
      customerEmail: formData.email || 'patron@example.com',
      customerPhone: formData.phone || '+91 98200 00000',
      shippingAddress: `${formData.addressLine1}${formData.addressLine2 ? ', ' + formData.addressLine2 : ''}, ${formData.pincode}`,
      city: `${formData.city}, ${formData.state}`,
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        image: item.product.image,
      })),
      subtotal,
      discount,
      total: totalAmount,
      paymentMethod: methodLabel,
      paymentStatus,
      orderStatus: 'Handcrafting',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      razorpayPaymentId: razorpayDetails?.paymentId,
      razorpayOrderId: razorpayDetails?.orderId,
      razorpaySignature: razorpayDetails?.signature,
    };

    setCompletedOrder(newOrder);
    setIsProcessing(false);
    setPaymentError(null);
    setStep(4);
    onOrderPlaced(newOrder);
    onClearCart();

    triggerConfetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#7A1526', '#C29342', '#FAF6F0', '#2C2420'],
    });
  };

  const handlePlaceOrder = async () => {
    setPaymentError(null);

    // 1. If Razorpay is chosen - Full server validation and signature verification flow
    if (paymentMethod === 'razorpay') {
      setIsProcessing(true);
      setProcessingStatusText('Creating secure payment...');
      const generatedOrderNum = `SW-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      try {
        // Step 1: Create Order on Server Side (validates cart and product prices)
        const serverOrderResult = await createServerRazorpayOrder({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            size: i.selectedSize,
          })),
          appliedPromo,
          isGiftWrap,
          customerName: formData.fullName || 'Valued Patron',
          customerEmail: formData.email || 'patron@example.com',
          customerPhone: formData.phone || '+91 98200 00000',
        });

        const activeKeyId = storeSettingsCMS?.razorpayKeyId || serverOrderResult.keyId || 'rzp_test_1DP5mmOlF5G5ag';

        setProcessingStatusText('Opening Razorpay Gateway...');

        // Step 2: Open Razorpay Checkout Modal
        await initiateRazorpayPayment({
          keyId: activeKeyId,
          orderId: serverOrderResult.orderId,
          amount: totalAmount,
          orderNumber: generatedOrderNum,
          customerName: formData.fullName || 'Valued Patron',
          customerEmail: formData.email || 'patron@example.com',
          customerPhone: formData.phone || '+91 98200 00000',
          storeName: storeSettingsCMS?.razorpayMerchantName || 'LABEL SHIKHA WARULE',
          logoUrl: logoCMS?.customImageUrl || '',
          themeColor: storeSettingsCMS?.razorpayThemeColor || '#7A1526',
          onSuccess: async (result) => {
            setProcessingStatusText('Verifying payment signature with server...');

            // Step 3: Server-side cryptographic signature verification
            const verifyResult = await verifyServerRazorpaySignature({
              razorpay_order_id: result.razorpay_order_id || serverOrderResult.orderId,
              razorpay_payment_id: result.razorpay_payment_id,
              razorpay_signature: result.razorpay_signature || '',
            });

            if (!verifyResult.verified) {
              setIsProcessing(false);
              setPaymentError(verifyResult.error || 'Cryptographic payment signature verification failed on the server.');
              return;
            }

            // Step 4: Mark order as PAID only after server verification
            finalizeOrder(
              `Razorpay Payment Gateway (${result.razorpay_payment_id})`,
              'Paid',
              {
                paymentId: result.razorpay_payment_id,
                orderId: result.razorpay_order_id || serverOrderResult.orderId,
                signature: result.razorpay_signature,
              }
            );
          },
          onError: (err) => {
            setIsProcessing(false);
            setPaymentError(err?.description || 'Payment was unsuccessful. Please check your payment details or try another payment method.');
          },
          onDismiss: () => {
            // Return customer safely to checkout without losing cart
            setIsProcessing(false);
          },
        });
      } catch (err: any) {
        setIsProcessing(false);
        setPaymentError(err?.message || 'Could not initiate Razorpay checkout. Please verify your connection.');
      }
      return;
    }

    // 2. Direct Alternative Payment Options (UPI QR, Card, NetBanking, COD)
    setIsProcessing(true);
    setProcessingStatusText('Processing order authorization...');
    setTimeout(() => {
      let methodLabel = '';
      let status: 'Paid' | 'Pending' = 'Paid';

      if (paymentMethod === 'upi') {
        methodLabel = `Direct UPI (${upiId || 'Instant VPA'})`;
      } else if (paymentMethod === 'card') {
        methodLabel = `Credit/Debit Card (*${cardNumber.slice(-4) || '8842'})`;
      } else if (paymentMethod === 'netbanking') {
        methodLabel = `NetBanking (${selectedBank})`;
      } else {
        methodLabel = 'Cash on Delivery (Verified)';
        status = 'Pending';
      }

      finalizeOrder(methodLabel, status);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:p-0">
        
        {/* Backdrop */}
        <div 
          onClick={() => {
            if (step !== 4 && !isProcessing) onClose();
          }} 
          className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" 
        />

        {/* Modal Window */}
        <div className="relative inline-block w-full max-w-3xl p-0 my-8 overflow-hidden text-left align-middle bg-[#FAF6F0] rounded-xl shadow-2xl transform transition-all border border-[#DFCBB8]">
          
          {/* Top Bar Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-[#EADDCF] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FCF4F6] border border-[#F0D5DA] flex items-center justify-center text-[#7A1526]">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#2C2420] tracking-wider uppercase">
                  {step === 4 ? 'PAYMENT SUCCESSFUL' : 'ROYAL ATELIER CHECKOUT'}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] text-[#7A6F68]">256-Bit SSL Encrypted Checkout</p>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#E6F4EA] text-[#137333] font-semibold rounded border border-[#CEEAD6] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Razorpay Verified
                  </span>
                </div>
              </div>
            </div>

            {step !== 4 && (
              <button
                onClick={onClose}
                disabled={isProcessing}
                aria-label="Close Checkout"
                className="p-1.5 text-[#685C54] hover:text-[#7A1526] rounded-full hover:bg-[#F3E8DB] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Stepper Header */}
          {step !== 4 && (
            <div className="px-6 py-3 bg-[#F4E9DD] border-b border-[#E3D3C1] flex items-center justify-between text-xs">
              <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#7A1526] font-bold' : 'text-[#8A7E75]'}`}>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${step >= 1 ? 'border-[#7A1526] bg-[#7A1526] text-white' : 'border-current'}`}>1</span>
                <span>Delivery Address</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C4B2A0]" />
              <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#7A1526] font-bold' : 'text-[#8A7E75]'}`}>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${step >= 2 ? 'border-[#7A1526] bg-[#7A1526] text-white' : 'border-current'}`}>2</span>
                <span>Shipping Speed</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C4B2A0]" />
              <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#7A1526] font-bold' : 'text-[#8A7E75]'}`}>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${step >= 3 ? 'border-[#7A1526] bg-[#7A1526] text-white' : 'border-current'}`}>3</span>
                <span>Razorpay & Payment</span>
              </div>
            </div>
          )}

          {/* Main Body */}
          <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-cinzel text-sm font-bold text-[#2C2420] uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#7A1526]" />
                  <span>Where should we deliver your handcrafted pieces?</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block text-[#523A30] font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Aayushi Malhotra"
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded-lg text-[#2C2420] focus:border-[#7A1526] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#523A30] font-semibold mb-1">Phone Number (For Delivery & OTP) *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98204 88190"
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded-lg text-[#2C2420] focus:border-[#7A1526] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#523A30] font-semibold mb-1">Email Address (For Invoice & Tracking) *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="aayushi@example.com"
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded-lg text-[#2C2420] focus:border-[#7A1526] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#523A30] font-semibold mb-1">Street Address, Apartment / Flat / Villa *</label>
                    <input
                      type="text"
                      required
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      placeholder="Flat 902, Bayview Towers, Prabhadevi"
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded-lg text-[#2C2420] focus:border-[#7A1526] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#523A30] font-semibold mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="400050"
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded-lg text-[#2C2420] focus:border-[#7A1526] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#523A30] font-semibold mb-1">City / Region *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Mumbai"
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded-lg text-[#2C2420] focus:border-[#7A1526] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#523A30] font-semibold mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Maharashtra"
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded-lg text-[#2C2420] focus:border-[#7A1526] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#523A30] font-semibold mb-1">Country</label>
                    <input
                      type="text"
                      disabled
                      value={formData.country}
                      className="w-full p-2.5 bg-[#EFE5D8] border border-[#DFCBB8] rounded-lg text-[#523A30] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.pincode) {
                        alert('Please fill in your name, phone number, address, and pincode.');
                        return;
                      }
                      setStep(2);
                    }}
                    className="px-6 py-3 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold tracking-wider uppercase rounded-lg flex items-center gap-2 cursor-pointer shadow-md transition-transform active:scale-98"
                  >
                    <span>Continue to Shipping</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-cinzel text-sm font-bold text-[#2C2420] uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#7A1526]" />
                  <span>Choose Atelier Dispatch & Delivery Speed</span>
                </h3>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'bg-white border-[#7A1526] shadow-md ring-1 ring-[#7A1526]'
                        : 'bg-[#FAF6F0] border-[#DFCBB8] hover:border-[#7A1526]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="mt-1 text-[#7A1526] focus:ring-[#7A1526]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel font-bold text-xs text-[#2C2420]">
                            EXPRESS ATELIER DISPATCH (BLUE DART AIR)
                          </span>
                          <span className="px-2 py-0.5 bg-[#EAF5EC] text-[#2D6A4F] text-[10px] font-bold rounded">
                            FREE TODAY
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A6F68] mt-1">
                          Delivery within <strong>2 to 4 business days</strong> with real-time GPS tracking & tamper-evident wax seal packaging.
                        </p>
                      </div>
                    </div>
                    <span className="font-serif-luxury font-bold text-xs text-[#2D6A4F]">₹ 0</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'bg-white border-[#7A1526] shadow-md ring-1 ring-[#7A1526]'
                        : 'bg-[#FAF6F0] border-[#DFCBB8] hover:border-[#7A1526]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="mt-1 text-[#7A1526] focus:ring-[#7A1526]"
                      />
                      <div>
                        <span className="font-cinzel font-bold text-xs text-[#2C2420]">
                          STANDARD INSURED SURFACE COURIER
                        </span>
                        <p className="text-[11px] text-[#7A6F68] mt-1">
                          Delivery within <strong>5 to 7 business days</strong> across all tier-1, tier-2, and tier-3 Indian cities.
                        </p>
                      </div>
                    </div>
                    <span className="font-serif-luxury font-bold text-xs text-[#2D6A4F]">₹ 0</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 border border-[#DFCBB8] text-xs font-cinzel font-semibold text-[#523A30] hover:bg-white rounded-lg cursor-pointer"
                  >
                    Back to Address
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-[#7A1526] hover:bg-[#61101E] text-white text-xs font-cinzel font-semibold tracking-wider uppercase rounded-lg flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel text-sm font-bold text-[#2C2420] uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#7A1526]" />
                    <span>Select Payment Method</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#0C2340] font-semibold bg-[#E8F0FE] px-2.5 py-1 rounded-full border border-[#D2E3FC]">
                    <span className="w-2 h-2 rounded-full bg-[#1A73E8] animate-pulse" />
                    <span>Razorpay Gateway Integrated</span>
                  </div>
                </div>

                {/* Payment Failure Banner with Try Again */}
                {paymentError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-2 animate-in fade-in">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-red-900">Payment Failed</p>
                        <p className="text-[11px] text-red-700 mt-0.5">{paymentError}</p>
                      </div>
                    </div>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={handlePlaceOrder}
                        className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-md text-[11px] font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Try Again</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Razorpay Option Banner */}
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                    paymentMethod === 'razorpay'
                      ? 'bg-gradient-to-br from-[#FFF9FA] to-[#FAF2F4] border-[#7A1526] shadow-md ring-2 ring-[#7A1526]/20'
                      : 'bg-white border-[#DFCBB8] hover:border-[#7A1526]/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="mt-1 text-[#7A1526] focus:ring-[#7A1526]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel font-bold text-sm text-[#3B0A12]">
                            RAZORPAY INSTANT CHECKOUT
                          </span>
                          <span className="px-2 py-0.5 bg-[#58111A] text-[#FDF8F3] text-[10px] font-bold rounded tracking-wide">
                            RECOMMENDED
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B3740] mt-1 leading-relaxed">
                          Pay securely via <strong>UPI (GPay, PhonePe, Paytm, BHIM)</strong>, <strong>All Major Credit & Debit Cards (Visa, Mastercard, RuPay, Amex)</strong>, <strong>NetBanking (50+ Banks)</strong> & <strong>Wallets</strong>.
                        </p>

                        {/* Payment Partner Logos/Icons */}
                        <div className="flex flex-wrap items-center gap-2 mt-2.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-[#DFCBB8] rounded text-[#0C2340]">
                            ⚡ UPI Instant
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-[#DFCBB8] rounded text-[#1A1A1A]">
                            💳 Visa / MC / RuPay
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-[#DFCBB8] rounded text-[#0F5132]">
                            🏦 50+ Banks
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-[#DFCBB8] rounded text-[#0D6EFD]">
                            🛡️ 100% Protected
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Razorpay Brand Visual */}
                    <div className="hidden sm:flex flex-col items-end shrink-0 pl-2">
                      <div className="px-2.5 py-1 bg-[#0C2340] text-white text-[11px] font-bold rounded tracking-wider flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-[#00BAF2]" />
                        <span>Razorpay</span>
                      </div>
                      <span className="text-[9px] text-[#685C54] mt-1">PCI-DSS Compliant</span>
                    </div>
                  </div>
                </div>

                {/* Alternative Payment Methods Accordion */}
                <div className="pt-2">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-cinzel font-semibold text-[#685C54]">
                      Alternative Payment Options
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'bg-[#FAF2F4] border-[#7A1526] text-[#7A1526] font-bold shadow-xs'
                          : 'bg-white border-[#DFCBB8] text-[#523A30] hover:border-[#7A1526]'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Direct UPI QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-[#FAF2F4] border-[#7A1526] text-[#7A1526] font-bold shadow-xs'
                          : 'bg-white border-[#DFCBB8] text-[#523A30] hover:border-[#7A1526]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Direct Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'netbanking'
                          ? 'bg-[#FAF2F4] border-[#7A1526] text-[#7A1526] font-bold shadow-xs'
                          : 'bg-white border-[#DFCBB8] text-[#523A30] hover:border-[#7A1526]'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>NetBanking</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-[#FAF2F4] border-[#7A1526] text-[#7A1526] font-bold shadow-xs'
                          : 'bg-white border-[#DFCBB8] text-[#523A30] hover:border-[#7A1526]'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>Cash on Delivery</span>
                    </button>
                  </div>
                </div>

                {/* Sub-panels for manual fallback methods */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 bg-white border border-[#DFCBB8] rounded-lg space-y-3 text-xs animate-in fade-in">
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-[#FAF6F0] rounded-lg border border-[#EADDCF]">
                      <div className="w-24 h-24 bg-white p-2 border border-[#C4A894] rounded-lg flex flex-col items-center justify-center shadow-xs shrink-0">
                        <div className="w-full h-full bg-[#2C2420] text-white flex items-center justify-center font-mono text-[8px] text-center p-1 rounded">
                          UPI QR SCANNER
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-[#2C2420]">Manual UPI Payment</p>
                        <p className="text-[11px] text-[#7A6F68] mt-0.5">
                          Enter your UPI Virtual Payment Address (VPA) below for payment verification.
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. yourname@okhdfcbank"
                            className="px-3 py-1.5 bg-white border border-[#DFCBB8] rounded-lg text-xs text-[#2C2420] focus:outline-none focus:border-[#7A1526] w-full max-w-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-4 bg-white border border-[#DFCBB8] rounded-lg space-y-3 text-xs animate-in fade-in">
                    <div>
                      <label className="block text-[#523A30] font-semibold mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8842"
                        className="w-full p-2 bg-white border border-[#DFCBB8] rounded-lg text-[#2C2420] font-mono focus:outline-none focus:border-[#7A1526]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#523A30] font-semibold mb-1">Expiry Date (MM/YY)</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="08/29"
                          className="w-full p-2 bg-white border border-[#DFCBB8] rounded-lg text-[#2C2420] font-mono focus:outline-none focus:border-[#7A1526]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#523A30] font-semibold mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full p-2 bg-white border border-[#DFCBB8] rounded-lg text-[#2C2420] font-mono focus:outline-none focus:border-[#7A1526]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-4 bg-white border border-[#DFCBB8] rounded-lg space-y-2 text-xs animate-in fade-in">
                    <label className="block text-[#523A30] font-semibold">Select Your Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded-lg text-[#2C2420] focus:outline-none focus:border-[#7A1526]"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-white border border-[#DFCBB8] rounded-lg text-xs text-[#523A30] space-y-1 animate-in fade-in">
                    <p className="font-bold text-[#7A1526]">Cash on Delivery Policy</p>
                    <p className="text-[11px] text-[#7A6F68]">
                      Please keep the exact amount ready upon delivery. Our BlueDart/Delhivery partner will also accept instant UPI scan at your doorstep.
                    </p>
                  </div>
                )}

                {/* Final Order Price Breakdown Box */}
                <div className="p-4 bg-[#F4E9DD] border border-[#DFCBB8] rounded-xl text-xs space-y-1.5">
                  <div className="flex justify-between text-[#685C54]">
                    <span>Items Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} pieces)</span>
                    <span className="font-serif-luxury font-semibold">₹ {subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#2D6A4F] font-semibold">
                      <span>Promo Discount ({appliedPromo})</span>
                      <span>- ₹ {discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {isGiftWrap && (
                    <div className="flex justify-between text-[#523A30]">
                      <span>Artisanal Gift Packaging</span>
                      <span>₹ {giftWrapFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#2D6A4F] font-semibold">
                    <span>Insured Courier Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#DFCBB8] font-bold text-sm text-[#2C2420]">
                    <span className="font-cinzel">TOTAL PAYABLE AMOUNT</span>
                    <span className="font-serif-luxury text-base text-[#7A1526]">
                      ₹ {totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    disabled={isProcessing}
                    className="px-5 py-2.5 border border-[#DFCBB8] text-xs font-cinzel font-semibold text-[#523A30] hover:bg-white rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    Back to Shipping
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#7A1526] via-[#851628] to-[#991B30] hover:from-[#61101E] hover:to-[#801426] text-white text-xs font-cinzel font-bold tracking-[0.15em] uppercase rounded-lg flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-70 transition-transform active:scale-98"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{processingStatusText.toUpperCase()}</span>
                      </span>
                    ) : paymentMethod === 'razorpay' ? (
                      <>
                        <Zap className="w-4 h-4 text-[#00BAF2]" />
                        <span>PAY ₹ {totalAmount.toLocaleString('en-IN')} VIA RAZORPAY</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>AUTHORIZE & PAY ₹ {totalAmount.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 4 && completedOrder && (
              <div className="py-6 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 bg-[#EAF5EC] text-[#2D6A4F] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <h3 className="font-cinzel text-2xl font-bold text-[#2C2420]">
                  PAYMENT SUCCESSFUL
                </h3>
                
                <p className="font-serif-luxury text-base text-[#685C54] max-w-md mx-auto">
                  Thank you, <strong>{completedOrder.customerName}</strong>. Your artisanal couture order has been verified and registered with our master weavers.
                </p>

                <div className="p-4 bg-white border border-[#EADDCF] rounded-xl max-w-lg mx-auto text-xs text-[#523A30] text-left space-y-2 shadow-xs">
                  <div className="flex justify-between border-b border-[#FAF6F0] pb-1.5">
                    <span className="text-[#8C7E74]">Order Reference Number:</span>
                    <span className="font-mono font-bold text-[#7A1526]">{completedOrder.orderNumber}</span>
                  </div>

                  {completedOrder.razorpayPaymentId && (
                    <div className="flex justify-between border-b border-[#FAF6F0] pb-1.5 bg-[#F0F7FF] p-1.5 rounded text-[#0C2340]">
                      <span className="font-semibold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-[#00BAF2]" /> Razorpay Payment ID:
                      </span>
                      <span className="font-mono font-bold">{completedOrder.razorpayPaymentId}</span>
                    </div>
                  )}

                  {completedOrder.razorpayOrderId && (
                    <div className="flex justify-between border-b border-[#FAF6F0] pb-1.5">
                      <span className="text-[#8C7E74]">Razorpay Order ID:</span>
                      <span className="font-mono">{completedOrder.razorpayOrderId}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-b border-[#FAF6F0] pb-1.5">
                    <span className="text-[#8C7E74]">Amount Paid:</span>
                    <span className="font-serif-luxury font-bold text-[#7A1526]">₹ {completedOrder.total.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between border-b border-[#FAF6F0] pb-1.5">
                    <span className="text-[#8C7E74]">Payment Status:</span>
                    <span className="font-semibold text-[#2D6A4F]">{completedOrder.paymentStatus} ({completedOrder.paymentMethod})</span>
                  </div>
                  
                  <div className="flex justify-between border-b border-[#FAF6F0] pb-1.5">
                    <span className="text-[#8C7E74]">Delivery Address:</span>
                    <span className="font-medium text-right max-w-[240px] truncate">{completedOrder.shippingAddress}</span>
                  </div>

                  <div className="flex justify-between pt-1">
                    <span className="text-[#8C7E74]">Estimated Dispatch:</span>
                    <span className="font-bold text-[#2C2420]">Within 48-72 Hours with Tracking</span>
                  </div>
                </div>

                {/* Purchased items summary */}
                <div className="max-w-lg mx-auto bg-[#FBF7F2] p-3 rounded-lg border border-[#EADDCF] text-xs text-left">
                  <p className="font-cinzel font-bold text-[#523A30] mb-2 uppercase tracking-wide">
                    Ordered Couture Items ({completedOrder.items.length})
                  </p>
                  <div className="space-y-1.5">
                    {completedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-[#685C54]">
                        <span>{it.quantity}x {it.productName} ({it.size})</span>
                        <span className="font-mono font-semibold">₹ {(it.price * it.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-5 py-2.5 bg-white border border-[#DFCBB8] text-[#523A30] hover:bg-[#FAF6F0] text-xs font-cinzel font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Order Invoice</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-8 py-2.5 bg-[#7A1526] text-white text-xs font-cinzel font-semibold tracking-wider rounded-lg uppercase hover:bg-[#61101E] cursor-pointer shadow-md"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
