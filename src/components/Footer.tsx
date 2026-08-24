import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Instagram, 
  ShieldCheck, 
  ArrowUp, 
  Lock, 
  Car,
  Heart
} from 'lucide-react';
import { Logo } from './Logo';
import { BUSINESS_INFO } from '../data/initialData';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0A0A] text-zinc-400 text-xs border-t border-zinc-800/80">
      {/* Top Footer Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Brand & Slogan */}
        <div className="space-y-4">
          <Logo size="md" variant="light" showSlogan />
          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
            {BUSINESS_INFO.tagline}. Service de location automobile fiable, économique et rapide avec livraison à l’Aéroport Al Massira et partout à Agadir.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href={BUSINESS_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#E1306C] hover:bg-gradient-to-tr hover:from-[#FD1D1D] hover:via-[#E1306C] hover:to-[#C13584] flex items-center justify-center transition-all shadow-sm"
              title="Instagram @skysousscars"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-950 hover:bg-[#25D366] hover:border-[#25D366] flex items-center justify-center transition-all shadow-sm"
              title="WhatsApp +212 665-868600"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>
            <a
              href={`tel:${BUSINESS_INFO.phonePrimaryRaw}`}
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-[#0D0D0D] hover:bg-[#F5C518] hover:border-[#F5C518] flex items-center justify-center transition-all shadow-sm"
              title="Appeler Direct"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
            Navigation Rapide
          </h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => scrollToSection('hero')} className="hover:text-[#F5C518] transition-colors">
                Accueil
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('catalog')} className="hover:text-[#F5C518] transition-colors">
                Nos Voitures Disponibles
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('categories')} className="hover:text-[#F5C518] transition-colors">
                Catégories de Véhicules
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('why-us')} className="hover:text-[#F5C518] transition-colors">
                Pourquoi Nous Choisir
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('conditions')} className="hover:text-[#F5C518] transition-colors">
                Conditions & Tarifs
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('contact')} className="hover:text-[#F5C518] transition-colors">
                Contact & Plan d’Accès
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Popular Cars in Agadir */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
            Véhicules Phares
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
              <span className="text-zinc-300">Dacia Logan (Berline)</span>
              <span className="text-[#F5C518] font-bold">250 DH/j</span>
            </li>
            <li className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
              <span className="text-zinc-300">Dacia Duster (SUV)</span>
              <span className="text-[#F5C518] font-bold">400 DH/j</span>
            </li>
            <li className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
              <span className="text-zinc-300">Renault Clio 4 (Citadine)</span>
              <span className="text-[#F5C518] font-bold">250 DH/j</span>
            </li>
            <li className="text-[11px] text-zinc-500 pt-1">
              Livraison immédiate à l’Aéroport Al Massira et Hay Elhouda.
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Agence */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
            Agence Agadir
          </h4>
          <div className="space-y-2 text-zinc-300">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#F5C518]" />
              <a href={`tel:${BUSINESS_INFO.phonePrimaryRaw}`} className="hover:text-[#F5C518]">
                {BUSINESS_INFO.phonePrimary}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-[#F5C518]" />
              <a href={`https://wa.me/${BUSINESS_INFO.phonePrimaryRaw}`} target="_blank" rel="noreferrer" className="hover:text-[#F5C518]">
                WhatsApp 7j/7
              </a>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#F5C518] flex-shrink-0 mt-0.5" />
              <span>{BUSINESS_INFO.address}</span>
            </p>
            <p className="text-[11px] text-zinc-400 pt-1">
              Instagram : <strong className="text-white">@skysousscars</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#050505] border-t border-zinc-900 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            © {new Date().getFullYear()} <strong className="text-white">Sky Souss Cars</strong> — Location de voitures à Agadir. Tous droits réservés.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('admin')}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-[#F5C518] transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Espace Admin (/admin)</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#F5C518]" />
              <span>Haut de page</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
