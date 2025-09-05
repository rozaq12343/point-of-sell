import React, { useState } from 'react';
import type { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatter';

interface TransactionsProps {
  transactions: Transaction[];
}

const Transactions: React.FC<TransactionsProps> = ({ transactions }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    
    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Riwayat Transaksi</h2>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID Transaksi</th>
                            <th scope="col" className="px-6 py-3">Tanggal</th>
                            <th scope="col" className="px-6 py-3">Total Barang</th>
                            <th scope="col" className="px-6 py-3">Total Harga</th>
                            <th scope="col" className="px-6 py-3">Keuntungan</th>
                            <th scope="col" className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(transaction => (
                            <React.Fragment key={transaction.id}>
                                <tr className="bg-white border-b hover:bg-slate-50">
                                    <th scope="row" className="px-6 py-4 font-mono text-xs text-slate-700">{transaction.id}</th>
                                    <td className="px-6 py-4">{formatDate(transaction.date)}</td>
                                    <td className="px-6 py-4">{transaction.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-800">{formatCurrency(transaction.total)}</td>
                                    <td className="px-6 py-4 font-semibold text-green-600">{formatCurrency(transaction.profit)}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => toggleExpand(transaction.id)} className="font-medium text-sky-600">
                                            {expandedId === transaction.id ? 'Tutup' : 'Detail'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedId === transaction.id && (
                                    <tr className="bg-slate-50">
                                        <td colSpan={6} className="p-4">
                                            <div className="p-4 bg-white rounded-md border">
                                                <h4 className="font-semibold mb-2">Detail Item:</h4>
                                                <ul className="divide-y divide-slate-200">
                                                    {transaction.items.map(item => (
                                                        <li key={item.productId} className="flex justify-between py-2 text-sm">
                                                            <span>{item.name} (x{item.quantity})</span>
                                                            <span>{formatCurrency(item.sellingPrice * item.quantity)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                 {transactions.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                        Belum ada transaksi yang tercatat.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;