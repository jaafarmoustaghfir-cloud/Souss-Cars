import React from 'react';
import { 
  BadgePercent, 
  Sparkles, 
  MapPin, 
  Headphones, 
  FileCheck, 
  Fuel, 
  Car, 
  Plane 
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: BadgePercent,
      title: 'Prix Les Plus Compétitifs',
      description: 'Location à partir de 250 DH/jour seulement. Aucun frais caché : le tarif annoncé est le tarif payé à la remise des clés.'
    },
    {
      icon: Car,
      title: 'Voitures Récentes & Bien Entretenues',
      description: 'Notre flotte (Dacia Logan, Dacia Duster, Renault Clio 4) bénéficie de révisions techniques régulières et d’un nettoyage complet avant chaque départ.'
    },
    {
      icon: Plane,
      title: 'Livraison Rapide à l’Aéroport Al Massira',
      description: 'Accueil personnalisé dès la sortie du terminal ou livraison à votre hôtel/riad à Agadir, Taghazout et Hay Elhouda sans attente.'
    },
    {
      icon: MapPin,
      title: 'Agence Locale à Agadir (Hay Elhouda)',
      description: 'Une présence physique locale forte au cœur d’Agadir pour vous assister à tout moment et vous conseiller les meilleurs itinéraires du Souss.'
    },
    {
      icon: FileCheck,
      title: 'Contrat Clair & Assurance Incluse',
      description: 'Formalités simples en 5 minutes : permis de conduire + pièce d’identité. Assurance tous risques et assistance dépannage comprises.'
    },
    {
      icon: Headphones,
      title: 'Support & Assistance 7j/7',
      description: `Disponibles par WhatsApp et appel au ${BUSINESS_INFO.phonePrimary} pour prolonger une location, modifier un horaire ou toute question.`
    }
  ];

  return (
    <section id="why-us" className="py-20 px-4 sm:px-6 bg-[#111111] border-y border-zinc-800 relative">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181818] border border-[#F5C518]/30 text-[#F5C518] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            L'Excellence Sky Souss Cars
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Pourquoi Nous Choisir à Agadir ?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Votre partenaire de confiance pour un séjour sans mauvaise surprise dans le sud marocain.
          </p>
        </div>

        {/* 6 Reasons Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#161616] border border-zinc-800/80 hover:border-[#F5C518]/60 transition-all duration-300 hover:-translate-y-1 space-y-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F5C518]/10 border border-[#F5C518]/30 text-[#F5C518] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-heading group-hover:text-[#F5C518] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
