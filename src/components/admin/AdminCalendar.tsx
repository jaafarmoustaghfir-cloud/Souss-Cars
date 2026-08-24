import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Car, 
  Calendar as CalendarIcon, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Wrench
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminCalendar: React.FC = () => {
  const { vehicles, reservations, blockedDates, addBlockedDate, removeBlockedDate } = useApp();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || 'all');
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 1)); // August 2026

  // Block modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockVehicleId, setBlockVehicleId] = useState(vehicles[0]?.id || '');
  const [blockStart, setBlockStart] = useState('');
  const [blockEnd, setBlockEnd] = useState('');
  const [blockReason, setBlockReason] = useState('Maintenance / Révision');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Month navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Determine bookings for a given day (YYYY-MM-DD)
  const getDayEvents = (dayNumber: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNumber).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    // Filter active reservations
    const matchedReservations = reservations.filter((r) => {
      if (r.status === 'Annulée') return false;
      if (selectedVehicleId !== 'all' && r.vehicleId !== selectedVehicleId) return false;
      return dateStr >= r.startDate && dateStr <= r.endDate;
    });

    // Filter blocked dates
    const matchedBlocks = blockedDates.filter((b) => {
      if (selectedVehicleId !== 'all' && b.vehicleId !== selectedVehicleId) return false;
      return dateStr >= b.startDate && dateStr <= b.endDate;
    });

    return { dateStr, reservations: matchedReservations, blocks: matchedBlocks };
  };

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockStart || !blockEnd) return;

    addBlockedDate({
      vehicleId: blockVehicleId,
      startDate: blockStart,
      endDate: blockEnd,
      reason: blockReason || 'Indisponible'
    });

    setShowBlockModal(false);
    setBlockStart('');
    setBlockEnd('');
  };

  const activeCar = vehicles.find(v => v.id === selectedVehicleId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Calendrier & Disponibilités
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Visualisez les plannings de location et bloquez des dates pour maintenance.
          </p>
        </div>

        <button
          onClick={() => setShowBlockModal(true)}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-zinc-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Lock className="w-4 h-4 text-[#F5C518]" />
          <span>Bloquer des Dates (Maintenance)</span>
        </button>
      </div>

      {/* Calendar Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#141414] rounded-2xl border border-zinc-800">
        {/* Vehicle Filter */}
        <div className="flex items-center gap-2.5">
          <Car className="w-4 h-4 text-[#F5C518]" />
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#F5C518]"
          >
            <option value="all">Tous les véhicules ({vehicles.length})</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.brand} - {v.price} DH/j)
              </option>
            ))}
          </select>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm font-extrabold text-white font-heading min-w-32 text-center">
            {monthNames[month]} {year}
          </span>

          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div className="rounded-2xl bg-[#141414] border border-zinc-800 overflow-hidden shadow-xl p-4 sm:p-6 space-y-4">
        {/* Weekdays Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-zinc-400 text-xs font-bold uppercase tracking-wider pb-2 border-b border-zinc-800">
          <div>Dim</div>
          <div>Lun</div>
          <div>Mar</div>
          <div>Mer</div>
          <div>Jeu</div>
          <div>Ven</div>
          <div>Sam</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-24 rounded-xl bg-zinc-900/20 border border-zinc-900" />
          ))}

          {/* Days in Month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const { dateStr, reservations: dayRes, blocks: dayBlk } = getDayEvents(dayNum);
            const hasBooking = dayRes.length > 0;
            const hasBlock = dayBlk.length > 0;

            return (
              <div
                key={dayNum}
                className={`min-h-24 p-2 rounded-xl border flex flex-col justify-between transition-all ${
                  hasBooking
                    ? 'bg-amber-950/30 border-amber-500/40 hover:bg-amber-950/50'
                    : hasBlock
                    ? 'bg-rose-950/30 border-rose-500/40'
                    : 'bg-[#181818] border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${hasBooking ? 'text-[#F5C518]' : 'text-zinc-300'}`}>
                    {dayNum}
                  </span>
                  {hasBooking && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518]" />
                  )}
                </div>

                {/* Event Badges inside day cell */}
                <div className="space-y-1 my-1 overflow-hidden">
                  {dayRes.map((r) => (
                    <div
                      key={r.id}
                      className="p-1 rounded bg-[#F5C518]/20 text-[#F5C518] text-[9px] font-bold truncate border border-[#F5C518]/30"
                      title={`${r.clientName} (${r.vehicleName})`}
                    >
                      {selectedVehicleId === 'all' ? `${r.vehicleName.split(' ')[0]} - ` : ''}{r.clientName}
                    </div>
                  ))}

                  {dayBlk.map((b) => (
                    <div
                      key={b.id}
                      className="p-1 rounded bg-rose-950/60 text-rose-300 text-[9px] font-bold truncate border border-rose-500/30 flex items-center justify-between"
                      title={b.reason}
                    >
                      <span className="truncate">{b.reason}</span>
                      <button
                        onClick={() => removeBlockedDate(b.id)}
                        className="text-rose-400 hover:text-white ml-1"
                        title="Débloquer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Status indicator */}
                <div className="text-[9px] text-zinc-500">
                  {hasBooking ? `${dayRes.length} réservé` : hasBlock ? 'Bloqué' : 'Libre'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-zinc-800 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-[#F5C518]/20 border border-[#F5C518]/40" />
            <span>Journée Réservée (Client)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-rose-950/60 border border-rose-500/40" />
            <span>Indisponible / Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-[#181818] border border-zinc-800" />
            <span>Disponible à la location</span>
          </div>
        </div>
      </div>

      {/* Manual Block Modal */}
      {showBlockModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowBlockModal(false)}
        >
          <div 
            className="w-full max-w-md bg-[#141414] border border-zinc-800 rounded-2xl p-6 space-y-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2 font-heading">
                <Wrench className="w-4 h-4 text-[#F5C518]" />
                <span>Bloquer des Dates Manuellement</span>
              </h3>
              <button onClick={() => setShowBlockModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSaveBlock} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 font-bold">Véhicule</label>
                <select
                  value={blockVehicleId}
                  onChange={(e) => setBlockVehicleId(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl p-2.5"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-bold">Date Début</label>
                  <input
                    type="date"
                    required
                    value={blockStart}
                    onChange={(e) => setBlockStart(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl p-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 font-bold">Date Fin</label>
                  <input
                    type="date"
                    required
                    value={blockEnd}
                    onChange={(e) => setBlockEnd(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl p-2"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-bold">Motif</label>
                <input
                  type="text"
                  placeholder="Ex: Révision moteur, contrôle technique..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-zinc-700 text-white rounded-xl p-2.5"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#F5C518] text-[#0D0D0D] font-bold"
                >
                  Bloquer les Dates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
