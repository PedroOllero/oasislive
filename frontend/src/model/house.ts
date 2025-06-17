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
    year_built: number;
    images: string[];
  }