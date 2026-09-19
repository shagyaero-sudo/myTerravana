import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Plus,
  MoreHorizontal,
  Calendar as CalendarIcon,
  Video,
  Clock,
  X,
  Star,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { StudentUser } from '../types';

export interface ScheduledTask {
  id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  title: string;
  description?: string;
  timeRange?: string;
  status?: 'In Progress' | 'Completed' | 'Pending';
  meetLink?: string;
  category: 'Work' | 'Personal';
  dateStr: string; // e.g. "Wed, Apr 14"
  assignees?: StudentUser[];
}

interface TasksViewProps {
  currentUser: StudentUser;
  students: StudentUser[];
}

export const TasksView: React.FC<TasksViewProps> = ({ currentUser, students }) => {
  // Master Scheduled Tasks
  const [tasks, setTasks] = useState<ScheduledTask[]>([
    {
      id: 'st-1',
      time: '9:00 AM',
      period: 'Morning',
      title: 'Meeting with Client / Dosen',
      description: 'Client meeting to review project progress, align on goals, and plan upcoming tasks.',
      meetLink: 'https://meet.google.com',
      category: 'Work',
      dateStr: 'Wed, Apr 14',
      assignees: students.slice(0, 3),
    },
    {
      id: 'st-2',
      time: '11:00 AM',
      period: 'Morning',
      title: 'Next Month Dribbble Short Design',
      timeRange: '11:10 AM - 01:30 PM',
      status: 'In Progress',
      category: 'Work',
      dateStr: 'Wed, Apr 14',
      assignees: students.slice(1, 4),
    },
    {
      id: 'st-3',
      time: '2:30 PM',
      period: 'Afternoon',
      title: 'Review Rangkuman Matkul PSP',
      description: 'Persiapan kuis bersama teman kelompok di Ruang Baca.',
      category: 'Personal',
      dateStr: 'Wed, Apr 14',
      assignees: [currentUser],
    },
  ]);

  // Selected Date State (Default: Wed 14)
  const [selectedDateNum, setSelectedDateNum] = useState(14);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Work' | 'Personal'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States untuk Modal Add New Task
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('2026-04-14');
  const [newTime, setNewTime] = useState('09:00');
  const [newTimeEnd, setNewTimeEnd] = useState('10:30');
  const [newCategory, setNewCategory] = useState<'Work' | 'Personal'>('Work');
  const [newMeetLink, setNewMeetLink] = useState('');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Strip Tanggal Horizontal (Mon - Sat)
  const dateStrip = [
    { day: 'Mon', date: 12 },
    { day: 'Tue', date: 13 },
    { day: 'Wed', date: 14 },
    { day: 'Thu', date: 15 },
    { day: 'Fri', date: 16 },
    { day: 'Sat', date: 17 },
  ];

  // Handler Create Task Baru
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Convert Time format
    const [hrs, mins] = newTime.split(':');
    const hourNum = parseInt(hrs, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    const formattedTime = `${displayHour}:${mins} ${ampm}`;

    const newTask: ScheduledTask = {
      id: `st-${Date.now()}`,
      time: formattedTime,
      period: hourNum < 12 ? 'Morning' : 'Afternoon',
      title: newTitle,
      description: newDesc,
      timeRange: `${formattedTime} - ${newTimeEnd}`,
      category: newCategory,
      meetLink: newMeetLink || undefined,
      status: 'In Progress',
      dateStr: 'Wed, Apr 14',
      assignees: [currentUser],
    };

    setTasks([...tasks, newTask]);
    setNewTitle('');
    setNewDesc('');
    setNewMeetLink('');
    setIsModalOpen(false);
  };

  // Filter Tasks berdasarkan Kategori
  const filteredTasks = tasks.filter((task) => {
    if (selectedCategory === 'All') return true;
    return task.category === selectedCategory;
  });

  return (
    <div id="tasks-schedule-root" className="max-w-md mx-auto space-y-5 pt-2 pb-36 font-sans">
      {/* 1. TOP HEADER (BACK, DATE TITLE, ADD BUTTON, MORE) */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-white/80 border border-slate-100 flex items-center justify-center text-slate-700 shadow-xs hover:bg-white"
        >
          <ArrowLeft size={18} />
        </button>

        <span className="text-sm font-extrabold text-slate-800 tracking-tight">
          Wed, April 26
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center shadow-md shadow-purple-200/60 hover:scale-105 transition-all"
            title="Add Task"
          >
            <Plus size={20} />
          </button>

          <button
            type="button"
            className="w-10 h-10 rounded-full bg-white/80 border border-slate-100 flex items-center justify-center text-slate-700 shadow-xs hover:bg-white"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* 2. TITLE & CALENDAR PILL BUTTON */}
      <div className="flex items-end justify-between pt-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Task
          </h1>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Schedule
          </h1>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center gap-2 text-xs font-black text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <CalendarIcon size={15} className="text-slate-700" />
          <span>Calendar</span>
        </button>
      </div>

      {/* 3. HORIZONTAL DATE STRIP */}
      <div className="flex items-center justify-between gap-1.5 py-1">
        {dateStrip.map((item) => {
          const isActive = selectedDateNum === item.date;
          return (
            <button
              key={item.date}
              type="button"
              onClick={() => setSelectedDateNum(item.date)}
              className={`flex-1 py-3.5 rounded-full flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-[#1E1B26] text-white shadow-lg shadow-slate-900/20 scale-105'
                  : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-100'
              }`}
            >
              <span className="text-[10px] font-bold opacity-70 block">{item.day}</span>
              <span className="text-sm font-black mt-0.5">{item.date}</span>
            </button>
          );
        })}
      </div>

      {/* 4. CATEGORY PILL FILTERS (ALL, WORK, PERSONAL) */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${
            selectedCategory === 'All'
              ? 'bg-[#1E1B26] text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-100 hover:bg-slate-50'
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('Work')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedCategory === 'Work'
              ? 'bg-[#1E1B26] text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-100 hover:bg-slate-50'
          }`}
        >
          <span>💼</span>
          <span>Work</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('Personal')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedCategory === 'Personal'
              ? 'bg-[#1E1B26] text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-100 hover:bg-slate-50'
          }`}
        >
          <span>👤</span>
          <span>Personal</span>
        </button>

        <button
          type="button"
          className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 ml-auto shrink-0 shadow-xs"
        >
          <Star size={16} />
        </button>
      </div>

      {/* 5. TIME SLOT HEADER (MORNING) */}
      <div className="pt-2">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-1.5 text-slate-800 text-sm font-black tracking-tight">
            <span>🌤️</span>
            <span>Morning</span>
          </div>
          <span className="text-xs font-bold text-slate-400">Today</span>
        </div>

        {/* TIME-SLOTTED TASKS LIST */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3">
              {/* Left Column: Time & Vertical Line */}
              <div className="w-14 shrink-0 text-center pt-1">
                <span className="text-sm font-black text-slate-900 block leading-tight">
                  {task.time.split(' ')[0]}
                </span>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {task.time.split(' ')[1]}
                </span>

                {/* Vertical Timeline Line */}
                <div className="w-0.5 h-12 bg-slate-200 mx-auto my-2 rounded-full opacity-60" />
              </div>

              {/* Right Column: Soft Clay Task Card */}
              <div className="flex-1 bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 space-y-3">
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      {task.description}
                    </p>
                  )}
                  {task.timeRange && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 pt-0.5">
                      <Clock size={12} />
                      <span>{task.timeRange}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Row inside Card: Assignees & Action Button/Status */}
                <div className="flex items-center justify-between pt-1">
                  {/* Assignee Avatars */}
                  <div className="flex -space-x-2 overflow-hidden">
                    {task.assignees?.map((st) => (
                      <img
                        key={st.id}
                        src={st.avatar}
                        alt={st.name}
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                      />
                    ))}
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[9px] font-black text-white ring-2 ring-white">
                      +4
                    </div>
                  </div>

                  {/* Action Button: Meet / In Progress Badge */}
                  {task.meetLink ? (
                    <a
                      href={task.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-2xl bg-[#0066FF] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Video size={14} />
                      <span>Meet</span>
                    </a>
                  ) : task.status === 'In Progress' ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-[#B282FF] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <span>●</span>
                      <span>In Progress</span>
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. MODAL ADD NEW TASK (PRESIS DENGAN SCREEN 3 REFERENSI) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-[36px] p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
                <h3 className="text-base font-black text-slate-900">Add New Task</h3>
                <button
                  type="button"
                  onClick={handleCreateTask}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center hover:bg-slate-200"
                >
                  ✓
                </button>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleCreateTask} className="space-y-4">
                {/* Task Title */}
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
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 block">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Design the new landing page for the product launch."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {/* Due Date & Time */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 block">
                    Due Date & time
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Meet Link Option */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 block">
                    Google Meet / Zoom Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/abc-defg-hij"
                    value={newMeetLink}
                    onChange={(e) => setNewMeetLink(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>

                {/* Priority Selector */}
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
                          className={`py-2 rounded-full text-xs font-extrabold transition-all border ${
                            isSelected
                              ? p === 'High'
                                ? 'bg-rose-100 text-rose-700 border-rose-300'
                                : p === 'Medium'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-slate-50 text-slate-500 border-slate-100'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category / Project */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 block">
                    Project / Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="Work">💼 Website Redesign / Kuliah</option>
                    <option value="Personal">👤 Personal Task</option>
                  </select>
                </div>

                {/* Create Task Submit */}
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