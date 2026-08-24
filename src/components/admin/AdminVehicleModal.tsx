import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  Car,
  AlertCircle
} from 'lucide-react';
import { Vehicle, VehicleCategory, TransmissionType, FuelType, VehicleStatus } from '../../types';
import { PRESET_CAR_IMAGES } from '../../data/initialData';

interface AdminVehicleModalProps {
  vehicle?: Vehicle | null;
  onSave: (data: Omit<Vehicle, 'id'>) => void;
  onClose: () => void;
}

export const AdminVehicleModal: React.FC<AdminVehicleModalProps> = ({
  vehicle,
  onSave,
  onClose
}) => {
  const [name, setName] = useState(vehicle?.name || '');
  const [brand, setBrand] = useState(vehicle?.brand || '');
  const [category, setCategory] = useState<VehicleCategory>(vehicle?.category || 'Économique');
  const [price, setPrice] = useState(vehicle?.price || 250);
  const [transmission, setTransmission] = useState<TransmissionType>(vehicle?.transmission || 'Manuelle');
  const [fuel, setFuel] = useState<FuelType>(vehicle?.fuel || 'Essence');
  const [seats, setSeats] = useState(vehicle?.seats || 5);
  const [doors, setDoors] = useState(vehicle?.doors || 5);
  const [year, setYear] = useState(vehicle?.year || new Date().getFullYear());
  const [mileage, setMileage] = useState(vehicle?.mileage || '20 000 km');
  const [status, setStatus] = useState<VehicleStatus>(vehicle?.status || 'Disponible');
  const [description, setDescription] = useState(vehicle?.description || '');
  const [airConditioning, setAirConditioning] = useState(vehicle?.airConditioning ?? true);
  const [luggage, setLuggage] = useState(vehicle?.luggage || 3);
  const [deposit, setDeposit] = useState(vehicle?.deposit || 2000);
  const [images, setImages] = useState<string[]>(
    vehicle?.images || ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80']
  );

  const [newImageUrl, setNewImageUrl] = useState('');
  const [error, setError] = useState('');

  // Handle local file uploads (Multi-photo support)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrlImage = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      copy.unshift(selected);
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !brand.trim()) {
      setError('Veuillez renseigner le nom et la marque du véhicule.');
      return;
    }

    if (price <= 0) {
      setError('Le prix journalier doit être supérieur à 0 DH.');
      return;
    }

    if (images.length === 0) {
      setError('Veuillez ajouter au moins une photo du véhicule.');
      return;
    }

    onSave({
      name: name.trim(),
      brand: brand.trim(),
      category,
      price: Number(price),
      transmission,
      fuel,
      seats: Number(seats),
      doors: Number(doors),
      year: Number(year),
      mileage: mileage.trim(),
      status,
      description: description.trim() || `${brand} ${name} disponible à la location à Agadir chez Sky Souss Cars.`,
      airConditioning,
      luggage: Number(luggage),
      minAge: category === 'Luxe' || category === 'SUV' ? 23 : 21,
      deposit: Number(deposit)
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#141414] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5C518]/10 text-[#F5C518] flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                {vehicle ? 'Modifier le Véhicule' : 'Ajouter un Nouveau Véhicule'}
              </h3>
              <p className="text-xs text-zinc-400">
                Informations techniques, tarifs et photos pour Sky Souss Cars Agadir
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* General Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5C518]">
              1. Informations Générales & Tarifs
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Nom du Modèle *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dacia Logan, Dacia Duster, Renault Clio 4"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Marque *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dacia, Renault"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Catégorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#F5C518]"
                >
                  <option value="Économique">Économique (Dès 250 DH)</option>
                  <option value="SUV">SUV (Dacia Duster...)</option>
                  <option value="Moyenne Gamme">Moyenne Gamme</option>
                  <option value="Luxe">Luxe & Prestige</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Prix Journalier (DH / Jour) *
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-[#F5C518] font-bold rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Statut
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#F5C518]"
                >
                  <option value="Disponible">Disponible (En ligne)</option>
                  <option value="En maintenance">En maintenance</option>
                  <option value="Réservée">Réservée</option>
                </select>
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="space-y-4 pt-2 border-t border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5C518]">
              2. Caractéristiques Techniques
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Boîte
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#F5C518]"
                >
                  <option value="Manuelle">Manuelle</option>
                  <option value="Automatique">Automatique</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Carburant
                </label>
                <select
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value as FuelType)}
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#F5C518]"
                >
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Électrique">Électrique</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Places
                </label>
                <input
                  type="number"
                  min={2}
                  max={9}
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Année
                </label>
                <input
                  type="number"
                  min={2018}
                  max={2030}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Kilométrage
                </label>
                <input
                  type="text"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="Ex: 24 000 km"
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Caution (DH)
                </label>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Capacité Bagages
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={luggage}
                  onChange={(e) => setLuggage(Number(e.target.value))}
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#F5C518]"
                />
              </div>

              <div className="space-y-1 flex items-end">
                <label className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={airConditioning}
                    onChange={(e) => setAirConditioning(e.target.checked)}
                    className="accent-[#F5C518]"
                  />
                  <span>Climatisée (A/C)</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Description / Notes
              </label>
              <textarea
                rows={3}
                placeholder="Description détaillée du véhicule pour le client..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#F5C518] resize-none"
              />
            </div>
          </div>

          {/* Multiple Photos Management */}
          <div className="space-y-4 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5C518]">
                3. Galerie Photos ({images.length} photo{images.length > 1 ? 's' : ''})
              </h4>
              <span className="text-[11px] text-zinc-400">
                La première photo est la photo principale
              </span>
            </div>

            {/* Current Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-zinc-900 border border-zinc-700"
                >
                  <img src={imgUrl} alt={`Car ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-[#F5C518] text-[#0D0D0D] font-extrabold text-[9px] uppercase">
                      Principale
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(idx)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-[#F5C518] hover:text-[#0D0D0D] text-xs font-bold"
                        title="Définir comme principale"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-700 text-rose-200 text-xs"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload or Add Photo Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* File Upload (Multi) */}
              <label className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-900 border border-dashed border-zinc-700 hover:border-[#F5C518] cursor-pointer transition-colors text-center">
                <Upload className="w-6 h-6 text-[#F5C518] mb-1.5" />
                <span className="text-xs font-bold text-white">Importer depuis l'ordinateur</span>
                <span className="text-[10px] text-zinc-500 mt-0.5">JPEG, PNG ou WebP (Multiples autorisés)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* URL Input */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 flex flex-col justify-center">
                <span className="text-xs font-bold text-white">Ou coller une URL d'image</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 bg-[#181818] border border-zinc-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#F5C518]"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlImage}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg border border-zinc-700"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>

            {/* Presets picker */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F5C518]" />
                Modèles de photos prédéfinies :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_CAR_IMAGES.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setImages((prev) => [...prev, preset.url])}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-[#F5C518] border border-zinc-800"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#F5C518] hover:bg-[#ffe053] text-[#0D0D0D] text-xs font-extrabold shadow-lg transition-all font-heading"
            >
              {vehicle ? 'Mettre à jour le Véhicule' : 'Enregistrer le Véhicule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
