import React from 'react';
import { Sparkles, Bell, ShieldCheck } from 'lucide-react';
import { StudentUser } from '../types';

interface HeaderProps {
  currentUser: StudentUser;
  onOpenProfile?: () => void;
  onQuickFinder?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenProfile,
  onQuickFinder,
}) => {
  return (
    <header
      id="app-top-header"
      className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-black/[0.05] transition-all"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Cohort Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-base tracking-tighter shadow-sm">
              T
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  myTerravana
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                  170 Active
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-tight">
                Cohort Portal • Angkatan 2026
              </span>
            </div>
          </div>
        </div>

        {/* Right Action & User Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-cohort-status"
            type="button"
            onClick={onQuickFinder}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 transition-colors"
            title="Darurat & Kontak Siaga Angkatan"
          >
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Kontak Siaga</span>
          </button>

          <button
            id="btn-announcement-bell"
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            aria-label="Notifikasi Angkatan"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {/* User Badge */}
          <button
            id="btn-user-profile-trigger"
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100/90 border border-black/[0.05] transition-all text-left"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-black/5"
            />
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                {currentUser.nickname}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                Kelompok {currentUser.kelompok}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
