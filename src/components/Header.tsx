'use client';

import React from 'react';

interface HeaderProps {
  userDinas: string;
  username: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuClick?: () => void;
}

export default function Header({
  userDinas,
  username,
  searchQuery,
  setSearchQuery,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Page Title & User Dinas */}
      <div className="flex items-center gap-3 min-w-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-700 md:hidden rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <h2 className="text-lg font-bold text-slate-800 hidden sm:block shrink-0">
          Dashboard Admin
        </h2>
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 truncate max-w-[100px] sm:max-w-none shrink-0">
          {userDinas}
        </span>
      </div>

      {/* Search Input & Profile Details */}
      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
        {/* Search */}
        <div className="relative w-full max-w-[130px] xs:max-w-[160px] sm:max-w-[240px]">
          <input
            type="text"
            placeholder="Cari..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#356a70] focus:border-transparent transition-all"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-2.5 top-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 capitalize">{username}</p>
            {/* <p className="text-xs text-slate-400">Petugas Dinas</p> */}
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 border border-slate-300">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>


      </div>
    </header>
  );
}
