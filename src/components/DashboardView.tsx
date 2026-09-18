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
  TrendingUp,
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
  const [isDetailAnnouncementOpen, setIsDetailAnnouncementOpen] = useState(false);
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
    <div id="dashboard-view-root" className="space-y-5 pt-2 pb-36">
      {/* 1. VISILY TOP BAR HEADER */}
      <div className="flex items-center justify-between">
        <div
          onClick={() => {
            if (!currentUser.is_officer) {
              setIsAuthModalOpen(true);
            } else if (confirm('Matikan mode BPH / Officer?')) {
              onToggleOfficerMode(false);
            }
          }}
          className="cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
              Overview
            </h1>
            {currentUser.is_officer && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900 text-white">
                BPH
              </span>
            )}
          </div>
        </div>

        {/* AVATAR USER & LOGO ANGKATAN PHOENIX (/public/logoterravana.png) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenProfile}
            className="relative group shrink-0"
            title="Klik untuk ubah profil"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-emerald-500 transition-all"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center ring-2 ring-white">
              <Pencil size={8} />
            </span>
          </button>

          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shadow-xs">
            <img
              src="/logoterravana.png"
              alt="Terravana Phoenix Logo"
              className="w-full h-full object-contain bg-white rounded-full p-1"
            />
          </div>
        </div>
      </div>

      {/* 2. MAIN KPI CARD (WARNA MINT / EMERALD SOFT ALA VISILY HEALTH SCORE) */}
      <section className="bg-gradient-to-br from-emerald-100/90 via-teal-50 to-emerald-50 rounded-3xl p-5 border border-emerald-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <span className="text-xs font-extrabold text-emerald-900 block tracking-tight">
            Terraquiz KPI
          </span>
          <p className="text-xs text-emerald-800/80 font-medium leading-relaxed">
            Berdasarkan tracker hafalan angkatan, skor kamu dianggap <span className="font-bold text-emerald-950">Sangat Baik</span>.
          </p>
          <button
            type="button"
            onClick={() => onNavigateTab('terraquiz')}
            className="text-xs font-black text-emerald-900 hover:underline inline-flex items-center gap-0.5 pt-1"
          >
            <span>Tell me more</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* CIRCULAR PROGRESS INDICATOR PRESISI */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-emerald-200/80"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-600 transition-all duration-700 ease-out"
              strokeDasharray={`${kpiPercentage}, 100`}
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-lg font-black text-emerald-950 leading-none">{kpiPercentage}</span>
            <span className="text-[8px] font-extrabold text-emerald-700 uppercase mt-0.5">% KPI</span>
          </div>
        </div>
      </section>

      {/* 3. HIGHLIGHTS & URGENT ANNOUNCEMENT (CLEAN RINGKAS) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">Highlights</h2>
          <button
            type="button"
            onClick={() => setIsDetailAnnouncementOpen(true)}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-0.5"
          >
            <span>View more</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-orange-50/50 rounded-3xl p-4 border border-rose-100/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
                <AlertTriangle size={10} />
                PENGUMUMAN URGENT
              </span>
              <span className="text-[11px] font-bold text-rose-800">{announcement.category}</span>
            </div>

            {currentUser.is_officer && onEditAnnouncement && (
              <button
                type="button"
                onClick={onEditAnnouncement}
                className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-200 text-rose-900"
              >
                Edit
              </button>
            )}
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
            {announcement.title}
          </h3>

          <div className="pt-2 border-t border-rose-100/80 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setIsDetailAnnouncementOpen(true)}
              className="text-xs font-black text-rose-700 hover:underline flex items-center gap-0.5"
            >
              <span>Lihat detail &gt;</span>
            </button>

            <div className="flex items-center gap-1 font-extrabold text-slate-700 text-[11px]">
              <Clock size={12} className="text-rose-500" />
              <span>Sidang: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VISILY WEEKLY REPORT GRID (KARTU WARNA-WARNI SOFT) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">Agenda & Ranking</h2>
          <button
            type="button"
            onClick={() => onNavigateTab('terrafinder')}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-0.5"
          >
            <span>View more</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* KARTU AGENDA (AKSEN SOFT BLUE) */}
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl p-4 border border-blue-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-blue-100/80">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-blue-600" />
                <span className="text-xs font-extrabold text-slate-900">Agenda Angkatan</span>
              </div>
              <button
                type="button"
                onClick={onOpenAddAgenda}
                className="p-1 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                <Plus size={13} />
              </button>
            </div>

            <div className="space-y-2">
              {agendas.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 p-2 rounded-2xl bg-white/80 border border-blue-50 text-xs"
                >
                  <button
                    type="button"
                    onClick={() => onToggleAgenda(item.id)}
                    className="mt-0.5 text-slate-300 hover:text-emerald-600 shrink-0"
                  >
                    {item.is_completed ? (
                      <CheckCircle2 size={15} className="text-emerald-500" />
                    ) : (
                      <Circle size={15} />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className={`font-bold block truncate ${item.is_completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.date} • {item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KARTU TOP HAFALAN (AKSEN SOFT AMBER) */}
          <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-slate-50 rounded-3xl p-4 border border-amber-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-100/80">
              <div className="flex items-center gap-2">
                <Trophy size={15} className="text-amber-600" />
                <span className="text-xs font-extrabold text-slate-900">Top 3 Hafalan</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                KPI Leaderboard
              </span>
            </div>

            <div className="space-y-2">
              {leaderboard.slice(0, 3).map((entry) => (
                <div key={entry.rank} className="flex items-center justify-between p-2 rounded-2xl bg-white/80 text-xs border border-amber-50">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                      {entry.rank}
                    </span>
                    <img src={entry.avatar} alt={entry.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="font-bold text-slate-800 truncate max-w-[100px]">{entry.name}</span>
                  </div>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg text-[10px]">
                    {entry.masteredCount} Anak
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DETAIL PENGUMUMAN FULL */}
      {isDetailAnnouncementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-black/[0.08] shadow-2xl p-6 space-y-4">
            <button
              type="button"
              onClick={() => setIsDetailAnnouncementOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
                PENGUMUMAN URGENT
              </span>
              <span className="text-xs font-bold text-slate-400">{announcement.category}</span>
            </div>

            <h3 className="text-lg font-black text-slate-900 leading-snug">
              {announcement.title}
            </h3>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {announcement.description}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Diposting BPH Angkatan</span>
              <span>{announcement.date}</span>
            </div>
          </div>
        </div>
      )}

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
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
            >
              <X size={16} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={24} />
            </div>

            <h3 className="text-sm font-bold text-slate-900">Akses Officer BPH</h3>
            <p className="text-xs text-slate-500 mt-1">Masukkan 4 digit PIN rahasia (2026).</p>

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
                className="w-full text-center text-xl tracking-[0.5em] font-mono py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900"
              />

              {pinError && <p className="text-[11px] font-bold text-rose-600">Kode PIN salah!</p>}

              <button
                type="submit"
                disabled={pin.length !== 4}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400"
              >
                Verifikasi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};