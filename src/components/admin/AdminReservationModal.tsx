import React, { useState } from 'react';
import { X, Calendar, User, Phone, MapPin, DollarSign, Car, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReservationStatus } from '../../types';

interface AdminReservationModalProps {
  onClose: () => void;
}

export const AdminReservationModal: React.FC<AdminReservationModalProps> = ({ onClose }) => {
  const { vehicles, addReservation } = useApp();

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+212');
  const [clientEmail, setClientEmail] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Aéroport Agadir Al Massira');
  const [notes, setNotes] = useState('Réservation téléphonique');
  const [status, setStatus] = useState<ReservationStatus>('Confirmée');
  const [error, setError] = useState('');

  const targetVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clientName.trim() || !clientPhone.trim()) {
      setError('Veuillez renseigner le nom et le téléphone du client.');
      return;
    }

    if (!startDate || !endDate) {
      setError('Veuillez renseigner les dates de début et de fin.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      setError('La date de retour doit être postérieure à la date de départ.');
      return;
    }

    const pricePerDay = targetVehicle ? targetVehicle.price : 250;
    const totalPrice = days * pricePerDay;

    await addReservation({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      vehicleId: targetVehicle.id,
      vehicleName: targetVehicle.name,
      vehicleImage: targetVehicle.images?.[0],
      startDate,
      endDate,
      totalDays: days,
      pricePerDay,
      totalPrice,
      pickupLocation,
      returnLocation: pickupLocation,
      notes: notes.trim(),
      status
    });

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#141414] border border-zinc-800 rounded-3xl p-6 shadow-2xl my-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
          <h3 className="text-lg font-bold text-white font-heading">
            + Nouvelle Réservation Manuelle
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400">Nom du Client *</label>
              <input
                type="text"
                required
                placeholder="Ex: Karim Tazi"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400">Téléphone / WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="+212 6..."
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>
          </div>

          {/* Vehicle Select */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400">Véhicule</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5C518]"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.brand} - {v.price} DH/j)
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400">Date Départ</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400">Date Retour</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>
          </div>

          {/* Delivery Location */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400">Lieu de Livraison</label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Aéroport Agadir Al Massira, Hay Elhouda, Hôtel..."
              className="w-full bg-[#1e1e1e] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5C518]"
            />
          </div>

          {/* Status & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400">Statut Initial</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ReservationStatus)}
                className="w-full bg-[#1e1e1e] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5C518]"
              >
                <option value="Confirmée">Confirmée ✅</option>
                <option value="En attente">En attente ⏳</option>
                <option value="Terminée">Terminée 🏁</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400">Notes Internes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Vol AT 450"
                className="w-full bg-[#1e1e1e] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5C518]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#F5C518] hover:bg-[#ffe053] text-[#0D0D0D] text-xs font-extrabold"
            >
              Créer la Réservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
