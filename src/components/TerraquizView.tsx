import React, { useState, useEffect, useCallback } from 'react';
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

    // Cek antrean pengulangan (Spaced Repetition / Smart Queue)
    if (reviewQueue.length > 0 && questionCount % 3 === 0) {
      const reviewId = reviewQueue[0];
      targetStudent = students.find((s) => s.id === reviewId);
    }

    // Jika tidak dari review queue, prioritaskan yang belum dihafal
    if (!targetStudent) {
      const unmastered = students.filter((s) => !s.mastered);
      const pool = unmastered.length > 0 ? unmastered : students;
      targetStudent = pool[Math.floor(Math.random() * pool.length)];
    }

    // Acak 3 pilihan salah
    const others = students.filter((s) => s.id !== targetStudent!.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random());
    const wrongOptions = shuffledOthers.slice(0, 3).map((s) => s.name);

    // Lock opsi jawaban
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

      // Hapus dari antrean review jika benar
      setReviewQueue((prev) => prev.filter((id) => id !== currentQuestion.student.id));

      // Update KPI
      onUpdateMastered(currentQuestion.student.id, true);
    } else {
      setStreak(0);
      setSessionTotal((prev) => prev + 1);

      // Masukkan ke antrean review jika salah
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
    <div id="terraquiz-view-root" className="max-w-2xl mx-auto space-y-5 pb-36 font-sans">
      {/* 1. HEADER + ICON BANTUAN (?) DI POJOK KANAN */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Terraquiz
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Kuis pintar otomatis untuk menghafal 170 rekan angkatan Terravana 2026
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsHowToPlayOpen(true)}
          className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
          title="Cara Bermain & Sistematika"
        >
          <HelpCircle size={18} />
        </button>
      </div>

      {/* 2. UNIFIED PROGRESS BAR */}
      <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-900">{masteredCount}/{totalStudents}</span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
            {kpiPercentage}% KPI
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-1 font-extrabold text-slate-800">
          <Flame size={14} className="fill-amber-500 text-amber-500" />
          <span>{streak}x Streak</span>
        </div>

        <div className="h-4 w-px bg-slate-200" />

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
        {/* Photo Card */}
        <div className="relative mb-5">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden ring-4 ring-slate-100 shadow-xs bg-slate-100">
            <img
              key={currentStudent.id}
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

        {/* 4 Multiple Choice Options */}
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
                key={`${currentStudent.id}-${option}`}
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

      {/* RESET SESI */}
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

      {/* MODAL CARA BERMAIN & SISTEMATIKA */}
      <AnimatePresence>
        {isHowToPlayOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Brain size={18} />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Cara Bermain & Sistematika
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

              <div className="space-y-3.5 text-xs text-slate-600 font-medium leading-relaxed">
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Target size={18} className="text-indigo-600 shrink-0 mt-0.5" />
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
                      Jika jawabanmu <strong className="text-rose-600">Salah</strong>, orang tersebut akan otomatis diselipkan kembali dalam 3–5 soal berikutnya sampai kamu berhasil menjawabnya dengan benar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-slate-900 mb-0.5">KPI Progres Hafalan</h4>
                    <p className="text-[11px] text-slate-500">
                      Setiap jawaban yang <strong className="text-emerald-600">Benar</strong> akan otomatis menandai rekan tersebut sebagai "Sudah Hafal" dan menaikkan persentase KPI Angkatanmu.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsHowToPlayOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs mt-2"
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