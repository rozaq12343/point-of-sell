
import React, { useState } from 'react';
import type { User, UserRole } from '../types';
import Modal from './Modal';

interface UsersProps {
  users: User[];
  onSave: (user: Omit<User, 'id'> & { id?: string }) => void;
  onDelete: (userId: string) => void;
  currentUser: User;
}

const UserForm: React.FC<{
    user: Partial<User> | null;
    onSave: (user: Omit<User, 'id'> & { id?: string }) => void;
    onCancel: () => void;
    isEditing: boolean;
}> = ({ user, onSave, onCancel, isEditing }) => {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        password: '',
        role: user?.role || 'kasir',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing && !formData.password) {
            alert("Password wajib diisi untuk pengguna baru.");
            return;
        }
        onSave({ id: user?.id, ...formData });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700">Username</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder={isEditing ? "Kosongkan jika tidak ingin ganti" : ""} required={!isEditing} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700">Peran</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
                    <option value="kasir">Kasir</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors">Simpan</button>
            </div>
        </form>
    );
};


const Users: React.FC<UsersProps> = ({ users, onSave, onDelete, currentUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleAddUser = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteRequest = (user: User) => {
        if (user.id === currentUser.id) {
            alert("Anda tidak dapat menghapus akun Anda sendiri.");
            return;
        }
        setUserToDelete(user);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteUser = () => {
        if (userToDelete) {
            onDelete(userToDelete.id);
            setIsDeleteConfirmOpen(false);
            setUserToDelete(null);
        }
    };

    const handleSaveUser = (userData: Omit<User, 'id'> & { id?: string; password?: string }) => {
        onSave(userData);
        setIsModalOpen(false);
        setEditingUser(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Manajemen Pengguna</h2>
                <button onClick={handleAddUser} className="bg-sky-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-sky-600 transition-all duration-200 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Tambah Pengguna
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Username</th>
                            <th scope="col" className="px-6 py-3">Peran</th>
                            <th scope="col" className="px-6 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                                <th scope="row" className="px-6 py-4 font-medium text-slate-900">{user.username}</th>
                                <td className="px-6 py-4 capitalize">{user.role}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => handleEditUser(user)} className="font-medium text-sky-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDeleteRequest(user)} className="font-medium text-red-600 hover:underline" disabled={user.id === currentUser.id}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}>
                <UserForm 
                    user={editingUser} 
                    onSave={handleSaveUser} 
                    onCancel={() => setIsModalOpen(false)}
                    isEditing={!!editingUser}
                />
            </Modal>
            
            <Modal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} title="Konfirmasi Hapus Pengguna">
                {userToDelete && (
                    <div>
                        <p className="text-slate-600 mb-6">
                            Apakah Anda yakin ingin menghapus pengguna "<strong>{userToDelete.username}</strong>"? Tindakan ini tidak dapat diurungkan.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsDeleteConfirmOpen(false);
                                    setUserToDelete(null);
                                }}
                                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDeleteUser}
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

export default Users;
