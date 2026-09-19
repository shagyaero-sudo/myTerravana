import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Search,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Instagram,
  Youtube,
  Send,
  Megaphone,
  X,
  Edit3,
  Sun,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';
import { StudentUser } from '../types';

export interface AnnouncementData {
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface AgendaData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  tag: string;
}

interface ClassScheduleItem {
  id: string;
  subject: string;
  time: string;
  room: string;
  lecturer: string;
  code: string;
}

interface DashboardViewProps {
  currentUser: StudentUser;
  students: StudentUser[];
  masteredCount: number;
  totalStudents: number;
  announcement: AnnouncementData;
  agendas: AgendaData[];
  onNavigateTab: (tabId: string) => void;
  onSelectStudent: (student: StudentUser) => void;
  onToggleOfficerMode?: () => void;
  onEditAnnouncement?: () => void;
  onEditAgenda?: (agenda: AgendaData) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  students,
  masteredCount,
  totalStudents,
  announcement,
  agendas,
  onNavigateTab,
  onSelectStudent,
  onToggleOfficerMode,
  onEditAnnouncement,
  onEditAgenda,
}) => {
  const [isDetailAnnouncementOpen, setIsDetailAnnouncementOpen] = useState(false);

  const kpiPercentage = Math.round((masteredCount / totalStudents) * 100);
  const topMasteredStudents = students.filter((s) => s.mastered).slice(0, 4);

  // Sample data jadwal kuliah harian (Hari Ini)
  const todayClasses: ClassScheduleItem[] = [
    {
      id: 'c1',
      subject: 'Pengantar Studi Pembangunan',
      time: '08:00 - 10:30',
      room: 'R. 102 Lt. 1',
      lecturer: 'Tim Dosen PSP',
      code: 'A',
    },
    {
      id: 'c2',
      subject: 'Ekonomi Pembangunan I',
      time: '13:00 - 15:30',
      room: 'R. 204 Lt. 2',
      lecturer: 'Dr. Ir. Budi Santoso',
      code: 'A',
    },
  ];

  return (
    <div id="dashboard-view-root" className="max-w-2xl mx-auto space-y-5 pt-2 pb-36 font-sans">
      {/* 1. TOP BAR: LOGO ANGKATAN & AVATAR PROFIL + BPH TOGGLE */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0">
            <img
              src="/logoterravana.png"
              alt="Terravana Phoenix Logo"
              className="w-full h-full object-contain drop-shadow-xs"
            />
          </div>
          <div>
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 leading-none">
              <Sun size={12} className="text-amber-500" />
              <span>Dashboard Home</span>
            </div>
            <h1
              onClick={onToggleOfficerMode}
              className="text-lg font-black tracking-tight text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors flex items-center gap-1.5 mt-0.5"
              title={currentUser.is_officer ? 'Mode BPH Aktif (Klik untuk matikan)' : 'Klik untuk masuk mode BPH'}
            >
              <span>Halo, {currentUser.nickname}! 👋</span>
              {currentUser.is_officer && (
                <ShieldCheck size={16} className="text-indigo-600 inline-block" />
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.is_officer && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-900 text-white shadow-xs">
              BPH
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsDetailAnnouncementOpen(true)}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all relative"
            title="Pengumuman Angkatan"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('terrafinder')}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
            title="Cari Mahasiswa"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* 2. PROGRESS CHALLENGE TERRAQUIZ (HERO BANNER - EVERNOTE SOFT CLAY STYLE) */}
      <div
        onClick={() => onNavigateTab('terraquiz')}
        className="relative bg-[#A088F2] rounded-[32px] p-6 text-white shadow-xl shadow-purple-200/50 overflow-hidden cursor-pointer group transition-all hover:scale-[1.005]"
      >
        {/* Animated Soft Clay Spheres SVG */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-6 -bottom-6 w-36 h-36 pointer-events-none opacity-90"
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="claySphere1" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFF2A1" />
                <stop offset="40%" stopColor="#F5A0D9" />
                <stop offset="100%" stopColor="#8054D6" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#claySphere1)" />
          </svg>
        </motion.div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider text-purple-100 backdrop-blur-md">
              <Sparkles size={12} />
              <span>Terraquiz Progress Challenge</span>
            </div>

            <div>
              <h3 className="text-2xl font-black tracking-tight leading-tight">
                Hafalan Terravana 2026
              </h3>
              <p className="text-xs font-semibold text-purple-100/90 mt-1">
                {masteredCount} dari {totalStudents} Mahasiswa Telah Dikuasai
              </p>
            </div>

            {/* Stack Avatar */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2.5 overflow-hidden">
                {topMasteredStudents.length > 0
                  ? topMasteredStudents.map((st) => (
                      <img
                        key={st.id}
                        src={st.avatar}
                        alt={st.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(st);
                        }}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-[#A088F2] object-cover hover:scale-110 transition-transform"
                      />
                    ))
                  : students.slice(0, 4).map((st) => (
                      <img
                        key={st.id}
                        src={st.avatar}
                        alt={st.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(st);
                        }}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-[#A088F2] object-cover hover:scale-110 transition-transform"
                      />
                    ))}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateTab('terrafinder');
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white ring-2 ring-[#A088F2] hover:bg-slate-800"
                >
                  +{totalStudents - 4}
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateTab('terraquiz');
                }}
                className="px-4 py-2 rounded-2xl bg-white text-slate-900 text-xs font-black hover:bg-slate-100 transition-all shadow-xs flex items-center gap-1.5 group-hover:translate-x-1"
              >
                <span>Mainkan Kuis</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* EVERNOTE PROGRESS CIRCLE WIDGET */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="relative w-20 h-20 rounded-full bg-white/10 border border-white/20 flex flex-col items-center justify-center backdrop-blur-sm">
              <span className="text-2xl font-black">{kpiPercentage}%</span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-purple-200">
                KPI
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BENTO CARDS SECTION (JADWAL MATKUL & MYITS SHORTCUTS) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Today's Academic
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab('tasks')}
            className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-1"
          >
            <span>Buka Productivity</span>
            <ChevronRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* KARTU KUNING PASTEL (JADWAL MATKUL HARIAN) */}
          <div className="relative bg-[#FFDA66] rounded-[32px] p-5 text-slate-900 shadow-lg shadow-amber-200/40 flex flex-col justify-between space-y-4 overflow-hidden">
            {/* Animated Soft Clay Gem SVG */}
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-4 -bottom-4 w-28 h-28 pointer-events-none opacity-80"
            >
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="clayGold" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#FFC837" />
                    <stop offset="100%" stopColor="#E08200" />
                  </radialGradient>
                </defs>
                <rect x="30" y="30" width="140" height="140" rx="40" fill="url(#clayGold)" />
              </svg>
            </motion.div>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 rounded-full bg-white/80 text-[10px] font-extrabold text-amber-900">
                  Jadwal Matkul Hari Ini
                </span>
                <span className="text-[10px] font-black bg-amber-900/10 text-amber-900 px-2 py-0.5 rounded-md">
                  Kelas {currentUser.class_code || 'A'}
                </span>
              </div>

              <div className="space-y-2.5">
                {todayClasses.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-2xl bg-white/70 border border-white/80 backdrop-blur-xs space-y-1"
                  >
                    <h4 className="text-xs font-black text-slate-900 leading-snug">
                      {item.subject}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-950/80">
                      <div className="flex items-center gap-1">
                        <Clock size={11} />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={11} />
                        <span>{item.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-2 flex items-center justify-between border-t border-amber-900/10">
              <span className="text-[11px] font-extrabold text-amber-950">
                Selalu tepat waktu ke kelas!
              </span>
              <BookOpen size={16} className="text-amber-900 opacity-80" />
            </div>
          </div>

          {/* RIGHT COLUMN: SHORTCUT MYITS PORTAL & AGENDA UTAMA */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* KARTU BIRU MUDA (MYITS PORTAL SHORTCUTS) */}
            <div className="relative bg-[#D0E5FF] rounded-[32px] p-5 text-slate-900 shadow-lg shadow-blue-100/50 flex-1 flex flex-col justify-between space-y-3 overflow-hidden">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-5 -bottom-5 w-24 h-24 pointer-events-none opacity-80"
              >
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="clayBlue" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#7ABCFF" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </radialGradient>
                  </defs>
                  <circle cx="100" cy="100" r="75" fill="url(#clayBlue)" />
                </svg>
              </motion.div>

              <div className="relative z-10 space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-white/80 text-[10px] font-extrabold text-blue-900">
                  Quick Access
                </span>

                <div>
                  <h4 className="text-lg font-black leading-tight">
                    Portal myITS Shortcuts
                  </h4>
                  <p className="text-xs font-bold text-blue-950/70 mt-0.5">
                    Akses cepat ke layanan akademik kampus
                  </p>
                </div>
              </div>

              {/* Action Buttons Redirect Portal */}
              <div className="relative z-10 grid grid-cols-2 gap-2 pt-1">
                <a
                  href="https://my.its.ac.id"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-2xl bg-slate-900 text-white text-[11px] font-extrabold hover:bg-slate-800 transition-colors shadow-xs flex items-center justify-between"
                >
                  <span>myITS Portal</span>
                  <ExternalLink size={12} />
                </a>
                <a
                  href="https://classroom.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-2xl bg-white text-slate-900 text-[11px] font-extrabold hover:bg-slate-50 transition-colors shadow-xs flex items-center justify-between"
                >
                  <span>Classroom</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* KARTU PINK PASTEL (MEDIA SOSIAL ANGKATAN) */}
            <div className="bg-[#F5C7F7] rounded-[32px] p-4 text-slate-900 shadow-lg shadow-pink-100/50 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black block">Follow us</span>
                <span className="text-[10px] font-bold text-pink-950/70">Medsos Terravana 2026</span>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white text-pink-600 flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white text-rose-600 flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                >
                  <Youtube size={16} />
                </a>
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white text-sky-600 flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                >
                  <Send size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DETAIL PENGUMUMAN */}
      <AnimatePresence>
        {isDetailAnnouncementOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Megaphone size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {announcement.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {announcement.date} • Oleh {announcement.author}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {currentUser.is_officer && onEditAnnouncement && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsDetailAnnouncementOpen(false);
                        onEditAnnouncement();
                      }}
                      className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Edit Pengumuman"
                    >
                      <Edit3 size={15} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsDetailAnnouncementOpen(false)}
                    className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700 font-medium leading-relaxed">
                <p className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 text-amber-950 font-bold whitespace-pre-line">
                  {announcement.content}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailAnnouncementOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
              >
                Tutup Pengumuman
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};