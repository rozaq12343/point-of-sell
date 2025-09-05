
import React, { useState } from 'react';
import type { Product, CartItem, Transaction } from '../types';
import { formatCurrency } from '../utils/formatter';

interface POSProps {
  products: Product[];
  onCheckout: (data: { transaction: Omit<Transaction, 'id' | 'date'>; updatedProducts: Product[] }) => void;
}

const POS: React.FC<POSProps> = ({ products, onCheckout }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const addToCart = (product: Product) => {
        if (product.stock <= 0) {
            alert("Stok produk habis!");
            return;
        }

        const existingItem = cart.find(item => item.productId === product.id);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            } else {
                alert("Jumlah melebihi stok yang tersedia!");
            }
        } else {
            setCart([...cart, { productId: product.id, name: product.name, sellingPrice: product.sellingPrice, quantity: 1 }]);
        }
    };

    const updateQuantity = (productId: string, quantity: number) => {
        const product = products.find(p => p.id === productId);
        if (product && quantity > product.stock) {
            alert("Jumlah melebihi stok yang tersedia!");
            return;
        }

        if (quantity <= 0) {
            setCart(cart.filter(item => item.productId !== productId));
        } else {
            setCart(cart.map(item => item.productId === productId ? { ...item, quantity } : item));
        }
    };
    
    const total = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("Keranjang kosong!");
            return;
        }
        
        const totalProfit = cart.reduce((profitSum, item) => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                const itemProfit = (item.sellingPrice - product.costPrice) * item.quantity;
                return profitSum + itemProfit;
            }
            return profitSum;
        }, 0);

        const newTransaction: Omit<Transaction, 'id' | 'date'> = {
            items: cart,
            total,
            profit: totalProfit,
        };
        
        const updatedProducts = products.map(p => {
            const cartItem = cart.find(item => item.productId === p.id);
            if (cartItem) {
                return { ...p, stock: p.stock - cartItem.quantity };
            }
            return p;
        });

        onCheckout({ transaction: newTransaction, updatedProducts });
        setCart([]);
    };
    
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="flex h-[calc(100vh-4rem)] gap-6">
            {/* Product List */}
            <div className="w-3/5 flex flex-col">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Pilih Produk</h2>
                 <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 mb-4 bg-white text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <button key={product.id} onClick={() => addToCart(product)} disabled={product.stock === 0} className="bg-white rounded-lg shadow p-3 text-left border-2 border-transparent hover:border-sky-500 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col">
                                <div className="w-full h-24 bg-slate-200 rounded mb-2 flex items-center justify-center text-slate-400 overflow-hidden">
                                     {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-sm text-slate-800 truncate">{product.name}</h3>
                                        <p className="text-xs text-slate-500">Stok: {product.stock}</p>
                                    </div>
                                    <p className="font-bold text-sky-600 mt-1">{formatCurrency(product.sellingPrice)}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart */}
            <div className="w-2/5 bg-white rounded-xl shadow-lg flex flex-col">
                <div className="p-5 border-b">
                    <h2 className="text-xl font-bold text-slate-800">Keranjang</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {cart.length === 0 ? (
                        <p className="text-slate-500 text-center mt-8">Keranjang belanja kosong.</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.productId} className="flex items-center gap-4">
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800">{item.name}</p>
                                    <p className="text-sm text-slate-500">{formatCurrency(item.sellingPrice)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        value={item.quantity} 
                                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                                        className="w-16 text-center border rounded-md py-1"
                                        min="0"
                                    />
                                </div>
                                <p className="font-semibold w-24 text-right">{formatCurrency(item.sellingPrice * item.quantity)}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-5 bg-slate-50 rounded-b-xl border-t mt-auto">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-slate-600">Total</span>
                        <span className="text-2xl font-bold text-slate-800">{formatCurrency(total)}</span>
                    </div>
                    <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-600 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed">
                        Bayar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POS;
