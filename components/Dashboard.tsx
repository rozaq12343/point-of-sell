import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Product, Transaction } from '../types';
import { formatCurrency } from '../utils/formatter';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
}

const IconRevenue = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const IconProfit = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const IconTransactions = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const IconProducts = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m0 10l8 4m-8-4v-10" /></svg>;
const IconStockValue = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const IconWarning = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
  isCurrency?: boolean;
}> = ({ icon, title, value, isCurrency = false }) => {
    const formattedValue = isCurrency ? formatCurrency(value) : value.toLocaleString('id-ID');
    const valueStr = String(formattedValue);

    let sizeClass = 'text-2xl';
    // Adjust font size based on string length to prevent wrapping
    if (valueStr.length > 15) {
        sizeClass = 'text-lg';
    } else if (valueStr.length > 11) {
        sizeClass = 'text-xl';
    }

    const tooltipText = isCurrency
        ? `Nilai Tepat: ${formatCurrency(value)}`
        : `Jumlah Tepat: ${value.toLocaleString('id-ID')}`;

    return (
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-6 overflow-hidden">
            <div className="flex-shrink-0">{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-500 font-medium truncate">{title}</p>
                <div title={tooltipText} className="cursor-help">
                    <p className={`${sizeClass} font-bold text-slate-800 whitespace-nowrap truncate`}>{valueStr}</p>
                </div>
            </div>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ products, transactions }) => {
    const totalRevenue = useMemo(() => transactions.reduce((sum, t) => sum + t.total, 0), [transactions]);
    const totalProfit = useMemo(() => transactions.reduce((sum, t) => sum + t.profit, 0), [transactions]);
    const totalStockValue = useMemo(() => products.reduce((sum, p) => sum + p.costPrice * p.stock, 0), [products]);
    const lowStockProducts = useMemo(() => products.filter(p => p.stock < 10), [products]);

    const chartData = useMemo(() => {
        const dataByDay: { [key: string]: { Penjualan: number; Keuntungan: number } } = {};

        transactions.forEach(t => {
            const date = new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
            if (!dataByDay[date]) {
                dataByDay[date] = { Penjualan: 0, Keuntungan: 0 };
            }
            dataByDay[date].Penjualan += t.total;
            dataByDay[date].Keuntungan += t.profit;
        });

        return Object.entries(dataByDay)
            .map(([name, values]) => ({ name, ...values }))
            .slice(-10); // Show last 10 days of activity
    }, [transactions]);


    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <StatCard icon={<IconRevenue />} title="Total Pendapatan" value={totalRevenue} isCurrency />
                <StatCard icon={<IconProfit />} title="Total Keuntungan" value={totalProfit} isCurrency />
                <StatCard icon={<IconTransactions />} title="Jumlah Transaksi" value={transactions.length} />
                <StatCard icon={<IconProducts />} title="Jenis Produk" value={products.length} />
                <StatCard icon={<IconStockValue />} title="Nilai Stok" value={totalStockValue} isCurrency />
            </div>

            {lowStockProducts.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow">
                    <div className="flex items-start gap-3">
                        <IconWarning />
                        <div>
                            <p className="font-bold text-yellow-800">Peringatan Stok Rendah</p>
                            <p className="text-sm text-yellow-700">
                                Produk berikut memiliki stok di bawah 10 unit. Segera lakukan pengadaan ulang.
                            </p>
                            <ul className="mt-2 list-disc list-inside text-sm text-yellow-900 space-y-1">
                                {lowStockProducts.map(product => (
                                    <li key={product.id}>
                                        <strong>{product.name}</strong> - Sisa stok: {product.stock}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-md p-6 h-96">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Aktivitas Penjualan</h3>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                                <YAxis tickFormatter={(value) => formatCurrency(Number(value))} tick={{ fill: '#64748b' }} />
                                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }} formatter={(value) => [formatCurrency(Number(value)), 'Penjualan']} />
                                <Legend />
                                <Bar dataKey="Penjualan" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            Belum ada data penjualan untuk ditampilkan.
                        </div>
                    )}
                </div>
                 <div className="bg-white rounded-xl shadow-md p-6 h-96">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Grafik Keuntungan</h3>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                                <YAxis tickFormatter={(value) => formatCurrency(Number(value))} tick={{ fill: '#64748b' }} />
                                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }} formatter={(value) => [formatCurrency(Number(value)), 'Keuntungan']} />
                                <Legend />
                                <Bar dataKey="Keuntungan" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            Belum ada data keuntungan untuk ditampilkan.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;