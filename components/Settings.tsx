
import React, { useState } from 'react';
import type { AppSettings } from '../types';

interface SettingsProps {
  appSettings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ appSettings, onSave }) => {
    const [formState, setFormState] = useState<AppSettings>(appSettings);
    const [imagePreview, setImagePreview] = useState<string | null>(appSettings.logo);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setFormState(prev => ({ ...prev, logo: result }));
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemoveImage = () => {
        setFormState(prev => ({ ...prev, logo: '' }));
        setImagePreview(null);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Pengaturan Aplikasi</h2>
            <div className="max-w-2xl bg-white p-8 rounded-xl shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="appName" className="block text-sm font-medium text-slate-700 mb-1">Nama Aplikasi</label>
                        <input
                            type="text"
                            id="appName"
                            name="appName"
                            value={formState.appName}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Logo Aplikasi</label>
                        <div className="mt-2 flex items-center gap-6">
                            <div className="w-24 h-24 rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Logo Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                )}
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    id="logo"
                                    name="logo"
                                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                                />
                                {imagePreview && (
                                     <button type="button" onClick={handleRemoveImage} className="text-sm text-red-600 hover:text-red-800">
                                        Hapus Logo
                                    </button>
                                )}
                            </div>
                        </div>
                         <p className="text-xs text-slate-500 mt-2">Disarankan gambar persegi (rasio 1:1) dan ukuran di bawah 500KB.</p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-md shadow-md hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
