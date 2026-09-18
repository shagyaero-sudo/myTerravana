import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  Eye,
  Check,
  Zap,
} from 'lucide-react';
import { StudentUser } from '../types';

interface TerraquizViewProps {
  students: StudentUser[];
  onUpdateMastered: (studentId: string, mastered: boolean) => void;
  onSelectStudent: (student: StudentUser) => void;
  masteredCount: number;
  totalStudents: number;
}

export const TerraquizView: React.FC<TerraquizViewProps> = ({
  students,
  onUpdateMastered,
  onSelectStudent,
  masteredCount,
  totalStudents,
}) => {
  // Antrean khusus untuk mengulang mahasiswa yang salah dijawab
  const [reviewQueue, setReviewQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Stats Sesi
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Lock options state agar tidak ter-acak ulang saat re-render / diklik
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  // Tentukan mahasiswa aktif (Utamakan dari reviewQueue jika ada, lalu dari unmastered/semua)
  const currentStudent = useMemo(() => {
    if (students.length === 0) return null;

    // Cek apakah ada mahasiswa di antrean pengulangan (salah jawab)
    if (reviewQueue.length > 0 && currentIndex % 3 === 0) {
      const reviewTargetId = reviewQueue[0];
      const found = students.find((s) => s.id === reviewTargetId);
      if (found) return found;
    }

    // Prioritaskan mahasiswa yang belum dihafal
    const unmastered = students.filter((s) => !s.mastered);
    const pool = unmastered.length > 0 ? unmastered : students;
    
    return pool[currentIndex % pool.length];
  }, [students, reviewQueue, currentIndex]);

  // Lock pilihan jawaban ketika mahasiswa aktif berganti
  useEffect(() => {
    if (!currentStudent) return;
    const correct = currentStudent.name;
    const others = students.filter((s) => s.id !== currentStudent.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random());
    const wrong = shuffledOthers.slice(0, 3).map((s) => s.name);

    setCurrentOptions([correct, ...wrong].sort(() => 0.5 - Math.random()));
  }, [currentStudent, students]);

  const handleSelectOption = (optionName: string) => {
    if (isAnswered || !currentStudent) return;

    setSelectedOption(optionName);
    setIsAnswered(true);

    const isCorrect = optionName === currentStudent.name;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setSessionCorrect((prev) => prev + 1);
      setSessionTotal((prev) => prev + 1);

      // Hapus dari antrean pengulangan jika tadi sempat salah
      setReviewQueue((prev) => prev.filter((id) => id !== currentStudent.id));

      // Tandai mastered untuk KPI Angkatan
      onUpdateMastered(currentStudent.id, true);
    } else {
      setStreak(0);
      setSessionTotal((prev) => prev + 1);

      // Masukkan ke antrean pengulangan agar muncul kembali dalam 3 soal ke depan
      if (!reviewQueue.includes(currentStudent.id)) {
        setReviewQueue((prev) => [...prev, currentStudent.id]);
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleResetSession = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setStreak(0);
    setSessionCorrect(0);
    setSessionTotal(0);
    setCurrentIndex(0);
    setReviewQueue([]);
  };

  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 100;
  const kpiPercentage = Math.round((masteredCount / totalStudents) * 100);

  if (!currentStudent) return null;

  return (
    <div id="terraquiz-view-root" className="max-w-2xl mx-auto space-y-5 pb-36 font-sans">
      {/* 1. HEADER RINGKAS (TANPA TOGGLE FILTER) */}
      <div className="pt-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Terraquiz
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Kuis pintar otomatis untuk menghafal 170 rekan angkatan Terravana 2026
        </p>
      </div>

      {/* 2. UNIFIED PROGRESS BAR (VISILY STYLE) */}
      <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 flex items-center justify-between gap-3 text-xs">
        {/* KPI Score */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-900">{masteredCount}/{totalStudents}</span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
            {kpiPercentage}% KPI
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Live Streak */}
        <div className="flex items-center gap-1 font-extrabold text-slate-800">
          <Flame size={14} className="fill-amber-500 text-amber-500" />
          <span>{streak}x Streak</span>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Live Accuracy */}
        <div className="flex items-center gap-1 font-extrabold text-slate-800">
          <Zap size={14} className="text-indigo-600" />
          <span>{accuracy}% Akurasi</span>
        </div>
      </div>

      {/* 3. CARD-BASED QUIZ CONTAINER */}
      <div
        id="terraquiz-card"
        className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-7 shadow-xs flex flex-col items-center"
      >
        {/* Photo Card with Mastered Badge */}
        <div className="relative mb-5">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden ring-4 ring-slate-100 shadow-xs bg-slate-100">
            <img
              src={currentStudent.avatar}
              alt="Tebak Siapakah Mahasiswa Ini?"
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {currentStudent.mastered && (
              <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                <Check size={11} />
                Sudah Hafal
              </span>
            )}
          </div>

          {/* Hint Overlay */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 transition-colors"
              >
                <HelpCircle size={13} />
                <span>Buka Petunjuk Kelompok & Domisili</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">
                <span>Kelompok {currentStudent.kelompok}</span>
                <span>•</span>
                <span>Domisili: {currentStudent.region}</span>
              </div>
            )}
          </div>
        </div>

        {/* Question Prompt */}
        <div className="text-center mb-5">
          <h3 className="text-base font-extrabold text-slate-900">
            Siapakah nama rekan angkatan di foto ini?
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Pilih 1 dari 4 pilihan jawaban:
          </p>
        </div>

        {/* 4 Multiple Choice Options (Locked Array) */}
        <div className="w-full grid grid-cols-1 gap-2.5">
          {currentOptions.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelected = selectedOption === option;
            const isCorrectOption = option === currentStudent.name;

            let buttonStyle =
              'bg-slate-50/80 border-slate-200/80 text-slate-800 hover:bg-slate-100 hover:border-slate-300';

            if (isAnswered) {
              if (isCorrectOption) {
                buttonStyle =
                  'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
              } else if (isSelected && !isCorrectOption) {
                buttonStyle =
                  'bg-rose-50 border-rose-400 text-rose-950 line-through';
              } else {
                buttonStyle = 'opacity-40 bg-slate-50 border-slate-100 text-slate-400';
              }
            }

            return (
              <motion.button
                key={option}
                type="button"
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`relative flex items-center gap-3 p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-bold transition-all duration-150 ${buttonStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    isAnswered && isCorrectOption
                      ? 'bg-emerald-600 text-white'
                      : isAnswered && isSelected && !isCorrectOption
                      ? 'bg-rose-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {letter}
                </span>

                <span className="flex-1 truncate">{option}</span>

                {isAnswered && isCorrectOption && (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle size={18} className="text-rose-600 shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* FEEDBACK & NEXT ACTION */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="w-full mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                {selectedOption === currentStudent.name ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 size={15} />
                    <span>Tepat! ({currentStudent.nickname} • K-{currentStudent.kelompok})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                    <XCircle size={15} />
                    <span>Kurang tepat. Ini {currentStudent.name}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onSelectStudent(currentStudent)}
                  className="text-xs text-slate-500 hover:text-slate-900 underline flex items-center gap-0.5 font-bold"
                >
                  <Eye size={12} />
                  <span>Bio</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                <span>Soal Berikutnya</span>
                <ChevronRight size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SESSION RESET */}
      <div className="flex justify-end text-xs text-slate-400 px-1 font-medium">
        <button
          type="button"
          onClick={handleResetSession}
          className="hover:text-slate-700 flex items-center gap-1 font-bold"
        >
          <RotateCcw size={12} />
          <span>Reset Sesi</span>
        </button>
      </div>
    </div>
  );
};