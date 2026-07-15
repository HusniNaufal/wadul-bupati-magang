'use client';

import React, { useState, useEffect } from 'react';
import { Aduan } from '@/lib/types';

interface DetailModalProps {
  aduan: Aduan | null;
  onClose: () => void;
  onSaveStatus: (id: number, status: 'Pending' | 'Proses' | 'Selesai', balasan_dinas: string) => Promise<void>;
}

export default function DetailModal({ aduan, onClose, onSaveStatus }: DetailModalProps) {
  const [status, setStatus] = useState<'Pending' | 'Proses' | 'Selesai'>('Pending');
  const [balasanDinas, setBalasanDinas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (aduan) {
      setStatus(aduan.status);
      setBalasanDinas(aduan.balasan_dinas || '');
    }
  }, [aduan]);

  if (!aduan) return null;

  const hasPhoto = aduan.foto_bukti &&
    aduan.foto_bukti !== '' &&
    aduan.foto_bukti !== 'tidak_ada_foto.jpg';

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSaveStatus(aduan.id, status, balasanDinas);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 flex flex-col animate-in fade-in duration-200">
      {/* Top Header Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-bold text-[#356a70] hover:text-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </button>

          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200">
              Tiket: {aduan.no_tiket}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
        {/* <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase ">
          Detail Laporan Aduan
        </h2> */}

        {/* 2-Column grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LEFT COLUMN: Photo Attachment & Description */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Foto Bukti / Lampiran</h4>
              {hasPhoto ? (
                <div className="rounded-lg border border-slate-200 overflow-hidden shadow-inner bg-slate-50 flex items-center justify-center p-2">
                  <img
                    src={`/uploads/${aduan.foto_bukti}`}
                    alt="Bukti aduan"
                    className="max-w-full h-auto object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="h-48 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-sm">
                  <svg className="w-10 h-10 mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Tidak ada lampiran foto</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Isi Laporan / Aduan</h4>
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-semibold">
                {aduan.isi_aduan}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Details & Response Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Pelapor</p>
                  <p className="font-bold text-slate-800 mt-1">{aduan.nama_pelapor || 'Anonim'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">No. HP Pelapor</p>
                  <p className="font-bold text-slate-800 mt-1">{aduan.no_hp || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alamat Pelapor</p>
                  <p className="font-semibold text-slate-700 mt-1">{aduan.alamat_pelapor || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Waktu Masuk</p>
                  <p className="font-semibold text-slate-700 mt-1">{aduan.waktu_masuk}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dinas Tujuan</p>
                  <p className="font-semibold text-slate-700 mt-1">{aduan.dinas}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Judul Aduan</p>
                  <p className="font-bold text-[#356a70] text-base mt-1">{aduan.judul_aduan || aduan.kategori}</p>
                </div>
              </div>

              {/* Response Textarea */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <label htmlFor="admin-reply-textarea" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Respon / Balasan Resmi Dinas
                </label>
                <textarea
                  id="admin-reply-textarea"
                  rows={4}
                  value={balasanDinas}
                  onChange={(e) => setBalasanDinas(e.target.value)}
                  placeholder="Tuliskan respon resmi dari pihak Dinas terkait penanganan laporan aduan ini..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#356a70] focus:border-transparent transition-all bg-slate-50 text-slate-800"
                />
              </div>

              {/* Actions Section */}
              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label htmlFor="modal-status" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Ubah Status:
                  </label>
                  <select
                    id="modal-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#356a70] focus:border-transparent transition-all"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Proses">Proses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-[#356a70] text-white rounded-xl text-sm font-semibold hover:bg-[#2c5c61] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan Perubahan'
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
