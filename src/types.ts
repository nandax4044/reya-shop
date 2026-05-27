export interface Item {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  inStock: boolean;
  featured: boolean;
}

export interface ShopData {
  shopName: string;
  whatsappNumber: string;
  currency: string;
  items: Item[];
}
