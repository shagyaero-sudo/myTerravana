import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Award,
  ChevronRight,
  Trophy,
  AlertTriangle,
  Users,
  Edit3,
  Pencil,
  X,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import {
  StudentUser,
  Announcement,
  AgendaItem,
  LeaderboardEntry,
  TabType,
} from '../types';

interface DashboardViewProps {
  currentUser: StudentUser;
  announcement: Announcement;
  agendas: AgendaItem[];
  onToggleAgenda: (id: string) => void;
  onOpenAddAgenda: () => void;
  students: StudentUser[];
  leaderboard: LeaderboardEntry[];
  masteredCount: number;
  totalStudents: number;
  onNavigateTab: (tab: TabType) => void;
  onOpenProfile: () => void;
  onToggleOfficerMode: (isOfficer: boolean) => void;
  onEditAnnouncement?: () => void;
  onEditAgenda?: (item: AgendaItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  announcement,
  agendas,
  onToggleAgenda,
  onOpenAddAgenda,
  leaderboard,
  masteredCount,
  totalStudents,
  onNavigateTab,
  onOpenProfile,
  onToggleOfficerMode,
  onEditAnnouncement,
  onEditAgenda,
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 22, seconds: 40 });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const BPH_SECRET_PIN = '2026';

  useEffect(() => {
    const targetDate = new Date(announcement.countdown_target).getTime();
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [announcement.countdown_target]);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === BPH_SECRET_PIN) {
      onToggleOfficerMode(true);
      setIsAuthModalOpen(false);
      setPin('');
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
    }
  };

  const kpiPercentage = Math.round((masteredCount / totalStudents) * 100);

  return (
    <div id="dashboard-view-root" className="space-y-6 pt-3 pb-36">
      {/* 1. HERO HEADER (GAYA NYENTRIK ALAIN GOLF UI) */}
      <section id="dashboard-hero" className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenProfile}
            className="relative group shrink-0"
            title="Klik untuk ubah biodata profil"
          >
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-[1.8rem] bg-gradient-to-br from-emerald-400 to-teal-600 p-1 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.3)]">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full rounded-[1.5rem] object-cover bg-white"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1E2022] text-emerald-400 flex items-center justify-center ring-4 ring-[#F3F5F8] shadow-md group-hover:scale-110 transition-transform">
              <Pencil size={11} />
            </span>
          </button>

          <div>
            <div
              onClick={() => {
                if (!currentUser.is_officer) {
                  setIsAuthModalOpen(true);
                } else {
                  if (confirm('Matikan mode BPH / Officer?')) {
                    onToggleOfficerMode(false);
                  }
                }
              }}
              className="flex items-center gap-2 cursor-pointer group"
              title={currentUser.is_officer ? 'Klik untuk matikan mode BPH' : 'Klik untuk masuk mode BPH / Pengurus'}
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                Hello, {currentUser.nickname}
              </h1>
              {currentUser.is_officer && (
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 shadow-sm">
                  OFFICER BPH
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-bold mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Kelompok {currentUser.kelompok} • NRP {currentUser.nrp}
            </p>
          </div>
        </div>
      </section>

      {/* 2. PINNED ANNOUNCEMENT BANNER (DEEP DARK SLATE CARD ALAIN GOLF UI) */}
      <section
        id="pinned-announcement-banner"
        className="relative overflow-hidden rounded-[2.2rem] bg-[#1E2022] text-white p-6 sm:p-7 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border border-slate-800"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Flame size={13} className="text-rose-400 fill-rose-400" />
                URGENT FORUM
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-slate-300 backdrop-blur-md">
                {announcement.category}
              </span>

              {currentUser.is_officer && onEditAnnouncement && (
                <button
                  type="button"
                  onClick={onEditAnnouncement}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
                >
                  <Edit3 size={11} />
                  <span>Edit Pengumuman</span>
                </button>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white leading-snug tracking-tight">
              {announcement.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {announcement.description}
            </p>
          </div>

          {/* COUNTDOWN BOX (ACCENT GREEN HIGH CONTRAST PILLS) */}
          <div className="flex flex-col sm:items-end justify-center shrink-0">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 sm:text-right">
              Hitung Mundur Sidang
            </div>
            <div className="flex items-center gap-2 bg-slate-900/90 p-3 rounded-[1.4rem] border border-slate-800 shadow-inner">
              <div className="flex flex-col items-center min-w-10">
                <span className="text-xl font-black text-emerald-400">{timeLeft.days}</span>
                <span className="text-[8px] font-black text-slate-500 uppercase">Hari</span>
              </div>
              <span className="text-slate-700 font-bold">:</span>
              <div className="flex flex-col items-center min-w-10">
                <span className="text-xl font-black text-emerald-400">{timeLeft.hours}</span>
                <span className="text-[8px] font-black text-slate-500 uppercase">Jam</span>
              </div>
              <span className="text-slate-700 font-bold">:</span>
              <div className="flex flex-col items-center min-w-10">
                <span className="text-xl font-black text-emerald-400">{timeLeft.minutes}</span>
                <span className="text-[8px] font-black text-slate-500 uppercase">Menit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID (NEUMORPHIC SOFT CLAY CARDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AGENDA & JADWAL */}
        <section
          id="interactive-agenda-widget"
          className="lg:col-span-7 bg-white rounded-[2.2rem] p-6 sm:p-7 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Agenda Angkatan
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400">Jadwal kegiatan terverifikasi</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenAddAgenda}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black text-white bg-[#1E2022] hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                <Plus size={15} />
                <span>+ Add Agenda</span>
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {agendas.map((item) => (
                <div
                  key={item.id}
                  className={`group flex items-start gap-3.5 p-4 rounded-[1.4rem] border transition-all ${
                    item.is_completed
                      ? 'bg-slate-50/80 border-slate-100 text-slate-400'
                      : 'bg-slate-50/40 border-slate-100 hover:border-emerald-300 hover:bg-white shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onToggleAgenda(item.id)}
                    className="mt-0.5 text-slate-300 group-hover:text-emerald-600 transition-colors"
                  >
                    {item.is_completed ? (
                      <CheckCircle2 size={22} className="text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle size={22} />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs sm:text-sm font-extrabold leading-snug ${
                            item.is_completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            item.type === 'cadre'
                              ? 'bg-[#1E2022] text-emerald-400'
                              : item.type === 'academic'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.type === 'cadre'
                            ? 'Kaderisasi'
                            : item.type === 'academic'
                            ? 'Kuliah'
                            : 'Personal'}
                        </span>
                      </div>

                      {currentUser.is_officer && onEditAgenda && (
                        <button
                          type="button"
                          onClick={() => onEditAgenda(item)}
                          className="text-slate-400 hover:text-slate-900 p-1 transition-colors"
                          title="Edit Agenda"
                        >
                          <Edit3 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-bold">
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-slate-400" />
                        {item.date} • {item.time}
                      </span>
                      <span>•</span>
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TERRAQUIZ WIDGET (SOFT CLAY KPI CARD) */}
        <section id="terraquiz-widget" className="lg:col-span-5 bg-white rounded-[2.2rem] p-6 sm:p-7 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                  <Award size={20} />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Terraquiz KPI
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('terraquiz')}
                className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 bg-emerald-50 px-3 py-1.5 rounded-full"
              >
                <span>Latihan</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="mt-6 bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-500">Target Hafalan 100%</span>
                <span className="text-sm font-black text-slate-900">
                  {masteredCount}/{totalStudents} ({kpiPercentage}%)
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-slate-200 overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, kpiPercentage))}%` }}
                />
              </div>
            </div>

            {/* TOP 3 HAFALAN LEADERBOARD */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                  <Trophy size={15} className="text-amber-500" />
                  <span>Top 3 Hafalan Angkatan</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {leaderboard.slice(0, 3).map((entry) => (
                  <div
                    key={entry.rank}
                    className="flex items-center justify-between p-3 rounded-[1.2rem] bg-slate-50/80 border border-slate-100/80"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-xl flex items-center justify-center text-[11px] font-black ${
                          entry.rank === 1
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : entry.rank === 2
                            ? 'bg-slate-300 text-slate-800'
                            : 'bg-amber-700/20 text-amber-900'
                        }`}
                      >
                        {entry.rank}
                      </span>
                      <img src={entry.avatar} alt={entry.name} className="w-8 h-8 rounded-xl object-cover ring-2 ring-white shadow-xs" />
                      <span className="text-xs font-extrabold text-slate-900 truncate max-w-[120px]">
                        {entry.name}
                      </span>
                    </div>

                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {entry.masteredCount} Anak
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigateTab('terrafinder')}
              className="text-xs font-extrabold text-slate-900 hover:text-emerald-600 flex items-center gap-1.5 transition-colors"
            >
              <Users size={15} />
              <span>Buka Direktori Mahasiswa</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </section>
      </div>

      {/* MODAL AUTH PIN BPH */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xs bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsAuthModalOpen(false);
                setPin('');
                setPinError(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#1E2022] text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-md">
              <ShieldCheck size={28} />
            </div>

            <h3 className="text-base font-black text-slate-900">Akses Officer BPH</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Masukkan 4 digit PIN rahasia untuk mengaktifkan fitur edit khusus BPH.
            </p>

            <form onSubmit={handleVerifyPin} className="mt-5 space-y-3">
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setPinError(false);
                }}
                className="w-full text-center text-2xl tracking-[0.6em] font-mono py-3 rounded-2xl border-2 border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900"
              />

              {pinError && (
                <p className="text-[11px] font-bold text-rose-600">
                  Kode PIN salah! Silakan coba lagi.
                </p>
              )}

              <button
                type="submit"
                disabled={pin.length !== 4}
                className="w-full py-3 rounded-2xl bg-[#1E2022] text-white text-xs font-black hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-md"
              >
                Verifikasi PIN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};