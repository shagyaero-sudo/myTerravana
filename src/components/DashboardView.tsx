import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  MapPin,
  ChevronRight,
  Instagram,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  BookOpen,
  GraduationCap,
  Users,
  UserCheck,
  Pencil,
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
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
  subject: string;
  time: string;
  room: string;
  lecturer: string;
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

// Helper Format Tanggal Real-Time Dinamis (cth: Min, 20 Sep 2026)
const getFormattedTodayDate = () => {
  const today = new Date();
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  return `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  students,
  masteredCount,
  totalStudents,
  onNavigateTab,
  onSelectStudent,
  onToggleOfficerMode,
}) => {
  const [selectedDay, setSelectedDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>('Senin');

  const kpiPercentage = Math.round((masteredCount / totalStudents) * 100);

  const days: ('Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat')[] = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
  ];

  // Master Data Jadwal Matkul Per Hari
  const masterSchedules: ClassScheduleItem[] = [
    {
      id: 's1',
      day: 'Senin',
      subject: 'Pengantar Studi Pembangunan',
      time: '08:00 - 10:30',
      room: 'R. 102 Lt. 1',
      lecturer: 'Tim Dosen PSP',
    },
    {
      id: 's2',
      day: 'Senin',
      subject: 'Ekonomi Pembangunan I',
      time: '13:00 - 15:30',
      room: 'R. 204 Lt. 2',
      lecturer: 'Dr. Ir. Budi Santoso',
    },
    {
      id: 's3',
      day: 'Selasa',
      subject: 'Sosiologi Pembangunan',
      time: '09:00 - 11:30',
      room: 'R. 105 Lt. 1',
      lecturer: 'Dra. Rahmawati M.Si',
    },
    {
      id: 's4',
      day: 'Rabu',
      subject: 'Metode Penelitian Sosial',
      time: '08:00 - 10:30',
      room: 'Lab Komputer SP',
      lecturer: 'Tim Dosen Metpen',
    },
    {
      id: 's5',
      day: 'Kamis',
      subject: 'Statistika Terapan',
      time: '10:00 - 12:30',
      room: 'R. 201 Lt. 2',
      lecturer: 'Prof. Suparto',
    },
    {
      id: 's6',
      day: 'Jumat',
      subject: 'Bahasa Inggris Akademik',
      time: '08:30 - 11:00',
      room: 'R. 102 Lt. 1',
      lecturer: 'Tim UPT Bahasa',
    },
  ];

  const currentDayClasses = masterSchedules.filter((item) => item.day === selectedDay);

  // Custom Icon TikTok
  const TikTokIcon = () => (
    <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.89-2.89c.28 0 .54.04.79.1V9.4a6.32 6.32 0 1 0 5.55 6.27V8.69a8.18 8.18 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.00-0.12z" />
    </svg>
  );

  return (
    <div id="dashboard-view-root" className="max-w-2xl mx-auto space-y-5 pt-2 pb-36 font-sans">
      {/* 1. TOP BAR: PROFILE AVATAR (TANPA CORNER OUTLINE + IKON PENSIL BULATAN SANTAI) & REAL-TIME DATE */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectStudent(currentUser)}
            className="relative shrink-0 group focus:outline-none"
            title="Klik untuk Edit / Lihat Profil"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-full object-cover shadow-2xs group-hover:opacity-90 transition-opacity"
            />
            {/* BULATAN KECIL IKON PENSIL DENGAN PADDING/CONTAINER RAPI */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-100 shadow-xs flex items-center justify-center text-slate-700 group-hover:scale-110 transition-transform">
              <Pencil size={10} className="stroke-[2.5]" />
            </div>
          </button>

          <div>
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 leading-none">
              <span>{getFormattedTodayDate()}</span>
            </div>
            <h1
              onClick={onToggleOfficerMode}
              className="text-lg font-black tracking-tight text-slate-900 cursor-pointer hover:text-[#DB0000] transition-colors flex items-center gap-1.5 mt-0.5"
              title={currentUser.is_officer ? 'Mode BPH Aktif (Klik untuk matikan)' : 'Klik untuk masuk mode BPH'}
            >
              <span>Halo, {currentUser.nickname}! 👋</span>
              {currentUser.is_officer && (
                <ShieldCheck size={16} className="text-[#DB0000] inline-block" />
              )}
            </h1>
          </div>
        </div>

        {currentUser.is_officer && (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-900 text-white shadow-xs">
            BPH / OFFICER
          </span>
        )}
      </div>

      {/* 2. PROGRESS CHALLENGE TERRAQUIZ (MERAH TERRAVANA #DB0000 -> #860400 & TANPA AVATAR STACK) */}
      <div
        onClick={() => onNavigateTab('terraquiz')}
        className="relative bg-gradient-to-r from-[#DB0000] to-[#860400] rounded-[32px] p-5 text-white shadow-xl shadow-red-900/20 overflow-hidden cursor-pointer group transition-all hover:scale-[1.005]"
      >
        {/* Soft Clay Clay Sphere SVG Accent */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-6 -bottom-6 w-32 h-32 pointer-events-none opacity-40"
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="clayRedGradient" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FF6B6B" />
                <stop offset="60%" stopColor="#DB0000" />
                <stop offset="100%" stopColor="#570300" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#clayRedGradient)" />
          </svg>
        </motion.div>

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="space-y-3 max-w-[70%] sm:max-w-[75%]">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[9px] font-extrabold uppercase tracking-wider text-red-100 backdrop-blur-md">
              <Sparkles size={10} />
              <span>TERRAQUIZ CHALLENGE</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                Hafalan Terravana
              </h3>
              <p className="text-[11px] font-semibold text-red-100/90 mt-0.5">
                {masteredCount} dari {totalStudents} Mahasiswa Telah Dikuasai
              </p>
            </div>

            {/* ACTION BUTTON CLEAN (TANPA TUMPUSAN AVATAR +166) */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateTab('terraquiz');
                }}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-black hover:bg-slate-100 transition-all shadow-md flex items-center gap-1 group-hover:translate-x-0.5 shrink-0"
              >
                <span>Mainkan Kuis</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/15 border border-white/30 flex flex-col items-center justify-center backdrop-blur-md shadow-inner">
              <span className="text-base sm:text-lg font-black leading-none">{kpiPercentage}%</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BENTO CARDS SECTION */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Agenda Hari Ini
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab('tasks')}
            className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-1"
          >
            <span>Buka Tasks</span>
            <ChevronRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* KARTU KUNING PASTEL (JADWAL KULIAH) */}
          <div className="relative bg-[#FFDA66] rounded-[32px] p-5 text-slate-900 shadow-lg shadow-amber-200/40 flex flex-col justify-between space-y-4 overflow-hidden">
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
                  Jadwal Kuliah
                </span>
                <span className="text-[10px] font-black bg-amber-900/10 text-amber-900 px-2 py-0.5 rounded-md">
                  KL. {currentUser.class_code || 'A'}
                </span>
              </div>

              {/* BAR HARI */}
              <div className="flex items-center justify-between gap-1 bg-amber-950/10 p-1 rounded-2xl">
                {days.map((day) => {
                  const isActive = selectedDay === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`flex-1 py-1 text-[10px] font-extrabold rounded-xl transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-amber-950/70 hover:text-slate-900'
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  );
                })}
              </div>

              {/* LIST MATKUL */}
              <div className="space-y-2 pt-0.5">
                {currentDayClasses.length > 0 ? (
                  currentDayClasses.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-white/80 border border-white/90 backdrop-blur-xs space-y-1 shadow-2xs"
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
                  ))
                ) : (
                  <div className="p-3 text-center rounded-2xl bg-white/60 text-xs font-bold text-amber-950/70">
                    Tidak ada jadwal kuliah di hari {selectedDay}. 🎉
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10 pt-2 border-t border-amber-900/10">
              <a
                href="https://mia.its.ac.id/presensi"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-black text-slate-900 hover:text-amber-950 transition-colors flex items-center justify-between group"
              >
                <span>Buka MIA Presensi</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* KANAN: SHORTCUT MYITS PORTAL & MEDSOS */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* PORTAL MYITS SHORTCUTS */}
            <div className="relative bg-[#D0E5FF] rounded-[32px] p-5 text-slate-900 shadow-lg shadow-blue-100/50 flex-1 flex flex-col justify-between space-y-4 overflow-hidden">
              <motion.div
                animate={{ y: [0, -8, 0] }}
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

              <div className="relative z-10 space-y-1">
                <h4 className="text-lg font-black leading-tight">Portal myITS</h4>
                <p className="text-xs font-bold text-blue-950/70">Akses shortcut</p>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-2 pt-1">
                <a
                  href="https://classroom.its.ac.id/auth/oidc"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-white border border-white/80 text-slate-900 text-xs font-extrabold hover:bg-slate-50 transition-all shadow-2xs flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={15} className="text-blue-600" />
                    <span>Classroom</span>
                  </div>
                  <ExternalLink size={12} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                </a>

                <a
                  href="https://mia.its.ac.id/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-white border border-white/80 text-slate-900 text-xs font-extrabold hover:bg-slate-50 transition-all shadow-2xs flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap size={15} className="text-blue-600" />
                    <span>Academics</span>
                  </div>
                  <ExternalLink size={12} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                </a>

                <a
                  href="https://kemahasiswaan.its.ac.id/portofolio/kegiatan"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-white border border-white/80 text-slate-900 text-xs font-extrabold hover:bg-slate-50 transition-all shadow-2xs flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-blue-600" />
                    <span>StudConn</span>
                  </div>
                  <ExternalLink size={12} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                </a>

                <a
                  href="https://wali.its.ac.id"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-white border border-white/80 text-slate-900 text-xs font-extrabold hover:bg-slate-50 transition-all shadow-2xs flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck size={15} className="text-blue-600" />
                    <span>Wali</span>
                  </div>
                  <ExternalLink size={12} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                </a>
              </div>
            </div>

            {/* KARTU PINK PASTEL (MEDSOS) */}
            <div className="bg-[#F5C7F7] rounded-[32px] p-4 text-slate-900 shadow-lg shadow-pink-100/50 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black block">Follow us</span>
                <span className="text-[10px] font-bold text-pink-950/70">@terravana25</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com/terravana25"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white text-pink-600 flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                  title="Instagram @terravana25"
                >
                  <Instagram size={17} />
                </a>
                <a
                  href="https://tiktok.com/@terravana25"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                  title="TikTok @terravana25"
                >
                  <TikTokIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};