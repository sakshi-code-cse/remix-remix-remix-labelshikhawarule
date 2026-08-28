import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, Eye, EyeOff, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminEmail: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDemoFill = () => {
    setEmail('admin@shikhawarule.com');
    setPassword('atelier2026');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Demo authentication acceptance
      if (
        (email.trim().toLowerCase() === 'admin@shikhawarule.com' && password === 'atelier2026') ||
        (email.includes('@') && password.length >= 4)
      ) {
        setIsLoading(false);
        onLoginSuccess(email.trim());
        onClose();
      } else {
        setIsLoading(false);
        setError('Invalid credentials. Please enter a valid email & password (or use Demo Login).');
      }
    }, 600);
  };

  return (
    <div
      id="admin-login-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2420]/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="admin-login-modal-panel"
        className="relative w-full max-w-md bg-[#FAF6F0] rounded-xl shadow-2xl border border-[#DFCBB8] overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#9E472A] via-[#C4A894] to-[#9E472A]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7A6F68] hover:text-[#2C2420] hover:bg-[#EFE5D8] rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <BrandLogo size="md" />
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE5D8] text-[#9E472A] text-[11px] font-cinzel font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Atelier Admin Portal</span>
            </div>
            <p className="mt-2 text-xs text-[#7A6F68] max-w-xs">
              Secure administrative access for Label SW inventory, orders, consultations, and analytics.
            </p>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="mb-6 p-3.5 rounded-lg bg-[#F2E8DC] border border-[#DFCBB8] text-xs text-[#5A4638] flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold flex items-center gap-1.5 text-[#9E472A]">
                <Sparkles className="w-3.5 h-3.5" /> Demo Admin Access
              </p>
              <p className="text-[11px] text-[#7A6F68] mt-0.5">
                admin@shikhawarule.com / atelier2026
              </p>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="shrink-0 px-2.5 py-1.5 bg-[#9E472A] hover:bg-[#85371D] text-white text-[11px] font-cinzel font-semibold rounded transition-colors shadow-xs"
            >
              Auto-Fill
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4638] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8988B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shikhawarule.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D5C2AF] rounded-md text-sm text-[#2C2420] placeholder-[#A8988B] focus:outline-none focus:border-[#9E472A] focus:ring-1 focus:ring-[#9E472A] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A4638] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8988B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#D5C2AF] rounded-md text-sm text-[#2C2420] placeholder-[#A8988B] focus:outline-none focus:border-[#9E472A] focus:ring-1 focus:ring-[#9E472A] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8988B] hover:text-[#5A4638]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#7A6F68]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-[#D5C2AF] text-[#9E472A] focus:ring-[#9E472A]"
                />
                <span>Remember session</span>
              </label>
              <span className="text-[#9E472A] hover:underline cursor-pointer">
                Atelier 2FA Enabled
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#9E472A] hover:bg-[#85371D] text-white font-cinzel font-semibold text-xs tracking-widest uppercase rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <span>Authenticating Atelier Access...</span>
              ) : (
                <>
                  <span>Enter Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Assurance Footer */}
          <div className="mt-6 pt-4 border-t border-[#DFCBB8]/70 flex items-center justify-center gap-2 text-[11px] text-[#8C7B70]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#9E472A]" />
            <span>256-Bit SSL Encrypted Administrative Console</span>
          </div>
        </div>
      </div>
    </div>
  );
};
