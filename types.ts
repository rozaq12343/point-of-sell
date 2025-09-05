
export interface Product {
  id: string;
  name: string;
  sellingPrice: number;
  costPrice: number;
  stock: number;
  sku: string;
  image?: string;
}

export interface CartItem {
  productId: string;
  name:string;
  sellingPrice: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  profit: number;
  date: string; // ISO 8601 format
}

export type UserRole = 'admin' | 'kasir';

export interface User {
    id: string;
    username: string;
    role: UserRole;
    password?: string; // Diperlukan untuk form login dan manajemen user
}

export interface AppSettings {
  appName: string;
  logo: string; // base64 data URL
}


export type View = 'dashboard' | 'pos' | 'inventory' | 'transactions' | 'users' | 'settings';