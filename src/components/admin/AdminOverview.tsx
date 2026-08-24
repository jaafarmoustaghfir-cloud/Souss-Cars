import React from 'react';
import { 
  Car, 
  ClipboardList, 
  Percent, 
  Coins, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageCircle, 
  Plus, 
  ArrowRight,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BUSINESS_INFO } from '../../data/initialData';

interface AdminOverviewProps {
  onOpenAddVehicle: () => void;
  onOpenAddReservation: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ 
  onOpenAddVehicle, 
  onOpenAddReservation 
}) => {
  const { 
    vehicles, 
    reservations, 
    updateReservationStatus, 
    setAdminTab 
  } = useApp();

  // Computations
  const activeVehicles = vehicles.filter(v => v.status === 'Disponible').length;
  const pendingReservations = reservations.filter(r => r.status === 'En attente');
  const confirmedReservations = reservations.filter(r => r.status === 'Confirmée');

  // Estimated Revenue
  const estimatedRevenue = confirmedReservations.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  // Occupancy rate calculation based on current confirmed bookings
  const occupancyRate = vehicles.length > 0 
    ? Math.min(100, Math.round((confirmedReservations.length / vehicles.length) * 100))
    : 0;

  const stats = [
    {
      title: 'Véhicules Actifs',
      value: `${vehicles.length}`,
      sub: `${activeVehicles} disponibles immédiatement`,
      icon: Car,
      color: 'text-[#F5C518]'
    },
    {
      title: 'Réservations en Attente',
      value: `${pendingReservations.length}`,
      sub: pendingReservations.length > 0 ? 'Action requise' : 'À jour',
      icon: Clock,
      color: pendingReservations.length > 0 ? 'text-amber-400' : 'text-zinc-400'
    },
    {
      title: 'Taux d’Occupation',
      value: `${occupancyRate}%`,
      sub: `${confirmedReservations.length} en cours / validées`,
      icon: Percent,
      color: 'text-emerald-400'
    },
    {
      title: 'Revenu Estimé (Mois)',
      value: `${estimatedRevenue.toLocaleString()} DH`,
      sub: 'Sur réservations confirmées',
      icon: Coins,
      color: 'text-[#F5C518]'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Tableau de Bord Sky Souss Cars
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Supervisez votre flotte, validez les réservations et suivez votre activité à Agadir.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddReservation}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-zinc-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#F5C518]" />
            <span>+ Réservation</span>
          </button>

          <button
            onClick={onOpenAddVehicle}
            className="flex items-center gap-2 bg-[#F5C518] hover:bg-[#ffe053] text-[#0D0D0D] font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition-all font-heading cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nouveau Véhicule</span>
          </button>
        </div>
      </div>

      {/* Pending Reservations Alert Banner if any */}
      {pendingReservations.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#F5C518] flex-shrink-0 animate-pulse" />
            <div className="text-xs sm:text-sm">
              <strong className="text-white">{pendingReservations.length} nouvelle{pendingReservations.length > 1 ? 's' : ''} demande{pendingReservations.length > 1 ? 's' : ''} de réservation</strong> en attente de confirmation.
            </div>
          </div>
          <button
            onClick={() => setAdminTab('reservations')}
            className="text-xs font-bold text-[#F5C518] hover:underline self-end sm:self-auto flex items-center gap-1"
          >
            <span>Voir les réservations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#141414] border border-zinc-800 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  {st.title}
                </span>
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${st.color}`} />
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-heading">
                  {st.value}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  {st.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reservations Table */}
      <div className="rounded-2xl bg-[#141414] border border-zinc-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Dernières Demandes de Réservation
            </h3>
            <p className="text-xs text-zinc-400">
              Gérez les demandes reçues via le site web et WhatsApp.
            </p>
          </div>

          <button
            onClick={() => setAdminTab('reservations')}
            className="text-xs font-bold text-[#F5C518] hover:underline flex items-center gap-1"
          >
            <span>Voir Tout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#181818] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4 sm:px-6">Client</th>
                <th className="py-3 px-4">Véhicule</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {reservations.slice(0, 5).map((res) => {
                const waReply = encodeURIComponent(
                  `Bonjour ${res.clientName}, Sky Souss Cars vous contacte au sujet de votre réservation pour la ${res.vehicleName} du ${res.startDate} au ${res.endDate}.`
                );
                return (
                  <tr key={res.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-white">{res.clientName}</div>
                      <div className="text-zinc-400 text-[11px]">{res.clientPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-zinc-200">{res.vehicleName}</div>
                      <div className="text-[11px] text-zinc-500">{res.pickupLocation}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div>{res.startDate} ➜ {res.endDate}</div>
                      <div className="text-[10px] text-zinc-500">{res.totalDays} jours</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#F5C518]">
                      {res.totalPrice} DH
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          res.status === 'Confirmée'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                            : res.status === 'En attente'
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                            : res.status === 'Annulée'
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'En attente' && (
                          <>
                            <button
                              onClick={() => updateReservationStatus(res.id, 'Confirmée')}
                              className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/40"
                              title="Confirmer la réservation"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => updateReservationStatus(res.id, 'Annulée')}
                              className="p-1.5 rounded-lg bg-rose-950/80 text-rose-400 hover:bg-rose-900 border border-rose-500/40"
                              title="Annuler la réservation"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <a
                          href={`https://wa.me/${res.clientPhone.replace(/[^0-9]/g, '')}?text=${waReply}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#F5C518]/10 text-[#F5C518] hover:bg-[#F5C518]/20 border border-[#F5C518]/30"
                          title="Contacter sur WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500 text-xs">
                    Aucune réservation enregistrée pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
