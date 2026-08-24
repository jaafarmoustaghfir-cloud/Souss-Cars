import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Check, 
  X, 
  CheckCircle2, 
  MessageCircle, 
  Trash2, 
  Calendar, 
  Phone, 
  MapPin, 
  Car,
  Filter,
  Clock,
  ArrowUpDown,
  Sparkles,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { Reservation, ReservationStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { AdminReservationModal } from './AdminReservationModal';

export const AdminReservations: React.FC = () => {
  const { 
    reservations, 
    vehicles, 
    updateReservationStatus, 
    deleteReservation 
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string>('');

  const pendingCount = reservations.filter(r => r.status === 'En attente').length;
  const confirmedCount = reservations.filter(r => r.status === 'Confirmée').length;

  // Format request date/time nicely (e.g. 24/08/2026 à 14:30)
  const formatRequestTime = (isoString?: string) => {
    if (!isoString) return 'Récemment';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return isoString;
    }
  };

  // Sort reservations: 'En attente' first, then latest createdAt
  const sortedReservations = useMemo(() => {
    return [...reservations].sort((a, b) => {
      // Pending requests come first
      if (a.status === 'En attente' && b.status !== 'En attente') return -1;
      if (b.status === 'En attente' && a.status !== 'En attente') return 1;
      // Then newest created first
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  }, [reservations]);

  const filtered = sortedReservations.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (vehicleFilter !== 'all' && r.vehicleId !== vehicleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchClient = r.clientName.toLowerCase().includes(q);
      const matchPhone = r.clientPhone.toLowerCase().includes(q);
      const matchVehicle = r.vehicleName.toLowerCase().includes(q);
      if (!matchClient && !matchPhone && !matchVehicle) return false;
    }
    return true;
  });

  const handleStatusChange = (id: string, status: ReservationStatus, clientName: string) => {
    updateReservationStatus(id, status);
    setActionSuccessNotice(`Réservation de ${clientName} passée au statut : ${status}`);
    setTimeout(() => setActionSuccessNotice(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Gestion des Réservations
            </h1>
            {pendingCount > 0 && (
              <span className="px-3 py-1 rounded-full bg-[#F5C518] text-[#0D0D0D] text-xs font-black animate-pulse shadow-md">
                {pendingCount} en attente
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Traitez les demandes de location en attente, appelez vos clients et validez les plannings.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#F5C518] hover:bg-[#ffe053] text-[#0D0D0D] font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg transition-all font-heading self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nouvelle Réservation Manuelle</span>
        </button>
      </div>

      {/* Success Notice Banner */}
      {actionSuccessNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessNotice}</span>
          </div>
          <button onClick={() => setActionSuccessNotice('')} className="text-emerald-400 hover:text-emerald-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Pending Reservations Callout Banner if any */}
      {pendingCount > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border-2 border-amber-500/40 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#F5C518] flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {pendingCount} demande{pendingCount > 1 ? 's' : ''} de réservation à traiter
              </div>
              <div className="text-xs text-amber-300/80">
                Contactez les clients par téléphone ou WhatsApp pour confirmer la disponibilité.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setStatusFilter('En attente')}
              className="px-3.5 py-1.5 rounded-xl bg-[#F5C518] text-[#0D0D0D] font-extrabold text-xs shadow hover:bg-[#ffe053] transition-colors cursor-pointer"
            >
              Afficher uniquement En Attente
            </button>
          </div>
        </div>
      )}

      {/* Quick Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-zinc-100 text-zinc-950 shadow-md'
              : 'bg-[#141414] text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          Toutes ({reservations.length})
        </button>

        <button
          onClick={() => setStatusFilter('En attente')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            statusFilter === 'En attente'
              ? 'bg-[#F5C518] text-[#0D0D0D] shadow-md shadow-[#F5C518]/20'
              : 'bg-amber-950/30 text-amber-300 hover:bg-amber-950/60 border border-amber-500/30'
          }`}
        >
          <span>En attente</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
            statusFilter === 'En attente' ? 'bg-[#0D0D0D] text-[#F5C518]' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('Confirmée')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            statusFilter === 'Confirmée'
              ? 'bg-emerald-500 text-zinc-950 shadow-md'
              : 'bg-emerald-950/30 text-emerald-300 hover:bg-emerald-950/60 border border-emerald-500/30'
          }`}
        >
          <span>Confirmées</span>
          <span className="text-[10px] opacity-80">({confirmedCount})</span>
        </button>

        <button
          onClick={() => setStatusFilter('Terminée')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'Terminée'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-[#141414] text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          Terminées
        </button>

        <button
          onClick={() => setStatusFilter('Annulée')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'Annulée'
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-[#141414] text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          Refusées / Annulées
        </button>
      </div>

      {/* Filter and search controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#141414] rounded-2xl border border-zinc-800">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom client, numéro de téléphone, véhicule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C518]"
          />
        </div>

        {/* Vehicle Filter */}
        <div>
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#F5C518]"
          >
            <option value="all">Tous les véhicules ({vehicles.length})</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.brand})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reservations List / Table */}
      <div className="rounded-2xl bg-[#141414] border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#181818] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Date Demande</th>
                <th className="py-3.5 px-4">Client & Contact Direct</th>
                <th className="py-3.5 px-4">Véhicule</th>
                <th className="py-3.5 px-4">Dates & Durée</th>
                <th className="py-3.5 px-4">Lieu Livraison</th>
                <th className="py-3.5 px-4">Montant</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Traitement & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filtered.map((res) => {
                const isPending = res.status === 'En attente';
                const cleanPhoneDigits = res.clientPhone.replace(/[^0-9]/g, '');
                const telLink = `tel:${res.clientPhone.replace(/[\s\-\(\)]/g, '')}`;
                const waReply = encodeURIComponent(
                  `Bonjour ${res.clientName},\n\nSky Souss Cars a bien reçu votre demande de réservation pour la *${res.vehicleName}* du *${res.startDate}* au *${res.endDate}* (${res.totalPrice} DH).\n\nNous sommes à votre disposition pour confirmer les derniers détails. Avez-vous des questions ?`
                );
                const waLink = `https://wa.me/${cleanPhoneDigits}?text=${waReply}`;

                return (
                  <tr 
                    key={res.id} 
                    className={`transition-colors ${
                      isPending 
                        ? 'bg-amber-950/15 hover:bg-amber-950/25 border-l-4 border-l-[#F5C518]' 
                        : 'hover:bg-zinc-900/50'
                    }`}
                  >
                    {/* Date/Time of Request */}
                    <td className="py-4 px-4 sm:px-6 text-xs text-zinc-400 whitespace-nowrap">
                      <div className="font-medium text-zinc-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{formatRequestTime(res.createdAt)}</span>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500 block mt-0.5">#{res.id}</span>
                    </td>

                    {/* Client Name & Direct Phone */}
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-white text-sm">{res.clientName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {/* Phone Display with Call Link */}
                        <a 
                          href={telLink}
                          className="inline-flex items-center gap-1 text-[#F5C518] hover:text-[#ffe053] font-mono text-xs font-bold bg-[#F5C518]/10 hover:bg-[#F5C518]/20 px-2 py-0.5 rounded-lg border border-[#F5C518]/30 transition-colors"
                          title="Appeler directement ce numéro"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{res.clientPhone}</span>
                        </a>
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        {res.vehicleImage && (
                          <img 
                            src={res.vehicleImage} 
                            alt={res.vehicleName} 
                            className="w-10 h-8 rounded-lg object-cover bg-zinc-900 border border-zinc-800 flex-shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-bold text-white">{res.vehicleName}</div>
                          <div className="text-[11px] text-zinc-400">{res.pricePerDay} DH / jour</div>
                        </div>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-4 text-xs">
                      <div className="text-zinc-200 font-semibold">{res.startDate} ➜ {res.endDate}</div>
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 mt-1 font-bold">
                        {res.totalDays} jour{res.totalDays > 1 ? 's' : ''}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 text-xs text-zinc-300 max-w-xs">
                      <div className="flex items-center gap-1 text-zinc-200 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#F5C518] flex-shrink-0" />
                        <span className="truncate">{res.pickupLocation}</span>
                      </div>
                      {res.notes && (
                        <div className="text-[11px] text-zinc-400 italic mt-1 bg-zinc-900/80 p-1.5 rounded-lg border border-zinc-800 max-w-[200px] truncate">
                          "{res.notes}"
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 font-black text-[#F5C518] text-base whitespace-nowrap">
                      {res.totalPrice} DH
                    </td>

                    {/* Status Select Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={res.status}
                        onChange={(e) => handleStatusChange(res.id, e.target.value as ReservationStatus, res.clientName)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                          res.status === 'Confirmée'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                            : res.status === 'En attente'
                            ? 'bg-amber-500 text-zinc-950 border-amber-400 font-extrabold shadow-sm'
                            : res.status === 'Annulée'
                            ? 'bg-rose-950 text-rose-400 border-rose-500/50'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        }`}
                      >
                        <option value="En attente">⏳ En attente</option>
                        <option value="Confirmée">✅ Confirmée</option>
                        <option value="Terminée">🏁 Terminée</option>
                        <option value="Annulée">❌ Refusée / Annulée</option>
                      </select>
                    </td>

                    {/* Contact & Decision Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1. Direct Call Button */}
                        <a
                          href={telLink}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/40 text-xs font-bold transition-all hover:scale-105"
                          title={`Appeler ${res.clientName} (${res.clientPhone})`}
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span className="hidden xl:inline">Appeler</span>
                        </a>

                        {/* 2. Direct WhatsApp Button */}
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/40 transition-colors"
                          title="Discuter sur WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                        </a>

                        {/* 3. Instant Confirm / Refuse quick buttons for pending requests */}
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleStatusChange(res.id, 'Confirmée', res.clientName)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
                              title="Confirmer la réservation"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span className="hidden sm:inline">Confirmer</span>
                            </button>

                            <button
                              onClick={() => handleStatusChange(res.id, 'Annulée', res.clientName)}
                              className="p-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                              title="Refuser la demande"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* 4. Delete Record button */}
                        <button
                          onClick={() => deleteReservation(res.id)}
                          className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-950 hover:text-rose-400 text-zinc-500 transition-colors cursor-pointer"
                          title="Supprimer la réservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500 text-xs">
                    Aucune réservation trouvée pour ce filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && <AdminReservationModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};
