import React, { useState } from 'react';
import { 
  Car, 
  Calendar, 
  MapPin, 
  Search, 
  Phone, 
  Shield, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Sparkles,
  ArrowRight,
  PlaneTakeoff,
  MessageCircle,
  Instagram
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';
import { useApp } from '../context/AppContext';

export const Hero: React.FC = () => {
  const { setActiveCategory } = useApp();

  const [selectedCat, setSelectedCat] = useState<string>('Toutes');
  const [pickupDate, setPickupDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);

  const heroShowcaseCars = [
    {
      name: 'Dacia Logan',
      category: 'Économique',
      price: 250,
      image: 'https://i.imgur.com/lpH5TdO.jpeg',
      badge: 'Bestseller Agadir'
    },
    {
      name: 'Dacia Duster',
      category: 'SUV & Confort',
      price: 400,
      image: 'https://i.imgur.com/uQeraUN.jpeg',
      badge: 'SUV Polyvalent'
    },
    {
      name: 'Renault Clio 4',
      category: 'Citadine Dynamique',
      price: 250,
      image: 'https://i.imgur.com/GitUGDV.jpeg',
      badge: 'Économique & Compacte'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCat !== 'Toutes') {
      setActiveCategory(selectedCat);
    }
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCatalog = () => {
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentCar = heroShowcaseCars[activeHeroIndex];

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-center bg-[#0D0D0D] overflow-hidden pt-8 pb-16">
      {/* Geometric Ambient Background Gradients & Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#F5C518]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-[#F5C518]/5 rounded-full blur-[120px]" />
        {/* Subtle geometric grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Call To Action */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Local Location Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-[#F5C518]/30 shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5C518] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5C518]"></span>
              </span>
              <span className="text-xs font-bold text-zinc-200 tracking-wide">
                AGADIR & SOUSS · HAY ELHOUDA & AÉROPORT
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight font-heading">
              Louez Votre Voiture à Agadir, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] via-[#ffd644] to-[#f5c518]">
                À Partir de 250 DH/jour
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
              Profitez d'un parc automobile récent (Dacia Logan, Dacia Duster, Renault Clio 4) avec 
              <strong className="text-white"> livraison gratuite à l'Aéroport Al Massira</strong>, à votre hôtel ou à Hay Elhouda. 
              Réservation instantanée sans démarche compliquée.
            </p>

            {/* Key Value Badges */}
            <div className="flex flex-wrap gap-3 pt-2 text-xs sm:text-sm font-semibold text-zinc-300">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414] border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-[#F5C518]" />
                <span>Assurance tous risques incluse</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414] border border-zinc-800">
                <PlaneTakeoff className="w-4 h-4 text-[#F5C518]" />
                <span>Livraison Aéroport 7j/7</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414] border border-zinc-800">
                <Zap className="w-4 h-4 text-[#F5C518]" />
                <span>Kilométrage illimité</span>
              </div>
            </div>

            {/* Main Action Buttons with WhatsApp and Instagram */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={scrollToCatalog}
                className="flex items-center gap-2.5 bg-[#F5C518] text-[#0D0D0D] hover:bg-[#ffe053] font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-xl shadow-[#F5C518]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer font-heading"
              >
                <span>Voir le Parc</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Direct WhatsApp Button */}
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-zinc-950 font-black text-sm sm:text-base px-5 py-3.5 rounded-xl shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-zinc-950" />
                <span>WhatsApp</span>
              </a>

              {/* Instagram Button */}
              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-[#181818] hover:bg-[#222222] text-white font-bold text-sm sm:text-base px-5 py-3.5 rounded-xl border border-zinc-700 transition-all hover:border-[#E1306C]/60 hover:scale-105 active:scale-95"
              >
                <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] flex items-center justify-center text-white">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Showcase Vehicle Image with Dynamic Switcher */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* Vehicle Showcase Card */}
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#141414] group">
              <img
                src={currentCar.image}
                alt={`Sky Souss Cars - ${currentCar.name}`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-85" />
              
              {/* Floating Highlight Card */}
              <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl bg-[#0D0D0D]/90 backdrop-blur-md border border-[#F5C518]/30 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#F5C518]">
                    {currentCar.badge}
                  </div>
                  <div className="text-base font-extrabold text-white">
                    {currentCar.name}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {currentCar.category} · Climatisée & Entretenue
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-zinc-400">À partir de</div>
                  <div className="text-xl font-black text-[#F5C518]">
                    {currentCar.price} <span className="text-xs font-semibold text-white">DH/j</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Fleet Carousel Selectors */}
            <div className="flex items-center gap-2 mt-4">
              {heroShowcaseCars.map((car, idx) => (
                <button
                  key={car.name}
                  onClick={() => setActiveHeroIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeHeroIndex === idx
                      ? 'bg-[#F5C518] text-[#0D0D0D] shadow-md scale-105'
                      : 'bg-[#181818] text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span>{car.name}</span>
                  <span className="text-[10px] opacity-80">({car.price} DH)</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Quick Booking Search Box (Bottom of Hero) */}
        <div className="mt-12 p-5 sm:p-7 rounded-2xl bg-[#141414] border border-zinc-800 shadow-2xl">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            {/* Category Select */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#F5C518]" />
                Catégorie de voiture
              </label>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-[#F5C518] transition-colors"
              >
                <option value="Toutes">Toutes les catégories</option>
                <option value="Économique">Économique (Dacia Logan, Clio 4 - 250 DH)</option>
                <option value="SUV">SUV (Dacia Duster - 400 DH)</option>
                <option value="Moyenne Gamme">Moyenne Gamme</option>
                <option value="Luxe">Luxe & Berline</option>
              </select>
            </div>

            {/* Pickup Date */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#F5C518]" />
                Date de départ
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#F5C518] transition-colors"
              />
            </div>

            {/* Return Date */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#F5C518]" />
                Date de retour
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={pickupDate || new Date().toISOString().split('T')[0]}
                className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#F5C518] transition-colors"
              />
            </div>

            {/* Submit Filter Button */}
            <div className="lg:col-span-3">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#F5C518] text-[#0D0D0D] hover:bg-[#ffe053] font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 font-heading cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Rechercher les Véhicules</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

