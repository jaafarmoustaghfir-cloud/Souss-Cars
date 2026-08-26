import React, { useState } from 'react';
import { 
  Users, 
  Fuel, 
  Gauge, 
  Sparkles, 
  Wind, 
  Luggage, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  ChevronRight
} from 'lucide-react';
import { Vehicle } from '../types';
import { BUSINESS_INFO } from '../data/initialData';
import { useApp } from '../context/AppContext';
import { VehicleImagePlaceholder } from './VehicleImagePlaceholder';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { setSelectedVehicle } = useApp();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const hasImages = Array.isArray(vehicle.images) && vehicle.images.length > 0 && vehicle.images.some(img => Boolean(img && img.trim().length > 0));
  const images = hasImages ? vehicle.images : [];

  const isAvailable = vehicle.status === 'Disponible';

  // Construct WhatsApp quick booking URL with pre-filled message
  const waMessage = encodeURIComponent(
    `Bonjour Sky Souss Cars, je souhaite réserver la *${vehicle.name}* (${vehicle.price} DH/jour). Est-elle disponible ? Merci !`
  );
  const waLink = `https://wa.me/${BUSINESS_INFO.phonePrimaryRaw}?text=${waMessage}`;

  return (
    <div 
      id={`vehicle-card-${vehicle.id}`}
      className="group rounded-2xl bg-[#141414] border border-zinc-800 hover:border-[#F5C518] overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-[#F5C518]/10"
    >
      {/* Top Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
        {hasImages ? (
          <>
            <img
              src={images[currentImgIdx]}
              alt={vehicle.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />
          </>
        ) : (
          <VehicleImagePlaceholder text="Photo à venir" iconSize="md" />
        )}

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-[#0D0D0D]/90 backdrop-blur-sm border border-zinc-700 text-xs font-bold text-white tracking-wide">
          {vehicle.category}
        </span>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Disponible
            </span>
          ) : vehicle.status === 'En maintenance' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 text-xs font-bold backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Maintenance
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 text-xs font-bold backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Réservée
            </span>
          )}
        </div>

        {/* Multi-image indicator if more than 1 */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-3 flex gap-1 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImgIdx(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImgIdx ? 'bg-[#F5C518] w-4' : 'bg-white/50 hover:bg-white'
                }`}
                title={`Image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
        <div>
          {/* Header Title & Daily Price */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-[#F5C518] uppercase tracking-wider">
                {vehicle.brand}
              </span>
              <h3 className="text-xl font-bold text-white font-heading group-hover:text-[#F5C518] transition-colors">
                {vehicle.name}
              </h3>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-black text-[#F5C518] font-heading">
                {vehicle.price} <span className="text-xs font-semibold text-zinc-300">DH</span>
              </div>
              <span className="text-[10px] text-zinc-400 block -mt-1">/ jour</span>
            </div>
          </div>

          {/* Quick Features / Specs Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-zinc-800/80 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-zinc-900/80">
              <Gauge className="w-3.5 h-3.5 text-[#F5C518]" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-zinc-900/80">
              <Fuel className="w-3.5 h-3.5 text-[#F5C518]" />
              <span className="truncate">{vehicle.fuel}</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-zinc-900/80">
              <Users className="w-3.5 h-3.5 text-[#F5C518]" />
              <span>{vehicle.seats} places</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-zinc-900/80">
              <Wind className="w-3.5 h-3.5 text-[#F5C518]" />
              <span>Climatisée</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-zinc-800">
          <div className="grid grid-cols-2 gap-2">
            {/* Primary Reservation Form CTA */}
            <button
              onClick={() => setSelectedVehicle(vehicle)}
              className="w-full flex items-center justify-center gap-1.5 bg-[#F5C518] hover:bg-[#ffe053] text-[#0D0D0D] font-extrabold text-xs py-2.5 px-3 rounded-xl shadow-md transition-all hover:scale-102 active:scale-98 text-center font-heading cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Réserver</span>
            </button>

            {/* Direct WhatsApp button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs py-2.5 px-3 rounded-xl border border-zinc-700 transition-colors text-center"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
