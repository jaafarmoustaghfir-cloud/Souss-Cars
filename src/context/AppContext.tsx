import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Vehicle, Reservation, BlockedDate, ReservationStatus, VehicleStatus, VehicleCategory, TransmissionType, FuelType } from '../types';
import { INITIAL_VEHICLES, INITIAL_RESERVATIONS, INITIAL_BLOCKED_DATES } from '../data/initialData';
import { supabase, SupabaseVehicleRow, SupabaseReservationRow } from '../lib/supabaseClient';
import { parseVehicleImages, serializeVehicleImages } from '../utils/imageUtils';

export type SupabaseStatus = 'connected' | 'missing_tables' | 'error' | 'loading';

interface AppContextType {
  vehicles: Vehicle[];
  reservations: Reservation[];
  blockedDates: BlockedDate[];
  isLoading: boolean;
  supabaseStatus: SupabaseStatus;
  supabaseErrorMessage: string | null;
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
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<Vehicle>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  setVehicleStatus: (id: string, status: VehicleStatus) => Promise<void>;

  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => Promise<Reservation>;
  updateReservationStatus: (id: string, status: ReservationStatus) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;

  addBlockedDate: (blockedDate: Omit<BlockedDate, 'id'>) => BlockedDate;
  removeBlockedDate: (id: string) => void;

  isVehicleAvailable: (vehicleId: string, startDate: string, endDate: string) => boolean;
  getVehicleBookedDates: (vehicleId: string) => { start: string; end: string; title: string }[];
  resetDataToDefaults: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AUTH_KEY = 'ssc_admin_auth_v3_session';
const LOCAL_VEHICLES_KEY = 'ssc_cached_vehicles_v3_catalog';
const LOCAL_RESERVATIONS_KEY = 'ssc_cached_reservations_v3';

// Helper: Check UUID format
function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// Convert Supabase vehicle row to frontend Vehicle model
function mapRowToVehicle(row: SupabaseVehicleRow): Vehicle {
  const images = parseVehicleImages(row.image_url);

  const category = (row.category || 'Économique') as VehicleCategory;
  const isHighEnd = category === 'Luxe' || category === 'SUV';

  return {
    id: String(row.id),
    name: row.name || 'Véhicule',
    brand: row.brand || '',
    category: category,
    price: Number(row.price) || 350,
    transmission: (row.transmission || 'Manuelle') as TransmissionType,
    fuel: (row.fuel || 'Essence') as FuelType,
    seats: Number(row.seats) || 5,
    doors: 5,
    year: Number(row.year) || new Date().getFullYear(),
    mileage: row.mileage || '20 000 km',
    status: (row.status || 'Disponible') as VehicleStatus,
    images: images,
    description: row.description || '',
    airConditioning: true,
    luggage: isHighEnd ? 4 : 3,
    minAge: isHighEnd ? 23 : 21,
    deposit: isHighEnd ? 4000 : 2000,
    featured: true
  };
}

// Convert frontend Vehicle to Supabase vehicle row payload
function mapVehicleToRow(v: Omit<Vehicle, 'id'> | Vehicle) {
  return {
    name: v.name,
    brand: v.brand,
    category: v.category,
    price: Number(v.price),
    transmission: v.transmission,
    fuel: v.fuel,
    seats: Number(v.seats),
    year: Number(v.year),
    mileage: v.mileage,
    status: v.status,
    image_url: serializeVehicleImages(v.images),
    description: v.description || null
  };
}

// Convert Supabase reservation row to frontend Reservation model
function mapRowToReservation(row: SupabaseReservationRow, allVehicles: Vehicle[]): Reservation {
  const start = new Date(row.start_date);
  const end = new Date(row.end_date);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const matchingVehicle = allVehicles.find(v => v.id === row.vehicle_id || v.name.toLowerCase() === (row.vehicle_name || '').toLowerCase());
  const pricePerDay = matchingVehicle ? matchingVehicle.price : 350;
  const totalPrice = pricePerDay * diffDays;

  return {
    id: String(row.id),
    clientName: row.client_name || 'Client',
    clientPhone: row.client_phone || '',
    clientEmail: '',
    vehicleId: String(row.vehicle_id || ''),
    vehicleName: row.vehicle_name || matchingVehicle?.name || 'Véhicule',
    vehicleImage: matchingVehicle?.images?.[0] || undefined,
    startDate: row.start_date || '',
    endDate: row.end_date || '',
    totalDays: diffDays,
    pricePerDay: pricePerDay,
    totalPrice: totalPrice,
    pickupLocation: 'Aéroport Agadir Al Massira (Gratuit)',
    returnLocation: 'Aéroport Agadir Al Massira (Gratuit)',
    notes: '',
    status: (row.status || 'En attente') as ReservationStatus,
    createdAt: row.created_at || new Date().toISOString()
  };
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_VEHICLES_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return INITIAL_VEHICLES;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_RESERVATIONS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return INITIAL_RESERVATIONS;
  });

  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(INITIAL_BLOCKED_DATES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus>('loading');
  const [supabaseErrorMessage, setSupabaseErrorMessage] = useState<string | null>(null);

  // UI States
  const [activeCategory, setActiveCategory] = useState<string>('Toutes');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentView, setCurrentView] = useState<'public' | 'admin'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        if (path === '/admin' || path.startsWith('/admin') || hash === '#admin') {
          return 'admin';
        }
      }
    } catch {}
    return 'public';
  });
  const [adminTab, setAdminTab] = useState<'overview' | 'vehicles' | 'reservations' | 'calendar' | 'settings'>('overview');

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Keep route synced with browser address bar
  useEffect(() => {
    const handleLocation = () => {
      try {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        if (path === '/admin' || path.startsWith('/admin') || hash === '#admin') {
          setCurrentView('admin');
        } else {
          setCurrentView('public');
        }
      } catch {}
    };

    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  useEffect(() => {
    try {
      if (currentView === 'admin') {
        if (!window.location.pathname.startsWith('/admin') && window.location.hash !== '#admin') {
          window.history.pushState(null, '', '/admin');
        }
      } else {
        if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
          window.history.pushState(null, '', '/');
        }
      }
    } catch {}
  }, [currentView]);

  useEffect(() => {
    try {
      if (isAdminLoggedIn) {
        sessionStorage.setItem(AUTH_KEY, 'true');
      } else {
        sessionStorage.removeItem(AUTH_KEY);
      }
    } catch (e) {
      console.error('Error saving auth:', e);
    }
  }, [isAdminLoggedIn]);

  // Persist locally as fallback
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_VEHICLES_KEY, JSON.stringify(vehicles));
    } catch {}
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_RESERVATIONS_KEY, JSON.stringify(reservations));
    } catch {}
  }, [reservations]);

  // Fetch Vehicles from Supabase
  const fetchVehicles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('relation "public.vehicles" does not exist')) {
          setSupabaseStatus('missing_tables');
          setSupabaseErrorMessage('La table "vehicles" n\'a pas encore été créée dans votre projet Supabase.');
        } else {
          setSupabaseStatus('error');
          setSupabaseErrorMessage(error.message);
        }
        return false;
      }

      setSupabaseStatus('connected');
      setSupabaseErrorMessage(null);

      if (data && data.length > 0) {
        // Detect if old vehicles (like Duster or Clio 4 or old 250 DH prices) are present
        const hasOldCatalog = data.some(d => 
          d.name === 'Dacia Duster' || 
          d.name === 'Renault Clio 4' || 
          (d.name === 'Dacia Logan' && Number(d.price) === 250)
        );

        if (hasOldCatalog) {
          try {
            // Remove old vehicles
            await supabase.from('vehicles').delete().neq('name', '___NONE___');
            // Insert the 6 new vehicles
            const seedPayload = INITIAL_VEHICLES.map(v => mapVehicleToRow(v));
            const { data: insertedData } = await supabase
              .from('vehicles')
              .insert(seedPayload)
              .select();

            if (insertedData && insertedData.length > 0) {
              setVehicles(insertedData.map(mapRowToVehicle));
            } else {
              setVehicles(INITIAL_VEHICLES);
            }
          } catch (delErr) {
            console.warn('Error upgrading supabase vehicle catalog:', delErr);
            setVehicles(data.map(mapRowToVehicle));
          }
        } else {
          const loadedVehicles = data.map(mapRowToVehicle);
          setVehicles(loadedVehicles);
        }
      } else {
        // If Supabase table is empty on first setup, seed initial vehicles
        const seedPayload = INITIAL_VEHICLES.map(v => mapVehicleToRow(v));
        const { data: insertedData, error: seedError } = await supabase
          .from('vehicles')
          .insert(seedPayload)
          .select();

        if (!seedError && insertedData && insertedData.length > 0) {
          setVehicles(insertedData.map(mapRowToVehicle));
        } else {
          setVehicles(INITIAL_VEHICLES);
        }
      }
      return true;
    } catch (err: any) {
      setSupabaseStatus('error');
      setSupabaseErrorMessage(err?.message || 'Erreur de connexion Supabase');
      return false;
    }
  }, []);

  // Fetch Reservations from Supabase
  const fetchReservations = useCallback(async (currentVehiclesList?: Vehicle[]) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('relation "public.reservations" does not exist')) {
          setSupabaseStatus('missing_tables');
          setSupabaseErrorMessage('La table "reservations" n\'a pas encore été créée dans votre projet Supabase.');
        }
        return false;
      }

      if (data) {
        setSupabaseStatus('connected');
        const refVehicles = currentVehiclesList || vehicles;
        const loadedReservations = data.map(row => mapRowToReservation(row, refVehicles));
        setReservations(loadedReservations);

        // Derive blocked dates from reservations
        const autoBlocked: BlockedDate[] = loadedReservations
          .filter(r => r.status !== 'Annulée')
          .map(r => ({
            id: `blk-${r.id}`,
            vehicleId: r.vehicleId,
            startDate: r.startDate,
            endDate: r.endDate,
            reason: `Réservation #${r.id.slice(0, 6)} (${r.clientName})`
          }));
        setBlockedDates(autoBlocked);
      }
      return true;
    } catch (err) {
      return false;
    }
  }, [vehicles]);

  // Initial Load and Realtime WebSocket Subscription
  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      setIsLoading(true);
      await fetchVehicles();
      await fetchReservations();
      if (isMounted) setIsLoading(false);
    }

    initialize();

    // Supabase Realtime Channels (PostgreSQL Replication)
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vehicles' },
        () => {
          fetchVehicles();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        () => {
          fetchReservations();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [fetchVehicles, fetchReservations]);

  const refreshData = async () => {
    setIsLoading(true);
    await fetchVehicles();
    await fetchReservations();
    setIsLoading(false);
  };

  // Actions: Vehicles (Supabase Insert/Update/Delete)
  const addVehicle = async (data: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    const tempId = crypto.randomUUID ? crypto.randomUUID() : `temp-${Date.now()}`;
    const optimisticVehicle: Vehicle = {
      ...data,
      id: tempId
    };
    setVehicles(prev => [optimisticVehicle, ...prev]);

    try {
      const payload = mapVehicleToRow(data);
      const { data: inserted, error } = await supabase
        .from('vehicles')
        .insert(payload)
        .select()
        .single();

      if (!error && inserted) {
        const createdVehicle = mapRowToVehicle(inserted);
        setVehicles(prev => prev.map(v => v.id === tempId ? createdVehicle : v));
        return createdVehicle;
      }
    } catch (err) {
      // Keep optimistic vehicle
    }
    return optimisticVehicle;
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => (v.id === id ? { ...v, ...updates } : v)));
    if (selectedVehicle?.id === id) {
      setSelectedVehicle(prev => (prev ? { ...prev, ...updates } : null));
    }

    try {
      const payload: any = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.brand !== undefined) payload.brand = updates.brand;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.price !== undefined) payload.price = Number(updates.price);
      if (updates.transmission !== undefined) payload.transmission = updates.transmission;
      if (updates.fuel !== undefined) payload.fuel = updates.fuel;
      if (updates.seats !== undefined) payload.seats = Number(updates.seats);
      if (updates.year !== undefined) payload.year = Number(updates.year);
      if (updates.mileage !== undefined) payload.mileage = updates.mileage;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.images !== undefined) payload.image_url = serializeVehicleImages(updates.images);
      if (updates.description !== undefined) payload.description = updates.description;

      if (Object.keys(payload).length > 0 && isValidUUID(id)) {
        await supabase
          .from('vehicles')
          .update(payload)
          .eq('id', id);
      }
    } catch (err) {}
  };

  const deleteVehicle = async (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    if (selectedVehicle?.id === id) setSelectedVehicle(null);

    try {
      if (isValidUUID(id)) {
        await supabase
          .from('vehicles')
          .delete()
          .eq('id', id);
      }
    } catch (err) {}
  };

  const setVehicleStatus = async (id: string, status: VehicleStatus) => {
    await updateVehicle(id, { status });
  };

  // Actions: Reservations (Supabase Insert/Update/Delete)
  const addReservation = async (data: Omit<Reservation, 'id' | 'createdAt'>): Promise<Reservation> => {
    const tempId = crypto.randomUUID ? crypto.randomUUID() : `temp-res-${Date.now()}`;
    const newReservation: Reservation = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString()
    };

    // Local state update
    setReservations(prev => [newReservation, ...prev]);

    // Block dates locally
    const newBlock: BlockedDate = {
      id: `blk-${tempId}`,
      vehicleId: data.vehicleId,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: `Réservation (${data.clientName})`
    };
    setBlockedDates(prev => [...prev, newBlock]);

    try {
      let vehicleUuid = data.vehicleId;
      if (!isValidUUID(vehicleUuid)) {
        const matched = vehicles.find(v => v.id === vehicleUuid || v.name === data.vehicleName);
        if (matched && isValidUUID(matched.id)) {
          vehicleUuid = matched.id;
        }
      }

      const payload: any = {
        client_name: data.clientName,
        client_phone: data.clientPhone,
        vehicle_name: data.vehicleName,
        start_date: data.startDate,
        end_date: data.endDate,
        status: data.status || 'En attente'
      };

      if (isValidUUID(vehicleUuid)) {
        payload.vehicle_id = vehicleUuid;
      }

      const { data: inserted, error } = await supabase
        .from('reservations')
        .insert(payload)
        .select()
        .single();

      if (!error && inserted) {
        const created = mapRowToReservation(inserted, vehicles);
        setReservations(prev => prev.map(r => r.id === tempId ? created : r));
        return created;
      }
    } catch (err) {}

    return newReservation;
  };

  const updateReservationStatus = async (id: string, status: ReservationStatus) => {
    setReservations(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));

    try {
      if (isValidUUID(id)) {
        await supabase
          .from('reservations')
          .update({ status })
          .eq('id', id);
      }
    } catch (err) {}
  };

  const deleteReservation = async (id: string) => {
    const target = reservations.find(r => r.id === id);
    setReservations(prev => prev.filter(r => r.id !== id));
    if (target) {
      setBlockedDates(prev => prev.filter(b => !b.reason.includes(target.id) && b.id !== `blk-${id}`));
    }

    try {
      if (isValidUUID(id)) {
        await supabase
          .from('reservations')
          .delete()
          .eq('id', id);
      }
    } catch (err) {}
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

  const resetDataToDefaults = async () => {
    setVehicles(INITIAL_VEHICLES);
    setReservations(INITIAL_RESERVATIONS);
    setBlockedDates(INITIAL_BLOCKED_DATES);
    await refreshData();
  };

  return (
    <AppContext.Provider
      value={{
        vehicles,
        reservations,
        blockedDates,
        isLoading,
        supabaseStatus,
        supabaseErrorMessage,
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
        resetDataToDefaults,
        refreshData
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
