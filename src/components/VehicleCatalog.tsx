import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Sparkles, Car } from 'lucide-react';
import { VehicleCard } from './VehicleCard';
import { useApp } from '../context/AppContext';

export const VehicleCatalog: React.FC = () => {
  const { vehicles, activeCategory, setActiveCategory } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('all');
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'year-desc'>('price-asc');

  const categories = ['Toutes', 'Économique', 'Moyenne Gamme', 'Luxe', 'SUV'];

  // Filtered & Sorted Vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((car) => {
        // Category filter
        if (activeCategory !== 'Toutes' && car.category !== activeCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = car.name.toLowerCase().includes(q);
          const matchBrand = car.brand.toLowerCase().includes(q);
          const matchDesc = car.description.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchDesc) return false;
        }
        // Transmission filter
        if (selectedTransmission !== 'all' && car.transmission !== selectedTransmission) {
          return false;
        }
        // Fuel filter
        if (selectedFuel !== 'all' && car.fuel !== selectedFuel) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'year-desc') return b.year - a.year;
        return 0;
      });
  }, [vehicles, activeCategory, searchQuery, selectedTransmission, selectedFuel, sortBy]);

  return (
    <section id="catalog" className="py-20 px-4 sm:px-6 bg-[#0D0D0D] relative">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181818] border border-[#F5C518]/30 text-[#F5C518] text-xs font-bold uppercase tracking-wider">
              <Car className="w-3.5 h-3.5" />
              Catalogue Réel & Disponible
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              Nos Voitures Disponibles à Agadir
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
              Choisissez votre véhicule et réservez instantanément via WhatsApp ou téléphone. 
              Livraison à l'Aéroport Al Massira et partout à Agadir.
            </p>
          </div>

          {/* Quick Count Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141414] border border-zinc-800 self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5C518] animate-pulse" />
            <span className="text-sm font-bold text-white">
              {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''} disponible{filteredVehicles.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4">
          {/* Categories Pill List */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F5C518] text-[#0D0D0D] shadow-lg shadow-[#F5C518]/20 scale-102'
                      : 'bg-[#181818] text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search & Secondary Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#141414] p-4 rounded-2xl border border-zinc-800">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher (Logan, Duster, Clio...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C518] transition-colors"
              />
            </div>

            {/* Transmission Select */}
            <div>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#F5C518] transition-colors"
              >
                <option value="all">Toutes boîtes</option>
                <option value="Manuelle">Boîte Manuelle</option>
                <option value="Automatique">Boîte Automatique</option>
              </select>
            </div>

            {/* Fuel Select */}
            <div>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#F5C518] transition-colors"
              >
                <option value="all">Tous carburants</option>
                <option value="Essence">Essence</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybride">Hybride</option>
              </select>
            </div>

            {/* Sort Select */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#F5C518] transition-colors"
              >
                <option value="price-asc">Prix : Moins cher d'abord</option>
                <option value="price-desc">Prix : Plus cher d'abord</option>
                <option value="year-desc">Année : Plus récentes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((car) => (
              <VehicleCard key={car.id} vehicle={car} />
            ))}
          </div>
        ) : (
          <div className="py-16 px-4 text-center rounded-2xl bg-[#141414] border border-zinc-800 space-y-4">
            <Car className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-xl font-bold text-white">Aucun véhicule ne correspond à ces critères</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Essayez de réinitialiser vos filtres ou contactez-nous directement sur WhatsApp pour vérifier nos disponibilités.
            </p>
            <button
              onClick={() => {
                setActiveCategory('Toutes');
                setSearchQuery('');
                setSelectedTransmission('all');
                setSelectedFuel('all');
              }}
              className="inline-flex items-center gap-2 bg-[#F5C518] text-[#0D0D0D] font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#ffe053] transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
