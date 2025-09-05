
import type { Product, Transaction, User, AppSettings } from '../types';

// --- SIMULASI DATABASE ---
// Data ini akan di-reset setiap kali halaman di-refresh.
// Dalam aplikasi nyata, ini akan digantikan oleh panggilan ke database MySQL melalui backend.

let db = {
  products: [
    { id: 'prod_1', name: 'Kopi Susu Gula Aren', sku: 'KS-001', sellingPrice: 18000, costPrice: 10000, stock: 50, image: '' },
    { id: 'prod_2', name: 'Americano', sku: 'AM-001', sellingPrice: 15000, costPrice: 7000, stock: 30, image: '' },
    { id: 'prod_3', name: 'Croissant Cokelat', sku: 'CR-001', sellingPrice: 22000, costPrice: 12000, stock: 25, image: '' },
    { id: 'prod_4', name: 'Red Velvet Cake', sku: 'RV-001', sellingPrice: 35000, costPrice: 20000, stock: 15, image: '' },
    { id: 'prod_5', name: 'Matcha Latte', sku: 'ML-001', sellingPrice: 25000, costPrice: 15000, stock: 40, image: '' },
    { id: 'prod_6', name: 'Donat Gula', sku: 'DN-001', sellingPrice: 10000, costPrice: 4000, stock: 60, image: '' },
  ] as Product[],
  transactions: [] as Transaction[],
  users: [
    { id: 'user_1', username: 'admin', role: 'admin', password: 'admin123' },
    { id: 'user_2', username: 'kasir', role: 'kasir', password: 'kasir123' },
  ] as User[],
  appSettings: {
    appName: 'KasirCerdas',
    logo: '',
  } as AppSettings,
};

// Simulasi network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- API FUNCTIONS ---

const api = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    await delay(100);
    return [...db.products];
  },

  saveProduct: async (productData: Omit<Product, 'id'> & { id?: string }): Promise<Product> => {
    await delay(200);
    if (productData.id) { // Edit
      db.products = db.products.map(p => p.id === productData.id ? { ...p, ...productData } as Product : p);
      return db.products.find(p => p.id === productData.id)!;
    } else { // Add
      const newProduct: Product = {
        id: `prod_${new Date().getTime()}`,
        ...productData,
      };
      db.products.push(newProduct);
      return newProduct;
    }
  },

  deleteProduct: async (productId: string): Promise<void> => {
    await delay(200);
    db.products = db.products.filter(p => p.id !== productId);
  },

  // Transactions
  getTransactions: async (): Promise<Transaction[]> => {
    await delay(100);
    return [...db.transactions];
  },

  saveTransaction: async (
    transaction: Omit<Transaction, 'id' | 'date'>, 
    updatedProducts: Product[]
  ): Promise<Transaction> => {
    await delay(300);
    const newTransaction: Transaction = {
      ...transaction,
      id: `trans_${new Date().getTime()}`,
      date: new Date().toISOString(),
    };
    db.transactions.push(newTransaction);
    // Update stock in our simulated DB
    updatedProducts.forEach(up => {
      const productIndex = db.products.findIndex(p => p.id === up.id);
      if (productIndex !== -1) {
        db.products[productIndex].stock = up.stock;
      }
    });
    return newTransaction;
  },

  // Users & Auth
  login: async (username: string, password: string): Promise<User | null> => {
    await delay(300);
    const user = db.users.find(u => u.username === username && u.password === password);
    if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userToStore } = user;
        sessionStorage.setItem('pos-user', JSON.stringify(userToStore)); // Simulate session
        return userToStore;
    }
    return null;
  },
  
  logout: async (): Promise<void> => {
    await delay(100);
    sessionStorage.removeItem('pos-user');
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(50);
    const userJson = sessionStorage.getItem('pos-user');
    return userJson ? JSON.parse(userJson) : null;
  },
  
  getUsers: async (): Promise<User[]> => {
    await delay(100);
    return db.users.map(u => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
  },

  saveUser: async (userData: Omit<User, 'id'> & { id?: string }): Promise<User> => {
    await delay(200);
    if (userData.id) { // Edit
      db.users = db.users.map(u => {
        if (u.id === userData.id) {
            const updatedUser = { ...u, username: userData.username, role: userData.role };
            if (userData.password) {
                return { ...updatedUser, password: userData.password };
            }
            return updatedUser;
        }
        return u;
      });
      return db.users.find(u => u.id === userData.id)!;
    } else { // Add
        const newUser: User = {
            id: `user_${new Date().getTime()}`,
            username: userData.username,
            password: userData.password,
            role: userData.role,
        };
        db.users.push(newUser);
        return newUser;
    }
  },

  deleteUser: async (userId: string): Promise<void> => {
    await delay(200);
    db.users = db.users.filter(u => u.id !== userId);
  },

  // Settings
  getAppSettings: async (): Promise<AppSettings> => {
    await delay(50);
    return { ...db.appSettings };
  },

  saveAppSettings: async (settings: AppSettings): Promise<AppSettings> => {
    await delay(200);
    db.appSettings = { ...settings };
    return { ...db.appSettings };
  },

};

export default api;
