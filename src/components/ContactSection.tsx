import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Mail, 
  Send, 
  Sparkles, 
  CheckCircle2,
  Navigation,
  Instagram,
  ExternalLink
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to WhatsApp with message
    const msg = `Bonjour Sky Souss Cars, je m'appelle ${formData.name} (${formData.phone}). Message : ${formData.message}`;
    window.open(`https://wa.me/${BUSINESS_INFO.phonePrimaryRaw}?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 bg-[#111111] border-t border-zinc-800 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181818] border border-[#F5C518]/30 text-[#F5C518] text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            Nous Trouver & Nous Contacter
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Agence Sky Souss Cars à Agadir
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Situé à Hay Elhouda, Agadir avec service de livraison rapide à l'Aéroport Al Massira et dans tous les hôtels de la région.
          </p>
        </div>

        {/* Content Grid: Info Cards + Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Details & Quick Form */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Details Card */}
            <div className="p-6 rounded-2xl bg-[#161616] border border-zinc-800 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white font-heading border-b border-zinc-800 pb-3 flex items-center justify-between">
                <span>Coordonnées Officielles</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#F5C518]/10 text-[#F5C518] border border-[#F5C518]/30 font-bold">
                  Agadir
                </span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Primary Phone / WhatsApp */}
                <a
                  href={`tel:${BUSINESS_INFO.phonePrimaryRaw}`}
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F5C518]/10 text-[#F5C518] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[11px]">Téléphone Principal / Réservation</div>
                    <div className="text-white font-extrabold text-base group-hover:text-[#F5C518] transition-colors font-heading">
                      {BUSINESS_INFO.phonePrimary}
                    </div>
                  </div>
                </a>

                {/* WhatsApp Channel Card */}
                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-[#25D366]/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5 fill-[#25D366]/30" />
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[11px]">WhatsApp Officiel (Chat direct 24/7)</div>
                    <div className="text-[#25D366] font-extrabold text-sm flex items-center gap-1 group-hover:underline">
                      <span>06 65 86 86 00</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </a>

                {/* Instagram Channel Card */}
                <a
                  href={BUSINESS_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-[#E1306C]/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#FD1D1D]/20 via-[#E1306C]/20 to-[#C13584]/20 text-[#E1306C] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[11px]">Page Instagram Officielle</div>
                    <div className="text-white group-hover:text-[#E1306C] font-extrabold text-sm flex items-center gap-1 transition-colors">
                      <span>@skysousscars</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                    </div>
                  </div>
                </a>

                {/* Secondary Phone */}
                <a
                  href={`tel:${BUSINESS_INFO.phoneSecondaryRaw}`}
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[11px]">Téléphone Secondaire</div>
                    <div className="text-white font-bold text-sm">
                      {BUSINESS_INFO.phoneSecondary}
                    </div>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="w-10 h-10 rounded-lg bg-[#F5C518]/10 text-[#F5C518] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[11px]">Adresse de l'Agence</div>
                    <div className="text-white font-bold">
                      {BUSINESS_INFO.address}
                    </div>
                    <div className="text-zinc-400 text-[11px] mt-0.5">
                      Livraison disponible : Aéroport Al Massira, Taghazout, Centre Agadir
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="w-10 h-10 rounded-lg bg-[#F5C518]/10 text-[#F5C518] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-zinc-400 text-[11px]">Horaires d'Ouverture</div>
                    <div className="text-white font-bold">
                      7 jours / 7 : 08h00 - 22h00
                    </div>
                    <div className="text-[#F5C518] text-[11px] font-semibold">
                      Assistance téléphonique 24h/24
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Big CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-zinc-950 font-black text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all hover:scale-102"
                >
                  <MessageCircle className="w-5 h-5 fill-zinc-950" />
                  <span>WhatsApp Direct</span>
                </a>

                <a
                  href={BUSINESS_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-95 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all hover:scale-102"
                >
                  <Instagram className="w-5 h-5" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Embed (Hay Elhouda, Agadir) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[16/11] shadow-2xl">
              {/* Google Maps Embed iframe */}
              <iframe
                title="Localisation Sky Souss Cars Hay Elhouda Agadir"
                src={BUSINESS_INFO.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Floating Overlay Badge with Address */}
              <div className="absolute top-4 left-4 p-3.5 rounded-xl bg-[#0D0D0D]/95 backdrop-blur-md border border-[#F5C518]/40 shadow-xl max-w-xs">
                <div className="flex items-center gap-2 text-[#F5C518] font-bold text-xs font-heading">
                  <Navigation className="w-4 h-4" />
                  <span>Sky Souss Cars Agadir</span>
                </div>
                <p className="text-zinc-300 text-xs mt-1">
                  Hay Elhouda, Agadir, Maroc
                </p>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Livraison Aéroport & Hôtels 7j/7
                </div>
              </div>
            </div>

            {/* Sub banner under map */}
            <div className="p-4 rounded-xl bg-[#161616] border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F5C518]" />
                <span>Prise en charge directe à l'Aéroport Al Massira sans surcoût</span>
              </div>
              <a
                href={`https://maps.google.com/?q=Hay+El+Houda+Agadir`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5C518] hover:underline font-bold"
              >
                Ouvrir dans Google Maps ➜
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

