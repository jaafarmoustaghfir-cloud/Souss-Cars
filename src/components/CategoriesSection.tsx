import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CategoriesSection: React.FC = () => {
  const { setActiveCategory, vehicles } = useApp();

  const categories = [
    {
      id: 'Économique',
      title: 'Économique',
      startingPrice: 250,
      description: 'Idéale pour la circulation en ville à Agadir, faible consommation de carburant et maniabilité.',
      models: 'Dacia Logan, Renault Clio 4...',
      image: 'https://i.imgur.com/lpH5TdO.jpeg',
      badge: 'Le plus populaire'
    },
    {
      id: 'SUV',
      title: 'SUV & 4x4',
      startingPrice: 400,
      description: 'Position de conduite surélevée, confort et espace bagages pour Taghazout, le désert et les plages.',
      models: 'Dacia Duster...',
      image: 'https://i.imgur.com/uQeraUN.jpeg',
      badge: 'Idéal Aventure & Famille'
    },
    {
      id: 'Moyenne Gamme',
      title: 'Moyenne Gamme',
      startingPrice: 350,
      description: 'Le parfait équilibre entre élégance, confort de route supérieur et finitions modernes.',
      models: 'Renault Clio 4, Berlines...',
      image: 'https://i.imgur.com/GitUGDV.jpeg',
      badge: 'Confort Supérieur'
    },
    {
      id: 'Luxe',
      title: 'Luxe & Prestige',
      startingPrice: 600,
      description: 'Véhicules haut de gamme pour vos événements, rendez-vous d’affaires et séjours d’exception.',
      models: 'Berlines & SUV Premium...',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      badge: 'Prestige VIP'
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
            return (
              <div
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className="group relative rounded-2xl bg-[#141414] border border-zinc-800 hover:border-[#F5C518] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#F5C518]/10 cursor-pointer flex flex-col justify-between"
              >
                {/* Top Image */}
                <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                  
                  {/* Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0D0D0D]/85 backdrop-blur-sm border border-[#F5C518]/30 text-[10px] font-bold text-[#F5C518]">
                    {cat.badge}
                  </span>

                  {count > 0 && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-zinc-900/90 text-[10px] text-zinc-300 font-medium">
                      {count} disponible{count > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between">
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

                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>

                    <div className="text-[11px] text-zinc-500 mt-2 font-medium">
                      Ex : {cat.models}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-bold text-[#F5C518] group-hover:translate-x-1 transition-transform">
                    <span>Explorer cette gamme</span>
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
