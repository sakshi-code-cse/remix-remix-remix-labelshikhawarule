import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { CustomerUser } from '../types';
import { MOCK_CUSTOMERS } from '../data/mockData';
import { BrandLogo } from './BrandLogo';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (customer: CustomerUser) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'otp'>('login');
  
  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  // OTP Form State
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Check existing mock customers or generate a profile
      const found = MOCK_CUSTOMERS.find((c) => c.email.toLowerCase() === email.toLowerCase());
      if (found) {
        onLoginSuccess(found);
      } else {
        const customUser: CustomerUser = {
          id: `cust-${Date.now()}`,
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          email: email,
          phone: '+91 98000 00000',
          city: 'Mumbai, Maharashtra',
          address: 'Main St, Bandra, Mumbai',
          joinedDate: 'August 2026',
          couturePoints: 200,
          tier: 'Heritage Circle',
          measurements: {
            bust: '34 in',
            waist: '28 in',
            hip: '38 in',
            height: "5'6\"",
          },
        };
        onLoginSuccess(customUser);
      }
      onClose();
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName || !regEmail || !regPassword) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser: CustomerUser = {
        id: `cust-${Date.now()}`,
        name: regName,
        email: regEmail,
        phone: regPhone || '+91 98000 00000',
        city: 'Mumbai, Maharashtra',
        address: 'Bandra West, Mumbai',
        joinedDate: 'August 2026',
        couturePoints: 500, // 500 bonus points on signup
        tier: 'Heritage Circle',
      };
      onLoginSuccess(newUser);
      onClose();
    }, 700);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpPhone || otpPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpCode('5821'); // Pre-fill mock OTP for smooth testing
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('Please enter the 4-digit OTP.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const matched = MOCK_CUSTOMERS.find((c) => c.phone.includes(otpPhone.slice(-4))) || MOCK_CUSTOMERS[0];
      onLoginSuccess(matched);
      onClose();
    }, 500);
  };

  const handleQuickDemoLogin = (user: CustomerUser) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(user);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FAF6F0] rounded-xl max-w-md w-full shadow-2xl border border-[#DFCBB8] overflow-hidden relative animate-scale-up">
        
        {/* Close Button */}
        <button
          id="customer-auth-modal-close"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7A6F68] hover:text-[#2C2420] hover:bg-[#F3EBE1] rounded-full transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="bg-[#2C2420] text-white p-6 pb-5 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(#9E472A_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          <div className="relative z-10 flex flex-col items-center">
            <BrandLogo variant="light" size="sm" className="mb-2" />
            <h2 className="text-lg font-cinzel font-medium text-[#FAF6F0] tracking-wide">
              Atelier Client Portal
            </h2>
            <p className="text-xs text-[#C4A894] font-light mt-0.5 max-w-xs mx-auto">
              Sign in to manage your tailored couture orders, appointments & rewards
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#DFCBB8] bg-[#F3EBE1]/60 text-xs font-cinzel font-semibold">
          <button
            id="tab-customer-signin"
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              tab === 'login'
                ? 'bg-[#FAF6F0] text-[#9E472A] border-b-2 border-[#9E472A]'
                : 'text-[#7A6F68] hover:text-[#2C2420]'
            }`}
          >
            Sign In
          </button>
          <button
            id="tab-customer-register"
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              tab === 'register'
                ? 'bg-[#FAF6F0] text-[#9E472A] border-b-2 border-[#9E472A]'
                : 'text-[#7A6F68] hover:text-[#2C2420]'
            }`}
          >
            Create Account
          </button>
          <button
            id="tab-customer-otp"
            onClick={() => { setTab('otp'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              tab === 'otp'
                ? 'bg-[#FAF6F0] text-[#9E472A] border-b-2 border-[#9E472A]'
                : 'text-[#7A6F68] hover:text-[#2C2420]'
            }`}
          >
            OTP Login
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
              <span className="font-bold">Notice:</span> {errorMsg}
            </div>
          )}

          {/* TAB 1: EMAIL SIGN IN */}
          {tab === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#523A30] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A6F68] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="customer-login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sakshisarode.work001@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFCBB8] focus:border-[#9E472A] rounded text-sm text-[#2C2420] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-[#523A30]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('otp');
                      setErrorMsg('You can quickly sign in with your mobile OTP instead.');
                    }}
                    className="text-[11px] text-[#9E472A] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7A6F68] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="customer-login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFCBB8] focus:border-[#9E472A] rounded text-sm text-[#2C2420] outline-hidden"
                  />
                </div>
              </div>

              <button
                id="customer-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#9E472A] hover:bg-[#83381E] text-white rounded font-cinzel font-semibold text-xs tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Atelier Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#523A30] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7A6F68] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="customer-register-name"
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Sakshi Sarode"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFCBB8] focus:border-[#9E472A] rounded text-sm text-[#2C2420] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#523A30] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A6F68] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="customer-register-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFCBB8] focus:border-[#9E472A] rounded text-sm text-[#2C2420] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#523A30] mb-1">
                  Phone (for Delivery & Fitting updates)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#7A6F68] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="customer-register-phone"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFCBB8] focus:border-[#9E472A] rounded text-sm text-[#2C2420] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#523A30] mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7A6F68] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="customer-register-password"
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFCBB8] focus:border-[#9E472A] rounded text-sm text-[#2C2420] outline-hidden"
                  />
                </div>
              </div>

              <div className="bg-[#F3EBE1] p-2.5 rounded text-[11px] text-[#523A30] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#9E472A] shrink-0" />
                <span>Get <strong>500 Atelier Couture Points</strong> instantly upon signing up!</span>
              </div>

              <button
                id="customer-register-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#9E472A] hover:bg-[#83381E] text-white rounded font-cinzel font-semibold text-xs tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Join Atelier Circle</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: OTP LOGIN */}
          {tab === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#523A30] mb-1">
                      Registered Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#7A6F68] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="customer-otp-phone-input"
                        type="tel"
                        required
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value)}
                        placeholder="e.g. 9820144520"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-[#DFCBB8] focus:border-[#9E472A] rounded text-sm text-[#2C2420] outline-hidden"
                      />
                    </div>
                    <p className="text-[11px] text-[#7A6F68] mt-1">
                      We will send a 4-digit one-time password via SMS.
                    </p>
                  </div>

                  <button
                    id="customer-send-otp-button"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#9E472A] hover:bg-[#83381E] text-white rounded font-cinzel font-semibold text-xs tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Get Instant OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>OTP sent to +91 {otpPhone}. (Demo code pre-filled)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#523A30] mb-1">
                      Enter 4-Digit OTP
                    </label>
                    <input
                      id="customer-otp-code-input"
                      type="text"
                      maxLength={4}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="5821"
                      className="w-full text-center tracking-[0.5em] text-lg font-bold py-2 bg-white border border-[#DFCBB8] focus:border-[#9E472A] rounded text-[#2C2420] outline-hidden"
                    />
                  </div>

                  <button
                    id="customer-verify-otp-button"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#9E472A] hover:bg-[#83381E] text-white rounded font-cinzel font-semibold text-xs tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Verify & Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-[#7A6F68] hover:text-[#9E472A] underline"
                    >
                      Change Mobile Number
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Quick Demo Customer Login Profiles */}
          <div className="mt-6 pt-4 border-t border-[#DFCBB8]">
            <p className="text-[10px] font-cinzel tracking-wider text-[#7A6F68] uppercase mb-2 text-center">
              Quick 1-Click Demo Profiles
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_CUSTOMERS.slice(0, 2).map((demoUser) => (
                <button
                  key={demoUser.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(demoUser)}
                  className="p-2 bg-white hover:bg-[#F3EBE1] border border-[#DFCBB8] hover:border-[#9E472A] rounded text-left transition-all group flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src={demoUser.avatar}
                    alt={demoUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#DFCBB8]"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-[#2C2420] truncate group-hover:text-[#9E472A]">
                      {demoUser.name}
                    </p>
                    <p className="text-[9px] text-[#7A6F68] truncate">
                      {demoUser.tier} • {demoUser.couturePoints} pts
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[10px] text-[#7A6F68] flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#9E472A]" />
              256-Bit SSL Encrypted Atelier Security
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
