import React, { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  ChevronDown, 
  CreditCard, 
  Key, 
  ShieldCheck, 
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

export const RentalConditions: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const conditions = [
    {
      icon: UserCheck,
      title: 'Âge & Permis de Conduire',
      desc: 'Conducteur âgé d’au moins 21 ans et titulaire d’un permis de conduire valide depuis plus de 1 an (marocain ou international).'
    },
    {
      icon: FileText,
      title: 'Documents Requis',
      desc: 'Présentation de l’original du permis de conduire et de la Carte Nationale d’Identité (CIN) ou Passeport en cours de validité.'
    },
    {
      icon: CreditCard,
      title: 'Caution & Paiement',
      desc: 'Paiement en espèces ou par carte bancaire à la livraison. Caution remboursable par empreinte bancaire ou chèque selon accord.'
    },
    {
      icon: ShieldCheck,
      title: 'Carburant & Kilométrage',
      desc: 'Kilométrage illimité inclus pour tous les véhicules. Restitution avec le même niveau de carburant qu’au départ.'
    }
  ];

  const faqs = [
    {
      q: 'Comment se passe la livraison à l’Aéroport Agadir Al Massira ?',
      a: 'Notre agent vous attend à la sortie des arrivées avec votre véhicule prêt. Les formalités et le contrat se font sur place en moins de 5 minutes pour que vous puissiez prendre la route sans délai.'
    },
    {
      q: 'Y a-t-il des frais supplémentaires pour un second conducteur ?',
      a: 'Non, chez Sky Souss Cars, l’ajout d’un deuxième conducteur est totalement gratuit sur simple présentation de son permis de conduire lors de la signature du contrat.'
    },
    {
      q: 'Puis-je voyager en dehors d’Agadir (Marrakech, Taghazout, Essaouira, Sud) ?',
      a: 'Oui, tous nos contrats incluent le kilométrage illimité et vous permettent de circuler librement partout sur le territoire marocain.'
    },
    {
      q: 'Comment réserver rapidement sans carte bancaire ?',
      a: `Il vous suffit de nous contacter sur WhatsApp au ${BUSINESS_INFO.phonePrimary} en précisant vos dates et le véhicule souhaité. La réservation est bloquée instantanément et vous réglez à la réception du véhicule.`
    }
  ];

  return (
    <section id="conditions" className="py-20 px-4 sm:px-6 bg-[#0D0D0D] relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Conditions Section */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight font-heading">
              Conditions de Location Simples & Transparentes
            </h2>
            <p className="text-zinc-400 text-sm">
              Tout est pensé pour une expérience fluide et sans prise de tête dès votre arrivée à Agadir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {conditions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-[#141414] border border-zinc-800 space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5C518]/10 text-[#F5C518] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base font-heading">
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181818] border border-[#F5C518]/30 text-[#F5C518] text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              Foire Aux Questions
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Questions Fréquemment Posées
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#141414] border border-zinc-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-[#F5C518] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#F5C518] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 border-t border-zinc-800/80 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
