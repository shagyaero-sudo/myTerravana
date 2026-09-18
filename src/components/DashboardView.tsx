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
  ArrowUpRight,
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
      {/* 1. VISILY-STYLE HEADER WITH COMPACT USER AVATAR */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            TERRAVANA COHORT 2026
          </span>
          <div
            onClick={() => {
              if (!currentUser.is_officer) {
                setIsAuthModalOpen(true);
              } else if (confirm('Matikan mode BPH / Officer?')) {
                onToggleOfficerMode(false);
              }
            }}
            className="flex items-center gap-2 cursor-pointer group mt-0.5"
          >
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
              Overview
            </h1>
            {currentUser.is_officer && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                OFFICER BPH
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenProfile}
          className="relative group shrink-0"
          title="Ubah Biodata"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-emerald-500 transition-all"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center ring-2 ring-white">
            <Pencil size={8} />
          </span>
        </button>
      </div>

      {/* 2. VISILY "HEALTH SCORE" STYLE CARD FOR TERRAQUIZ KPI */}
      <section className="bg-slate-50/80 rounded-3xl p-5 border border-slate-200/60 flex items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">Terraquiz KPI Score</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-0.5">
              <TrendingUp size={10} /> Good
            </span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2">
            Berdasarkan progress hafalan kamu, kamu telah menguasai {masteredCount} dari total {totalStudents} anak angkatan.
          </p>
          <button
            type="button"
            onClick={() => onNavigateTab('terraquiz')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 pt-1"
          >
            <span>Latihan Kuis Sekarang</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* VISILY CIRCULAR KPI INDICATOR */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-200"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-500 transition-all duration-700 ease-out"
              strokeDasharray={`${kpiPercentage}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-lg font-black text-slate-900 leading-none">{kpiPercentage}%</span>
            <span className="text-[8px] font-bold text-slate-400 mt-0.5">KPI</span>
          </div>
        </div>
      </section>

      {/* 3. PINNED ANNOUNCEMENT (VISILY CLEAN HIGHLIGHT CARD) */}
      <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle size={11} />
              URGENT
            </span>
            <span className="text-xs font-semibold text-slate-400">{announcement.category}</span>
          </div>

          {currentUser.is_officer && onEditAnnouncement && (
            <button
              type="button"
              onClick={onEditAnnouncement}
              className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800"
            >
              Edit
            </button>
          )}
        </div>

        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">{announcement.title}</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{announcement.description}</p>
        </div>

        {/* COMPACT COUNTDOWN PILLS */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[11px] font-medium text-slate-400">Hitung Mundur Sidang:</span>
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">{timeLeft.days}d</span>
            <span>:</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">{timeLeft.hours}h</span>
            <span>:</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-md">{timeLeft.minutes}m</span>
          </div>
        </div>
      </section>

      {/* 4. VISILY BENTO GRID (COMPACT HIGHLIGHT CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AGENDA SECTION */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Agenda Angkatan</h3>
            </div>
            <button
              type="button"
              onClick={onOpenAddAgenda}
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {agendas.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs"
              >
                <button
                  type="button"
                  onClick={() => onToggleAgenda(item.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 shrink-0"
                >
                  {item.is_completed ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <Circle size={16} />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <span className={`font-semibold block truncate ${item.is_completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.date} • {item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP 3 HAFALAN LEADERBOARD */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Top Hafalan</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('terrafinder')}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-900"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-2">
            {leaderboard.slice(0, 3).map((entry) => (
              <div key={entry.rank} className="flex items-center justify-between p-2 rounded-2xl bg-slate-50/80 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                    {entry.rank}
                  </span>
                  <img src={entry.avatar} alt={entry.name} className="w-6 h-6 rounded-full object-cover" />
                  <span className="font-semibold text-slate-800 truncate max-w-[110px]">{entry.name}</span>
                </div>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg text-[11px]">
                  {entry.masteredCount} Anak
                </span>
              </div>
            ))}
          </div>
        </div>
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