import React from 'react';
import { MessageCircle, Phone, Instagram } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-auto">
      {/* Tooltip badge */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121212] border border-[#F5C518]/40 shadow-xl text-[11px] font-bold text-white backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span>Contact Rapide Agadir</span>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Floating Instagram Icon Button */}
        <a
          href={BUSINESS_INFO.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-3 rounded-full sm:rounded-2xl bg-[#141414] hover:bg-[#1f1f1f] text-white border border-zinc-700 hover:border-[#E1306C] shadow-2xl transition-all hover:scale-105 active:scale-95 group font-bold text-xs"
          title="Instagram @skysousscars"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] flex items-center justify-center text-white">
            <Instagram className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline ml-2 text-zinc-200 group-hover:text-white">Instagram</span>
        </a>

        {/* Floating WhatsApp CTA Button */}
        <a
          href={BUSINESS_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-zinc-950 p-3.5 sm:px-5 sm:py-3 rounded-full sm:rounded-2xl shadow-2xl shadow-[#25D366]/30 font-black text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 group font-heading"
          title="Discuter sur WhatsApp (+212 665-868600)"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 sm:w-5 sm:h-5 fill-zinc-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-[#25D366]" />
          </div>
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

