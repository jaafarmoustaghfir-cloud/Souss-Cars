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
  X,
  RefreshCw,
  Zap,
  Database,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { AdminVehicles } from './AdminVehicles';
import { AdminReservations } from './AdminReservations';
import { AdminCalendar } from './AdminCalendar';
import { AdminVehicleModal } from './AdminVehicleModal';
import { AdminReservationModal } from './AdminReservationModal';
import { SUPABASE_SCHEMA_SQL } from '../../lib/supabaseClient';

export const AdminDashboard: React.FC = () => {
  const { 
    adminTab, 
    setCurrentView, 
    reservations, 
    vehicles,
    addVehicle,
    refreshData,
    isLoading,
    supabaseStatus,
    supabaseErrorMessage
  } = useApp();

  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);

  const pendingCount = reservations.filter(r => r.status === 'En attente').length;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

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
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-white font-heading">Sky Souss Cars</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5C518] text-[#0D0D0D] font-black">
              ADMIN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || isLoading}
            className="p-2 rounded-xl bg-zinc-800 text-[#F5C518]"
            title="Actualiser"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setCurrentView('public')}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
            title="Retour au site"
          >
            <Globe className="w-4 h-4" />
          </button>
        </div>
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
            {supabaseStatus === 'connected' ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>Supabase Synchronisé</span>
              </div>
            ) : supabaseStatus === 'missing_tables' ? (
              <button 
                onClick={() => setShowSqlModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/60 text-amber-300 text-[11px] font-bold hover:bg-amber-900 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Tables Supabase à initialiser (Cliquer ici)</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[11px] font-bold">
                <span>Supabase en attente</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing || isLoading}
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-xl border border-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
              title="Forcer l'actualisation des données depuis Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#F5C518] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Synchronisation...' : 'Actualiser'}</span>
            </button>

            {pendingCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
                <Bell className="w-3.5 h-3.5 text-[#F5C518]" />
                <span>{pendingCount} demande{pendingCount > 1 ? 's' : ''} en attente</span>
              </div>
            )}

            <button
              onClick={() => setCurrentView('public')}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3.5 py-1.5 rounded-xl border border-zinc-700 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#F5C518]" />
              <span>Voir le Site Public</span>
            </button>
          </div>
        </header>

        {/* Missing Supabase Tables Notice Banner */}
        {supabaseStatus === 'missing_tables' && (
          <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#F5C518] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white flex items-center gap-2">
                  <span>Initialisation des tables Supabase requise</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-zinc-950 font-black">1 ÉTAPE</span>
                </div>
                <div className="text-xs text-amber-300/90 mt-1 max-w-2xl">
                  Les tables <code className="bg-zinc-900 px-1.5 py-0.5 rounded font-mono text-white">vehicles</code> et <code className="bg-zinc-900 px-1.5 py-0.5 rounded font-mono text-white">reservations</code> n'ont pas encore été créées dans votre projet Supabase. Exécutez le script SQL ci-dessous dans le SQL Editor de Supabase.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto flex-shrink-0">
              <button
                onClick={() => setShowSqlModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F5C518] text-[#0D0D0D] font-extrabold text-xs shadow hover:bg-[#ffe053] transition-colors cursor-pointer"
              >
                <span>Voir le Script SQL</span>
              </button>
              <a
                href="https://supabase.com/dashboard/project/mkwrrrptredsqbjoztux/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 text-xs font-bold transition-colors border border-zinc-700"
              >
                <span>Ouvrir Supabase SQL</span>
                <ExternalLink className="w-3 h-3 text-[#F5C518]" />
              </a>
            </div>
          </div>
        )}

        {/* Dynamic Tab View */}
        <div className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          {adminTab === 'overview' && (
            <AdminOverview
              onOpenAddVehicle={() => setVehicleModalOpen(true)}
              onOpenAddReservation={() => setReservationModalOpen(true)}
            />
          )}
          {adminTab === 'vehicles' && (
            <AdminVehicles onOpenAddModal={() => setVehicleModalOpen(true)} />
          )}
          {adminTab === 'reservations' && (
            <AdminReservations onOpenAddModal={() => setReservationModalOpen(true)} />
          )}
          {adminTab === 'calendar' && (
            <AdminCalendar onOpenAddReservation={() => setReservationModalOpen(true)} />
          )}
        </div>
      </main>

      {/* SQL Setup Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-zinc-700 w-full max-w-2xl rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#F5C518]" />
                <h3 className="text-base font-extrabold text-white font-heading">
                  Script SQL d'initialisation Supabase
                </h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 mt-3">
              Copiez ce script SQL et collez-le dans le <strong>SQL Editor</strong> de votre projet Supabase (puis cliquez sur <em>Run</em>) :
            </p>

            <div className="relative mt-3 flex-1 min-h-0 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 overflow-y-auto">
              <pre className="text-[11px] font-mono text-zinc-300 whitespace-pre-wrap">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-800 mt-4">
              <a
                href="https://supabase.com/dashboard/project/mkwrrrptredsqbjoztux/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#F5C518] hover:underline flex items-center gap-1 font-bold"
              >
                <span>Aller au SQL Editor Supabase</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5C518] hover:bg-[#ffe053] text-[#0D0D0D] font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-4 h-4 text-black stroke-[3]" />
                      <span>Copié dans le presse-papier !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copier le Script SQL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={async () => {
                    await handleManualRefresh();
                    setShowSqlModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700 transition-colors cursor-pointer"
                >
                  Actualiser & Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Add / Edit Modal */}
      <AdminVehicleModal
        isOpen={vehicleModalOpen}
        onClose={() => setVehicleModalOpen(false)}
        onSave={handleSaveVehicle}
      />

      {/* Reservation Add Modal */}
      <AdminReservationModal
        isOpen={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
      />
    </div>
  );
};
