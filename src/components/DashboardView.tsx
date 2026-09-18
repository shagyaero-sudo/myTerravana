import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Bell,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ChevronRight,
  Instagram,
  Youtube,
  Send,
  Megaphone,
  X,
  ExternalLink,
} from 'lucide-react';
import { StudentUser } from '../types';

interface DashboardViewProps {
  currentUser: StudentUser;
  students: StudentUser[];
  masteredCount: number;
  totalStudents: number;
  onNavigateToTab: (tabId: string) => void;
  onSelectStudent: (student: StudentUser) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  students,
  masteredCount,
  totalStudents,
  onNavigateToTab,
  onSelectStudent,
}) => {
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('25'); // Active Date State

  const kpiPercentage = Math.round((masteredCount / totalStudents) * 100);
  const topMasteredStudents = students.filter((s) => s.mastered).slice(0, 4);

  // Strip Tanggal Mingguan
  const weekDays = [
    { day: 'Sun', date: '22' },
    { day: 'Mon', date: '23' },
    { day: 'Tue', date: '24' },
    { day: 'Wed', date: '25' },
    { day: 'Thu', date: '26' },
    { day: 'Fri', date: '27' },
  ];

  return (
    <div id="dashboard-view-root" className="max-w-2xl mx-auto space-y-6 pb-36 font-sans">
      {/* 1. HEADER ATAS */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer" onClick={() => onSelectStudent(currentUser)}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover ring-4 ring-purple-100 shadow-xs hover:opacity-90 transition-opacity"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block leading-tight">
              Today 18 Sep.
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Hello, {currentUser.nickname}!
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAnnouncementOpen(true)}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all relative"
            title="Pengumuman Angkatan"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateToTab('terrafinder')}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
            title="Cari Mahasiswa"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* 2. HERO BANNER UNGU (DAILY CHALLENGE) */}
      <div 
        onClick={() => onNavigateToTab('terraquiz')}
        className="relative bg-[#A088F2] rounded-[32px] p-6 text-white shadow-xl shadow-purple-200/50 overflow-hidden cursor-pointer group transition-all hover:scale-[1.01]"
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

        <div className="relative z-10 space-y-4">
          <div>
            <h3 className="text-2xl font-black tracking-tight leading-tight">
              Daily Challenge
            </h3>
            <p className="text-xs font-semibold text-purple-100/90 mt-1">
              Target hafalan angkatan Terravana 2026 ({kpiPercentage}% Tuntas)
            </p>
          </div>

          {/* Stack Avatar Pendaftar / Mastered */}
          <div className="flex items-center gap-3 pt-2">
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
                  onNavigateToTab('terrafinder');
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
                onNavigateToTab('terraquiz');
              }}
              className="px-4 py-2 rounded-2xl bg-white text-slate-900 text-xs font-black hover:bg-slate-100 transition-all shadow-xs flex items-center gap-1.5 group-hover:translate-x-1"
            >
              <span>Mainkan Kuis</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. HORIZONTAL DATE STRIP */}
      <div className="flex items-center justify-between gap-2 px-1">
        {weekDays.map((item) => {
          const isActive = selectedDate === item.date;
          return (
            <button
              key={item.date}
              type="button"
              onClick={() => setSelectedDate(item.date)}
              className={`flex-1 flex flex-col items-center py-2.5 rounded-2xl transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md scale-105 font-bold'
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                {item.day}
              </span>
              <span className="text-sm font-black mt-0.5">{item.date}</span>
            </button>
          );
        })}
      </div>

      {/* 4. ASYMMETRIC GRID CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Your plan
          </h3>
          <button
            type="button"
            onClick={() => setIsAnnouncementOpen(true)}
            className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors"
          >
            See all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* KARTU KUNING PASTEL (AGENDA UTAMA) */}
          <div 
            onClick={() => setIsAnnouncementOpen(true)}
            className="relative bg-[#FFDA66] rounded-[32px] p-5 text-slate-900 shadow-lg shadow-amber-200/40 flex flex-col justify-between space-y-4 overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform"
          >
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
              <span className="inline-block px-3 py-1 rounded-full bg-white/80 text-[10px] font-extrabold text-amber-900">
                Wajib Angkatan
              </span>

              <div>
                <h4 className="text-xl font-black leading-tight">
                  Sidang Pleno Terravana 2026
                </h4>
                <div className="mt-2 space-y-1 text-xs font-bold text-amber-950/80">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon size={13} />
                    <span>25 Nov. 2026</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>14:00 - 15:00</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    <span>Auditorium ITS</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-2 flex items-center justify-between border-t border-amber-900/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                  T
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-900/70 block leading-tight">Panitia</span>
                  <span className="text-xs font-extrabold text-slate-900">BPH Terravana</span>
                </div>
              </div>

              <span className="text-amber-900/80 hover:text-amber-950 font-bold text-xs flex items-center gap-0.5">
                Detail <ExternalLink size={12} />
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* KARTU BIRU MUDA (BALANCE / STATS) */}
            <div 
              onClick={() => onNavigateToTab('terraquiz')}
              className="relative bg-[#D0E5FF] rounded-[32px] p-5 text-slate-900 shadow-lg shadow-blue-100/50 flex-1 flex flex-col justify-between space-y-3 overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform"
            >
              {/* Animated Floating Sphere */}
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
                  Stats Hafalan
                </span>

                <div>
                  <h4 className="text-lg font-black leading-tight">
                    Progress Angkatan
                  </h4>
                  <p className="text-xs font-bold text-blue-950/70 mt-1">
                    {masteredCount} dari {totalStudents} Mahasiswa Telah Dikuasai
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToTab('terraquiz');
                  }}
                  className="w-full py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  Uji Hafalan
                </button>
              </div>
            </div>

            {/* KARTU PINK PASTEL (MEDIA SOSIAL) */}
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

      {/* MODAL PENGUMUMAN URGENT BPH */}
      <AnimatePresence>
        {isAnnouncementOpen && (
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
                  <h3 className="text-base font-extrabold text-slate-900">
                    Pengumuman Urgent BPH
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnnouncementOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700 font-medium leading-relaxed">
                <p className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 text-amber-950 font-bold">
                  ⚠️ Pengumpulan Berkas Kelompok Terravana paling lambat diserahkan tanggal 25 November 2026 pukul 23.59 WIB melalui Penanggung Jawab masing-masing.
                </p>
                <p className="text-slate-500">
                  Pastikan seluruh anggota kelompok sudah menyelesaikan pendaftaran ulang di direktori Terrafinder agar tidak terkendala administrasi.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAnnouncementOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
              >
                Saya Mengerti
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};