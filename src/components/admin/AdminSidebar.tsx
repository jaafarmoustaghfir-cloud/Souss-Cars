import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  ClipboardList, 
  CalendarDays, 
  Settings, 
  LogOut, 
  Globe, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../Logo';
import { useApp } from '../../context/AppContext';

export const AdminSidebar: React.FC = () => {
  const { 
    adminTab, 
    setAdminTab, 
    setIsAdminLoggedIn, 
    setCurrentView,
    reservations,
    vehicles 
  } = useApp();

  const pendingCount = reservations.filter(r => r.status === 'En attente').length;

  const menuItems = [
    {
      id: 'overview' as const,
      label: "Vue d'ensemble",
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'vehicles' as const,
      label: 'Véhicules (CRUD)',
      icon: Car,
      badge: vehicles.length
    },
    {
      id: 'reservations' as const,
      label: 'Réservations',
      icon: ClipboardList,
      badge: pendingCount > 0 ? `${pendingCount} en attente` : reservations.length
    },
    {
      id: 'calendar' as const,
      label: 'Calendrier & Dispos',
      icon: CalendarDays,
      badge: null
    }
  ];

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('public');
  };

  return (
    <aside className="w-full lg:w-64 bg-[#0F0F0F] border-r border-zinc-800 flex flex-col justify-between p-4 sm:p-6 shrink-0">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="space-y-2">
          <Logo size="md" variant="light" />
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#F5C518] px-2 py-0.5 rounded bg-[#F5C518]/10 border border-[#F5C518]/20 inline-block">
            Panneau d'Administration
          </div>
        </div>

        {/* Nav list */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#F5C518] text-[#0D0D0D] shadow-lg shadow-[#F5C518]/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-[#0D0D0D] text-[#F5C518]'
                        : item.id === 'reservations' && pendingCount > 0
                        ? 'bg-[#F5C518] text-[#0D0D0D]'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-zinc-800/80 space-y-2 mt-6">
        {/* Switch to Public Site */}
        <button
          onClick={() => setCurrentView('public')}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#F5C518]" />
            <span>Voir Site Public</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};
