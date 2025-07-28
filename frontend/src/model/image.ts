export interface HouseImage {
  id: number;
  url: string;
  alt: string;
  orderIndex: number;
  houseId: number;
}

export interface HouseImageFormData {
  id?: number;
  url: string;
  alt: string;
  order_index: number;
  houseId: number;
}
