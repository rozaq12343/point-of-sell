
import React, { useState, useEffect } from 'react';
import type { Product, Transaction, View, User, AppSettings } from './types';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import POS from './components/POS';
import Transactions from './components/Transactions';
import Login from './components/Login';
import AccessDenied from './components/AccessDenied';
import Users from './components/Users';
import Settings from './components/Settings';
import api from './services/api';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      try {
        const [
          initialProducts, 
          initialTransactions, 
          initialUsers, 
          initialSettings,
          loggedInUser
        ] = await Promise.all([
          api.getProducts(),
          api.getTransactions(),
          api.getUsers(),
          api.getAppSettings(),
          api.getCurrentUser()
        ]);
        setProducts(initialProducts);
        setTransactions(initialTransactions);
        setUsers(initialUsers);
        setAppSettings(initialSettings);
        
        if (loggedInUser) {
           setCurrentUser(loggedInUser);
           setCurrentView(loggedInUser.role === 'admin' ? 'dashboard' : 'pos');
        }

      } catch (error) {
        console.error("Failed to initialize app:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  const refreshProducts = async () => {
    const data = await api.getProducts();
    setProducts(data);
  };
  
  const handleCheckout = async (data: { transaction: Omit<Transaction, 'id' | 'date'>; updatedProducts: Product[] }) => {
    await api.saveTransaction(data.transaction, data.updatedProducts);
    const [newTransactions, newProducts] = await Promise.all([api.getTransactions(), api.getProducts()]);
    setTransactions(newTransactions);
    setProducts(newProducts);
    alert('Transaksi berhasil!');
  };
  
  const handleSaveProduct = async (productData: Omit<Product, 'id'> & { id?: string }) => {
      await api.saveProduct(productData);
      refreshProducts();
  };

  const handleDeleteProduct = async (productId: string) => {
      await api.deleteProduct(productId);
      refreshProducts();
  };
  
  const handleSaveUser = async (userData: Omit<User, 'id'> & { id?: string }) => {
    await api.saveUser(userData);
    const newUsers = await api.getUsers();
    setUsers(newUsers);
  };
  
  const handleDeleteUser = async (userId: string) => {
    await api.deleteUser(userId);
    const newUsers = await api.getUsers();
    setUsers(newUsers);
  };

  const handleSaveSettings = async (settings: AppSettings) => {
    const newSettings = await api.saveAppSettings(settings);
    setAppSettings(newSettings);
    alert('Pengaturan berhasil disimpan!');
  };

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    const user = await api.login(username, password);
    if (user) {
      setCurrentUser(user);
      setCurrentView(user.role === 'admin' ? 'dashboard' : 'pos');
      return true;
    }
    return false;
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
  };

  const renderView = () => {
    if (isLoading || !appSettings) {
        return <div className="flex items-center justify-center h-full"><p>Loading...</p></div>;
    }

    // Role-based access control
    const forbiddenViews: View[] = ['dashboard', 'inventory', 'users', 'settings'];
    if (currentUser?.role === 'kasir' && forbiddenViews.includes(currentView)) {
        return <AccessDenied setView={setCurrentView} />;
    }
      
    switch (currentView) {
      case 'dashboard':
        return <Dashboard products={products} transactions={transactions} />;
      case 'inventory':
        return <Inventory products={products} onSave={handleSaveProduct} onDelete={handleDeleteProduct} />;
      case 'pos':
        return <POS products={products} onCheckout={handleCheckout} />;
      case 'transactions':
        return <Transactions transactions={transactions} />;
      case 'users':
        return <Users users={users} onSave={handleSaveUser} onDelete={handleDeleteUser} currentUser={currentUser!} />;
       case 'settings':
        return <Settings appSettings={appSettings} onSave={handleSaveSettings} />;
      default:
        return <Dashboard products={products} transactions={transactions} />;
    }
  };

  if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <p className="text-slate-500">Memuat Aplikasi...</p>
        </div>
      );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} appSettings={appSettings!} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView}
        currentUser={currentUser}
        onLogout={handleLogout}
        appSettings={appSettings!}
      />
      <main className="flex-1 overflow-y-auto p-8">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
