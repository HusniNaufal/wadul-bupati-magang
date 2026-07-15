'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import AduanTable from '@/components/AduanTable';
import DetailModal from '@/components/DetailModal';
import { Aduan } from '@/lib/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [userDinas, setUserDinas] = useState('');
  const [aduanList, setAduanList] = useState<Aduan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAduan, setSelectedAduan] = useState<Aduan | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Helper to parse cookies
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!);
    return '';
  };

  useEffect(() => {
    const cookieUser = getCookie('admin_user');
    const cookieDinas = getCookie('admin_dinas');

    if (!cookieUser || !cookieDinas) {
      // Redirect to login if auth cookies are missing
      router.push('/login');
      return;
    }

    setUsername(cookieUser);
    setUserDinas(cookieDinas);
  }, [router]);

  // Fetch complaints once userDinas is loaded
  useEffect(() => {
    if (!userDinas) return;

    async function fetchAduan() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/aduan?dinas=${encodeURIComponent(userDinas)}`);
        const json = await res.json();
        if (json.success) {
          setAduanList(json.data);
        }
      } catch (error) {
        console.error('Failed to load aduan', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAduan();
  }, [userDinas]);

  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'admin_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'admin_dinas=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  // Handle status update inside DetailModal
  const handleSaveStatus = async (id: number, status: 'Pending' | 'Proses' | 'Selesai', balasan_dinas: string) => {
    try {
      const res = await fetch('/api/admin/aduan', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status, balasan_dinas }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        // Refresh local data list state
        setAduanList((prevList) =>
          prevList.map((item) => (item.id === id ? { ...item, status, balasan_dinas } : item))
        );

        // Update selected modal details state
        if (selectedAduan && selectedAduan.id === id) {
          setSelectedAduan({ ...selectedAduan, status, balasan_dinas });
        }

        // Close modal after successful update
        setSelectedAduan(null);
      } else {
        alert(json.error || 'Gagal mengubah status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Terjadi kesalahan saat menyimpan status');
    }
  };

  // KPI calculations based on current loaded dataset (scoped already by Dinas API query)
  const totalCount = aduanList.length;
  const pendingCount = aduanList.filter((a) => a.status === 'Pending').length;
  const prosesCount = aduanList.filter((a) => a.status === 'Proses').length;
  const selesaiCount = aduanList.filter((a) => a.status === 'Selesai').length;

  // Local Search filtering inside current authorized subset
  const filteredAduan = aduanList.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.no_tiket.toLowerCase().includes(q) ||
      item.kategori.toLowerCase().includes(q) ||
      item.dinas.toLowerCase().includes(q) ||
      item.isi_aduan.toLowerCase().includes(q)
    );
  });

  if (!username || !userDinas) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <svg className="animate-spin h-8 w-8 text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Sidebar - fixed left with responsive drawer */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false); // Auto close on mobile navigation click
        }} 
        onLogout={handleLogout} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Layout Area - responsive ml-0 / md:ml-64 */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen min-w-0">
        {/* Header */}
        <Header
          userDinas={userDinas}
          username={username}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content Container */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center text-slate-500 font-medium">
              <svg className="animate-spin h-6 w-6 text-[#1E3A8A] mx-auto mb-2" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Memuat data pengaduan...
            </div>
          </div>
        ) : (
          <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-6xl w-full min-w-0">
            {activeTab === 'dashboard' ? (
              <>
                {/* Dashboard statistics summary banner */}
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight">Overview Statistik</h1>
                  <p className="text-xs text-slate-400">Ringkasan status pengaduan warga untuk {userDinas === 'Diskominfo' ? 'Seluruh Dinas' : `Dinas ${userDinas}`}.</p>
                </div>

                {/* KPI block cards */}
                <StatCard
                  total={totalCount}
                  pending={pendingCount}
                  proses={prosesCount}
                  selesai={selesaiCount}
                />

                {/* Aduan Table Grid */}
                <AduanTable 
                  data={filteredAduan} 
                  onDetailClick={(aduan) => setSelectedAduan(aduan)} 
                />
              </>
            ) : (
              <div className="p-8 border border-dashed border-slate-200 rounded-3xl bg-white flex flex-col items-center justify-center text-slate-400 min-h-[50vh]">
                <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="font-bold text-slate-700 text-lg">Modul Sedang Dikembangkan</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-md text-center">
                  Fitur ini masih dalam tahap pembangunan. Hubungi Administrator Diskominfo Kabupaten Kudus untuk informasi lebih lanjut.
                </p>
              </div>
            )}
          </main>
        )}
      </div>

      {/* Detail Modal Popups */}
      <DetailModal
        aduan={selectedAduan}
        onClose={() => setSelectedAduan(null)}
        onSaveStatus={handleSaveStatus}
      />
    </div>
  );
}
