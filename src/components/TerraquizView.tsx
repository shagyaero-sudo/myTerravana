import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
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
  const [filterMode, setFilterMode] = useState<'all' | 'unmastered'>('all');
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(4);
  const [bestStreak, setBestStreak] = useState(12);
  const [sessionCorrect, setSessionCorrect] = useState(8);
  const [sessionTotal, setSessionTotal] = useState(9);
  const [showHint, setShowHint] = useState(false);

  // Active pool of students
  const activePool = useMemo(() => {
    if (filterMode === 'unmastered') {
      const unmastered = students.filter((s) => !s.mastered);
      return unmastered.length > 0 ? unmastered : students;
    }
    return students;
  }, [students, filterMode]);

  const currentStudent = activePool[currentStudentIndex % activePool.length] || students[0];

  // Generate 4 randomized options (1 correct, 3 wrong from other students)
  const options = useMemo(() => {
    if (!currentStudent) return [];
    const correct = currentStudent.name;
    const others = students.filter((s) => s.id !== currentStudent.id);

    // Shuffle and pick 3 distinct wrong options
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random());
    const wrong = shuffledOthers.slice(0, 3).map((s) => s.name);

    // Combined and shuffled options
    return [correct, ...wrong].sort(() => 0.5 - Math.random());
  }, [currentStudent, students]);

  const handleSelectOption = (optionName: string) => {
    if (isAnswered) return;

    setSelectedOption(optionName);
    setIsAnswered(true);

    const isCorrect = optionName === currentStudent.name;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setSessionCorrect((prev) => prev + 1);
      setSessionTotal((prev) => prev + 1);

      // Mark student as mastered for KPI!
      onUpdateMastered(currentStudent.id, true);
    } else {
      setStreak(0);
      setSessionTotal((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setCurrentStudentIndex((prev) => (prev + 1) % activePool.length);
  };

  const handleResetSession = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setStreak(0);
    setSessionCorrect(0);
    setSessionTotal(0);
    setCurrentStudentIndex(0);
  };

  const accuracy =
    sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 100;
  const kpiPercentage = Math.round((masteredCount / totalStudents) * 100);

  return (
    <div id="terraquiz-view-root" className="max-w-2xl mx-auto space-y-5 pb-28">
      {/* 1. VIEW HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Terraquiz
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              Gamified Cadre
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Hafalkan foto, wajah, dan nama 170 rekan satu angkatan Terravana 2026
          </p>
        </div>

        {/* Mode filter pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100/90 p-1 rounded-xl border border-black/[0.04]">
          <button
            type="button"
            onClick={() => {
              setFilterMode('all');
              setCurrentStudentIndex(0);
              setIsAnswered(false);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Semua ({students.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterMode('unmastered');
              setCurrentStudentIndex(0);
              setIsAnswered(false);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'unmastered'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Belum Hafal ({totalStudents - masteredCount})
          </button>
        </div>
      </div>

      {/* 2. STATS & ACCURACY METER STRIP */}
      <div
        id="terraquiz-meters-strip"
        className="grid grid-cols-3 gap-3 bg-white rounded-2xl border border-black/[0.06] p-4 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)]"
      >
        {/* KPI Meter */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Award size={13} className="text-slate-500" />
            <span>KPI Kelulusan</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
            {masteredCount}/{totalStudents}
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 mt-1.5 overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full transition-all"
              style={{ width: `${kpiPercentage}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1">{kpiPercentage}% Target</span>
        </div>

        {/* Live Streak */}
        <div className="flex flex-col border-x border-slate-100 px-3">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 uppercase tracking-wider">
            <Flame size={13} className="fill-amber-500 stroke-amber-500" />
            <span>Streak</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 flex items-baseline gap-1">
            <span>{streak}x</span>
            {streak >= 5 && (
              <span className="text-[10px] font-bold text-amber-600 animate-pulse">
                🔥 On Fire!
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Rekor: {bestStreak}x berturut</span>
        </div>

        {/* Live Accuracy */}
        <div className="flex flex-col pl-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Zap size={13} className="text-emerald-500" />
            <span>Akurasi</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
            {accuracy}%
          </div>
          <span className="text-[10px] text-slate-500 mt-1">
            {sessionCorrect} benar / {sessionTotal} soal
          </span>
        </div>
      </div>

      {/* 3. CARD-BASED QUIZ CONTAINER */}
      <div
        id="terraquiz-card"
        className="bg-white rounded-3xl border border-black/[0.06] p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] flex flex-col items-center"
      >
        {/* Photo Card with Hint Badge */}
        <div className="relative mb-6">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden ring-4 ring-slate-100 shadow-md bg-slate-100">
            <img
              src={currentStudent.avatar}
              alt="Tebak Siapakah Mahasiswa Ini?"
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Mastered Badge if already mastered */}
            {currentStudent.mastered && (
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                <Check size={11} />
                Sudah Hafal
              </span>
            )}
          </div>

          {/* Hint Overlay or Trigger */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors"
              >
                <HelpCircle size={13} />
                <span>Buka Petunjuk Kelompok/Domisili</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
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
          <p className="text-xs text-slate-400 mt-0.5">
            Pilih 1 dari 4 pilihan nama di bawah:
          </p>
        </div>

        {/* 4 Multiple Choice Option Buttons */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = selectedOption === option;
            const isCorrectOption = option === currentStudent.name;

            let buttonStyle =
              'bg-slate-50/70 border-slate-200/80 text-slate-800 hover:bg-slate-100 hover:border-slate-300';

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
                id={`quiz-option-${letter.toLowerCase()}`}
                type="button"
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`relative flex items-center gap-3 p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all duration-150 ${buttonStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${
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

        {/* FEEDBACK & NEXT QUESTION ACTION */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="w-full mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                {selectedOption === currentStudent.name ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 size={16} />
                    <span>Jawaban Tepat! ({currentStudent.nickname} • K-{currentStudent.kelompok})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                    <XCircle size={16} />
                    <span>Kurang tepat. Dia adalah {currentStudent.name}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onSelectStudent(currentStudent)}
                  className="text-xs text-slate-500 hover:text-slate-900 underline flex items-center gap-0.5"
                >
                  <Eye size={12} />
                  <span>Lihat Bio</span>
                </button>
              </div>

              <button
                id="btn-quiz-next"
                type="button"
                onClick={handleNextQuestion}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                <span>Soal Berikutnya</span>
                <ChevronRight size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Session Reset & Tip */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Tips: Latihan setiap hari 15 menit menjamin hafal 100% sebelum evaluasi forum.</span>
        <button
          type="button"
          onClick={handleResetSession}
          className="hover:text-slate-700 flex items-center gap-1 font-semibold"
        >
          <RotateCcw size={12} />
          <span>Reset Sesi</span>
        </button>
      </div>
    </div>
  );
};
