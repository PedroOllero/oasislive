import type { HouseImage } from "./image";

export interface House {
  id?: number;
  title: string;
  price: number;
  description: string;
  flat: string;
  mapAddress: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  total_area: number;
  living_area: number;
  garage: boolean;
  accesible: boolean;
  garden: boolean;
  pet: boolean;
  airConditioned: boolean;
  heating: boolean;
  furnished: boolean;
  terrace: boolean;
  active: boolean;
  rentable: boolean;
  construction_year: number;
  images: HouseImage[];
}

export interface HouseFormData {
  id?: number;
  title: string;
  price: number;
  description: string;
  flat: string;
  mapAddress: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  total_area: number;
  living_area: number;
  garage: boolean;
  accesible: boolean;
  garden: boolean;
  pet: boolean;
  airConditioned: boolean;
  heating: boolean;
  furnished: boolean;
  terrace: boolean;
  active: boolean;
  rentable: boolean;
  construction_year: number;
}
