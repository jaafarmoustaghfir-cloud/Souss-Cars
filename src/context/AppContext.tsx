import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, Reservation, BlockedDate, ReservationStatus, VehicleStatus } from '../types';
import { INITIAL_VEHICLES, INITIAL_RESERVATIONS, INITIAL_BLOCKED_DATES } from '../data/initialData';

interface AppContextType {
  vehicles: Vehicle[];
  reservations: Reservation[];
  blockedDates: BlockedDate[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (v: Vehicle | null) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  currentView: 'public' | 'admin';
  setCurrentView: (view: 'public' | 'admin') => void;
  adminTab: 'overview' | 'vehicles' | 'reservations' | 'calendar' | 'settings';
  setAdminTab: (tab: 'overview' | 'vehicles' | 'reservations' | 'calendar' | 'settings') => void;

  // Actions
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  setVehicleStatus: (id: string, status: VehicleStatus) => void;

  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => Reservation;
  updateReservationStatus: (id: string, status: ReservationStatus) => void;
  deleteReservation: (id: string) => void;

  addBlockedDate: (blockedDate: Omit<BlockedDate, 'id'>) => BlockedDate;
  removeBlockedDate: (id: string) => void;

  isVehicleAvailable: (vehicleId: string, startDate: string, endDate: string) => boolean;
  getVehicleBookedDates: (vehicleId: string) => { start: string; end: string; title: string }[];
  resetDataToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const VEHICLES_KEY = 'ssc_vehicles_data_v2';
const RESERVATIONS_KEY = 'ssc_reservations_data_v2';
const BLOCKED_KEY = 'ssc_blocked_dates_data_v2';
const AUTH_KEY = 'ssc_admin_auth_v2';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Vehicles
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(VEHICLES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading vehicles:', e);
    }
    return INITIAL_VEHICLES;
  });

  // 2. Reservations
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(RESERVATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading reservations:', e);
    }
    return INITIAL_RESERVATIONS;
  });

  // 3. Blocked Dates
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(() => {
    try {
      const saved = localStorage.getItem(BLOCKED_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading blocked dates:', e);
    }
    return INITIAL_BLOCKED_DATES;
  });

  // 4. UI States
  const [activeCategory, setActiveCategory] = useState<string>('Toutes');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [adminTab, setAdminTab] = useState<'overview' | 'vehicles' | 'reservations' | 'calendar' | 'settings'>('overview');

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
    } catch (e) {
      console.error('Error saving vehicles:', e);
    }
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
    } catch (e) {
      console.error('Error saving reservations:', e);
    }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem(BLOCKED_KEY, JSON.stringify(blockedDates));
    } catch (e) {
      console.error('Error saving blocked dates:', e);
    }
  }, [blockedDates]);

  useEffect(() => {
    try {
      sessionStorage.setItem(AUTH_KEY, isAdminLoggedIn ? 'true' : 'false');
    } catch (e) {
      console.error('Error saving auth:', e);
    }
  }, [isAdminLoggedIn]);

  // Actions: Vehicles
  const addVehicle = (data: Omit<Vehicle, 'id'>): Vehicle => {
    const newVehicle: Vehicle = {
      ...data,
      id: `ssc-car-${Date.now()}`
    };
    setVehicles(prev => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => (v.id === id ? { ...v, ...updates } : v)));
    if (selectedVehicle?.id === id) {
      setSelectedVehicle(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    if (selectedVehicle?.id === id) setSelectedVehicle(null);
  };

  const setVehicleStatus = (id: string, status: VehicleStatus) => {
    updateVehicle(id, { status });
  };

  // Actions: Reservations
  const addReservation = (data: Omit<Reservation, 'id' | 'createdAt'>): Reservation => {
    const newReservation: Reservation = {
      ...data,
      id: `res-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString()
    };
    setReservations(prev => [newReservation, ...prev]);

    // Automatically create a corresponding blocked date entry
    const newBlock: BlockedDate = {
      id: `blk-${Date.now()}`,
      vehicleId: data.vehicleId,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: `Réservation #${newReservation.id} (${data.clientName})`
    };
    setBlockedDates(prev => [...prev, newBlock]);

    return newReservation;
  };

  const updateReservationStatus = (id: string, status: ReservationStatus) => {
    setReservations(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
  };

  const deleteReservation = (id: string) => {
    const target = reservations.find(r => r.id === id);
    setReservations(prev => prev.filter(r => r.id !== id));
    if (target) {
      // Also remove associated block if exists
      setBlockedDates(prev => prev.filter(b => !b.reason.includes(target.id)));
    }
  };

  // Actions: Blocked Dates
  const addBlockedDate = (data: Omit<BlockedDate, 'id'>): BlockedDate => {
    const newBlock: BlockedDate = {
      ...data,
      id: `blk-${Date.now()}`
    };
    setBlockedDates(prev => [...prev, newBlock]);
    return newBlock;
  };

  const removeBlockedDate = (id: string) => {
    setBlockedDates(prev => prev.filter(b => b.id !== id));
  };

  // Availability checking
  const isVehicleAvailable = (vehicleId: string, startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) return true;
    const reqStart = new Date(startDate).getTime();
    const reqEnd = new Date(endDate).getTime();

    // Check reservations (excluding cancelled)
    const hasConflictingReservation = reservations.some(res => {
      if (res.vehicleId !== vehicleId || res.status === 'Annulée') return false;
      const resStart = new Date(res.startDate).getTime();
      const resEnd = new Date(res.endDate).getTime();
      return (reqStart <= resEnd && reqEnd >= resStart);
    });

    if (hasConflictingReservation) return false;

    // Check blocked dates
    const hasBlockedDate = blockedDates.some(block => {
      if (block.vehicleId !== vehicleId) return false;
      const blkStart = new Date(block.startDate).getTime();
      const blkEnd = new Date(block.endDate).getTime();
      return (reqStart <= blkEnd && reqEnd >= blkStart);
    });

    return !hasBlockedDate;
  };

  const getVehicleBookedDates = (vehicleId: string) => {
    const resDates = reservations
      .filter(r => r.vehicleId === vehicleId && r.status !== 'Annulée')
      .map(r => ({
        start: r.startDate,
        end: r.endDate,
        title: `Réservé (${r.clientName} - ${r.status})`
      }));

    const blkDates = blockedDates
      .filter(b => b.vehicleId === vehicleId)
      .map(b => ({
        start: b.startDate,
        end: b.endDate,
        title: b.reason || 'Indisponible'
      }));

    return [...resDates, ...blkDates];
  };

  const resetDataToDefaults = () => {
    setVehicles(INITIAL_VEHICLES);
    setReservations(INITIAL_RESERVATIONS);
    setBlockedDates(INITIAL_BLOCKED_DATES);
    localStorage.removeItem(VEHICLES_KEY);
    localStorage.removeItem(RESERVATIONS_KEY);
    localStorage.removeItem(BLOCKED_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        vehicles,
        reservations,
        blockedDates,
        activeCategory,
        setActiveCategory,
        selectedVehicle,
        setSelectedVehicle,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        setVehicleStatus,
        addReservation,
        updateReservationStatus,
        deleteReservation,
        addBlockedDate,
        removeBlockedDate,
        isVehicleAvailable,
        getVehicleBookedDates,
        resetDataToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
