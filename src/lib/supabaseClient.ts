import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://mkwrrrptredsqbjoztux.supabase.co';
const supabaseAnonKey: string = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_11PRQDzWdZX9uSPBzSXp5g_vxOn_K-m';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseVehicleRow {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  transmission: string;
  fuel: string;
  seats: number;
  year: number;
  mileage: string;
  status: string;
  image_url: string | null;
  description: string | null;
  created_at?: string;
}

export interface SupabaseReservationRow {
  id: string;
  client_name: string;
  client_phone: string;
  vehicle_id: string;
  vehicle_name: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at?: string;
}

export const SUPABASE_SCHEMA_SQL = `-- Script SQL à exécuter dans le SQL Editor de Supabase (https://supabase.com/dashboard/project/mkwrrrptredsqbjoztux/sql/new)

-- 1. Création de la table 'vehicles'
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Économique',
  price NUMERIC NOT NULL DEFAULT 350,
  transmission TEXT NOT NULL DEFAULT 'Manuelle',
  fuel TEXT NOT NULL DEFAULT 'Essence',
  seats INT NOT NULL DEFAULT 5,
  year INT NOT NULL DEFAULT 2023,
  mileage TEXT DEFAULT '20 000 km',
  status TEXT NOT NULL DEFAULT 'Disponible',
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Création de la table 'reservations'
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  vehicle_id UUID,
  vehicle_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'En attente',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Activer Row Level Security (RLS) et autoriser l'accès anonyme (anon)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public insert vehicles" ON public.vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update vehicles" ON public.vehicles FOR UPDATE USING (true);
CREATE POLICY "Allow public delete vehicles" ON public.vehicles FOR DELETE USING (true);

CREATE POLICY "Allow public read reservations" ON public.reservations FOR SELECT USING (true);
CREATE POLICY "Allow public insert reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update reservations" ON public.reservations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete reservations" ON public.reservations FOR DELETE USING (true);

-- 4. Configuration du Bucket de Stockage 'vehicle-images' (Public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policies de stockage pour autoriser l'upload et la lecture des photos
CREATE POLICY "Allow public select vehicle-images" ON storage.objects FOR SELECT USING (bucket_id = 'vehicle-images');
CREATE POLICY "Allow public insert vehicle-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vehicle-images');
CREATE POLICY "Allow public update vehicle-images" ON storage.objects FOR UPDATE USING (bucket_id = 'vehicle-images');
CREATE POLICY "Allow public delete vehicle-images" ON storage.objects FOR DELETE USING (bucket_id = 'vehicle-images');

-- 5. Activer Supabase Realtime sur les deux tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;

-- 6. Recharger le cache du schéma PostgREST
NOTIFY pgrst, 'reload schema';
`;

export { uploadVehicleImage } from '../utils/imageUtils';

