import React, { useState } from 'react';
import { 
  Bell, 
  Globe, 
  Plus, 
  User, 
  ShieldCheck, 
  Car, 
  Calendar, 
  CheckCircle2, 
  MessageCircle,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { AdminVehicles } from './AdminVehicles';
import { AdminReservations } from './AdminReservations';
import { AdminCalendar } from './AdminCalendar';
import { AdminVehicleModal } from './AdminVehicleModal';
import { AdminReservationModal } from './AdminReservationModal';

export const AdminDashboard: React.FC = () => {
  const { 
    adminTab, 
    setCurrentView, 
    reservations, 
    vehicles,
    addVehicle 
  } = useApp();

  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingCount = reservations.filter(r => r.status === 'En attente').length;

  const handleSaveVehicle = (data: any) => {
    addVehicle(data);
    setVehicleModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col lg:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#121212] border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-300"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm font-heading">
            Admin · <span className="text-[#F5C518]">Sky Souss Cars</span>
          </span>
        </div>

        <button
          onClick={() => setCurrentView('public')}
          className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-[#F5C518]" />
          <span>Site Public</span>
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden lg:flex shrink-0">
        <AdminSidebar />
      </div>

      {/* Drawer Sidebar for Mobile */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/80 flex" onClick={() => setMobileSidebarOpen(false)}>
          <div className="w-72 bg-[#0F0F0F] h-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <AdminSidebar />
          </div>
        </div>
      )}

      {/* Main Admin Content Container */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0D0D0D]">
        {/* Top Header Bar */}
        <header className="hidden lg:flex h-16 border-b border-zinc-800 bg-[#121212] items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="font-bold text-white uppercase tracking-wider">Espace Gestion Agadir</span>
            <span>•</span>
            <span className="text-[#F5C518] font-bold">Session Administrateur Active</span>
          </div>

          <div className="flex items-center gap-4">
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
                <Bell className="w-3.5 h-3.5 text-[#F5C518]" />
                <span>{pendingCount} demande{pendingCount > 1 ? 's' : ''} en attente</span>
              </div>
            )}

            <button
              onClick={() => setCurrentView('public')}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3.5 py-1.5 rounded-xl border border-zinc-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#F5C518]" />
              <span>Voir le Site Public</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab View */}
        <div className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          {adminTab === 'overview' && (
            <AdminOverview
              onOpenAddVehicle={() => setVehicleModalOpen(true)}
              onOpenAddReservation={() => setReservationModalOpen(true)}
            />
          )}

          {adminTab === 'vehicles' && <AdminVehicles />}

          {adminTab === 'reservations' && <AdminReservations />}

          {adminTab === 'calendar' && <AdminCalendar />}
        </div>
      </main>

      {/* Global Vehicle Add Modal */}
      {vehicleModalOpen && (
        <AdminVehicleModal
          onSave={handleSaveVehicle}
          onClose={() => setVehicleModalOpen(false)}
        />
      )}

      {/* Global Manual Reservation Modal */}
      {reservationModalOpen && (
        <AdminReservationModal
          onClose={() => setReservationModalOpen(false)}
        />
      )}
    </div>
  );
};
