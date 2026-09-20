import React, { useState, useMemo } from 'react';
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
  CalendarDays,
  CheckSquare,
  Pencil,
  Trash2,
} from 'lucide-react';
import { StudentUser } from '../types';

export type AgendaType = 'task' | 'event';

export interface ScheduledTask {
  id: string;
  type: AgendaType;
  time: string; // "09:00" (24 Jam)
  endTime?: string; // "10:30" (24 Jam)
  title: string;
  description: string;
  category: string;
  dateIso: string;
  isCompleted: boolean;
  priority: 'Low' | 'Medium' | 'High';
}

interface TasksViewProps {
  currentUser: StudentUser;
  students: StudentUser[];
  onNavigateTab?: (tabId: string) => void;
}

// Helper YYYY-MM-DD
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

// Helper Converter Jam 24 Jam -> Siklus Indonesia (PAGI, SIANG, SORE, MALAM)
const getIndonesianPeriod = (timeStr: string): { time: string; period: string } => {
  if (!timeStr) return { time: '00:00', period: 'PAGI' };
  
  const cleanTime = timeStr.replace(/(AM|PM)/i, '').trim();
  const [hrs, mins] = cleanTime.split(':');
  let hours = parseInt(hrs, 10);
  if (isNaN(hours)) hours = 9;

  if (timeStr.toUpperCase().includes('PM') && hours < 12) hours += 12;
  if (timeStr.toUpperCase().includes('AM') && hours === 12) hours = 0;

  let period = 'PAGI';
  if (hours >= 11 && hours < 15) {
    period = 'SIANG';
  } else if (hours >= 15 && hours < 18) {
    period = 'SORE';
  } else if (hours >= 18 || hours < 5) {
    period = 'MALAM';
  }

  const formatted24Time = `${String(hours).padStart(2, '0')}:${mins || '00'}`;

  return { time: formatted24Time, period };
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

export const TasksView: React.FC<TasksViewProps> = ({ onNavigateTab }) => {
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
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [customCatInput, setCustomCatInput] = useState('');

  // Form States untuk Add/Edit Agenda
  const [newType, setNewType] = useState<AgendaType>('task');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState(todayIso);
  const [newTime, setNewTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('10:30');
  const [newCategory, setNewCategory] = useState('Work');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Calendar State
  const [calendarViewMonth, setCalendarViewMonth] = useState(today.getMonth());
  const [calendarViewYear, setCalendarViewYear] = useState(today.getFullYear());

  // Master Tasks State
  const [tasks, setTasks] = useState<ScheduledTask[]>([
    {
      id: 'st-1',
      type: 'event',
      time: '09:00',
      endTime: '10:30',
      title: 'Meeting dengan Dosen Pembimbing',
      description: 'Diskusi progres PKM-RSH dan rekap data. Link Zoom: https://zoom.us/j/123456789',
      category: 'Work',
      dateIso: todayIso,
      isCompleted: false,
      priority: 'High',
    },
    {
      id: 'st-2',
      type: 'task',
      time: '17:00',
      title: 'Bayar Iuran Kas Angkatan',
      description: 'Transfer ke bendahara Terravana via QRIS / Bank Mandiri.',
      category: 'Personal',
      dateIso: todayIso,
      isCompleted: false,
      priority: 'Low',
    },
    {
      id: 'st-3',
      type: 'task',
      time: '23:59',
      title: 'Submit Proposal Terravana Compe',
      description: 'Upload berkas final dalam format PDF ke portal kemahasiswaan.',
      category: 'Organisasi',
      dateIso: todayIso,
      isCompleted: true,
      priority: 'High',
    },
  ]);

  // Date Strip Generator
  const dateStrip = useMemo(() => {
    const list = [];
    const base = new Date();
    for (let i = 0; i <= 60; i++) {
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

  const handleDeleteCategory = (catToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (categories.length <= 1) return; // Sisakan min 1
    const updated = categories.filter((c) => c !== catToDelete);
    setCategories(updated);
    if (selectedCategory === catToDelete) setSelectedCategory('All');
    if (newCategory === catToDelete) setNewCategory(updated[0]);
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

  const handleOpenAddModal = () => {
    setNewType('task');
    setNewTitle('');
    setNewDesc('');
    setNewDate(selectedDateIso);
    setNewTime('09:00');
    setNewEndTime('10:30');
    setNewCategory(categories[0] || 'Work');
    setNewPriority('Medium');
    setIsAddModalOpen(true);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: ScheduledTask = {
      id: `st-${Date.now()}`,
      type: newType,
      time: newTime,
      endTime: newType === 'event' ? newEndTime : undefined,
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

  // Open Edit Mode inside Detail Modal
  const handleStartEditTask = (task: ScheduledTask) => {
    setNewType(task.type);
    setNewTitle(task.title);
    setNewDesc(task.description);
    setNewDate(task.dateIso);
    setNewTime(task.time);
    setNewEndTime(task.endTime || '10:30');
    setNewCategory(task.category);
    setNewPriority(task.priority);
    setIsEditingTask(true);
  };

  const handleSaveEditedTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDetailTask || !newTitle.trim()) return;

    const updatedTask: ScheduledTask = {
      ...selectedDetailTask,
      type: newType,
      title: newTitle,
      description: newDesc,
      dateIso: newDate,
      time: newTime,
      endTime: newType === 'event' ? newEndTime : undefined,
      category: newCategory,
      priority: newPriority,
    };

    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedDetailTask(updatedTask);
    setIsEditingTask(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedDetailTask(null);
    setIsEditingTask(false);
  };

  const tasksForSelectedDate = useMemo(() => {
    const filtered = tasks.filter((t) => {
      const matchesDate = t.dateIso === selectedDateIso;
      const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
      return matchesDate && matchesCat;
    });

    const parseTimeToMinutes = (timeStr: string) => {
      const clean = timeStr.replace(/(AM|PM)/i, '').trim();
      const [hours, minutes] = clean.split(':').map(Number);
      return (hours || 0) * 60 + (minutes || 0);
    };

    return filtered.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
  }, [tasks, selectedDateIso, selectedCategory]);

  const activeDateObj = new Date(selectedDateIso);
  const activeDateFormatted = formatIndonesianDate(activeDateObj);
  const isViewingToday = selectedDateIso === todayIso;

  // Calendar Calc
  const daysInMonth = new Date(calendarViewYear, calendarViewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarViewYear, calendarViewMonth, 1).getDay();

  return (
    <div id="tasks-schedule-root" className="max-w-md mx-auto space-y-4 pt-2 pb-36 font-sans">
      {/* 1. TOP BAR CLEAN */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab('home')}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors shrink-0"
          title="Kembali ke Dashboard Home"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          type="button"
          onClick={() => setIsCalendarModalOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-black flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <CalendarIcon size={14} className="text-slate-600" />
          <span>Kalender</span>
        </button>
      </div>

      {/* 2. TITLE SECTION */}
      <div className="pt-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
          Schedule
        </h1>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
          Tracker
        </h1>
      </div>

      {/* 3. SCROLLABLE DATE STRIP */}
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

                {isToday && !isActive && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 bg-purple-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. CATEGORY FILTERS DENGAN OPTION HAPUS KATEGORI */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            selectedCategory === 'All'
              ? 'bg-[#1E1B26] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <div
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[#1E1B26] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
              {categories.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => handleDeleteCategory(cat, e)}
                  className={`p-0.5 rounded-full hover:bg-rose-500/20 transition-colors ${
                    isActive ? 'text-slate-300 hover:text-white' : 'text-slate-400 hover:text-rose-600'
                  }`}
                  title="Hapus Kategori Ini"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. BUTTON (+ TAMBAH AGENDA BARU) ABU-ABU */}
      <button
        type="button"
        onClick={handleOpenAddModal}
        className="w-full py-3 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-black transition-all shadow-2xs flex items-center justify-center gap-2 group"
      >
        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Plus size={13} className="stroke-[3]" />
        </div>
        <span>+ Tambah Agenda Baru</span>
      </button>

      {/* NOTIFIKASI MEMILIH TANGGAL LAIN */}
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

      {/* 6. TIMELINE LIST */}
      <div className="space-y-4 pt-1">
        {tasksForSelectedDate.length > 0 ? (
          tasksForSelectedDate.map((task) => {
            const isEvent = task.type === 'event';
            
            const startInfo = getIndonesianPeriod(task.time);
            const endInfo = getIndonesianPeriod(task.endTime || '10:30');

            return (
              <div key={task.id} className="flex items-stretch gap-3">
                {/* Left Column: Time Axis */}
                <div className="w-16 shrink-0 flex flex-col items-end justify-between py-1 text-right">
                  {isEvent ? (
                    <>
                      <div>
                        <span className="text-xs font-black text-slate-900 block leading-none">
                          {startInfo.time}
                        </span>
                        <span className="text-[9px] font-extrabold text-slate-400 block mt-0.5">
                          {startInfo.period}
                        </span>
                      </div>

                      <div className="w-0.5 flex-1 bg-slate-200 my-1 rounded-full self-end mr-2" />

                      <div>
                        <span className="text-xs font-black text-slate-900 block leading-none">
                          {endInfo.time}
                        </span>
                        <span className="text-[9px] font-extrabold text-slate-400 block mt-0.5">
                          {endInfo.period}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-0.5 flex-1 bg-slate-200 mb-1 rounded-full self-end mr-2" />

                      <div>
                        <span className="text-xs font-black text-rose-600 block leading-none">
                          {startInfo.time}
                        </span>
                        <span className="text-[9px] font-extrabold text-rose-400 block mt-0.5">
                          {startInfo.period}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Right Column: Card Agenda */}
                <div
                  className={`flex-1 rounded-[26px] p-4 border transition-all space-y-2.5 shadow-xs relative ${
                    task.isCompleted
                      ? 'bg-slate-50/80 border-slate-200 opacity-60'
                      : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="space-y-1">
                    {/* BARIS TAG & JAM SUBTLE ABU-ABU REVISI 1 */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isEvent ? (
                          <>
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                              <CalendarDays size={10} />
                              <span>EVENT</span>
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {startInfo.time} - {endInfo.time}
                            </span>
                          </>
                        ) : (
                          <>
                            <span
                              className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                task.priority === 'High'
                                  ? 'bg-rose-100 text-rose-700'
                                  : task.priority === 'Medium'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {task.category}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              Deadline: {startInfo.time} {startInfo.period}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <h3
                      className={`text-sm font-black text-slate-900 leading-snug pt-0.5 ${
                        !isEvent && task.isCompleted ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                        {renderTextWithLinks(task.description)}
                      </p>
                    )}
                  </div>

                  {/* Bottom Row Card */}
                  <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDetailTask(task);
                        setIsEditingTask(false);
                      }}
                      className="text-[11px] font-black text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-0.5"
                    >
                      <span>Detail</span>
                      <ChevronRight size={14} />
                    </button>

                    {!isEvent && (
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
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-slate-200 p-6 space-y-2">
            <Clock size={32} className="mx-auto text-slate-300" />
            <h4 className="text-sm font-black text-slate-700">Tidak Ada Agenda Hari Ini</h4>
            <p className="text-xs text-slate-400 font-medium">
              Gunakan waktu luang untuk istirahat atau catat tugas/event baru.
            </p>
          </div>
        )}
      </div>

      {/* MODAL KALENDER */}
      <AnimatePresence>
        {isCalendarModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-[36px] p-6 shadow-2xl border border-slate-100 space-y-4"
            >
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

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase">
                <span className="text-rose-600">MIN</span>
                <span className="text-slate-400">SEN</span>
                <span className="text-slate-400">SEL</span>
                <span className="text-slate-400">RAB</span>
                <span className="text-slate-400">KAM</span>
                <span className="text-slate-400">JUM</span>
                <span className="text-slate-400">SAB</span>
              </div>

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

              <div className="pt-2 text-center border-t border-slate-100">
                <p className="text-[10px] font-semibold text-slate-400">
                  💡 Klik tanggal ber-indikator dot untuk melihat agenda tugas/event di hari tersebut.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DETAIL TASK (DISERTAI EDIT KARTU DAN IKON PENSIL & TRASH REVISI 2) */}
      <AnimatePresence>
        {selectedDetailTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-[36px] p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                      selectedDetailTask.type === 'event'
                        ? 'bg-blue-600 text-white'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {selectedDetailTask.type === 'event' ? '📅 EVENT' : selectedDetailTask.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditingTask && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStartEditTask(selectedDetailTask)}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                        title="Edit Agenda Ini"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTask(selectedDetailTask.id)}
                        className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors"
                        title="Hapus Agenda Ini"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDetailTask(null);
                      setIsEditingTask(false);
                    }}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {!isEditingTask ? (
                /* MODE TAMPILAN DETAIL */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900">
                      {selectedDetailTask.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Clock size={13} />
                      <span>
                        {selectedDetailTask.dateIso} • {selectedDetailTask.time}
                        {selectedDetailTask.endTime ? ` - ${selectedDetailTask.endTime}` : ''}
                      </span>
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
                    Tutup
                  </button>
                </div>
              ) : (
                /* MODE EDIT KARTU AGENDA */
                <form onSubmit={handleSaveEditedTask} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-800 block">
                      Judul Agenda
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-800 block">
                      Deskripsi & Link
                    </label>
                    <textarea
                      rows={3}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-800 block">
                      Tanggal & Jam
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                      />
                      <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* CUSTOM PILLS SELECTOR UNTUK KATEGORI (BUKAN SYSTEM SELECT) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-800 block">
                      Pilih Kategori
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setNewCategory(c)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            newCategory === c
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingTask(false)}
                      className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-2xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors shadow-md shadow-purple-200"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ADD CUSTOM CATEGORY */}
      <AnimatePresence>
        {isAddingCustomCategory && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <h3 className="text-sm font-black text-slate-900">Tambah Kategori Custom</h3>
              <input
                type="text"
                placeholder="Contoh: Project Terravana, Sertifikasi..."
                value={customCatInput}
                onChange={(e) => setCustomCatInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCustomCategory(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ADD NEW AGENDA (MENGGUNAKAN CUSTOM PILLS SELECTOR & FITUR HAPUS KATEGORI REVISI 3) */}
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
                <h3 className="text-base font-black text-slate-900">Tambah Agenda Baru</h3>
                <div className="w-5" />
              </div>

              <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setNewType('task')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    newType === 'task'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <CheckSquare size={14} />
                  <span> Tugas </span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewType('event')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    newType === 'event'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <CalendarDays size={14} />
                  <span> Event</span>
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 block">
                    {newType === 'task' ? 'Judul Tugas / Pekerjaan' : 'Nama Event / Acara'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      newType === 'task'
                        ? 'Contoh: Submit Laporan Metpen'
                        : 'Contoh: Sidang Pleno Angkatan / Webinar'
                    }
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 block">
                    Deskripsi dan Link Penting
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tulis deskripsi atau sertakan link penting https://..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 block">
                    {newType === 'task' ? 'Tanggal & Jam Deadline (24 Jam)' : 'Tanggal & Waktu Acara (24 Jam)'}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                    />

                    {newType === 'task' ? (
                      <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                            Jam Mulai
                          </span>
                          <input
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                            Jam Selesai
                          </span>
                          <input
                            type="time"
                            value={newEndTime}
                            onChange={(e) => setNewEndTime(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {newType === 'task' && (
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
                )}

                {/* CUSTOM KATEGORI SELECTOR DENGAN PILIHAN OPSI HAPUS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 block">
                      Kategori Agenda
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomCategory(true)}
                      className="text-[10px] font-black text-purple-600 hover:underline"
                    >
                      + Tambah Kategori
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                    {categories.map((c) => {
                      const isSelected = newCategory === c;
                      return (
                        <div
                          key={c}
                          onClick={() => setNewCategory(c)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{c}</span>
                          {categories.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteCategory(c, e)}
                              className={`p-0.5 rounded-full hover:bg-rose-500/20 transition-colors ${
                                isSelected ? 'text-slate-300 hover:text-white' : 'text-slate-400 hover:text-rose-600'
                              }`}
                              title="Hapus Kategori"
                            >
                              <X size={11} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-2xl text-white text-xs font-black transition-colors shadow-lg mt-2 ${
                    newType === 'event'
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200/60'
                      : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
                  }`}
                >
                  {newType === 'task' ? 'Buat Task Baru' : 'Jadwalkan Event'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};