'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicDetailModal from '@/components/PublicDetailModal';

interface PublicAduan {
  no_tiket: string;
  waktu_masuk: string;
  dinas: string;
  kategori: string;
  status: 'Pending' | 'Proses' | 'Selesai';
  isi_aduan?: string;
  foto_bukti?: string | null;
  nama_pelapor?: string;
  alamat_pelapor?: string;
  no_hp?: string;
  judul_aduan?: string;
  balasan_dinas?: string | null;
  waktu_balasan?: string | null;
}

export default function PublicPortal() {
  const [ticketInput, setTicketInput] = useState('');
  const [searchResult, setSearchResult] = useState<PublicAduan | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPublicAduan, setSelectedPublicAduan] = useState<PublicAduan | null>(null);

  const [recentComplaints, setRecentComplaints] = useState<PublicAduan[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  // Fetch 5 most recent complaints on mount
  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch('/api/public/aduan');
        const json = await res.json();
        if (json.success) {
          setRecentComplaints(json.data);
        }
      } catch (err) {
        console.error('Failed to load recent complaints', err);
      } finally {
        setIsLoadingFeed(false);
      }
    }
    fetchRecent();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    setIsSearching(true);
    setSearchError('');
    setSearchResult(null);

    try {
      const res = await fetch(`/api/public/aduan?tiket=${encodeURIComponent(ticketInput.trim())}`);
      const json = await res.json();

      if (res.ok && json.success) {
        setSearchResult(json.data);
      } else {
        setSearchError(json.error || 'Aduan tidak ditemukan. Silakan periksa kembali nomor tiket Anda.');
      }
    } catch (err) {
      setSearchError('Terjadi kesalahan saat menghubungi server. Silakan coba lagi.');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: 'Pending' | 'Proses' | 'Selesai') => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            Pending
          </span>
        );
      case 'Proses':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Proses
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top Header/Navbar */}
      <header className="bg-[#356a70] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="https://pengaduan.kuduskab.go.id/assets/images/asp_logo.png" alt="Logo" className="w-24 h-24 object-contain" />
            <div>
              <h1 className="text-lg font-bold tracking-wide leading-tight">WADUL BUPATI</h1>
              <p className="text-xs text-blue-200">Diskominfo Kabupaten Kudus</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <Link
              id="admin-portal-link-header"
              href="/login"
              className="text-xs text-[#1E3A8A] bg-white hover:bg-blue-50 font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm inline-flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Portal Dinas
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero & Content Section */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full space-y-12">
        {/* Banner Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight sm:text-4xl">
            Portal Layanan Wadul Bupati Kabupaten Kudus
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Pantau status aduan Anda secara real-time. Masukkan nomor tiket pengaduan yang Anda terima dari WhatsApp Bot Wadul Bupati untuk melihat progres penanganannya.
          </p>
        </section>

        {/* Feature A: Ticket Tracker Form & Result */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#356a70]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cek Status Aduan
            </h3>
            <p className="text-xs text-slate-400">Contoh format tiket: WDL-YYYYMMDD-XXXX</p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              id="ticket-search-input"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="Masukkan Nomor Tiket Pengaduan..."
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all bg-slate-50 text-slate-800 font-semibold uppercase tracking-wider"
              required
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-[#356a70] text-white rounded-xl text-sm font-semibold hover:bg-[#344e4e] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Mencari...
                </>
              ) : (
                'Cek Status'
              )}
            </button>
          </form>

          {/* Search Error */}
          {searchError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{searchError}</span>
            </div>
          )}

          {/* Search Result Card */}
          {searchResult && (
            <div className="border border-slate-200 rounded-l overflow-hidden shadow-sm animate-fade-in bg-slate-50/50">
              <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nomor Tiket</p>
                  <h4 className="font-extrabold text-[#356a70] text-lg mt-0.5">{searchResult.no_tiket}</h4>
                </div>
                <div>{getStatusBadge(searchResult.status)}</div>
              </div>
              <div className="p-6 space-y-4 text-sm text-slate-700">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-200/60 pb-4">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Nama Pelapor</span>
                    <span className="font-medium text-slate-800 capitalize">{searchResult.nama_pelapor || 'Anonim'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">No. HP Pelapor</span>
                    <span className="font-medium text-slate-800">{searchResult.no_hp || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Waktu Masuk</span>
                    <span className="font-medium text-slate-800">{searchResult.waktu_masuk}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Dinas Terkait</span>
                    <span className="font-medium text-slate-800">{searchResult.dinas}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-slate-400 font-semibold block">Judul Aduan</span>
                    <span className="font-bold text-[#356a70]">{searchResult.judul_aduan || searchResult.kategori}</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Isi Aduan</span>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 leading-relaxed font-medium whitespace-pre-wrap">
                    {searchResult.isi_aduan}
                  </div>
                </div>

                {/* Optional Photo display if fetched */}
                {searchResult.foto_bukti &&
                  searchResult.foto_bukti !== '' &&
                  searchResult.foto_bukti !== 'tidak_ada_foto.jpg' && (
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block mb-2">Lampiran Foto Bukti</span>
                      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white max-h-64 flex items-center justify-center p-2">
                        <img
                          src={`/uploads/${searchResult.foto_bukti}`}
                          alt="Bukti aduan"
                          className="max-h-60 object-contain rounded"
                        />
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </section>

        {/* Feature B: Recent Complaints Table */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">Aduan Terbaru Masuk</h3>
            <p className="text-xs text-slate-400">Menampilkan 5 aduan masyarakat terbaru yang telah terverifikasi secara sistem.</p>
          </div>

          {isLoadingFeed ? (
            <div className="bg-white border border-slate-200 p-12 text-center text-slate-400 font-medium shadow-sm">
              <svg className="animate-spin h-6 w-6 text-[#356a70] mx-auto mb-3" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Memuat data aduan terbaru...</span>
            </div>
          ) : recentComplaints.length === 0 ? (
            <div className="bg-white border border-slate-200 p-12 text-center text-slate-400 font-medium shadow-sm">
              Belum ada data aduan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentComplaints.map((item) => (
                <div
                  key={item.no_tiket}
                  onClick={() => setSelectedPublicAduan(item)}
                  className="bg-white border border-slate-200 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden shadow-sm cursor-pointer"
                >
                  {/* Card Header: Reporter Profile & Time */}
                  <div className="p-4 pb-3 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/50">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-slate-200">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate capitalize">
                          {item.nama_pelapor || 'Anonim'}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold truncate">{item.no_hp || '-'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold text-right shrink-0 mt-0.5">
                      {item.waktu_masuk}
                    </span>
                  </div>

                  {/* Card Body: Title and content preview */}
                  <div className="p-4 flex-1 space-y-2">
                    <h5 className="text-sm font-bold text-[#356a70] line-clamp-1">
                      {item.judul_aduan || item.kategori}
                    </h5>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {item.isi_aduan}
                    </p>
                  </div>

                  {/* Card Footer: Dinas Tag & Status */}
                  <div className="px-4 py-3 bg-[#356a70] border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-200">
                    <div className="flex items-center gap-1.5 min-w-0 text-slate-200">
                      <svg className="w-3.5 h-3.5 text-slate-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate uppercase tracking-wider text-[9px] font-bold">{item.dinas}</span>
                    </div>
                    <div>{getStatusBadge(item.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#356a70] text-white py-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          {/* Social Icons row */}
          <div className="flex justify-center gap-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#356a70] hover:opacity-90 transition-opacity">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#356a70] hover:opacity-90 transition-opacity">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#356a70] hover:opacity-90 transition-opacity">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#356a70] hover:opacity-90 transition-opacity">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
          </div>

          <hr className="border-white/30" />

          {/* Details Row */}
          <div className="text-left space-y-1.5 text-xs text-white/90 font-medium max-w-2xl">
            <h4 className="font-extrabold text-sm tracking-wide mb-2 uppercase">KUDUSKAB.GO.ID</h4>
            <p>Jl. Simpang Tujuh, Kudus, Demaan, Kec. Kota Kudus, Kabupaten Kudus, Jawa Tengah 59313</p>
            <p>Phone : (+6221) 382 2255</p>
            <p>Fax : (+6221) 382 2255</p>
            <p>Email : kudus@kuduskab.go.id</p>
          </div>
        </div>
      </footer>

      {/* Public Detail Modal */}
      <PublicDetailModal
        aduan={selectedPublicAduan as any}
        onClose={() => setSelectedPublicAduan(null)}
      />
    </div>
  );
}
