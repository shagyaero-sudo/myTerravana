import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  X,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { StudentUser } from '../types';

export interface ScheduledTask {
  id: string;
  time: string;
  title: string;
  description: string;
  category: string;
  dateIso: string; // "YYYY-MM-DD"
  isCompleted: boolean;
  priority: 'Low' | 'Medium' | 'High';
}

interface TasksViewProps {
  currentUser: StudentUser;
  students: StudentUser[];
}

// Helper untuk format YYYY-MM-DD
const toIsoString = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Helper Format Tanggal Indonesia
const formatIndonesianDate = (date: Date) => {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// Helper Render Link Clickable
const renderTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline font-bold inline-flex items-center gap-0.5 break-all"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{part}</span>
          <ExternalLink size={10} />
        </a>
      );
    }
    return part;
  });
};

export const TasksView: React.FC<TasksViewProps> = ({ currentUser }) => {
  const today = new Date();
  const todayIso = toIsoString(today);

  // Active States
  const [selectedDateIso, setSelectedDateIso] = useState<string>(todayIso);
  const [categories, setCategories] = useState<string[]>(['Work', 'Personal', 'Organisasi']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDetailTask, setSelectedDetailTask] = useState<ScheduledTask | null>(null);
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [customCatInput, setCustomCatInput] = useState('');

  // Form States
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState(todayIso);
  const [newTime, setNewTime] = useState('09:00');
  const [newCategory, setNewCategory] = useState('Work');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Calendar State
  const [calendarViewMonth, setCalendarViewMonth] = useState(today.getMonth());
  const [calendarViewYear, setCalendarViewYear] = useState(today.getFullYear());

  // Master Tasks State
  const [tasks, setTasks] = useState<ScheduledTask[]>([
    {
      id: 'st-1',
      time: '09:00 AM',
      title: 'Meeting dengan Dosen Pembimbing',
      description: 'Diskusi progres PKM-RSH dan rekap data. Link Zoom: https://zoom.us/j/123456789',
      category: 'Work',
      dateIso: todayIso,
      isCompleted: false,
      priority: 'High',
    },
    {
      id: 'st-2',
      time: '11:00 AM',
      title: 'Pengerjaan Desain Landing Page',
      description: 'Review UI komponen Soft Clay di Figma dan koordinasi dengan tim dev.',
      category: 'Work',
      dateIso: todayIso,
      isCompleted: true,
      priority: 'Medium',
    },
    {
      id: 'st-3',
      time: '02:30 PM',
      title: 'Bayar Iuran Kas Angkatan',
      description: 'Transfer ke bendahara Terravana via QRIS / Bank Mandiri.',
      category: 'Personal',
      dateIso: todayIso,
      isCompleted: false,
      priority: 'Low',
    },
  ]);

  // Infinite Swipe Date Generator (-30 Hari sampai +60 Hari)
  const dateStrip = useMemo(() => {
    const list = [];
    const base = new Date();
    for (let i = -30; i <= 60; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      const iso = toIsoString(d);
      const dayIndex = d.getDay();
      
      const dayNamesIndo = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
      const dayName = dayNamesIndo[dayIndex];
      const dayNum = d.getDate();
      const isSunday = dayIndex === 0;

      list.push({ dateObj: d, iso, dayName, dayNum, isSunday });
    }
    return list;
  }, []);

  // Handlers
  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const handleAddCustomCategory = () => {
    if (customCatInput.trim() && !categories.includes(customCatInput.trim())) {
      const updated = [...categories, customCatInput.trim()];
      setCategories(updated);
      setNewCategory(customCatInput.trim());
      setCustomCatInput('');
      setIsAddingCustomCategory(false);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const [hrs, mins] = newTime.split(':');
    const hourNum = parseInt(hrs, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    const formattedTime = `${String(displayHour).padStart(2, '0')}:${mins} ${ampm}`;

    const newTask: ScheduledTask = {
      id: `st-${Date.now()}`,
      time: formattedTime,
      title: newTitle,
      description: newDesc,
      category: newCategory,
      dateIso: newDate,
      isCompleted: false,
      priority: newPriority,
    };

    setTasks([...tasks, newTask]);
    setSelectedDateIso(newDate);

    setNewTitle('');
    setNewDesc('');
    setIsAddModalOpen(false);
  };

  const tasksForSelectedDate = tasks.filter((t) => {
    const matchesDate = t.dateIso === selectedDateIso;
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesDate && matchesCat;
  });

  const activeDateObj = new Date(selectedDateIso);
  const activeDateFormatted = formatIndonesianDate(activeDateObj);
  const isViewingToday = selectedDateIso === todayIso;

  // Calendar Calc
  const daysInMonth = new Date(calendarViewYear, calendarViewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarViewYear, calendarViewMonth, 1).getDay();

  return (
    <div id="tasks-schedule-root" className="max-w-md mx-auto space-y-5 pt-2 pb-36 font-sans">
      {/* 1. BAR PALING ATAS REVISI 7: (<-) | (Today: Sab, 19 Sept 2026) | (+) */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setSelectedDateIso(todayIso)}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          title="Kembali ke Hari Ini"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="px-4 py-2 rounded-full bg-white border border-slate-200 shadow-2xs text-center">
          <span className="text-xs font-black text-slate-900 tracking-tight">
            Today: {formatIndonesianDate(today)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="w-10 h-10 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center shadow-md shadow-purple-200/60 hover:scale-105 transition-all"
          title="Tambah Task Baru"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* 2. TITLE & KALENDER POPUP BUTTON */}
      <div className="flex items-end justify-between pt-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
            Task
          </h1>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
            Schedule
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsCalendarModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2 text-xs font-black text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <CalendarIcon size={15} className="text-slate-700" />
          <span>Kalender</span>
        </button>
      </div>

      {/* 3. REAL-TIME INFINITE SWIPE DATE STRIP (SWIPEABLE & TODAY ON LEFT) */}
      <div className="pt-1">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1.5 px-0.5 touch-pan-x">
          {dateStrip.map((item) => {
            const isActive = selectedDateIso === item.iso;
            const isToday = item.iso === todayIso;

            return (
              <button
                key={item.iso}
                type="button"
                onClick={() => setSelectedDateIso(item.iso)}
                className={`flex-1 min-w-[50px] py-3.5 rounded-2xl flex flex-col items-center justify-center transition-all shrink-0 relative ${
                  isActive
                    ? 'bg-[#1E1B26] text-white shadow-md scale-105 font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span
                  className={`text-[10px] font-black block uppercase ${
                    item.isSunday && !isActive ? 'text-rose-500' : ''
                  }`}
                >
                  {item.dayName}
                </span>
                <span
                  className={`text-sm font-black mt-0.5 ${
                    item.isSunday && !isActive ? 'text-rose-600' : ''
                  }`}
                >
                  {item.dayNum}
                </span>

                {/* Dot penanda Hari Ini */}
                {isToday && !isActive && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 bg-purple-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. CATEGORY FILTERS (REVISI 3: TANPA +CUSTOM) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 ${
            selectedCategory === 'All'
              ? 'bg-[#1E1B26] text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#1E1B26] text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* REVISI 9: NOTIFIKASI MEMILIH TANGGAL LAIN + OPTION KEMBALI */}
      {!isViewingToday && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between text-amber-950 text-xs font-bold shadow-2xs">
          <span>Menampilkan: {activeDateFormatted}</span>
          <button
            type="button"
            onClick={() => setSelectedDateIso(todayIso)}
            className="px-2.5 py-1 rounded-xl bg-amber-900 text-white text-[10px] font-black flex items-center gap-1 hover:bg-amber-950 transition-colors"
          >
            <RotateCcw size={11} />
            <span>Ke Hari Ini</span>
          </button>
        </div>
      )}

      {/* 5. TIME SLOT & TIMELINE TASKS */}
      <div className="pt-2 space-y-4">
        {tasksForSelectedDate.length > 0 ? (
          tasksForSelectedDate.map((task) => (
            <div key={task.id} className="flex items-start gap-3">
              {/* Left Column: Time */}
              <div className="w-14 shrink-0 text-center pt-1">
                <span className="text-xs font-black text-slate-900 block leading-tight">
                  {task.time.split(' ')[0]}
                </span>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {task.time.split(' ')[1]}
                </span>
                <div className="w-0.5 h-10 bg-slate-200 mx-auto my-2 rounded-full opacity-60" />
              </div>

              {/* Right Column: Task Card */}
              <div
                className={`flex-1 rounded-[28px] p-4 border transition-all space-y-2.5 shadow-xs ${
                  task.isCompleted
                    ? 'bg-slate-50/80 border-slate-200 opacity-60'
                    : 'bg-white border-slate-100'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        task.priority === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : task.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      ● {task.category}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedDetailTask(task)}
                      className="text-[11px] font-black text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      Details &gt;
                    </button>
                  </div>

                  <h3
                    className={`text-sm font-black text-slate-900 leading-snug ${
                      task.isCompleted ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {renderTextWithLinks(task.description)}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">
                    {task.isCompleted ? 'Tugas Selesai' : 'Belum Selesai'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleComplete(task.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      task.isCompleted
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {task.isCompleted ? (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Checked ✓</span>
                      </>
                    ) : (
                      <>
                        <Circle size={14} />
                        <span>Tandai Selesai</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-slate-200 p-6 space-y-2">
            <Clock size={32} className="mx-auto text-slate-300" />
            <h4 className="text-sm font-black text-slate-700">Tidak Ada Tugas Hari Ini</h4>
            <p className="text-xs text-slate-400 font-medium">
              Gunakan waktu luang untuk istirahat atau catat agenda baru.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL LAYER HIGHEST (z-[100]) UNTUK MENUTUP TOTAL NAV DOCK */}
      {/* ========================================================= */}

      {/* MODAL POPUP KALENDER UTUH (REVISI 4, 5, 6) */}
      <AnimatePresence>
        {isCalendarModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-[36px] p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              {/* Header Kalender */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">
                  {new Date(calendarViewYear, calendarViewMonth).toLocaleDateString('id-ID', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (calendarViewMonth === 0) {
                        setCalendarViewMonth(11);
                        setCalendarViewYear(calendarViewYear - 1);
                      } else {
                        setCalendarViewMonth(calendarViewMonth - 1);
                      }
                    }}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (calendarViewMonth === 11) {
                        setCalendarViewMonth(0);
                        setCalendarViewYear(calendarViewYear + 1);
                      } else {
                        setCalendarViewMonth(calendarViewMonth + 1);
                      }
                    }}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCalendarModalOpen(false)}
                    className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Grid Header Hari (MIN Merah) */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase">
                <span className="text-rose-600">MIN</span>
                <span className="text-slate-400">SEN</span>
                <span className="text-slate-400">SEL</span>
                <span className="text-slate-400">RAB</span>
                <span className="text-slate-400">KAM</span>
                <span className="text-slate-400">JUM</span>
                <span className="text-slate-400">SAB</span>
              </div>

              {/* Grid Tanggal Kalender */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-9" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateObj = new Date(calendarViewYear, calendarViewMonth, dayNum);
                  const iso = toIsoString(dateObj);
                  const isSelected = iso === selectedDateIso;
                  const isToday = iso === todayIso;
                  const isSunday = dateObj.getDay() === 0;
                  const hasTasks = tasks.some((t) => t.dateIso === iso);

                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => {
                        setSelectedDateIso(iso);
                        setIsCalendarModalOpen(false);
                      }}
                      className={`h-9 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center relative border ${
                        isSelected
                          ? 'bg-[#1E1B26] text-white border-[#1E1B26] font-black shadow-xs'
                          : isToday
                          ? 'bg-purple-100 text-purple-900 border-purple-200 font-extrabold'
                          : isSunday
                          ? 'text-rose-600 border-transparent hover:bg-rose-50'
                          : 'border-transparent hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span>{dayNum}</span>

                      {/* REVISI 5: Indikator Outline/Dot jika ada Task */}
                      {hasTasks && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full absolute bottom-0.5 ${
                            isSelected ? 'bg-amber-400' : 'bg-purple-600 ring-1 ring-purple-200'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* REVISI 4: Notes Kecil di Bawah Kalender */}
              <div className="pt-2 text-center border-t border-slate-100">
                <p className="text-[10px] font-semibold text-slate-400">
                  💡 Klik tanggal ber-indikator dot untuk melihat agenda tugas di hari tersebut.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DETAIL TASK DESKRIPSI */}
      <AnimatePresence>
        {selectedDetailTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-[36px] p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold">
                  {selectedDetailTask.category}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDetailTask(null)}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900">
                  {selectedDetailTask.title}
                </h3>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Clock size={13} />
                  <span>{selectedDetailTask.dateIso} • {selectedDetailTask.time}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-medium text-slate-700 leading-relaxed space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 block">
                  Deskripsi & Link
                </span>
                <p className="whitespace-pre-line">
                  {selectedDetailTask.description
                    ? renderTextWithLinks(selectedDetailTask.description)
                    : 'Tidak ada deskripsi tambahan.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDetailTask(null)}
                className="w-full py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Tutup Detail
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ADD CUSTOM CATEGORY */}
      <AnimatePresence>
        {isAddingCustomCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl space-y-4"
            >
              <h3 className="text-sm font-black text-slate-900">Tambah Kategori Custom</h3>
              <input
                type="text"
                placeholder="Contoh: Project Terravana, Sertifikasi..."
                value={customCatInput}
                onChange={(e) => setCustomCatInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCustomCategory(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ADD NEW TASK (REVISI 10: TANPA CENTANG POJOK) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-[36px] p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
                <h3 className="text-base font-black text-slate-900">Tambah Task Baru</h3>
                <div className="w-5" />
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 block">
                    Judul Task
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Finish landing page design"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 block">
                    Deskripsi & Link (Zoom/GMeet/Drive)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tulis deskripsi atau sertakan link Zoom https://..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 block">
                    Tanggal & Jam Deadline
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 block">
                    Prioritas
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Low', 'Medium', 'High'] as const).map((p) => {
                      const isSelected = newPriority === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewPriority(p)}
                          className={`py-2 rounded-full text-xs font-extrabold capitalize transition-all border ${
                            isSelected
                              ? p === 'High'
                                ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                                : p === 'Medium'
                                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                                : 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* REVISI 3: Tambah Custom Category di Modal */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 block">
                      Project / Kategori
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomCategory(true)}
                      className="text-[10px] font-black text-purple-600 hover:underline"
                    >
                      + Tambah Custom Kategori
                    </button>
                  </div>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#7C5CFC] text-white text-xs font-black hover:bg-purple-600 transition-colors shadow-lg shadow-purple-200/60 mt-2"
                >
                  Buat Task
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};