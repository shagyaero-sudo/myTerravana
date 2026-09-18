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
  Sun,
  Flame,
  ArrowRight,
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
    <div id="dashboard-view-root" className="space-y-6 pt-2 pb-36 font-sans">
      {/* 1. HEADER ATAS: LOGO ANGKATAN DI KIRI & AVATAR USER DI KANAN */}
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-2xl bg-slate-900 p-1.5 shadow-sm">
          <img
            src="/logoterravana.png"
            alt="Terravana Phoenix Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <button
          type="button"
          onClick={onOpenProfile}
          className="relative group shrink-0"
          title="Klik untuk ubah profil"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-slate-900 transition-all"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center ring-2 ring-white">
            <Pencil size={8} />
          </span>
        </button>
      </div>

      {/* TANGGAL & SUBTITLE OVERVIEW */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Sun size={13} className="text-amber-500" />
          <span>JUMAT, 18 SEP</span>
        </div>

        <div className="flex items-center justify-between">
          <h1
            onClick={() => {
              if (!currentUser.is_officer) {
                setIsAuthModalOpen(true);
              } else if (confirm('Matikan mode BPH / Officer?')) {
                onToggleOfficerMode(false);
              }
            }}
            className="text-3xl font-black tracking-tight text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors"
          >
            Overview
          </h1>

          <button
            type="button"
            onClick={() => setIsDetailAnnouncementOpen(true)}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1"
          >
            <span>Detail BPH</span>
          </button>
        </div>
      </div>

      {/* 2. HEALTH SCORE STYLE CARD (PERSISI VISILY CARD 1) */}
      <section className="relative overflow-hidden bg-[#F2F3FF] rounded-3xl p-6 border border-indigo-100/60 shadow-xs flex items-start justify-between gap-4">
        <div className="space-y-2 max-w-[240px]">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Terraquiz KPI
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Berdasarkan tracker hafalan angkatan, skor kamu adalah <span className="font-bold text-slate-900">{kpiPercentage}%</span> dan dianggap baik.
          </p>
          <button
            type="button"
            onClick={() => onNavigateTab('terraquiz')}
            className="text-xs font-black text-indigo-600 hover:underline inline-flex items-center gap-1 pt-1"
          >
            <span>Tell me more</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* BADGE SKOR PINK/MERAH ALA VISILY */}
        <div className="w-16 h-20 bg-rose-400 text-white rounded-2xl rounded-b-3xl flex flex-col items-center justify-center shadow-md shrink-0 font-black text-2xl">
          {kpiPercentage}
        </div>
      </section>

      {/* 3. HIGHLIGHTS GRID 2x2 (WARNA-WARNI SOLID ALA VISILY) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900">Highlights</h2>
          <button
            type="button"
            onClick={() => setIsDetailAnnouncementOpen(true)}
            className="text-xs font-bold text-slate-400 hover:text-slate-900 flex items-center gap-0.5"
          >
            <span>View more</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* CARD 1: PENGUMUMAN URGENT (UNGU/INDIGO) */}
          <div
            onClick={() => setIsDetailAnnouncementOpen(true)}
            className="bg-[#7A82FC] text-white rounded-3xl p-4 flex flex-col justify-between min-h-[140px] shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-100">
                Pengumuman
              </span>
              <AlertTriangle size={24} className="text-white/80" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-200 block">Urgent Forum</span>
              <h3 className="text-sm font-black text-white leading-tight mt-0.5 line-clamp-2">
                {announcement.title}
              </h3>
              <span className="text-[10px] font-semibold text-indigo-100 mt-2 block">
                Sidang: {timeLeft.days}d {timeLeft.hours}h
              </span>
            </div>
          </div>

          {/* CARD 2: AGENDA TERDEKAT (ORANGE/SAGE) */}
          <div
            onClick={() => onNavigateTab('terrafinder')}
            className="bg-[#FFAA7A] text-white rounded-3xl p-4 flex flex-col justify-between min-h-[140px] shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-100">
                Agenda Utama
              </span>
              <Calendar size={24} className="text-white/80" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-100 block">
                {agendas[0]?.date || 'Mendatang'}
              </span>
              <h3 className="text-sm font-black text-white leading-tight mt-0.5 line-clamp-2">
                {agendas[0]?.title || 'Tidak ada agenda'}
              </h3>
              <span className="text-[10px] font-semibold text-orange-100 mt-2 block">
                {agendas[0]?.time || '-'}
              </span>
            </div>
          </div>

          {/* CARD 3: TOP HAFALAN (TEAL/CYAN) */}
          <div
            onClick={() => onNavigateTab('terraquiz')}
            className="bg-[#007EA7] text-white rounded-3xl p-4 flex flex-col justify-between min-h-[140px] shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-100">
                Leaderboard
              </span>
              <Trophy size={24} className="text-white/80" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-200 block">Rank #1 Hafalan</span>
              <h3 className="text-sm font-black text-white leading-tight mt-0.5 truncate">
                {leaderboard[0]?.name || '-'}
              </h3>
              <span className="text-[10px] font-semibold text-cyan-100 mt-2 block">
                {leaderboard[0]?.masteredCount} Anak Dikuasai
              </span>
            </div>
          </div>

          {/* CARD 4: DIREKTORI MAHASISWA (PURPLE) */}
          <div
            onClick={() => onNavigateTab('terrafinder')}
            className="bg-[#5C428E] text-white rounded-3xl p-4 flex flex-col justify-between min-h-[140px] shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-200">
                Direktori
              </span>
              <Users size={24} className="text-white/80" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-purple-200 block">Angkatan 2026</span>
              <h3 className="text-sm font-black text-white leading-tight mt-0.5">
                170 Mahasiswa
              </h3>
              <span className="text-[10px] font-semibold text-purple-200 mt-2 block">
                Cari Kontak & Kos &gt;
              </span>
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