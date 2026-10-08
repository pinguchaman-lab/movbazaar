"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  ShieldCheck,
  X,
  Lock,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from "lucide-react";

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, isVip, user, login, logout } =
    useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setSuccessMsg("VIP status activated! All ads have been removed.");
      setTimeout(() => {
        setSuccessMsg(null);
      }, 1500);
    } else {
      setError(result.message || "Invalid VIP credentials.");
    }
  };

  const fillDemoCredentials = () => {
    setEmail("vip@movbazaar.com");
    setPassword("movbazaar2026");
    setError(null);
  };

  const handleLogout = async () => {
    await logout();
    closeLoginModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 text-center pt-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#e50914] to-amber-500 p-0.5 mx-auto shadow-lg shadow-red-950/50">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isVip ? "MovBazaar VIP Active" : "VIP Ad-Free Access"}
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            {isVip
              ? "You are logged in with VIP status. Enjoy completely ad-free streaming."
              : "Enter your administrator-issued VIP credentials to eliminate all ads on movies, shows, and player."}
          </p>
        </div>

        {/* If already logged in as VIP */}
        {isVip ? (
          <div className="space-y-5 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-emerald-300">
                  {user?.plan || "VIP 100% Ad-Free Pass"}
                </div>
                <div className="text-[11px] text-zinc-400 truncate font-mono mt-0.5">
                  {user?.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={closeLoginModal}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold border border-zinc-800 transition-colors"
              >
                Continue Watching
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-2.5 text-xs text-red-300 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                VIP Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@movbazaar.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 text-sm text-zinc-100 placeholder-zinc-500 rounded-xl pl-9 pr-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 text-sm text-zinc-100 placeholder-zinc-500 rounded-xl pl-9 pr-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Quick Demo Helper Pill */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-zinc-500">Testing VIP pass?</span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
              >
                Auto-Fill Demo VIP Pass
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#e50914] to-[#b80710] hover:from-[#f40d1a] hover:to-[#c90812] text-white text-sm font-bold shadow-lg shadow-red-950/60 transition-all disabled:opacity-50 active:scale-[0.99] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Pass...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Unlock Ad-Free VIP</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-zinc-500 text-center pt-2">
              Streaming remains 100% free for everyone. Logging in is optional and simply removes sponsor ads.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
