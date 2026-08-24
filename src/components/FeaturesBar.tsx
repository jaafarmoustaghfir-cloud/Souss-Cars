import React from 'react';
import { Tag, Truck, ShieldCheck, Clock8 } from 'lucide-react';

export const FeaturesBar: React.FC = () => {
  const features = [
    {
      icon: Tag,
      title: 'Prix Dès 250 DH/Jour',
      desc: 'Tarifs transparents sans frais cachés'
    },
    {
      icon: Truck,
      title: 'Livraison Possible',
      desc: 'Aéroport Agadir, Hôtels & Hay Elhouda'
    },
    {
      icon: ShieldCheck,
      title: 'Assurance Incluse',
      desc: 'Tous risques & assistance dépannage'
    },
    {
      icon: Clock8,
      title: 'Disponible 7j/7',
      desc: 'Service client réactif et assistance 24/24'
    }
  ];

  return (
    <section className="bg-[#141414] border-y border-zinc-800/80 py-8 px-4 sm:px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#191919] border border-zinc-800 hover:border-[#F5C518]/40 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#F5C518]/10 border border-[#F5C518]/30 flex items-center justify-center text-[#F5C518]">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight font-heading">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
