import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, MapPin, CheckCircle, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useShop();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regPostalCode, setRegPostalCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      setIsAuthModalOpen(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        fullName: regName,
        email: regEmail,
        password: regPassword,
        address: regAddress || undefined,
        city: regCity || undefined,
        postalCode: regPostalCode || undefined,
      });
      setIsAuthModalOpen(false);
      setRegName('');
      setRegEmail('');
      setRegPassword('');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setLoginEmail('admin@thriftandtrend.com');
    setLoginPassword('Admin123!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1F140E]/80 backdrop-blur-md transition-opacity" 
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#C59A6F]/30 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-[#1F140E] p-6 text-white relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-[#FAF7F2]/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#C59A6F]/20 border border-[#C59A6F]/40 flex items-center justify-center p-1 overflow-hidden">
              <img src="/images/logo/badge.jpg" alt="Thrift & Trend" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wider font-semibold uppercase text-[#FAF7F2]">
                Thrift & Trend
              </h2>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#C59A6F] font-medium">
                Where Style Meets Savings
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-5 p-1 bg-white/5 rounded-xl border border-white/10">
            <button
              onClick={() => { setTab('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-medium tracking-wider uppercase rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-[#C59A6F] text-[#1F140E] font-semibold shadow-sm'
                  : 'text-[#FAF7F2]/70 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(null); }}
              className={`flex-1 py-2 text-xs font-medium tracking-wider uppercase rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-[#C59A6F] text-[#1F140E] font-semibold shadow-sm'
                  : 'text-[#FAF7F2]/70 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
              <span>{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#1F140E]/80 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#1F140E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="Enter your customer email"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#1F140E]/15 rounded-xl text-sm text-[#1F140E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C59A6F] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#1F140E]/80">
                    Password
                  </label>
                  <span className="text-[10px] text-[#C59A6F] hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#1F140E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#1F140E]/15 rounded-xl text-sm text-[#1F140E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C59A6F] transition-all"
                  />
                </div>
              </div>

              {/* Admin Quick Login Pill */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-gray-500">
                <span className="flex items-center gap-1 text-[11px] text-stone-500">
                  <span>Authorized Personnel:</span>
                </span>
                <button
                  type="button"
                  onClick={fillAdmin}
                  className="px-2.5 py-1 bg-white border border-[#C59A6F]/60 text-[#C59A6F] hover:bg-[#C59A6F]/10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                >
                  <ShieldAlert className="w-3 h-3 text-[#C59A6F]" />
                  <span>Fill Admin</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-[#1F140E] hover:bg-[#2C1D14] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In With MSSQL</span>
                    <ArrowRight className="w-4 h-4 text-[#C59A6F]" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#1F140E]/80 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#1F140E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#1F140E]/15 rounded-xl text-sm text-[#1F140E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C59A6F] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#1F140E]/80 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#1F140E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="customer@domain.com"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#1F140E]/15 rounded-xl text-sm text-[#1F140E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C59A6F] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#1F140E]/80 mb-1">
                  Create Password (min 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#1F140E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#1F140E]/15 rounded-xl text-sm text-[#1F140E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C59A6F] transition-all"
                  />
                </div>
              </div>

              <div className="pt-1 border-t border-[#1F140E]/10">
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-[#1F140E]/80 mb-1">
                  Shipping Address (For Vault Delivery)
                </label>
                <div className="relative mb-2">
                  <MapPin className="w-4 h-4 text-[#1F140E]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regAddress}
                    onChange={e => setRegAddress(e.target.value)}
                    placeholder="Street Address"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#1F140E]/15 rounded-xl text-sm text-[#1F140E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C59A6F] transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={regCity}
                    onChange={e => setRegCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-3 py-2 bg-white border border-[#1F140E]/15 rounded-xl text-sm text-[#1F140E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C59A6F] transition-all"
                  />
                  <input
                    type="text"
                    value={regPostalCode}
                    onChange={e => setRegPostalCode(e.target.value)}
                    placeholder="Postal Code"
                    className="w-full px-3 py-2 bg-white border border-[#1F140E]/15 rounded-xl text-sm text-[#1F140E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C59A6F] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 bg-[#1F140E] hover:bg-[#2C1D14] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Customer Account</span>
                    <CheckCircle className="w-4 h-4 text-[#C59A6F]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Database & Security Trust Badge */}
          <div className="mt-5 pt-4 border-t border-[#1F140E]/10 flex items-center justify-center gap-2 text-[10px] tracking-wider uppercase text-gray-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#C59A6F]" />
            <span>MSSQL 2025 Express • Bcrypt + JWT Auth</span>
          </div>
        </div>

      </div>
    </div>
  );
};
