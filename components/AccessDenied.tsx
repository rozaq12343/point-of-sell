
import React from 'react';
import type { View } from '../types';

interface AccessDeniedProps {
  setView: (view: View) => void;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ setView }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-white rounded-xl shadow-md p-8">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
      <h2 className="text-4xl font-bold text-slate-800">Akses Ditolak</h2>
      <p className="text-slate-500 mt-2 mb-6 max-w-sm">Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.</p>
      <button
        onClick={() => setView('pos')} // Default ke halaman POS untuk kasir
        className="bg-sky-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-sky-600 transition-all duration-200"
      >
        Kembali ke Halaman Kasir
      </button>
    </div>
  );
};

export default AccessDenied;
