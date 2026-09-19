import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  X,
  Star,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Info,
  ExternalLink,
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

// Helper untuk Render Text dengan Clickable Links
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

  // Active Date State (Default: Hari ini)
  const [selectedDateIso, setSelectedDateIso] = useState<string>(todayIso);
  const [baseDateForStrip, setBaseDateForStrip] = useState<Date>(today);

  // Categories State
  const [categories, setCategories] = useState<string[]>(['Work', 'Personal', 'Organisasi']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal States
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

  // Calendar Picker State
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

  // Infinite Date Strip Generator (15 Hari disekitar baseDate)
  const dateStrip = useMemo(() => {
    const list = [];
    for (let i = -7; i <= 7; i++) {
      const d = new Date(baseDateForStrip);
      d.setDate(d.getDate() + i);
      const iso = toIsoString(d);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      list.push({ dateObj: d, iso, dayName, dayNum });
    }
    return list;
  }, [baseDateForStrip]);

  // Shifts Date Strip
  const shiftStrip = (days: number) => {
    const newBase = new Date(baseDateForStrip);
    newBase.setDate(newBase.getDate() + days);
    setBaseDateForStrip(newBase);
  };

  // Toggle Status Completed (Checked Effect)
  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  // Handler Add Category Baru
  const handleAddCustomCategory = () => {
    if (customCatInput.trim() && !categories.includes(customCatInput.trim())) {
      const updated = [...categories, customCatInput.trim()];
      setCategories(updated);
      setNewCategory(customCatInput.trim());
      setCustomCatInput('');
      setIsAddingCustomCategory(false);
    }
  };

  // Handler Create Task
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

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setIsAddModalOpen(false);
  };

  // Filter Tasks berdasarkan tanggal dan kategori
  const tasksForSelectedDate = tasks.filter((t) => {
    const matchesDate = t.dateIso === selectedDateIso;
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesDate && matchesCat;
  });

  // Display Format Date Active Header
  const activeDateObj = new Date(selectedDateIso);
  const activeDateFormatted = activeDateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calendar Calculation Helpers
  const daysInMonth = new Date(calendarViewYear, calendarViewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarViewYear, calendarViewMonth, 1).getDay();

  return (
    <div id="tasks-schedule-root" className="max-w-md mx-auto space-y-5 pt-2 pb-36 font-sans">
      {/* 1. TOP HEADER (BACK, DATE DISPLAY, ADD BUTTON) */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setSelectedDateIso(todayIso);
            setBaseDateForStrip(today);
          }}
          className="px-3 py-1.5 rounded-full bg-white/80 border border-slate-100 flex items-center gap-1 text-slate-700 text-xs font-bold shadow-2xs hover:bg-white"
          title="Kembali ke Hari Ini"
        >
          <ArrowLeft size={14} />
          <span>Today</span>
        </button>

        <span className="text-xs font-black text-slate-800 tracking-tight">
          {activeDateFormatted}
        </span>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="w-10 h-10 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center shadow-md shadow-purple-200/60 hover:scale-105 transition-all"
          title="Add Task"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* 2. TITLE & CALENDAR POPUP BUTTON */}
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

      {/* 3. REAL-TIME INFINITE SWIPE DATE STRIP */}
      <div className="relative flex items-center gap-1 pt-1">
        <button
          type="button"
          onClick={() => shiftStrip(-7)}
          className="p-1 rounded-full text-slate-400 hover:text-slate-800 shrink-0"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 px-0.5">
          {dateStrip.map((item) => {
            const isActive = selectedDateIso === item.iso;
            const isToday = item.iso === todayIso;

            return (
              <button
                key={item.iso}
                type="button"
                onClick={() => setSelectedDateIso(item.iso)}
                className={`flex-1 min-w-[46px] py-3 rounded-2xl flex flex-col items-center justify-center transition-all shrink-0 relative ${
                  isActive
                    ? 'bg-[#1E1B26] text-white shadow-md scale-105 font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                <span className="text-[10px] font-bold opacity-70 block uppercase">
                  {item.dayName}
                </span>
                <span className="text-sm font-black mt-0.5">{item.dayNum}</span>

                {/* Dot Hari Ini */}
                {isToday && !isActive && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 bg-purple-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => shiftStrip(7)}
          className="p-1 rounded-full text-slate-400 hover:text-slate-800 shrink-0"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 4. CATEGORY PILL FILTERS (+ CUSTOM ADD) */}
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
          All
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

        <button
          type="button"
          onClick={() => setIsAddingCustomCategory(true)}
          className="px-3.5 py-2 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold hover:bg-purple-100 transition-colors shrink-0 flex items-center gap-1"
        >
          <Plus size={13} />
          <span>Custom</span>
        </button>
      </div>

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

                    {/* Tombol Details > */}
                    <button
                      type="button"
                      onClick={() => setSelectedDetailTask(task)}
                      className="text-[11px] font-black text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      Details &gt;
                    </button>
                  </div>

                  {/* Title dengan efek Strikethrough jika Selesai */}
                  <h3
                    className={`text-sm font-black text-slate-900 leading-snug ${
                      task.isCompleted ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </h3>

                  {/* Deskripsi Singkat */}
                  {task.description && (
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {renderTextWithLinks(task.description)}
                    </p>
                  )}
                </div>

                {/* Bottom Row Card: Tombol Checked / Tandai Selesai */}
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
              Gunakan waktu luang untuk istirahat atau buat catatan tugas baru.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL LAYER HIGHEST (z-[100]) UNTUK MENUTUP TOTAL NAV DOCK */}
      {/* ========================================================= */}

      {/* MODAL POPUP KALENDER UTUH */}
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
                  {new Date(calendarViewYear, calendarViewMonth).toLocaleDateString('en-US', {
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

              {/* Grid Hari Kalender */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 uppercase">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Empty cells */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-9" />
                ))}

                {/* Day numbers */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateObj = new Date(calendarViewYear, calendarViewMonth, dayNum);
                  const iso = toIsoString(dateObj);
                  const isSelected = iso === selectedDateIso;
                  const isToday = iso === todayIso;
                  const hasTasks = tasks.some((t) => t.dateIso === iso);

                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => {
                        setSelectedDateIso(iso);
                        setBaseDateForStrip(dateObj);
                        setIsCalendarModalOpen(false);
                      }}
                      className={`h-9 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center relative ${
                        isSelected
                          ? 'bg-[#1E1B26] text-white font-black shadow-xs'
                          : isToday
                          ? 'bg-purple-100 text-purple-900 font-extrabold'
                          : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {hasTasks && !isSelected && (
                        <span className="w-1 h-1 bg-purple-500 rounded-full mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsCalendarModalOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Pilih Tanggal Ini
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DETAIL TASK DESKRIPSI (WITH CLICKABLE LINKS) */}
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

      {/* MODAL ADD NEW TASK */}
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
                <h3 className="text-base font-black text-slate-900">Add New Task</h3>
                <button
                  type="button"
                  onClick={handleCreateTask}
                  className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold"
                >
                  ✓
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 block">
                    Task Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Finish landing page design"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 block">
                    Description & Link (Zoom/GMeet/Drive)
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
                    Due Date & Time
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
                    Priority
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

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 block">
                      Project / Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomCategory(true)}
                      className="text-[10px] font-black text-purple-600 hover:underline"
                    >
                      + Custom Category
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
                  Create Task
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};