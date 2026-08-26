import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, ArrowLeft, ShieldCheck, Car } from 'lucide-react';
import { Logo } from '../Logo';
import { useApp } from '../../context/AppContext';

export const AdminLogin: React.FC = () => {
  const { setIsAdminLoggedIn, setCurrentView, setAdminTab } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Valid credentials: zac / 2007
      const cleanUser = username.trim().toLowerCase();
      const cleanPass = password.trim();

      if (cleanUser === 'zac' && cleanPass === '2007') {
        setError('');
        setAdminTab('overview');
        setIsAdminLoggedIn(true);
      } else {
        setError('Nom d’utilisateur ou mot de passe incorrect. Veuillez réessayer.');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F5C518]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Return to public site button */}
      <button
        onClick={() => setCurrentView('public')}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-[#F5C518] bg-zinc-900/80 px-3.5 py-2 rounded-xl border border-zinc-800 transition-colors z-20 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour au Site Public</span>
      </button>

      {/* Card container */}
      <div className="relative w-full max-w-md bg-[#121212] border border-zinc-800 rounded-3xl p-8 shadow-2xl z-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" variant="light" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white tracking-tight font-heading">
              Espace Administrateur
            </h2>
            <p className="text-xs text-zinc-400">
              Connexion sécurisée pour la gestion de Sky Souss Cars
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#F5C518]" />
              Nom d'utilisateur
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="zac"
              autoComplete="username"
              className="w-full bg-[#181818] border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C518] transition-colors placeholder-zinc-500"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#F5C518]" />
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoComplete="current-password"
              className="w-full bg-[#181818] border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C518] transition-colors placeholder-zinc-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-[#ffe053] text-[#0D0D0D] font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all hover:scale-102 active:scale-98 font-heading disabled:opacity-50 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Connexion en cours...' : 'Se Connecter'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
