export interface Sale {
  id: string;
  amount: number;
  customerType: 'loyalty' | 'customer';
  salesChannel: 'instore' | 'online';
  date: string;
}

export interface SaleData {
  loyalty: number,
  customer: number,
  instore: number,
  online: number
}

export interface SaleKey {
  customerType: keyof SaleData;
  salesChannel: keyof SaleData;
}

export interface DailyData {
  [key: string]: Sale[]
}

export interface MockData {
  [key: string]: any; // or a more specific type if you know the structure
}