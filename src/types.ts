export type VehicleCategory = 'Économique' | 'Moyenne Gamme' | 'Luxe' | 'SUV';

export type TransmissionType = 'Manuelle' | 'Automatique';

export type FuelType = 'Essence' | 'Diesel' | 'Hybride' | 'Électrique';

export type VehicleStatus = 'Disponible' | 'En maintenance' | 'Réservée';

export type ReservationStatus = 'En attente' | 'Confirmée' | 'Annulée' | 'Terminée';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: VehicleCategory;
  price: number; // Price per day in DH
  transmission: TransmissionType;
  fuel: FuelType;
  seats: number;
  doors: number;
  year: number;
  mileage: string;
  status: VehicleStatus;
  images: string[];
  description: string;
  airConditioning: boolean;
  luggage: number; // number of suitcases
  minAge: number;
  deposit: number; // Caution in DH
  featured?: boolean;
}

export interface Reservation {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  pricePerDay: number;
  totalPrice: number;
  pickupLocation: string;
  returnLocation: string;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface BlockedDate {
  id: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  reason: string;
}
