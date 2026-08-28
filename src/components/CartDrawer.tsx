import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag, Gift, Sparkles } from 'lucide-react';
import { CartItem, AdminOrder, CustomerUser } from '../types';
import { PROMO_CODES } from '../data/mockData';
import { triggerConfetti } from '../utils/storage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onPlaceOrder?: (order: AdminOrder) => void;
  onOpenCheckout?: (checkoutData: {
    subtotal: number;
    discount: number;
    appliedPromo: string | null;
    isGiftWrap: boolean;
    orderNotes: string;
  }) => void;
  currentUser?: CustomerUser | null;
  onOpenCustomerLogin?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  onOpenCheckout,
  currentUser,
  onOpenCustomerLogin,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>('WELCOME10'); // Default welcome promo
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2999;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Promo discount calculation
  let discountAmount = 0;
  if (appliedPromo) {
    const promo = PROMO_CODES.find((p) => p.code === appliedPromo);
    if (promo && subtotal >= promo.minOrder) {
      discountAmount = Math.round((subtotal * promo.discountPercentage) / 100);
    }
  }

  const giftWrapCost = isGiftWrap ? 150 : 0;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 250;
  const finalTotal = Math.max(0, subtotal - discountAmount + giftWrapCost + shippingFee);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoInput.trim().toUpperCase();
    const valid = PROMO_CODES.find((p) => p.code === code);
    if (valid) {
      setAppliedPromo(code);
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon code. Try "WELCOME10" or "FESTIVE15"');
    }
  };

  const handleCheckout = () => {
    if (onOpenCheckout) {
      onOpenCheckout({
        subtotal,
        discount: discountAmount,
        appliedPromo,
        isGiftWrap,
        orderNotes,
      });
      onClose();
      return;
    }

    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderCompleted(true);
      
      if (onPlaceOrder && items.length > 0) {
        const newOrder: AdminOrder = {
          id: `ord-${Date.now()}`,
          orderNumber: `SW-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: currentUser ? currentUser.name : 'Aayushi Malhotra',
          customerEmail: currentUser ? currentUser.email : 'aayushi.m@gmail.com',
          customerPhone: currentUser ? currentUser.phone : '+91 98204 88190',
          shippingAddress: currentUser ? currentUser.address : 'Flat 902, Bayview Towers, Prabhadevi',
          city: currentUser ? currentUser.city : 'Mumbai, Maharashtra',
          items: items.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            size: i.selectedSize,
            image: i.product.image,
          })),
          subtotal,
          discount: discountAmount,
          total: finalTotal,
          paymentMethod: 'Prepaid (UPI / Card)',
          paymentStatus: 'Paid',
          orderStatus: 'Handcrafting',
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        };
        onPlaceOrder(newOrder);
      }

      triggerConfetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9E472A', '#C29342', '#FAF6F0', '#34221A'],
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF6F0] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EADDCF] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#9E472A]" />
              <h2 className="font-cinzel text-base font-bold text-[#2C2420] tracking-wider uppercase">
                YOUR SHOPPING BAG ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 text-[#685C54] hover:text-[#9E472A] rounded-full hover:bg-[#F3E8DB] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#F4E9DD] border-b border-[#E3D3C1]">
            <div className="flex items-center justify-between text-xs text-[#523A30] mb-1.5 font-medium">
              {amountNeededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#9E472A]">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <span className="font-semibold text-[#9E472A]">FREE Express Shipping</span>
                </span>
              ) : (
                <span className="text-[#2D6A4F] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  You've qualified for FREE Express Shipping!
                </span>
              )}
              <span className="text-[11px] font-mono">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-[#DFCBB8] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#9E472A] h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {orderCompleted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[#F3E8DB] text-[#9E472A] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-[#2C2420]">
                  ORDER PLACED SUCCESSFULLY!
                </h3>
                <p className="text-xs text-[#685C54] max-w-xs mx-auto">
                  Thank you for celebrating handcrafted luxury. Your artisan confirmation and tracking link have been dispatched.
                </p>
                <div className="p-3 bg-white border border-[#EADDCF] rounded text-xs text-[#523A30]">
                  Order Reference: <span className="font-mono font-bold text-[#9E472A]">#LSW-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <button
                  onClick={() => {
                    onClearCart();
                    setOrderCompleted(false);
                    onClose();
                  }}
                  className="px-6 py-3 bg-[#9E472A] text-white text-xs font-cinzel font-semibold tracking-wider rounded uppercase"
                >
                  Continue Browsing
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#F3E8DB] text-[#9E472A] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-cinzel text-base font-semibold text-[#2C2420]">Your bag is currently empty</h3>
                <p className="text-xs text-[#7A6F68] max-w-xs mx-auto">
                  Discover timeless handloom drapes, handcrafted kurtas, and artisanal essentials.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#9E472A] text-white text-xs font-cinzel font-semibold tracking-wider rounded uppercase"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-white rounded-md border border-[#EADDCF] shadow-xs"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-24 bg-[#EFE5D8] rounded overflow-hidden shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-cinzel text-xs font-semibold text-[#2C2420] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#9E472A] hover:text-[#7A3119] p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-[#7A6F68] mt-0.5 space-x-2">
                          <span>Size: <strong className="text-[#2C2420]">{item.selectedSize}</strong></span>
                          <span>•</span>
                          <span>{item.product.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#DFCBB8] rounded bg-[#FAF6F0]">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 hover:bg-[#EBD8C4] text-[#523A30] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-medium text-[#2C2420]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 hover:bg-[#EBD8C4] text-[#523A30] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-serif-luxury text-sm font-bold text-[#2C2420]">
                          ₹ {(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code Accordion */}
                <div className="pt-2">
                  {currentUser ? (
                    <div className="mb-2 p-2.5 bg-[#FAF6F0] border border-[#DFCBB8] rounded flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#9E472A]" />
                        <div>
                          <p className="font-bold text-[#2C2420] text-[11px] leading-tight">
                            Logged in as {currentUser.name}
                          </p>
                          <p className="text-[10px] text-[#7A6F68]">
                            {currentUser.tier} • {currentUser.couturePoints} Couture Points
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                        Member Perks Active
                      </span>
                    </div>
                  ) : (
                    onOpenCustomerLogin && (
                      <button
                        type="button"
                        onClick={onOpenCustomerLogin}
                        className="w-full mb-2 p-2 bg-[#F3EBE1] hover:bg-[#EADDCF] border border-dashed border-[#9E472A] rounded text-left flex items-center justify-between text-xs text-[#523A30] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#9E472A]" />
                          <span className="text-[11px]">Sign in to earn <strong>500 Couture Points</strong></span>
                        </div>
                        <span className="text-[10px] text-[#9E472A] font-bold underline">Sign In</span>
                      </button>
                    )
                  )}

                  <form onSubmit={handleApplyPromo} className="space-y-1.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9E472A]" />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Coupon (e.g. WELCOME10)"
                          className="w-full pl-8 pr-3 py-2 bg-white border border-[#DFCBB8] rounded text-xs text-[#2C2420] uppercase placeholder:normal-case focus:outline-none focus:border-[#9E472A]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#9E472A] text-white text-xs font-cinzel font-semibold tracking-wider rounded uppercase hover:bg-[#7E331B]"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedPromo && (
                      <div className="flex items-center justify-between text-xs text-[#2D6A4F] bg-[#EAF5EC] px-2.5 py-1.5 rounded">
                        <span>Coupon <strong>{appliedPromo}</strong> applied!</span>
                        <button 
                          type="button" 
                          onClick={() => setAppliedPromo(null)}
                          className="text-[11px] underline text-[#9E472A]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {promoError && (
                      <p className="text-[11px] text-[#D90429]">{promoError}</p>
                    )}
                  </form>
                </div>

                {/* Luxury Gift Packaging Option */}
                <label className="flex items-start gap-2 p-3 bg-white border border-[#EADDCF] rounded cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isGiftWrap}
                    onChange={(e) => setIsGiftWrap(e.target.checked)}
                    className="mt-0.5 rounded text-[#9E472A] focus:ring-[#9E472A]"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-[#2C2420] flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-[#9E472A]" />
                      Artisanal Gift Box & Wax-Sealed Note (+ ₹150)
                    </span>
                    <p className="text-[11px] text-[#7A6F68] mt-0.5">
                      Packaged in raw silk dustbags with personalized handwritten calligraphy message.
                    </p>
                  </div>
                </label>

                {/* Special Instructions */}
                <div>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Add special sizing notes or atelier customization instructions..."
                    className="w-full p-2.5 bg-white border border-[#DFCBB8] rounded text-xs text-[#2C2420] placeholder-[#8A7E75] focus:outline-none focus:border-[#9E472A]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Order Summary & Checkout */}
          {items.length > 0 && !orderCompleted && (
            <div className="p-4 sm:p-5 bg-white border-t border-[#EADDCF] space-y-3">
              <div className="space-y-1.5 text-xs text-[#685C54]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-serif-luxury font-semibold text-[#2C2420]">₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2D6A4F]">
                    <span>Discount ({appliedPromo})</span>
                    <span>- ₹ {discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {isGiftWrap && (
                  <div className="flex justify-between">
                    <span>Artisanal Gift Wrap</span>
                    <span>₹ {giftWrapCost}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-[#2D6A4F]">FREE</strong> : `₹ ${shippingFee}`}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#F0E7DC] font-bold text-sm text-[#2C2420]">
                  <span className="font-cinzel tracking-wider">TOTAL</span>
                  <span className="font-serif-luxury text-base text-[#9E472A]">₹ {finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 bg-[#9E472A] hover:bg-[#85371D] text-white rounded-xs font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-75"
              >
                {isCheckingOut ? (
                  <span>PROCESSING ATELIER ORDER...</span>
                ) : (
                  <>
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8C7E74]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9E472A]" />
                <span>100% Genuine Handcrafted Weaves • 15 Days Easy Returns</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
