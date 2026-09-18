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
  onEditAnnouncement?: () => void; // Khusus Officer / BPH
  onEditAgenda?: (item: AgendaItem) => void; // Khusus Officer / BPH
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
  onEditAnnouncement,
  onEditAgenda,
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 22, seconds: 40 });

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

  const kpiPercentage = Math.round((masteredCount / totalStudents) * 100);

  return (
    <div id="dashboard-view-root" className="space-y-6 pt-4 pb-28">
      {/* 1. HERO HEADER (DENGAN FOTO PROFIL DI SEBELAH GREETING) */}
      <section id="dashboard-hero" className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenProfile}
            className="relative group shrink-0"
            title="Klik untuk lihat / edit profil"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-black/5 group-hover:ring-slate-900 transition-all"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                Halo, {currentUser.nickname} 👋
              </span>
              {currentUser.is_officer && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-white">
                  Officer / BPH
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              Selamat datang di myTerravana!
            </p>
          </div>
        </div>
      </section>

      {/* 2. PINNED ANNOUNCEMENT BANNER */}
      <section
        id="pinned-announcement-banner"
        className="relative overflow-hidden rounded-2xl bg-white border border-black/[0.06] p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)]"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                <AlertTriangle size={12} className="text-rose-600" />
                PENGUMUMAN URGENT
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                {announcement.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">{announcement.date}</span>

              {/* Edit Button untuk Officer */}
              {currentUser.is_officer && onEditAnnouncement && (
                <button
                  type="button"
                  onClick={onEditAnnouncement}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                >
                  <Edit3 size={11} />
                  <span>Edit Pengumuman</span>
                </button>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {announcement.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {announcement.description}
            </p>
          </div>

          {/* Countdown Box */}
          <div className="flex flex-col sm:items-end justify-center shrink-0 pt-2 md:pt-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:text-right">
              Hitung Mundur Sidang / Forum
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex flex-col items-center justify-center w-12 h-13 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-base font-extrabold text-slate-900">{timeLeft.days}</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase">Hari</span>
              </div>
              <span className="text-slate-300 font-bold">:</span>
              <div className="flex flex-col items-center justify-center w-12 h-13 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-base font-extrabold text-slate-900">{timeLeft.hours}</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase">Jam</span>
              </div>
              <span className="text-slate-300 font-bold">:</span>
              <div className="flex flex-col items-center justify-center w-12 h-13 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-base font-extrabold text-slate-900">{timeLeft.minutes}</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase">Menit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID: INTERACTIVE AGENDA + TERRAQUIZ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* AGENDA & JADWAL */}
        <section
          id="interactive-agenda-widget"
          className="lg:col-span-7 bg-white rounded-2xl border border-black/[0.06] p-5 sm:p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-slate-700" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Agenda & Jadwal Angkatan
                </h3>
              </div>

              {/* + Add Agenda (Officer mode atau user personal note) */}
              <button
                type="button"
                onClick={onOpenAddAgenda}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors"
              >
                <Plus size={14} />
                <span>+ Add Agenda</span>
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {agendas.map((item) => (
                <div
                  key={item.id}
                  className={`group flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    item.is_completed
                      ? 'bg-slate-50/70 border-slate-100 text-slate-400'
                      : 'bg-white border-slate-200/70 hover:border-slate-300 shadow-xs'
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
                          className={`px-2 py-0.2 rounded text-[10px] font-semibold ${
                            item.type === 'cadre'
                              ? 'bg-slate-900 text-white'
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

                      {/* Mode Officer: Edit button per agenda */}
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

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-medium">
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

        {/* TERRAQUIZ WIDGET (RE-NAMED DARI COHORT PULSE) */}
        <section id="terraquiz-widget" className="lg:col-span-5 bg-white rounded-2xl border border-black/[0.06] p-5 sm:p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-slate-700" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
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
                <span className="text-xs font-semibold text-slate-600">Terraquiz KPI (Target 100%)</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {masteredCount}/{totalStudents} Dikuasai ({kpiPercentage}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-slate-900 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, kpiPercentage))}%` }}
                />
              </div>
            </div>

            {/* LEADERBOARD TOP 3 */}
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
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                          entry.rank === 1
                            ? 'bg-amber-400 text-slate-950'
                            : entry.rank === 2
                            ? 'bg-slate-300 text-slate-800'
                            : 'bg-amber-700/20 text-amber-900'
                        }`}
                      >
                        {entry.rank}
                      </span>
                      <img src={entry.avatar} alt={entry.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                        {entry.name}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-900">{entry.masteredCount} Anak</span>
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
    </div>
  );
};