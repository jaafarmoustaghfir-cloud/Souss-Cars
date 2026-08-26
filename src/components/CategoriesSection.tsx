import React from 'react';
import { ArrowRight, Sparkles, Car, Shield, Compass, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CategoriesSection: React.FC = () => {
  const { setActiveCategory, vehicles } = useApp();

  const categories = [
    {
      id: 'Économique',
      title: 'Économique',
      startingPrice: 350,
      description: 'Idéale pour la circulation en ville à Agadir, faible consommation de carburant et grande maniabilité.',
      models: 'Dacia Sandero, Logan, Clio',
      badge: 'Le plus populaire',
      icon: Car
    },
    {
      id: 'Moyenne Gamme',
      title: 'Moyenne Gamme',
      startingPrice: 400,
      description: 'Le parfait équilibre entre élégance, confort de route et finitions modernes.',
      models: 'Hyundai Accent, Kia Cerato',
      badge: 'Confort Supérieur',
      icon: Shield
    },
    {
      id: 'SUV',
      title: 'SUV / Luxe',
      startingPrice: 500,
      description: 'Position de conduite surélevée, confort absolu et espace bagages pour Taghazout et les longs trajets.',
      models: 'Volkswagen Touareg',
      badge: 'Prestige & Espace',
      icon: Compass
    },
    {
      id: 'Luxe',
      title: 'Luxe & Prestige',
      startingPrice: 500,
      description: 'Véhicules haut de gamme pour vos événements, rendez-vous d’affaires et séjours d’exception.',
      models: 'Volkswagen Touareg',
      badge: 'Prestige VIP',
      icon: Award
    }
  ];

  const handleSelect = (catId: string) => {
    setActiveCategory(catId);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-20 px-4 sm:px-6 bg-[#0D0D0D] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181818] border border-[#F5C518]/30 text-[#F5C518] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Flotte Adaptée à Vos Besoins
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Nos Catégories de Véhicules
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Trouvez la voiture idéale pour votre séjour touristique ou professionnel à Agadir et dans la région du Souss.
          </p>
        </div>

        {/* Categories Grid (4 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const count = vehicles.filter(v => v.category === cat.id).length;
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className="group relative rounded-2xl bg-[#141414] border border-zinc-800 hover:border-[#F5C518] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#F5C518]/10 cursor-pointer flex flex-col justify-between p-6"
              >
                <div>
                  {/* Top Header with Icon and Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#1d1d1d] border border-zinc-800 group-hover:border-[#F5C518]/40 flex items-center justify-center text-[#F5C518] transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-[#181818] border border-[#F5C518]/30 text-[10px] font-bold text-[#F5C518]">
                      {cat.badge}
                    </span>
                  </div>

                  {/* Title & Price */}
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-lg font-bold text-white font-heading group-hover:text-[#F5C518] transition-colors">
                      {cat.title}
                    </h3>
                    <div className="text-right">
                      <span className="text-[11px] text-zinc-400">dès </span>
                      <span className="text-base font-extrabold text-[#F5C518]">
                        {cat.startingPrice} DH
                      </span>
                      <span className="text-[10px] text-zinc-400">/j</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom Model tag and Action */}
                <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 font-medium">Modèles :</span>
                    <span className="text-zinc-300 font-bold truncate max-w-[140px] text-right">{cat.models}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-[#F5C518] group-hover:translate-x-1 transition-transform">
                    <span>
                      {count > 0 ? `${count} véhicule${count > 1 ? 's' : ''}` : 'Voir les offres'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
