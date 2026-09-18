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
    <div id="dashboard-view-root" className="space-y-6 pt-2 pb-32">
      {/* 1. HERO HEADER (HERO STYLE SOFT SLEEK) */}
      <section id="dashboard-hero" className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onOpenProfile}
            className="relative group shrink-0"
            title="Klik untuk ubah biodata profil"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-13 h-13 sm:w-15 sm:h-15 rounded-3xl object-cover ring-4 ring-white shadow-md group-hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1E2022] text-white flex items-center justify-center ring-2 ring-white shadow-sm group-hover:bg-amber-500 transition-colors">
              <Pencil size={10} />
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
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                Halo, {currentUser.nickname} 👋
              </span>
              {currentUser.is_officer && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#1E2022] text-white shadow-xs">
                  Officer / BPH
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
              Selamat datang di myTerravana!
            </p>
          </div>
        </div>
      </section>

      {/* 2. PINNED ANNOUNCEMENT BANNER */}
      <section
        id="pinned-announcement-banner"
        className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-black/[0.04] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                <AlertTriangle size={12} className="text-rose-600" />
                PENGUMUMAN URGENT
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                {announcement.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">{announcement.date}</span>

              {currentUser.is_officer && onEditAnnouncement && (
                <button
                  type="button"
                  onClick={onEditAnnouncement}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                >
                  <Edit3 size={11} />
                  <span>Edit Pengumuman</span>
                </button>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
              {announcement.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {announcement.description}
            </p>
          </div>

          {/* COUNTDOWN BOX (DARK PILL STYLE REFRENSI GOLF APP) */}
          <div className="flex flex-col sm:items-end justify-center shrink-0 pt-2 md:pt-0">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 sm:text-right">
              Hitung Mundur Sidang / Forum
            </div>
            <div className="flex items-center gap-2 bg-[#1E2022] text-white p-2.5 rounded-2xl shadow-md">
              <div className="flex flex-col items-center px-2">
                <span className="text-base font-black text-white">{timeLeft.days}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Hari</span>
              </div>
              <span className="text-slate-600 font-bold">:</span>
              <div className="flex flex-col items-center px-2">
                <span className="text-base font-black text-white">{timeLeft.hours}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Jam</span>
              </div>
              <span className="text-slate-600 font-bold">:</span>
              <div className="flex flex-col items-center px-2">
                <span className="text-base font-black text-white">{timeLeft.minutes}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Menit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* AGENDA & JADWAL */}
        <section
          id="interactive-agenda-widget"
          className="lg:col-span-7 bg-white/80 backdrop-blur-xl rounded-3xl border border-black/[0.04] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-slate-800" />
                <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  Agenda & Jadwal Angkatan
                </h3>
              </div>

              <button
                type="button"
                onClick={onOpenAddAgenda}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#1E2022] hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Plus size={14} />
                <span>+ Add Agenda</span>
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {agendas.map((item) => (
                <div
                  key={item.id}
                  className={`group flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                    item.is_completed
                      ? 'bg-slate-50/60 border-slate-100 text-slate-400'
                      : 'bg-white border-slate-200/60 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onToggleAgenda(item.id)}
                    className="mt-0.5 text-slate-400 group-hover:text-slate-700 transition-colors"
                  >
                    {item.is_completed ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <Circle size={18} className="text-slate-300" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold leading-snug ${
                            item.is_completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded-md text-[10px] font-bold ${
                            item.type === 'cadre'
                              ? 'bg-[#1E2022] text-white'
                              : item.type === 'academic'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
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
                          title="Edit Agenda Angkatan"
                        >
                          <Edit3 size={13} />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
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

        {/* TERRAQUIZ WIDGET */}
        <section id="terraquiz-widget" className="lg:col-span-5 bg-white/80 backdrop-blur-xl rounded-3xl border border-black/[0.04] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-slate-800" />
                <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  Terraquiz
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('terraquiz')}
                className="text-xs font-bold text-slate-900 hover:text-slate-600 flex items-center gap-0.5"
              >
                <span>Latihan Quiz</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-500">Terraquiz KPI</span>
                <span className="text-xs font-black text-slate-900">
                  {masteredCount}/{totalStudents} Dikuasai ({kpiPercentage}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#1E2022] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, kpiPercentage))}%` }}
                />
              </div>
            </div>

            {/* TOP 3 HAFALAN */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Trophy size={14} className="text-amber-500" />
                  <span>Top 3 Hafalan Angkatan</span>
                </div>
              </div>

              <div className="space-y-2">
                {leaderboard.slice(0, 3).map((entry) => (
                  <div
                    key={entry.rank}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          entry.rank === 1
                            ? 'bg-amber-400 text-slate-950'
                            : entry.rank === 2
                            ? 'bg-slate-300 text-slate-800'
                            : 'bg-amber-700/20 text-amber-900'
                        }`}
                      >
                        {entry.rank}
                      </span>
                      <img src={entry.avatar} alt={entry.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200" />
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                        {entry.name}
                      </span>
                    </div>

                    <span className="text-xs font-black text-slate-900">{entry.masteredCount} Anak</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigateTab('terrafinder')}
              className="text-xs font-bold text-slate-900 hover:text-slate-600 flex items-center gap-1"
            >
              <Users size={14} />
              <span>Buka Direktori Mahasiswa</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </section>
      </div>

      {/* MODAL AUTH PIN BPH */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xs bg-white rounded-3xl border border-black/[0.08] shadow-2xl p-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsAuthModalOpen(false);
                setPin('');
                setPinError(false);
              }}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#1E2022] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <ShieldCheck size={24} />
            </div>

            <h3 className="text-base font-bold text-slate-900">Akses BPH / Pengurus</h3>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan 4 digit PIN rahasia untuk mengaktifkan fitur edit khusus BPH.
            </p>

            <form onSubmit={handleVerifyPin} className="mt-4 space-y-3">
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
                className="w-full text-center text-xl tracking-[0.5em] font-mono py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900"
              />

              {pinError && (
                <p className="text-[11px] font-semibold text-rose-600">
                  Kode PIN salah! Silakan coba lagi.
                </p>
              )}

              <button
                type="submit"
                disabled={pin.length !== 4}
                className="w-full py-2.5 rounded-2xl bg-[#1E2022] text-white text-xs font-bold hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
              >
                Verifikasi Kode
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};