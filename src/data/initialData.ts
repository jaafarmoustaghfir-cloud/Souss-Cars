import { Vehicle, Reservation, BlockedDate } from '../types';

export const LOGO_URL = 'https://i.imgur.com/uqFZzGb.png';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'ssc-logan-1',
    name: 'Dacia Logan',
    brand: 'Dacia',
    category: 'Économique',
    price: 250,
    transmission: 'Manuelle',
    fuel: 'Essence',
    seats: 5,
    doors: 4,
    year: 2023,
    mileage: '24 000 km',
    status: 'Disponible',
    images: [
      'https://i.imgur.com/lpH5TdO.jpeg',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'La Dacia Logan est la berline économique par excellence à Agadir. Spacieuse, confortable et très économique en consommation, elle convient parfaitement aux familles et professionnels pour la ville ou les trajets à travers le Souss.',
    airConditioning: true,
    luggage: 3,
    minAge: 21,
    deposit: 2000,
    featured: true
  },
  {
    id: 'ssc-duster-1',
    name: 'Dacia Duster',
    brand: 'Dacia',
    category: 'SUV',
    price: 400,
    transmission: 'Manuelle',
    fuel: 'Diesel',
    seats: 5,
    doors: 5,
    year: 2023,
    mileage: '18 500 km',
    status: 'Disponible',
    images: [
      'https://i.imgur.com/uQeraUN.jpeg',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Le Dacia Duster est un SUV robuste et polyvalent. Idéal pour explorer la région d’Agadir, Taghazout, Paradise Valley, ou les plages sauvages du Sud marocain avec un confort surélevé et une excellente tenue de route.',
    airConditioning: true,
    luggage: 4,
    minAge: 23,
    deposit: 3000,
    featured: true
  },
  {
    id: 'ssc-clio-1',
    name: 'Renault Clio 4',
    brand: 'Renault',
    category: 'Économique',
    price: 250,
    transmission: 'Manuelle',
    fuel: 'Essence',
    seats: 5,
    doors: 5,
    year: 2022,
    mileage: '32 000 km',
    status: 'Disponible',
    images: [
      'https://i.imgur.com/GitUGDV.jpeg',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'La Renault Clio 4 est la citadine compacte moderne par excellence. Dynamique, agile et facile à garer partout à Agadir et sur la corniche, elle offre un plaisir de conduite et une consommation minimale.',
    airConditioning: true,
    luggage: 2,
    minAge: 21,
    deposit: 2000,
    featured: true
  }
];

export const PRESET_CAR_IMAGES = [
  { label: 'Dacia Logan (Officiel)', url: 'https://i.imgur.com/lpH5TdO.jpeg' },
  { label: 'Dacia Duster (Officiel)', url: 'https://i.imgur.com/uQeraUN.jpeg' },
  { label: 'Renault Clio 4 (Officiel)', url: 'https://i.imgur.com/GitUGDV.jpeg' },
  { label: 'Berline Blanche Économique', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
  { label: 'SUV Noir Moderne', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Citadine Rouge Sport', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Berline Noire Luxe', url: 'https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1200&q=80' },
  { label: 'SUV Blanc Tout-Terrain', url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80' },
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    clientName: 'Yassine El Amrani',
    clientPhone: '+212612345678',
    clientEmail: 'yassine.amrani@gmail.com',
    vehicleId: 'ssc-logan-1',
    vehicleName: 'Dacia Logan',
    vehicleImage: 'https://i.imgur.com/lpH5TdO.jpeg',
    startDate: '2026-08-25',
    endDate: '2026-08-28',
    totalDays: 3,
    pricePerDay: 250,
    totalPrice: 750,
    pickupLocation: 'Aéroport Agadir Al Massira',
    returnLocation: 'Aéroport Agadir Al Massira',
    notes: 'Vol arrivant à 14h30, souhaite récupérer la voiture à la sortie.',
    status: 'Confirmée',
    createdAt: '2026-08-24T10:15:00Z'
  },
  {
    id: 'res-102',
    clientName: 'Sarah Dupont',
    clientPhone: '+33612345678',
    clientEmail: 'sarah.dupont@orange.fr',
    vehicleId: 'ssc-duster-1',
    vehicleName: 'Dacia Duster',
    vehicleImage: 'https://i.imgur.com/uQeraUN.jpeg',
    startDate: '2026-08-27',
    endDate: '2026-09-02',
    totalDays: 6,
    pricePerDay: 400,
    totalPrice: 2400,
    pickupLocation: 'Hôtel / Riad à Agadir (Taghazout Bay)',
    returnLocation: 'Aéroport Agadir Al Massira',
    notes: 'Besoin d’un siège bébé.',
    status: 'En attente',
    createdAt: '2026-08-24T11:45:00Z'
  },
  {
    id: 'res-103',
    clientName: 'Omar Benjelloun',
    clientPhone: '+212678901234',
    vehicleId: 'ssc-clio-1',
    vehicleName: 'Renault Clio 4',
    vehicleImage: 'https://i.imgur.com/GitUGDV.jpeg',
    startDate: '2026-08-20',
    endDate: '2026-08-23',
    totalDays: 3,
    pricePerDay: 250,
    totalPrice: 750,
    pickupLocation: 'Agence Hay Elhouda, Agadir',
    returnLocation: 'Agence Hay Elhouda, Agadir',
    status: 'Terminée',
    createdAt: '2026-08-19T09:00:00Z'
  }
];

export const INITIAL_BLOCKED_DATES: BlockedDate[] = [
  {
    id: 'blk-1',
    vehicleId: 'ssc-logan-1',
    startDate: '2026-08-25',
    endDate: '2026-08-28',
    reason: 'Réservation #res-101 (Yassine)'
  },
  {
    id: 'blk-2',
    vehicleId: 'ssc-duster-1',
    startDate: '2026-08-27',
    endDate: '2026-09-02',
    reason: 'Réservation #res-102 (Sarah Dupont)'
  }
];

export const BUSINESS_INFO = {
  name: 'Sky Souss Cars',
  tagline: 'Location de voiture à Agadir — À partir de 250 DH/jour',
  logoUrl: 'https://i.imgur.com/uqFZzGb.png',
  logoUrlAlt: 'https://i.imgur.com/uqFZzGb.jpeg',
  phonePrimary: '+212 665-868600',
  phonePrimaryRaw: '212665868600',
  phoneSecondary: '0634558156',
  phoneSecondaryRaw: '212634558156',
  email: 'contact@skysousscars.ma',
  address: 'Hay Elhouda, Agadir 80000, Maroc',
  city: 'Agadir, Maroc',
  instagram: '@skysousscars',
  instagramUrl: 'https://www.instagram.com/skysousscars?igsi=MXc0MWhkbG94ZG5ueA==',
  whatsappUrl: 'https://wa.me/212665868600?text=Bonjour%20Sky%20Souss%20Cars,%20je%20souhaite%20louer%20une%20voiture%20%C3%A0%20Agadir.',
  hours: 'Lun - Dim : 08:00 - 22:00 (Assistance téléphonique 24h/24)',
  basePriceDH: 250,
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13764.582877546648!2d-9.5639147!3d30.4035671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6f00db10aab%3A0xb3dc57088b39eaec!2sHay%20El%20Houda%2C%20Agadir!5e0!3m2!1sfr!2sma!4v1700000000000!5m2!1sfr!2sma'
};
