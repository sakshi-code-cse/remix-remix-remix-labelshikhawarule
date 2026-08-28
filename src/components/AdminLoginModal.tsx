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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A050B]/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="admin-login-modal-panel"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#EAC8CE] overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Maroon Gradient Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#4A0E17] via-[#851628] to-[#B31D36]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7E4A53] hover:text-[#4A0E17] hover:bg-[#FDF2F4] rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <BrandLogo size="md" />
            <div className="mt-3 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FCF0F2] text-[#7A1526] border border-[#F3D5DB] text-[11px] font-cinzel font-bold tracking-wider uppercase shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#851628]" />
              <span>Atelier Admin Portal</span>
            </div>
            <p className="mt-2 text-xs text-[#6B474E] max-w-xs">
              Secure administrative access for Label Shikha Warule inventory, orders, consultations, and analytics.
            </p>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-[#FCF4F6] border border-[#F3D5DB] text-xs text-[#4A0E17] flex items-center justify-between gap-3 shadow-2xs">
            <div>
              <p className="font-semibold flex items-center gap-1.5 text-[#7A1526]">
                <Sparkles className="w-3.5 h-3.5 text-[#991B30]" /> Demo Admin Access
              </p>
              <p className="text-[11px] text-[#7E4A53] mt-0.5 font-mono">
                admin@shikhawarule.com / atelier2026
              </p>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="shrink-0 px-3 py-1.5 bg-[#7A1526] hover:bg-[#61101E] text-white text-[11px] font-cinzel font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A0E17] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A87E86]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shikhawarule.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DFBAC2] rounded-lg text-sm text-[#2A050B] placeholder-[#B59199] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A0E17] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A87E86]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#DFBAC2] rounded-lg text-sm text-[#2A050B] placeholder-[#B59199] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A87E86] hover:text-[#4A0E17]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#6B474E]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-[#DFBAC2] text-[#7A1526] focus:ring-[#7A1526]"
                />
                <span>Remember session</span>
              </label>
              <span className="text-[#7A1526] font-medium hover:underline cursor-pointer">
                Atelier 2FA Enabled
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#7A1526] via-[#851628] to-[#991B30] hover:from-[#61101E] hover:via-[#701221] hover:to-[#801426] text-white font-cinzel font-semibold text-xs tracking-widest uppercase rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
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
          <div className="mt-6 pt-4 border-t border-[#F0D5DA] flex items-center justify-center gap-2 text-[11px] text-[#7E4A53]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7A1526]" />
            <span>256-Bit SSL Encrypted Administrative Console</span>
          </div>
        </div>
      </div>
    </div>
  );
};
