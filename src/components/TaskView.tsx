import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Circle,
  X,
  Check,
  Tag,
  AlertCircle,
  Briefcase,
  User,
  Sparkles,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { StudentUser } from '../types';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: 'Work' | 'Personal' | 'Organisasi';
  assignees?: StudentUser[];
}

interface TasksViewProps {
  currentUser: StudentUser;
  students: StudentUser[];
}

export const TasksView: React.FC<TasksViewProps> = ({ currentUser, students }) => {
  // Master Task State
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 't1',
      title: 'Design Landing Page Terravana',
      description: 'Finish landing page design and review UI component with team.',
      dueDate: 'April 14, 2026',
      dueTime: '10:30 AM',
      status: 'todo',
      priority: 'high',
      category: 'Work',
      assignees: students.slice(0, 3),
    },
    {
      id: 't2',
      title: 'Submit Proposal PKM-RSH',
      description: 'Lengkapi berkas administrasi dan lembar pengesahan Dosen Pembimbing.',
      dueDate: 'April 18, 2026',
      dueTime: '11:59 PM',
      status: 'in_progress',
      priority: 'high',
      category: 'Work',
      assignees: students.slice(1, 4),
    },
    {
      id: 't3',
      title: 'Bayar Kas Angkatan Terravana',
      description: 'Transfer iuran bulan ini ke rekening bendahara BPH.',
      dueDate: 'April 20, 2026',
      dueTime: '05:00 PM',
      status: 'todo',
      priority: 'medium',
      category: 'Personal',
    },
    {
      id: 't4',
      title: 'Review Rangkuman Matkul PSP',
      description: 'Baca kembali slide dosen untuk persiapan kuis minggu depan.',
      dueDate: 'April 22, 2026',
      dueTime: '08:00 AM',
      status: 'completed',
      priority: 'low',
      category: 'Work',
    },
  ]);

  // UI Filter States
  const [activeTab, setActiveTab] = useState<'todo' | 'in_progress' | 'completed'>('todo');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Work' | 'Personal' | 'Organisasi'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State untuk Modal Add New Task
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('2026-04-26');
  const [newTime, setNewTime] = useState('10:00');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newCategory, setNewCategory] = useState<'Work' | 'Personal' | 'Organisasi'>('Work');

  // Stats Counters
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Handler Toggle Status
  const handleToggleStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  // Handler Create Task Baru
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      dueDate: newDate,
      dueTime: newTime,
      status: 'todo',
      priority: newPriority,
      category: newCategory,
      assignees: [currentUser],
    };

    setTasks([newTask, ...tasks]);
    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  // Filter Tasks berdasarkan Tab & Category
  const filteredTasks = tasks.filter((task) => {
    const matchesTab =
      activeTab === 'todo'
        ? task.status === 'todo'
        : activeTab === 'in_progress'
        ? task.status === 'in_progress'
        : task.status === 'completed';

    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;

    return matchesTab && matchesCategory;
  });

  return (
    <div id="tasks-view-root" className="max-w-2xl mx-auto space-y-6 pt-2 pb-36 font-sans">
      {/* 1. HEADER ATAS & ADD TASK BUTTON */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
            PRODUCTIVITY OS
          </span>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-0.5">
            Tasks & Schedule
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-11 h-11 rounded-full bg-[#A088F2] text-white flex items-center justify-center shadow-lg shadow-purple-200/60 hover:scale-105 active:scale-95 transition-all"
          title="Tambah Tugas Baru"
        >
          <Plus size={22} />
        </button>
      </div>

      {/* 2. TODAY'S PROGRESS STATS CARD (PERSIS REFERENSI SCREEN 1) */}
      <div className="relative bg-[#F5C7F7] rounded-[32px] p-5 text-slate-900 shadow-xl shadow-pink-100/60 overflow-hidden">
        {/* Soft Clay Background Accent */}
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-6 -bottom-6 w-32 h-32 pointer-events-none opacity-80"
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="clayPink" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F5A0D9" />
                <stop offset="100%" stopColor="#C451B0" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#clayPink)" />
          </svg>
        </motion.div>

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/70 text-[10px] font-black text-pink-950 uppercase tracking-wider">
              <Sparkles size={11} />
              <span>Today's Progress</span>
            </span>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="bg-white/60 backdrop-blur-xs p-2.5 rounded-2xl border border-white/80">
                <span className="text-lg font-black block leading-none">{totalTasks}</span>
                <span className="text-[10px] font-bold text-pink-950/70 block mt-1">
                  Total Task
                </span>
              </div>

              <div className="bg-white/60 backdrop-blur-xs p-2.5 rounded-2xl border border-white/80">
                <span className="text-lg font-black block leading-none text-emerald-700">
                  {completedTasks}
                </span>
                <span className="text-[10px] font-bold text-pink-950/70 block mt-1">
                  Completed
                </span>
              </div>

              <div className="bg-white/60 backdrop-blur-xs p-2.5 rounded-2xl border border-white/80">
                <span className="text-lg font-black block leading-none text-amber-700">
                  {pendingTasks}
                </span>
                <span className="text-[10px] font-bold text-pink-950/70 block mt-1">
                  Pending Task
                </span>
              </div>
            </div>
          </div>

          {/* RADIAL PROGRESS RING CIRCLE */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/80 border-4 border-pink-300 flex flex-col items-center justify-center shadow-xs">
              <span className="text-base sm:text-xl font-black text-slate-900 leading-none">
                {progressPercentage}%
              </span>
              <span className="text-[8px] font-black uppercase text-pink-800 tracking-wider mt-0.5">
                Done
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FILTER TABS (TO DO, IN PROGRESS, COMPLETED) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('todo')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'todo'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black flex items-center justify-center">
              {tasks.filter((t) => t.status === 'todo').length}
            </span>
            <span>To Do</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('in_progress')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'in_progress'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black flex items-center justify-center">
              {tasks.filter((t) => t.status === 'in_progress').length}
            </span>
            <span>In Progress</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center">
              {completedTasks}
            </span>
            <span>Completed</span>
          </button>
        </div>

        {/* CATEGORY TAG FILTERS (ALL, WORK, PERSONAL, ORGANISASI) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['All', 'Work', 'Personal', 'Organisasi'] as const).map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold shrink-0 transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'Work' ? '💼 Work / Kuliah' : cat === 'Personal' ? '👤 Personal' : cat === 'Organisasi' ? '👥 Organisasi' : '✨ All'}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. TASK LIST CARDS (PERSIS UX SCREEN 1 & 2) */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-[28px] p-5 border border-slate-100 shadow-md transition-all space-y-3 ${
                task.status === 'completed' ? 'opacity-65 bg-slate-50/80' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(task.id)}
                    className="mt-0.5 text-slate-300 hover:text-emerald-500 transition-colors"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 size={22} className="text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle size={22} />
                    )}
                  </button>

                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-1 ${
                        task.priority === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : task.priority === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      ● {task.priority} Priority
                    </span>
                    <h3
                      className={`text-base font-black text-slate-900 leading-snug ${
                        task.status === 'completed' ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-[10px] font-bold text-slate-600 shrink-0">
                  {task.category}
                </span>
              </div>

              {/* CARD FOOTER: DUE DATE & ASSIGNEE AVATARS */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-purple-500" />
                  <span>
                    {task.dueDate} • {task.dueTime}
                  </span>
                </div>

                {/* Assignee Avatars */}
                {task.assignees && task.assignees.length > 0 && (
                  <div className="flex -space-x-2 overflow-hidden">
                    {task.assignees.map((st) => (
                      <img
                        key={st.id}
                        src={st.avatar}
                        alt={st.name}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-slate-200 p-6 space-y-2">
            <CheckCircle2 size={36} className="mx-auto text-slate-300" />
            <h4 className="text-sm font-black text-slate-700">Tidak ada tugas di kategori ini</h4>
            <p className="text-xs text-slate-400 font-medium">
              Semua tugas bersih! Klik tombol + di atas untuk mencatat tugas baru.
            </p>
          </div>
        )}
      </div>

      {/* 5. MODAL ADD NEW TASK (PRESIS DENGAN REFERENSI GAMBAR SCREEN 3) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-900">Add New Task</h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Input */}
              <form onSubmit={handleCreateTask} className="space-y-4">
                {/* Task Title */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Task Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Finish landing page design"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Design the new landing page for the product launch."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {/* Due Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">
                      Time
                    </label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>

                {/* Priority Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((p) => {
                      const isSelected = newPriority === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewPriority(p)}
                          className={`py-2 rounded-xl text-xs font-extrabold capitalize transition-all border ${
                            isSelected
                              ? p === 'high'
                                ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                                : p === 'medium'
                                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                                : 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category / Project Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Category / Project
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="Work">💼 Work / Kuliah</option>
                    <option value="Personal">👤 Personal</option>
                    <option value="Organisasi">👥 Organisasi</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#A088F2] text-white text-xs font-black hover:bg-purple-600 transition-colors shadow-lg shadow-purple-200/60 mt-2"
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