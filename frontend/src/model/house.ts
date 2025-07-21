import type { HouseImage } from "./image";

export interface House {
  id: number;
  title: string;
  price: number;
  description: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  total_area: number;
  living_area: number;
  garage: boolean;
  terrace: boolean;
  active: boolean;
  rentable: boolean;
  construction_year: number;
  images: HouseImage[];
}

export interface HouseFormData {
  title: string;
  price: number;
  description: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  total_area: number;
  living_area: number;
  garage: boolean;
  terrace: boolean;
  active: boolean;
  rentable: boolean;
  construction_year: number;
}
