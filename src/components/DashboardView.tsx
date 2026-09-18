import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  MessageCircle,
  Sparkles,
  ChevronRight,
  Trophy,
  AlertTriangle,
  Shuffle,
  Users,
  Award,
  Share2,
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
  onSelectStudent: (student: StudentUser) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  announcement,
  agendas,
  onToggleAgenda,
  onOpenAddAgenda,
  students,
  leaderboard,
  masteredCount,
  totalStudents,
  onNavigateTab,
  onSelectStudent,
}) => {
  // Spotlight student: default to someone having a birthday or a random member
  const birthdayStudent = students.find((s) => s.is_birthday_today) || students[0];
  const [spotlightStudent, setSpotlightStudent] = useState<StudentUser>(birthdayStudent);
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 22, seconds: 40 });

  // Countdown timer calculation
  useEffect(() => {
    const targetDate = new Date(announcement.countdown_target).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [announcement.countdown_target]);

  const handleShuffleSpotlight = () => {
    const pool = students.filter((s) => s.id !== spotlightStudent.id);
    if (pool.length > 0) {
      const random = pool[Math.floor(Math.random() * pool.length)];
      setSpotlightStudent(random);
    }
  };

  const kpiPercentage = Math.round((masteredCount / totalStudents) * 100);

  return (
    <div id="dashboard-view-root" className="space-y-6 pb-28">
      {/* 1. HERO HEADER */}
      <section
        id="dashboard-hero"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Halo, {currentUser.nickname} 👋
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            Selamat datang di portal kaderisasi & kolaborasi angkatan Terravana.
          </p>
        </div>

        {/* Cohort Group Badge */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white border border-black/[0.06] shadow-sm self-start sm:self-auto">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
            K{currentUser.kelompok}
          </div>
          <div className="flex flex-col text-left pr-1">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              Kelompok {currentUser.kelompok}
            </span>
            <span className="text-[10px] text-slate-400 font-medium leading-tight">
              NRP {currentUser.nrp}
            </span>
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
              <span className="text-xs text-slate-400 font-medium">
                {announcement.date}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {announcement.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {announcement.description}
            </p>
          </div>

          {/* Countdown Event Tag Box */}
          <div className="flex flex-col sm:items-end justify-center shrink-0 pt-2 md:pt-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:text-right">
              Hitung Mundur Sidang / Forum
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex flex-col items-center justify-center w-12 h-13 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-base font-extrabold text-slate-900">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase">
                  Hari
                </span>
              </div>
              <span className="text-slate-300 font-bold">:</span>
              <div className="flex flex-col items-center justify-center w-12 h-13 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-base font-extrabold text-slate-900">
                  {timeLeft.hours}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase">
                  Jam
                </span>
              </div>
              <span className="text-slate-300 font-bold">:</span>
              <div className="flex flex-col items-center justify-center w-12 h-13 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-base font-extrabold text-slate-900">
                  {timeLeft.minutes}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase">
                  Menit
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID: INTERACTIVE AGENDA + COHORT PULSE + SPOTLIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: INTERACTIVE AGENDA (7 Cols on LG) */}
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
              <button
                id="btn-add-agenda-trigger"
                type="button"
                onClick={onOpenAddAgenda}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors"
              >
                <Plus size={14} />
                <span>+ Add Agenda</span>
              </button>
            </div>

            {/* Agenda List */}
            <div className="mt-4 space-y-2.5">
              {agendas.map((item) => (
                <div
                  key={item.id}
                  id={`agenda-item-${item.id}`}
                  onClick={() => onToggleAgenda(item.id)}
                  className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    item.is_completed
                      ? 'bg-slate-50/70 border-slate-100 text-slate-400'
                      : 'bg-white border-slate-200/70 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-slate-400 group-hover:text-slate-700 transition-colors"
                    aria-label={item.is_completed ? 'Tandai belum' : 'Tandai selesai'}
                  >
                    {item.is_completed ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <Circle size={18} className="text-slate-300" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-bold leading-snug ${
                          item.is_completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-900'
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

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {item.date} • {item.time}
                      </span>
                      <span>•</span>
                      <span className="truncate">{item.location}</span>
                    </div>

                    {item.notes && (
                      <p className="mt-1 text-[11px] text-slate-500 italic bg-slate-50 px-2 py-1 rounded-md">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{agendas.filter((a) => a.is_completed).length} dari {agendas.length} terselesaikan</span>
            <span className="text-[11px] text-slate-400">Klik item untuk toggle centang</span>
          </div>
        </section>

        {/* RIGHT COLUMN: COHORT PULSE WIDGET (5 Cols on LG) */}
        <section
          id="cohort-pulse-widget"
          className="lg:col-span-5 space-y-5"
        >
          {/* KPI PROGRESS CARD */}
          <div className="bg-white rounded-2xl border border-black/[0.06] p-5 sm:p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-slate-700" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Cohort Pulse
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
                <span className="text-xs font-semibold text-slate-600">
                  Terraquiz KPI (Target 100%)
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  {masteredCount}/{totalStudents} Dikuasai ({kpiPercentage}%)
                </span>
              </div>

              {/* Minimalist Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-slate-900 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, kpiPercentage))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                <span>Minimal kelulusan: 100% (170 anak)</span>
                <span className="font-semibold text-slate-600">
                  {totalStudents - masteredCount} tersisa
                </span>
              </div>
            </div>

            {/* LEADERBOARD TOP 3 PREVIEW */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Trophy size={14} className="text-amber-500" />
                  <span>Top 3 Hafalan Angkatan</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">
                  Leaderboard Realtime
                </span>
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
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : entry.rank === 2
                            ? 'bg-slate-300 text-slate-800'
                            : 'bg-amber-700/20 text-amber-900'
                        }`}
                      >
                        {entry.rank}
                      </span>
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[130px] sm:max-w-[160px]">
                        {entry.name}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 block">
                        {entry.masteredCount} Anak
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {entry.score} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 4. SPOTLIGHT CARD & COHORT OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* SPOTLIGHT CARD (Highlight Birthday / Random Member) */}
        <section
          id="spotlight-card"
          className="md:col-span-7 bg-white rounded-2xl border border-black/[0.06] p-5 sm:p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                {spotlightStudent.is_birthday_today
                  ? '🎂 Birthday Spotlight Hari Ini!'
                  : '✨ Cohort Spotlight (Kenalan Yuk!)'}
              </h3>
            </div>
            <button
              id="btn-shuffle-spotlight"
              type="button"
              onClick={handleShuffleSpotlight}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              title="Acak Mahasiswa"
            >
              <Shuffle size={13} />
              <span>Acak</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-100">
            <img
              src={spotlightStudent.avatar}
              alt={spotlightStudent.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white shadow-sm cursor-pointer"
              onClick={() => onSelectStudent(spotlightStudent)}
            />

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h4
                    onClick={() => onSelectStudent(spotlightStudent)}
                    className="text-sm font-bold text-slate-900 hover:underline cursor-pointer"
                  >
                    {spotlightStudent.name} ({spotlightStudent.nickname})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Kelompok {spotlightStudent.kelompok} • {spotlightStudent.region}
                  </p>
                </div>

                {spotlightStudent.is_birthday_today && (
                  <span className="self-center sm:self-start px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                    Ulang Tahun Hari Ini
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-slate-600 italic">
                "{spotlightStudent.motto || 'Semangat kaderisasi Terravana 2026!'}"
              </p>

              <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                <a
                  id="btn-spotlight-wa"
                  href={`https://wa.me/${spotlightStudent.wa_number}?text=${encodeURIComponent(
                    spotlightStudent.is_birthday_today
                      ? `Selamat ulang tahun ${spotlightStudent.nickname}! 🎂 Sukses selalu dan sehat bersama Terravana 2026!`
                      : `Halo ${spotlightStudent.nickname}! Salam kenal dari teman satu angkatan Terravana 2026 😊`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <MessageCircle size={14} />
                  <span>Chat WA ({spotlightStudent.nickname})</span>
                </a>

                <button
                  type="button"
                  onClick={() => onSelectStudent(spotlightStudent)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Lihat Profil
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* COHORT OVERVIEW STRIP (5 Cols on LG) */}
        <section
          id="cohort-quick-metrics"
          className="md:col-span-5 bg-white rounded-2xl border border-black/[0.06] p-5 sm:p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Statistik Angkatan 2026
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                100% Terverifikasi
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Anggota
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  170
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  12 Kelompok Kader
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Domisili Kos
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  7 Wilayah
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Mayoritas Sukolilo
                </div>
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
