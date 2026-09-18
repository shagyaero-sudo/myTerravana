import React from 'react';
import { X, MessageCircle, MapPin, Calendar, BookOpen, Heart, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { StudentUser } from '../types';

interface StudentDetailModalProps {
  student: StudentUser | null;
  onClose: () => void;
  onToggleMastered?: (studentId: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onToggleMastered,
}) => {
  if (!student) return null;

  const waMessage = encodeURIComponent(
    `Halo ${student.nickname}! Aku teman satu angkatan Terravana 2026. Mau silaturahmi & koordinasi agenda kaderisasi yaa 🙏`
  );
  const waUrl = `https://wa.me/${student.wa_number}?text=${waMessage}`;

  return (
    <div
      id="student-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="student-detail-modal-dialog"
        className="relative w-full max-w-md bg-white rounded-3xl border border-black/[0.08] shadow-2xl p-6 overflow-hidden"
      >
        <button
          id="btn-close-student-detail"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center pt-2 pb-4">
          <div className="relative mb-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100 shadow-sm"
            />
            <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-white shadow-sm">
              K-{student.kelompok}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {student.name}
          </h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            "{student.nickname}" • NRP {student.nrp}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            <span>{student.major}</span>
            <span>•</span>
            <span>{student.region}</span>
          </div>
        </div>

        {/* Student Data Cards */}
        <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-start gap-2.5">
            <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 block">Domisili / Kos:</span>
              <span className="text-slate-600">{student.kos_address}</span>
            </div>
          </div>

          {student.birthday && (
            <div className="flex items-center gap-2.5">
              <Calendar size={15} className="text-slate-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-700">Ulang Tahun: </span>
                <span>{student.birthday}</span>
                {student.is_birthday_today && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                    Hari Ini! 🎂
                  </span>
                )}
              </div>
            </div>
          )}

          {student.motto && (
            <div className="flex items-start gap-2.5">
              <BookOpen size={15} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 block">Motto:</span>
                <span className="italic text-slate-500">"{student.motto}"</span>
              </div>
            </div>
          )}

          {student.hobbies && student.hobbies.length > 0 && (
            <div className="flex items-start gap-2.5">
              <Heart size={15} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 block mb-1">Minat & Hobi:</span>
                <div className="flex flex-wrap gap-1">
                  {student.hobbies.map((h, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 text-[11px]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {student.emergency_contact && (
            <div className="flex items-start gap-2.5 pt-1 border-t border-slate-200/60">
              <ShieldAlert size={15} className="text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700">Kontak Darurat: </span>
                <span className="text-slate-600">
                  {student.emergency_contact.relation} ({student.emergency_contact.phone})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          <a
            id={`btn-wa-student-${student.id}`}
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-sm"
          >
            <MessageCircle size={17} />
            <span>Chat WhatsApp (+{student.wa_number})</span>
          </a>

          {onToggleMastered && (
            <button
              id={`btn-toggle-mastered-${student.id}`}
              type="button"
              onClick={() => onToggleMastered(student.id)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                student.mastered
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 size={15} className={student.mastered ? 'text-emerald-600' : 'text-slate-400'} />
              <span>
                {student.mastered
                  ? '✓ Sudah Dikuasai di Terraquiz KPI'
                  : 'Tandai Sudah Dikuasai (Terraquiz KPI)'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
