import React from 'react';
import { CheckCircle2, Heart, ShoppingBag, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'cart' | 'wishlist' | 'info' | 'success';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#FAF6F0] border-l-4 border-[#9E472A] border-y border-r border-[#DFCBB8] p-3.5 rounded-sm shadow-xl flex items-start justify-between gap-3 transform transition-all duration-300 animate-slide-up"
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'cart' && <ShoppingBag className="w-4 h-4 text-[#9E472A] mt-0.5" />}
            {toast.type === 'wishlist' && <Heart className="w-4 h-4 text-[#9E472A] fill-[#9E472A] mt-0.5" />}
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] mt-0.5" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#9E472A] mt-0.5" />}

            <div className="text-left">
              <h4 className="font-cinzel text-xs font-bold text-[#2C2420]">{toast.title}</h4>
              {toast.description && (
                <p className="text-[11px] text-[#685C54] mt-0.5 font-light">{toast.description}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#8C7E74] hover:text-[#2C2420] p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
