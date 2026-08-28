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
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Gift, 
  ArrowRight,
  Printer,
  ChevronRight
} from 'lucide-react';
import { CartItem, AdminOrder, CustomerUser } from '../types';
import { triggerConfetti } from '../utils/storage';

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
  onOrderPlaced,
  onClearCart,
}) => {
  // Step in checkout: 1 = Shipping Address, 2 = Shipping Method, 3 = Payment, 4 = Confirmation
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

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Status & Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
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
        paymentMethod: 
          paymentMethod === 'upi' ? `UPI (${upiId || 'QR Instant Pay'})` :
          paymentMethod === 'card' ? `Credit Card (*${cardNumber.slice(-4) || '8842'})` :
          paymentMethod === 'netbanking' ? `NetBanking (${selectedBank})` : 'Cash on Delivery (Verified)',
        paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
        orderStatus: 'Handcrafting',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };

      setCompletedOrder(newOrder);
      setIsProcessing(false);
      setStep(4);
      onOrderPlaced(newOrder);
      onClearCart();

      triggerConfetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#9E472A', '#C29342', '#FAF6F0', '#2C2420'],
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:p-0">
        
        {/* Backdrop */}
        <div 
          onClick={() => {
            if (step !== 4) onClose();
          }} 
          className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" 
        />

        {/* Modal Window */}
        <div className="relative inline-block w-full max-w-3xl p-0 my-8 overflow-hidden text-left align-middle bg-[#FAF6F0] rounded-lg shadow-2xl transform transition-all border border-[#DFCBB8]">
          
          {/* Top Bar Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-[#EADDCF] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F4E9DC] flex items-center justify-center text-[#9E472A]">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#2C2420] tracking-wider uppercase">
                  {step === 4 ? 'ORDER CONFIRMED' : 'ROYAL ATELIER CHECKOUT'}
                </h2>
                <p className="text-[11px] text-[#7A6F68]">256-Bit Encrypted Secure Payment</p>
              </div>
            </div>

            {step !== 4 && (
              <button
                onClick={onClose}
                aria-label="Close Checkout"
                className="p-1.5 text-[#685C54] hover:text-[#9E472A] rounded-full hover:bg-[#F3E8DB] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Stepper Header */}
          {step !== 4 && (
            <div className="px-6 py-3 bg-[#F4E9DD] border-b border-[#E3D3C1] flex items-center justify-between text-xs">
              <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#9E472A] font-bold' : 'text-[#8A7E75]'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
                <span>Delivery Address</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C4B2A0]" />
              <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#9E472A] font-bold' : 'text-[#8A7E75]'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
                <span>Shipping Speed</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C4B2A0]" />
              <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#9E472A] font-bold' : 'text-[#8A7E75]'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
                <span>Payment</span>
              </div>
            </div>
          )}

          {/* Main Body */}
          <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-cinzel text-sm font-bold text-[#2C2420] uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#9E472A]" />
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
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-[#2C2420] focus:border-[#9E472A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#523A30] font-semibold mb-1">Phone Number (For WhatsApp Updates) *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98204 88190"
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-[#2C2420] focus:border-[#9E472A] focus:outline-none"
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
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-[#2C2420] focus:border-[#9E472A] focus:outline-none"
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
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-[#2C2420] focus:border-[#9E472A] focus:outline-none"
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
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-[#2C2420] focus:border-[#9E472A] focus:outline-none font-mono"
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
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-[#2C2420] focus:border-[#9E472A] focus:outline-none"
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
                      className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-[#2C2420] focus:border-[#9E472A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#523A30] font-semibold mb-1">Country</label>
                    <input
                      type="text"
                      disabled
                      value={formData.country}
                      className="w-full p-2.5 bg-[#EFE5D8] border border-[#DFCBB8] rounded text-[#523A30] cursor-not-allowed"
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
                    className="px-6 py-3 bg-[#9E472A] hover:bg-[#85371D] text-white text-xs font-cinzel font-semibold tracking-wider uppercase rounded flex items-center gap-2 cursor-pointer shadow-md"
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
                  <Truck className="w-4 h-4 text-[#9E472A]" />
                  <span>Choose Atelier Dispatch & Delivery Speed</span>
                </h3>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-start justify-between p-4 rounded border cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'bg-white border-[#9E472A] shadow-md ring-1 ring-[#9E472A]'
                        : 'bg-[#FAF6F0] border-[#DFCBB8] hover:border-[#9E472A]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="mt-1 text-[#9E472A] focus:ring-[#9E472A]"
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
                    className={`flex items-start justify-between p-4 rounded border cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'bg-white border-[#9E472A] shadow-md ring-1 ring-[#9E472A]'
                        : 'bg-[#FAF6F0] border-[#DFCBB8] hover:border-[#9E472A]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="mt-1 text-[#9E472A] focus:ring-[#9E472A]"
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
                    className="px-5 py-2.5 border border-[#DFCBB8] text-xs font-cinzel font-semibold text-[#523A30] hover:bg-white rounded"
                  >
                    Back to Address
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-[#9E472A] hover:bg-[#85371D] text-white text-xs font-cinzel font-semibold tracking-wider uppercase rounded flex items-center gap-2 shadow-md"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-cinzel text-sm font-bold text-[#2C2420] uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#9E472A]" />
                  <span>Select Payment Method</span>
                </h3>

                {/* Payment Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-[#F4E9DC] border-[#9E472A] text-[#9E472A] font-bold shadow-xs'
                        : 'bg-white border-[#DFCBB8] text-[#523A30] hover:border-[#9E472A]'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>UPI / QR Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-[#F4E9DC] border-[#9E472A] text-[#9E472A] font-bold shadow-xs'
                        : 'bg-white border-[#DFCBB8] text-[#523A30] hover:border-[#9E472A]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Card (Visa/MC)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'bg-[#F4E9DC] border-[#9E472A] text-[#9E472A] font-bold shadow-xs'
                        : 'bg-white border-[#DFCBB8] text-[#523A30] hover:border-[#9E472A]'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-[#F4E9DC] border-[#9E472A] text-[#9E472A] font-bold shadow-xs'
                        : 'bg-white border-[#DFCBB8] text-[#523A30] hover:border-[#9E472A]'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                {/* Method Specific UI */}
                <div className="p-4 bg-white border border-[#DFCBB8] rounded-md space-y-3">
                  {paymentMethod === 'upi' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-[#FAF6F0] rounded border border-[#EADDCF]">
                        {/* Dynamic Simulated QR Code */}
                        <div className="w-28 h-28 bg-white p-2 border border-[#C4A894] rounded flex flex-col items-center justify-center shadow-xs shrink-0">
                          <div className="w-full h-full bg-[#2C2420] text-white flex items-center justify-center font-mono text-[9px] text-center p-1 rounded-2xs">
                            SCAN WITH GPAY / PHONEPE / PAYTM
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-[#2C2420]">Instant UPI Payment</p>
                          <p className="text-[11px] text-[#7A6F68] mt-0.5">
                            Scan the dynamic atelier QR with any UPI app or enter your VPA / UPI ID below for instant zero-fee verification.
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="e.g. mobile@okhdfcbank"
                              className="px-2.5 py-1.5 bg-white border border-[#DFCBB8] rounded text-xs text-[#2C2420] focus:outline-none focus:border-[#9E472A]"
                            />
                            <span className="text-[11px] text-[#2D6A4F] font-semibold">100% Secure</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[#523A30] font-semibold mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 •••• •••• 8842"
                          className="w-full p-2 bg-white border border-[#DFCBB8] rounded text-[#2C2420] font-mono focus:outline-none focus:border-[#9E472A]"
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
                            className="w-full p-2 bg-white border border-[#DFCBB8] rounded text-[#2C2420] font-mono focus:outline-none focus:border-[#9E472A]"
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
                            className="w-full p-2 bg-white border border-[#DFCBB8] rounded text-[#2C2420] font-mono focus:outline-none focus:border-[#9E472A]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-2 text-xs">
                      <label className="block text-[#523A30] font-semibold">Select Your Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full p-2 bg-white border border-[#DFCBB8] rounded text-[#2C2420] focus:outline-none focus:border-[#9E472A]"
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
                    <div className="p-3 bg-[#FAF6F0] rounded text-xs text-[#523A30] space-y-1">
                      <p className="font-bold text-[#9E472A]">Cash on Delivery Policy</p>
                      <p className="text-[11px] text-[#7A6F68]">
                        Please keep the exact amount ready upon delivery. Our delivery partner will also accept UPI scan at your doorstep.
                      </p>
                    </div>
                  )}
                </div>

                {/* Final Order Price Breakdown Box */}
                <div className="p-4 bg-[#F4E9DD] border border-[#DFCBB8] rounded text-xs space-y-1.5">
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
                    <span className="font-serif-luxury text-base text-[#9E472A]">
                      ₹ {totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    disabled={isProcessing}
                    className="px-5 py-2.5 border border-[#DFCBB8] text-xs font-cinzel font-semibold text-[#523A30] hover:bg-white rounded cursor-pointer"
                  >
                    Back to Shipping
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="px-8 py-3.5 bg-[#9E472A] hover:bg-[#85371D] text-white text-xs font-cinzel font-bold tracking-[0.2em] uppercase rounded flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <span>FINALIZING ATELIER ORDER...</span>
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
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-[#EAF5EC] text-[#2D6A4F] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <h3 className="font-cinzel text-2xl font-bold text-[#2C2420]">
                  ORDER RESERVED & PLACED
                </h3>
                
                <p className="font-serif-luxury text-base text-[#685C54] max-w-md mx-auto">
                  Thank you, <strong>{completedOrder.customerName}</strong>. Your artisanal couture order has been registered with our master weavers.
                </p>

                <div className="p-4 bg-white border border-[#EADDCF] rounded-lg max-w-lg mx-auto text-xs text-[#523A30] text-left space-y-2 shadow-xs">
                  <div className="flex justify-between border-b border-[#FAF6F0] pb-1.5">
                    <span className="text-[#8C7E74]">Order Reference Number:</span>
                    <span className="font-mono font-bold text-[#9E472A]">{completedOrder.orderNumber}</span>
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

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-5 py-2.5 bg-white border border-[#DFCBB8] text-[#523A30] hover:bg-[#FAF6F0] text-xs font-cinzel font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Order Invoice</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-8 py-2.5 bg-[#9E472A] text-white text-xs font-cinzel font-semibold tracking-wider rounded uppercase hover:bg-[#85371D] cursor-pointer shadow-md"
                  >
                    Continue Exploring
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
