import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Instagram, 
  ArrowUp, 
  Lock, 
  Mail,
  Code2,
  Sparkles,
  ArrowRight
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
    <footer id="main-footer" className="bg-[#0A0A0A] text-zinc-400 text-xs border-t border-zinc-800/80">
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
              id="footer-instagram-link"
              href={BUSINESS_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#E1306C] hover:bg-gradient-to-tr hover:from-[#FD1D1D] hover:via-[#E1306C] hover:to-[#C13584] flex items-center justify-center transition-all shadow-sm"
              title="Instagram @skysousscars"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              id="footer-whatsapp-agency-link"
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-950 hover:bg-[#25D366] hover:border-[#25D366] flex items-center justify-center transition-all shadow-sm"
              title="WhatsApp Sky Souss Cars"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>
            <a
              id="footer-phone-agency-link"
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

      {/* Developer Signature & Contact Section */}
      <div className="border-t border-zinc-800/80 bg-gradient-to-b from-[#0e0e0e] to-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div 
            id="developer-showcase-card"
            className="relative rounded-2xl bg-zinc-900/80 border border-zinc-800/90 p-6 sm:p-8 backdrop-blur-sm overflow-hidden"
          >
            {/* Background subtle decorative glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#25D366]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#F5C518]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left Column: Author info & Hook */}
              <div className="space-y-2.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/90 border border-zinc-700/70 text-zinc-300 text-[11px] font-medium">
                  <Code2 className="w-3.5 h-3.5 text-[#F5C518]" />
                  <span>Site développé par <strong className="text-white font-semibold">Jaafar Moustaghfir</strong> – Développeur Web</span>
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Vous avez un projet ou une idée de site ?</span>
                  <Sparkles className="w-4 h-4 text-[#F5C518] shrink-0" />
                </h3>
                
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Partagez-la avec moi, le professionnalisme est garanti. Conception moderne, performante et sur-mesure pour donner vie à votre activité en ligne.
                </p>
              </div>

              {/* Right Column: Actions (WhatsApp Button + Email Link) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                {/* WhatsApp Button */}
                <a
                  id="developer-whatsapp-btn"
                  href="https://wa.me/212772908456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1fa855] hover:bg-[#25D366] transition-all duration-300 shadow-lg shadow-[#25D366]/15 hover:shadow-[#25D366]/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-[#2ce26e]/30"
                >
                  {/* WhatsApp SVG Icon */}
                  <svg 
                    className="w-5 h-5 fill-current text-white shrink-0 group-hover:scale-110 transition-transform duration-300"
                    viewBox="0 0 24 24" 
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span>Discuter sur WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </a>

                {/* Email Link */}
                <a
                  id="developer-email-link"
                  href="mailto:jaafarmoustaghfir@gmail.com"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-zinc-200 bg-zinc-800/90 hover:bg-zinc-800 hover:text-white border border-zinc-700 hover:border-zinc-600 transition-all duration-200"
                >
                  <Mail className="w-4 h-4 text-[#F5C518] shrink-0" />
                  <span>jaafarmoustaghfir@gmail.com</span>
                </a>
              </div>
            </div>
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

