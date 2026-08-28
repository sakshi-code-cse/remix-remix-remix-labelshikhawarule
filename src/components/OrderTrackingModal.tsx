import React from 'react';
import { X, CheckCircle2, Clock, Truck, Package, ShieldCheck, MapPin, Printer } from 'lucide-react';
import { AdminOrder } from '../types';

interface OrderTrackingModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  // Timeline steps
  const steps = [
    { title: 'Order Placed & Verified', desc: `Reserved on ${order.createdAt}`, done: true },
    { title: 'Artisan Loom Assignment', desc: 'Mulberry silk / Khadi assigned to master weaver', done: true },
    { title: 'Handcrafting & Finishing', desc: 'Precision tailoring & hand zardozi stitching', done: order.orderStatus !== 'Pending' },
    { title: 'Quality Assurance & Wax Seal', desc: '14-point craftsmanship inspection', done: ['Shipped', 'Delivered'].includes(order.orderStatus) },
    { title: 'Dispatched with Blue Dart Air', desc: 'Tracking AWB: BDA-8920194829IN', done: order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' },
    { title: 'Delivered', desc: 'Handed to patron in signature dustbag', done: order.orderStatus === 'Delivered' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        
        {/* Backdrop */}
        <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" />

        {/* Modal Window */}
        <div className="relative inline-block w-full max-w-2xl p-6 sm:p-8 my-8 overflow-hidden text-left align-middle bg-[#FAF6F0] rounded-lg shadow-2xl transform transition-all border border-[#DFCBB8]">
          
          <button
            onClick={onClose}
            aria-label="Close tracking"
            className="absolute top-4 right-4 p-2 text-[#2C2420] hover:text-[#9E472A] rounded-full hover:bg-[#F3E8DB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="border-b border-[#DFCBB8] pb-4 mb-6">
            <div className="flex items-center gap-2 text-[#9E472A] text-xs font-cinzel font-bold tracking-widest uppercase mb-1">
              <Truck className="w-4 h-4" />
              <span>Live Atelier Tracking</span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#2C2420]">
              Order #{order.orderNumber}
            </h2>
            <p className="text-xs text-[#7A6F68] mt-0.5">
              Patron: <strong className="text-[#2C2420]">{order.customerName}</strong> • Placed: {order.createdAt}
            </p>
          </div>

          {/* Progress Timeline */}
          <div className="space-y-4 mb-6">
            <h3 className="font-cinzel text-xs font-bold text-[#523A30] uppercase tracking-wider">
              Status Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DFCBB8]">
              {steps.map((s, idx) => (
                <div key={idx} className="relative flex items-start gap-3 text-xs">
                  <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white ${
                    s.done ? 'bg-[#9E472A]' : 'bg-[#D4C3B2]'
                  }`}>
                    {s.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3 h-3 text-[#523A30]" />}
                  </div>
                  <div>
                    <h4 className={`font-cinzel font-semibold ${s.done ? 'text-[#2C2420]' : 'text-[#8A7E75]'}`}>
                      {s.title}
                    </h4>
                    <p className="text-[11px] text-[#7A6F68] mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items In This Order */}
          <div className="p-4 bg-white rounded border border-[#EADDCF] space-y-3 mb-6">
            <h4 className="font-cinzel text-xs font-bold text-[#2C2420] uppercase tracking-wider">
              Items in Parcel ({order.items.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-[#FAF6F0] last:border-none">
                  <div className="flex items-center gap-2.5">
                    <img src={item.image} alt={item.productName} className="w-10 h-12 object-cover rounded" />
                    <div>
                      <p className="font-semibold text-[#2C2420] line-clamp-1">{item.productName}</p>
                      <p className="text-[11px] text-[#7A6F68]">Size: {item.size} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-serif-luxury font-bold text-[#2C2420]">
                    ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#DFCBB8] flex justify-between font-bold text-xs text-[#2C2420]">
              <span>Total Paid:</span>
              <span className="font-serif-luxury text-sm text-[#9E472A]">₹ {order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-[#DFCBB8] bg-white hover:bg-[#FAF6F0] text-xs font-cinzel font-semibold text-[#523A30] rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#9E472A] text-white text-xs font-cinzel font-semibold tracking-wider rounded uppercase hover:bg-[#85371D] cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
