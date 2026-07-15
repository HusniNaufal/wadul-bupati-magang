'use client';

import React, { useState } from 'react';
import { Aduan } from '@/lib/types';

interface AduanTableProps {
  data: Aduan[];
  onDetailClick: (aduan: Aduan) => void;
}

export default function AduanTable({ data, onDetailClick }: AduanTableProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Proses' | 'Selesai'>('All');

  const filteredData = data.filter((item) => {
    if (statusFilter === 'All') return true;
    return item.status === statusFilter;
  });

  const getStatusBadge = (status: 'Pending' | 'Proses' | 'Selesai') => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            Pending
          </span>
        );
      case 'Proses':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Proses
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Table Header Filter controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Daftar Laporan Aduan</h3>
          <p className="text-xs text-slate-500 mt-1">Mengelola aduan masyarakat yang masuk ke dinas Anda.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Filter Status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all"
          >
            <option value="All">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Proses">Proses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-4 px-6">No. Tiket</th>
              <th className="py-4 px-6">Waktu Masuk</th>
              <th className="py-4 px-6">Judul Aduan</th>
              <th className="py-4 px-6">Dinas</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                  Tidak ada laporan aduan ditemukan.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                  <td className="py-4 px-6 font-bold text-slate-900">{item.no_tiket}</td>
                  <td className="py-4 px-6 text-slate-500">{item.waktu_masuk}</td>
                  <td className="py-4 px-6 font-medium">{item.judul_aduan || item.kategori}</td>
                  <td className="py-4 px-6">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded text-xs">
                      {item.dinas}
                    </span>
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(item.status)}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onDetailClick(item)}
                      className="px-3.5 py-1.5 bg-[#356a70] text-white rounded-lg text-xs font-semibold hover:bg-[#2c5c61] transition-colors shadow-sm"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer statistics */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
        <span>Menampilkan {filteredData.length} dari {data.length} total aduan</span>
      </div>
    </div>
  );
}
