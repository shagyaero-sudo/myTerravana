import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  Eye,
  Check,
  Zap,
  X,
  Brain,
  Target,
  Sparkles,
} from 'lucide-react';
import { StudentUser } from '../types';

interface TerraquizViewProps {
  students: StudentUser[];
  onUpdateMastered: (studentId: string, mastered: boolean) => void;
  onSelectStudent: (student: StudentUser) => void;
  masteredCount: number;
  totalStudents: number;
  onNavigateTab?: (tabId: string) => void;
}

interface QuizQuestion {
  student: StudentUser;
  options: string[];
}

export const TerraquizView: React.FC<TerraquizViewProps> = ({
  students,
  onUpdateMastered,
  onSelectStudent,
  masteredCount,
  totalStudents,
  onNavigateTab,
}) => {
  const [reviewQueue, setReviewQueue] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  
  // Stats Sesi
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  // FUNGSI BUAT SOAL BARU
  const generateNewQuestion = useCallback(() => {
    if (students.length === 0) return;

    let targetStudent: StudentUser | undefined;

    if (reviewQueue.length > 0 && questionCount % 3 === 0) {
      const reviewId = reviewQueue[0];
      targetStudent = students.find((s) => s.id === reviewId);
    }

    if (!targetStudent) {
      const unmastered = students.filter((s) => !s.mastered);
      const pool = unmastered.length > 0 ? unmastered : students;
      targetStudent = pool[Math.floor(Math.random() * pool.length)];
    }

    const others = students.filter((s) => s.id !== targetStudent!.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random());
    const wrongOptions = shuffledOthers.slice(0, 3).map((s) => s.name);

    const lockedOptions = [targetStudent.name, ...wrongOptions].sort(() => 0.5 - Math.random());

    setCurrentQuestion({
      student: targetStudent,
      options: lockedOptions,
    });
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
  }, [students, reviewQueue, questionCount]);

  useEffect(() => {
    if (!currentQuestion && students.length > 0) {
      generateNewQuestion();
    }
  }, [students, currentQuestion, generateNewQuestion]);

  const handleSelectOption = (optionName: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(optionName);
    setIsAnswered(true);

    const isCorrect = optionName === currentQuestion.student.name;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setSessionCorrect((prev) => prev + 1);
      setSessionTotal((prev) => prev + 1);
      setReviewQueue((prev) => prev.filter((id) => id !== currentQuestion.student.id));
      onUpdateMastered(currentQuestion.student.id, true);
    } else {
      setStreak(0);
      setSessionTotal((prev) => prev + 1);

      if (!reviewQueue.includes(currentQuestion.student.id)) {
        setReviewQueue((prev) => [...prev, currentQuestion.student.id]);
      }
    }
  };

  const handleNextQuestion = () => {
    setQuestionCount((prev) => prev + 1);
    generateNewQuestion();
  };

  const handleResetSession = () => {
    setStreak(0);
    setBestStreak(0);
    setSessionCorrect(0);
    setSessionTotal(0);
    setReviewQueue([]);
    setQuestionCount(0);
    generateNewQuestion();
  };

  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 100;
  const kpiPercentage = Math.round((masteredCount / totalStudents) * 100);

  if (!currentQuestion) return null;

  const { student: currentStudent, options: currentOptions } = currentQuestion;

  return (
    <div id="terraquiz-view-root" className="max-w-md mx-auto space-y-4 pt-2 pb-36 font-sans">
      {/* 1. TOP BAR CLEAN (TANPA TANGGAL) */}
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
          onClick={() => setIsHowToPlayOpen(true)}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors shrink-0"
          title="Cara Bermain & Info"
        >
          <HelpCircle size={18} />
        </button>
      </div>

      {/* 2. TITLE & DESKRIPSI RINGKAS */}
      <div className="pt-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
          Terraquiz
        </h1>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
          Challenge
        </h1>
      </div>

      {/* 3. UNIFIED PROGRESS BAR */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-slate-900 text-xs">{masteredCount}/{totalStudents}</span>
          <span className="text-[9px] font-black text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-md">
            {kpiPercentage}% KPI
          </span>
        </div>

        <div className="h-3.5 w-px bg-slate-200" />

        <div className="flex items-center gap-1 font-extrabold text-slate-800 text-xs">
          <Flame size={13} className="fill-amber-500 text-amber-500" />
          <span>{streak}x Streak</span>
        </div>

        <div className="h-3.5 w-px bg-slate-200" />

        <div className="flex items-center gap-1 font-extrabold text-slate-800 text-xs">
          <Zap size={13} className="text-indigo-600" />
          <span>{accuracy}% Akurasi</span>
        </div>
      </div>

      {/* 4. CARD-BASED QUIZ CONTAINER */}
      <div
        id="terraquiz-card"
        className="bg-white rounded-[32px] border border-slate-100 p-5 shadow-xs flex flex-col items-center"
      >
        <div className="relative mb-4 w-full flex flex-col items-center">
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-[28px] overflow-hidden ring-4 ring-slate-100 shadow-xs bg-slate-100">
            <img
              key={currentStudent.id}
              src={currentStudent.avatar}
              alt="Tebak Siapakah Mahasiswa Ini?"
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {currentStudent.mastered && (
              <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                <Check size={10} />
                Sudah Hafal
              </span>
            )}
          </div>

          <div className="mt-3">
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 transition-colors"
              >
                <HelpCircle size={12} />
                <span>Petunjuk</span>
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

        <div className="text-center mb-4">
          <h3 className="text-sm font-black text-slate-900">
            Siapakah nama rekan di foto ini?
          </h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Pilih 1 dari 4 pilihan jawaban:
          </p>
        </div>

        <div className="w-full grid grid-cols-1 gap-2">
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
                key={`${currentStudent.id}-${option}`}
                type="button"
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`relative flex items-center gap-3 p-3 rounded-2xl border text-left text-xs font-bold transition-all duration-150 ${buttonStyle}`}
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
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle size={16} className="text-rose-600 shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="w-full mt-5 pt-4 border-t border-slate-100 flex flex-col items-center justify-between gap-3"
            >
              <div className="flex items-center justify-between w-full">
                {selectedOption === currentStudent.name ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 size={14} />
                    <span>Tepat! ({currentStudent.nickname})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                    <XCircle size={14} />
                    <span>Ini {currentStudent.nickname}</span>
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
                className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl bg-[#7C5CFC] hover:bg-purple-600 text-white text-xs font-black shadow-md shadow-purple-200/60 transition-all"
              >
                <span>Soal Berikutnya</span>
                <ChevronRight size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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

      {/* MODAL HOW TO PLAY */}
      <AnimatePresence>
        {isHowToPlayOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-[36px] p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Brain size={18} />
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    Sistematika Terraquiz
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHowToPlayOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 font-medium leading-relaxed">
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Target size={18} className="text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-slate-900 mb-0.5">Aturan Kuis</h4>
                    <p className="text-[11px] text-slate-500">
                      Tebak nama mahasiswa berdasarkan foto yang muncul. Pilih 1 dari 4 pilihan jawaban yang tersedia.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Sparkles size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-slate-900 mb-0.5">Smart Queue Algorithm</h4>
                    <p className="text-[11px] text-slate-500">
                      Jika jawabanmu <strong className="text-rose-600">Salah</strong>, foto orang tersebut akan diselipkan kembali dalam 3–5 soal berikutnya.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-slate-900 mb-0.5">KPI Progres Hafalan</h4>
                    <p className="text-[11px] text-slate-500">
                      Setiap jawaban yang <strong className="text-emerald-600">Benar</strong> akan otomatis menaikkan persentase KPI Angkatanmu.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsHowToPlayOpen(false)}
                className="w-full py-3 rounded-2xl bg-[#7C5CFC] text-white text-xs font-black hover:bg-purple-600 transition-colors shadow-xs mt-2"
              >
                Paham & Mulai Kuis
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};