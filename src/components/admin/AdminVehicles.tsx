import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Car, 
  Fuel, 
  Gauge, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { Vehicle, VehicleCategory, VehicleStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { AdminVehicleModal } from './AdminVehicleModal';
import { VehicleImagePlaceholder } from '../VehicleImagePlaceholder';

export const AdminVehicles: React.FC = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, setVehicleStatus } = useApp();

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('Toutes');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [failedImgIds, setFailedImgIds] = useState<Record<string, boolean>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = vehicles.filter((car) => {
    if (catFilter !== 'Toutes' && car.category !== catFilter) return false;
    if (statusFilter !== 'all' && car.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return car.name.toLowerCase().includes(q) || car.brand.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (car: Vehicle) => {
    setEditingVehicle(car);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Vehicle, 'id'>) => {
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, data);
    } else {
      addVehicle(data);
    }
    setModalOpen(false);
    setEditingVehicle(null);
  };

  const confirmDelete = (id: string) => {
    deleteVehicle(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Gestion du Parc Automobile
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Ajoutez, modifiez ou mettez à jour les véhicules disponibles à la location à Agadir.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-[#F5C518] hover:bg-[#ffe053] text-[#0D0D0D] font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg transition-all font-heading self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Ajouter un Véhicule</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#141414] rounded-2xl border border-zinc-800">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par modèle ou marque..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl pl-10 pr-3.5 py-2 text-xs focus:outline-none focus:border-[#F5C518]"
          />
        </div>

        {/* Category */}
        <div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#F5C518]"
          >
            <option value="Toutes">Toutes les catégories</option>
            <option value="Économique">Économique</option>
            <option value="SUV">SUV</option>
            <option value="Moyenne Gamme">Moyenne Gamme</option>
            <option value="Luxe">Luxe</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#F5C518]"
          >
            <option value="all">Tous statuts</option>
            <option value="Disponible">Disponible</option>
            <option value="En maintenance">En maintenance</option>
            <option value="Réservée">Réservée</option>
          </select>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((car) => {
          const hasImage = Array.isArray(car.images) && car.images.length > 0 && car.images.some(img => Boolean(img?.trim()));
          const mainImg = hasImage ? car.images[0] : null;

          return (
            <div
              key={car.id}
              className="rounded-2xl bg-[#141414] border border-zinc-800 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-lg"
            >
              {/* Photo & Badge */}
              <div className="relative aspect-[16/10] w-full bg-zinc-900 overflow-hidden flex items-center justify-center">
                {mainImg && !failedImgIds[car.id] ? (
                  <img
                    src={mainImg}
                    alt={car.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setFailedImgIds(prev => ({ ...prev, [car.id]: true }))}
                  />
                ) : (
                  <VehicleImagePlaceholder text="Photo à venir" subtext={car.name} iconSize="md" />
                )}
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-[#0D0D0D]/90 text-xs font-bold text-white border border-zinc-700">
                  {car.category}
                </span>

                {/* Status Toggle Button */}
                <div className="absolute top-3 right-3">
                  <select
                    value={car.status}
                    onChange={(e) => setVehicleStatus(car.id, e.target.value as VehicleStatus)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                      car.status === 'Disponible'
                        ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/40'
                        : car.status === 'En maintenance'
                        ? 'bg-amber-950/90 text-amber-400 border-amber-500/40'
                        : 'bg-rose-950/90 text-rose-400 border-rose-500/40'
                    }`}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En maintenance">En maintenance</option>
                    <option value="Réservée">Réservée</option>
                  </select>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5C518]">
                        {car.brand} · Année {car.year}
                      </span>
                      <h3 className="text-lg font-bold text-white font-heading">
                        {car.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-[#F5C518] font-heading">
                        {car.price} <span className="text-xs text-white">DH</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 block -mt-1">/ jour</span>
                    </div>
                  </div>

                  {/* Quick specs icons */}
                  <div className="grid grid-cols-3 gap-1.5 mt-3 text-[11px] text-zinc-300">
                    <div className="p-1.5 rounded-lg bg-zinc-900 flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-[#F5C518]" />
                      <span className="truncate">{car.transmission}</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-zinc-900 flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-[#F5C518]" />
                      <span className="truncate">{car.fuel}</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-zinc-900 flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#F5C518]" />
                      <span>{car.seats} pl.</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                    {car.description}
                  </p>
                </div>

                {/* Card Bottom Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                  <span className="text-[10px] text-zinc-500">
                    {car.images?.length || 1} photo{(car.images?.length || 1) > 1 ? 's' : ''}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(car)}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 border border-zinc-700 transition-colors"
                      title="Modifier le véhicule"
                    >
                      <Pencil className="w-3.5 h-3.5 text-[#F5C518]" />
                      <span>Modifier</span>
                    </button>

                    <button
                      onClick={() => setDeletingId(car.id)}
                      className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 text-rose-300 text-xs border border-rose-500/30 transition-colors"
                      title="Supprimer le véhicule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-500 text-sm">
            Aucun véhicule trouvé avec ces critères de recherche.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <AdminVehicleModal
          isOpen={modalOpen}
          vehicle={editingVehicle}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingVehicle(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#161616] border border-zinc-800 rounded-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Confirmer la Suppression ?</h3>
            <p className="text-xs text-zinc-400">
              Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold"
              >
                Annuler
              </button>
              <button
                onClick={() => confirmDelete(deletingId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
