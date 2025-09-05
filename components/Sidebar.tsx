import React from 'react';
// FIX: Import UserRole to be used for typing navigation items.
import type { View, User, UserRole, AppSettings } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  currentUser: User | null;
  onLogout: () => void;
  appSettings: AppSettings;
}

const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const IconPOS = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const IconInventory = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m0 10l8 4m-8-4v-10" /></svg>;
const IconTransactions = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;


// FIX: Explicitly type allNavItems to ensure roles is `readonly UserRole[]`, fixing the type error with `includes()`.
const allNavItems: { id: View; label: string; icon: JSX.Element; roles: readonly UserRole[] }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard />, roles: ['admin'] },
    { id: 'pos', label: 'Kasir (POS)', icon: <IconPOS />, roles: ['admin', 'kasir'] },
    { id: 'inventory', label: 'Inventaris', icon: <IconInventory />, roles: ['admin'] },
    { id: 'transactions', label: 'Transaksi', icon: <IconTransactions />, roles: ['admin', 'kasir'] },
    { id: 'users', label: 'Pengguna', icon: <IconUsers />, roles: ['admin'] },
    { id: 'settings', label: 'Pengaturan', icon: <IconSettings />, roles: ['admin'] },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, currentUser, onLogout, appSettings }) => {
    
    const availableNavItems = allNavItems.filter(item => currentUser && item.roles.includes(currentUser.role));

    return (
        <aside className="w-64 bg-slate-800 text-slate-200 flex flex-col">
            <div className="h-20 flex items-center justify-center gap-3 border-b border-slate-700 px-4">
                {appSettings.logo ? (
                    <img src={appSettings.logo} alt="App Logo" className="h-10 w-auto max-w-[40px] object-contain" />
                ) : null}
                <h1 className="text-xl font-bold text-white truncate">
                    {appSettings.appName === 'KasirCerdas' ? 
                        (<>Kasir<span className="text-sky-400">Cerdas</span></>) : 
                        appSettings.appName
                    }
                </h1>
            </div>
            <nav className="flex-1 px-4 py-6">
                <ul>
                    {availableNavItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => setView(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-3 my-1 rounded-lg transition-all duration-200 ${
                                    currentView === item.id 
                                    ? 'bg-sky-500 text-white shadow-lg' 
                                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-slate-700">
                {currentUser && (
                    <div className="text-center mb-4">
                        <p className="font-semibold text-white">{currentUser.username}</p>
                        <p className="text-xs text-slate-400 capitalize">{currentUser.role}</p>
                    </div>
                )}
                 <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-slate-400 hover:bg-red-500 hover:text-white"
                >
                    <IconLogout />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;