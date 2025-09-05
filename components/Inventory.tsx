
import React, { useState } from 'react';
import type { Product } from '../types';
import { formatCurrency } from '../utils/formatter';
import Modal from './Modal';

interface InventoryProps {
  products: Product[];
  onSave: (product: Omit<Product, 'id'> & { id?: string }) => void;
  onDelete: (productId: string) => void;
}

const ProductForm: React.FC<{
    product: Partial<Product> | null;
    onSave: (product: Omit<Product, 'id'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        sku: product?.sku || '',
        sellingPrice: product?.sellingPrice || 0,
        costPrice: product?.costPrice || 0,
        stock: product?.stock || 0,
        image: product?.image || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'sellingPrice' || name === 'costPrice' || name === 'stock') {
            const numericValue = value.replace(/[^0-9]/g, ''); // Allow only digits
            setFormData(prev => ({
                ...prev,
                [name]: numericValue === '' ? 0 : parseInt(numericValue, 10)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    image: event.target?.result as string
                }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: product?.id, ...formData });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="image" className="block text-sm font-medium text-slate-700">Gambar Produk</label>
                <div className="mt-1 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md bg-slate-200 flex items-center justify-center overflow-hidden">
                        {formData.image ? (
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        )}
                    </div>
                    <input 
                        type="file" 
                        id="image" 
                        name="image" 
                        accept="image/png, image/jpeg, image/webp" 
                        onChange={handleImageChange} 
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" 
                    />
                </div>
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nama Produk</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="sku" className="block text-sm font-medium text-slate-700">SKU (Kode Barang)</label>
                <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="costPrice" className="block text-sm font-medium text-slate-700">Harga Beli</label>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" id="costPrice" name="costPrice" value={formData.costPrice} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="sellingPrice" className="block text-sm font-medium text-slate-700">Harga Jual</label>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" id="sellingPrice" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
                </div>
            </div>
            <div>
                <label htmlFor="stock" className="block text-sm font-medium text-slate-700">Stok</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" id="stock" name="stock" value={formData.stock} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors">Simpan</button>
            </div>
        </form>
    );
};

const Inventory: React.FC<InventoryProps> = ({ products, onSave, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteRequest = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteConfirmOpen(true);
    };
    
    const confirmDeleteProduct = () => {
        if (productToDelete) {
            onDelete(productToDelete.id);
            setIsDeleteConfirmOpen(false);
            setProductToDelete(null);
        }
    };

    const handleSaveProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
        onSave(productData);
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Manajemen Inventaris</h2>
                <button onClick={handleAddProduct} className="bg-sky-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-sky-600 transition-all duration-200 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Tambah Produk
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 w-20">Gambar</th>
                            <th scope="col" className="px-6 py-3">Nama Produk</th>
                            <th scope="col" className="px-6 py-3">SKU</th>
                            <th scope="col" className="px-6 py-3">Harga Beli</th>
                            <th scope="col" className="px-6 py-3">Harga Jual</th>
                            <th scope="col" className="px-6 py-3">Stok</th>
                            <th scope="col" className="px-6 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                                    ) : (
                                        <div className="w-12 h-12 bg-slate-200 rounded-md flex items-center justify-center text-slate-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    )}
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{product.name}</th>
                                <td className="px-6 py-4">{product.sku}</td>
                                <td className="px-6 py-4">{formatCurrency(product.costPrice)}</td>
                                <td className="px-6 py-4">{formatCurrency(product.sellingPrice)}</td>
                                <td className="px-6 py-4">{product.stock}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEditProduct(product)} className="font-medium text-sky-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDeleteRequest(product)} className="font-medium text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {products.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                        Tidak ada produk. Silakan tambahkan produk baru.
                    </div>
                )}
            </div>

            {/* Add/Edit Product Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}>
                <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} title="Konfirmasi Hapus Produk">
                {productToDelete && (
                    <div>
                        <p className="text-slate-600 mb-6">
                            Apakah Anda yakin ingin menghapus produk "<strong>{productToDelete.name}</strong>"? Tindakan ini tidak dapat diurungkan.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsDeleteConfirmOpen(false);
                                    setProductToDelete(null);
                                }}
                                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDeleteProduct}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Inventory;
