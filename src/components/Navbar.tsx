import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Clock, Menu, X, ShieldCheck, UserCheck, Car, Calendar, Instagram } from 'lucide-react';
import { Logo } from './Logo';
import { BUSINESS_INFO } from '../data/initialData';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { setCurrentView, currentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'public') {
      setCurrentView('public');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Accueil', id: 'hero' },
    { label: 'Nos Voitures', id: 'catalog' },
    { label: 'Catégories', id: 'categories' },
    { label: 'Pourquoi Nous', id: 'why-us' },
    { label: 'Conditions', id: 'conditions' },
    { label: 'Contact & Plan', id: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D0D0D]/95 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      {/* Top Info Bar */}
      <div className="bg-[#141414] border-b border-zinc-800 text-xs text-zinc-300 py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left info */}
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a 
              href={`tel:${BUSINESS_INFO.phonePrimaryRaw}`}
              className="flex items-center gap-1.5 text-[#F5C518] font-bold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Réservation rapide : {BUSINESS_INFO.phonePrimary}</span>
            </a>
            <span className="hidden md:inline-flex items-center gap-1 text-zinc-400">
              <MapPin className="w-3 h-3 text-[#F5C518]" />
              {BUSINESS_INFO.address}
            </span>
          </div>

          {/* Social Icons & Admin quick trigger */}
          <div className="flex items-center gap-3">
            {/* Instagram Quick Link */}
            <a
              href={BUSINESS_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-zinc-300 hover:text-[#E1306C] transition-colors py-0.5 px-2 rounded-lg hover:bg-zinc-800"
              title="Suivez Sky Souss Cars sur Instagram"
            >
              <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
              <span className="hidden md:inline text-[11px] font-medium">@skysousscars</span>
            </a>

            {/* WhatsApp Direct Header Link */}
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-zinc-300 hover:text-[#25D366] transition-colors py-0.5 px-2 rounded-lg hover:bg-zinc-800"
              title="Discuter sur WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]/20" />
              <span className="hidden sm:inline text-[11px] font-medium">WhatsApp Direct</span>
            </a>

            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-[#F5C518]/10 text-[#F5C518] font-semibold border border-[#F5C518]/20">
              Dès 250 DH/j
            </span>

            <button
              onClick={() => setCurrentView('admin')}
              className="text-[11px] text-zinc-400 hover:text-[#F5C518] flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-zinc-800"
              title="Accès Espace Administrateur"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Espace Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => scrollToSection('hero')} 
          className="cursor-pointer"
        >
          <Logo size="md" variant="light" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-zinc-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="hover:text-[#F5C518] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#F5C518] hover:after:w-full after:transition-all cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Icon Buttons: Instagram + WhatsApp */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Instagram Button */}
          <a
            href={BUSINESS_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#222222] text-zinc-200 hover:text-white border border-zinc-700/80 hover:border-[#E1306C]/50 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all shadow-sm hover:scale-105 active:scale-95 group"
            title="Page Instagram Officielle Sky Souss Cars"
          >
            <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] flex items-center justify-center text-white shadow-sm">
              <Instagram className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span>Instagram</span>
          </a>

          {/* WhatsApp Action Button */}
          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-zinc-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105 active:scale-95"
            title="Contacter directement sur WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-zinc-950" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 focus:outline-none"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111111] border-b border-zinc-800 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-left py-2 px-3 text-sm font-semibold text-zinc-200 hover:text-[#F5C518] hover:bg-zinc-800/60 rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2.5">
            {/* Mobile WhatsApp Button */}
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-zinc-950 font-bold text-sm py-3 rounded-xl shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-zinc-950" />
              <span>WhatsApp : 06 65 86 86 00</span>
            </a>

            {/* Mobile Instagram Button */}
            <a
              href={BUSINESS_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white font-bold text-sm py-2.5 rounded-xl shadow-md"
            >
              <Instagram className="w-4 h-4" />
              <span>Suivre sur Instagram (@skysousscars)</span>
            </a>

            <div className="flex gap-2">
              <a
                href={`tel:${BUSINESS_INFO.phonePrimaryRaw}`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs py-2.5 rounded-lg border border-zinc-700"
              >
                <Phone className="w-3.5 h-3.5 text-[#F5C518]" />
                <span>Appeler</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentView('admin');
                }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-800/70 text-zinc-300 hover:text-[#F5C518] text-xs py-2.5 rounded-lg border border-zinc-700"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#F5C518]" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

