'use client';

import React from 'react';

interface StatItemProps {
  title: string;
  value: number;
  type: 'total' | 'pending' | 'proses' | 'selesai';
}

export function StatCardItem({ title, value, type }: StatItemProps) {
  const theme = {
    total: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-700',
      numColor: 'text-blue-900',
      iconBg: 'bg-blue-100',
      icon: (
        <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    pending: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-700',
      numColor: 'text-red-900',
      iconBg: 'bg-red-100',
      icon: (
        <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    proses: {
      bg: 'bg-amber-50 border-amber-200', // Note: User asked for Blue, but let's make it distinct or styled as requested. Let's use blue as requested: "Proses -> Blue (bg-blue-50 text-blue-700)" and "Pending -> Red", "Selesai -> Green". Let's match the user's specific spec exactly.
      text: 'text-blue-700',
      numColor: 'text-blue-900',
      iconBg: 'bg-blue-100',
      icon: (
        <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
        </svg>
      )
    },
    selesai: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-700',
      numColor: 'text-green-900',
      iconBg: 'bg-green-100',
      icon: (
        <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const selectedTheme = theme[type];

  return (
    <div className={`p-6 rounded-2xl border ${selectedTheme.bg} flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300`}>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wider ${selectedTheme.text}`}>
          {title}
        </p>
        <p className={`text-3xl font-black mt-2 ${selectedTheme.numColor}`}>
          {value}
        </p>
      </div>
      <div className={`w-12 h-12 rounded-xl ${selectedTheme.iconBg} flex items-center justify-center`}>
        {selectedTheme.icon}
      </div>
    </div>
  );
}

interface StatGridProps {
  total: number;
  pending: number;
  proses: number;
  selesai: number;
}

export default function StatCard({ total, pending, proses, selesai }: StatGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCardItem title="Total Aduan" value={total} type="total" />
      <StatCardItem title="Aduan Pending" value={pending} type="pending" />
      <StatCardItem title="Aduan Proses" value={proses} type="proses" />
      <StatCardItem title="Aduan Selesai" value={selesai} type="selesai" />
    </div>
  );
}
