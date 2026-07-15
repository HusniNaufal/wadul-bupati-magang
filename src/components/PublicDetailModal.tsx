'use client';

import React from 'react';
import { Aduan } from '@/lib/types';

interface PublicDetailModalProps {
  aduan: Aduan | null;
  onClose: () => void;
}

export default function PublicDetailModal({ aduan, onClose }: PublicDetailModalProps) {
  if (!aduan) return null;

  const hasPhoto = aduan.foto_bukti &&
    aduan.foto_bukti !== '' &&
    aduan.foto_bukti !== 'tidak_ada_foto.jpg';

  const getStatusBadge = (status: 'Pending' | 'Proses' | 'Selesai') => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded bg-blue-600 text-white text-xs font-bold gap-1 shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending
          </span>
        );
      case 'Proses':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded bg-[#356a70] text-white text-xs font-bold gap-1 shadow-sm animate-pulse">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
            </svg>
            Proses
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded bg-green-600 text-white text-xs font-bold gap-1 shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 flex flex-col animate-in fade-in duration-200">
      {/* Top Navigation Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-bold text-[#356a70] hover:text-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </button>
          
          <div className="hidden md:flex items-center gap-2">
            <img src="https://pengaduan.kuduskab.go.id/assets/images/asp_logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xs tracking-wider text-slate-400">WADUL BUPATI KUDUS</span>
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
        
        {/* Title Heading */}
        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase border-b border-slate-200 pb-4">
          {aduan.judul_aduan || aduan.kategori}
        </h2>

        {/* Column Layout Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: Complaint Description, Photo, Responses (spans 2 cols) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Ticket & Share details bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  ID. {aduan.no_tiket}
                </p>

              </div>

              <div>
                {getStatusBadge(aduan.status)}
              </div>
            </div>

            {/* Reporter details metadata block */}
            <div className="space-y-1">
              <p className="text-xs text-slate-400 uppercase font-black tracking-wider">OLEH PELAPOR</p>
              <h4 className="text-base font-extrabold text-slate-800 capitalize flex items-center gap-1.5">
                <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {aduan.nama_pelapor || 'Anonim'}
              </h4>
              <p className="text-xs text-slate-400 font-bold">{aduan.waktu_masuk} WIB • Phone: {aduan.no_hp || '-'}</p>
            </div>

            {/* Description Text */}
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-5 rounded-2xl border border-slate-100 font-medium">
              {aduan.isi_aduan}
            </div>

            {/* Image proof Carousel / display */}
            {hasPhoto ? (
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 max-h-96 flex items-center justify-center p-3 shadow-inner">
                <img
                  src={`/uploads/${aduan.foto_bukti}`}
                  alt="Bukti aduan"
                  className="max-h-80 object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="h-28 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-sm">
                <svg className="w-8 h-8 mb-1.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Tidak ada lampiran foto</span>
              </div>
            )}

            {/* Respon Aspirasi (Official replies from Dinas) */}
            <div className="space-y-3 pt-4">
              <span className="inline-block bg-[#356a70] text-white px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm">
                Respon Aspirasi
              </span>

              {aduan.balasan_dinas ? (
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-emerald-50/20 shadow-sm">
                  <div className="bg-[#356a70]/5 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-[#356a70] uppercase tracking-wider">
                      Dinas Terkait ({aduan.dinas})
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {aduan.waktu_balasan} WIB
                    </span>
                  </div>
                  <div className="p-5 text-sm text-slate-700 leading-relaxed font-semibold">
                    {aduan.balasan_dinas}
                  </div>
                </div>
              ) : (
                <div className="p-6 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs font-semibold bg-slate-50/30">
                  — Belum ada respon dari dinas terkait —
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Metadata details, dispositions, comments */}
          <div className="space-y-6">

            {/* Category tag */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kategori</span>
              <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#356a70]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {aduan.kategori}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold">Melalui WhatsApp Bot Backend</p>
            </div>

            {/* Disposition Details */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Disposisi Aspirasi</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aspirasi anda didelegasikan ke <strong className="text-slate-800 capitalize">DINAS {aduan.dinas.toUpperCase()}</strong>
              </p>
            </div>

            {/* Location block */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Lokasi</span>
              <div className="space-y-1 text-xs text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-800 flex items-start gap-1">
                  <svg className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Alamat:
                </p>
                <p className="pl-5 text-slate-500 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
                  {aduan.alamat_pelapor || 'Alamat tidak dicantumkan oleh pelapor'}
                </p>
                <p className="pl-5 text-[10px] text-slate-400 font-semibold mt-1">
                  Kecamatan Kota, Kabupaten Kudus, Jawa Tengah, Indonesia
                </p>
              </div>
            </div>

            {/* Public Comments Section */}
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <button className="bg-[#356a70] text-white px-3 py-1 rounded text-xs font-bold shadow-sm">
                  Komentar Publik
                </button>
                <button className="border border-slate-200 text-slate-600 px-3 py-1 rounded text-xs font-bold hover:bg-slate-50 transition-colors">
                  Berikan Komentar
                </button>
              </div>

              <div className="py-8 text-center text-xs text-slate-400 font-medium bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                — Belum ada komentar publik —
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
