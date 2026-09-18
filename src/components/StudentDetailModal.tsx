import React, { useState, useEffect } from 'react';
import { X, MessageCircle, MapPin, BookOpen, Heart, Edit2, Lock, Save } from 'lucide-react';
import { StudentUser } from '../types';

interface StudentDetailModalProps {
  student: StudentUser | null;
  currentUser: StudentUser;
  onClose: () => void;
  onSaveProfile?: (updatedUser: Partial<StudentUser>) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  currentUser,
  onClose,
  onSaveProfile,
}) => {
  // 1. Guard Clause jika modal tidak aktif / student null
  if (!student) return null;

  return (
    <StudentDetailModalContent
      student={student}
      currentUser={currentUser}
      onClose={onClose}
      onSaveProfile={onSaveProfile}
    />
  );
};

// Komponen terpisah agar Hooks safe dari kondisi null
const StudentDetailModalContent: React.FC<{
  student: StudentUser;
  currentUser: StudentUser;
  onClose: () => void;
  onSaveProfile?: (updatedUser: Partial<StudentUser>) => void;
}> = ({ student, currentUser, onClose, onSaveProfile }) => {
  const isOwnProfile = student.id === currentUser.id;
  const [isEditing, setIsEditing] = useState(false);

  // Form states aman diakses karena student dijamin ada
  const [name, setName] = useState(student.name);
  const [nickname, setNickname] = useState(student.nickname);
  const [nrp, setNrp] = useState(student.nrp);
  const [region, setRegion] = useState(student.region);
  const [kosAddress, setKosAddress] = useState(student.kos_address || '');
  const [motto, setMotto] = useState(student.motto || '');
  const [hobbies, setHobbies] = useState(student.hobbies ? student.hobbies.join(', ') : '');
  const [password, setPassword] = useState('');

  // Update state form jika data student berubah
  useEffect(() => {
    setName(student.name);
    setNickname(student.nickname);
    setNrp(student.nrp);
    setRegion(student.region);
    setKosAddress(student.kos_address || '');
    setMotto(student.motto || '');
    setHobbies(student.hobbies ? student.hobbies.join(', ') : '');
  }, [student]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveProfile) {
      onSaveProfile({
        name,
        nickname,
        nrp,
        region: region as any,
        kos_address: kosAddress,
        motto,
        hobbies: hobbies.split(',').map((h) => h.trim()).filter(Boolean),
        ...(password ? { password } : {}),
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-black/[0.08] shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center pt-2 pb-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-100 shadow-sm mb-2"
          />

          {!isEditing ? (
            <>
              <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                "{student.nickname}" • NRP {student.nrp}
              </p>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <Edit2 size={12} />
                  <span>Edit Profil Saya</span>
                </button>
              )}
            </>
          ) : (
            <span className="text-sm font-bold text-slate-900">Edit Biodata Profil</span>
          )}
        </div>

        {/* MODE BACA PROFIL */}
        {!isEditing ? (
          <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 block">Domisili / Kos:</span>
                <span>{student.kos_address || '-'}</span>
              </div>
            </div>

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
                  <span className="font-semibold text-slate-700 block mb-1">Hobi:</span>
                  <div className="flex flex-wrap gap-1">
                    {student.hobbies.map((h, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white border text-[11px]">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* FORM EDIT PROFIL */
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Panjang</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NRP</label>
                <input
                  type="text"
                  value={nrp}
                  onChange={(e) => setNrp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Wilayah Domisili</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Kos / Rumah</label>
              <input
                type="text"
                value={kosAddress}
                onChange={(e) => setKosAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Motto</label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hobi (Pisahkan koma)</label>
              <input
                type="text"
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Lock size={12} />
                <span>Ubah Password (Opsional)</span>
              </label>
              <input
                type="password"
                placeholder="Password baru..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-bold"
              >
                <Save size={14} />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        )}

        {/* Tombol Chat WA untuk profil orang lain */}
        {!isOwnProfile && !isEditing && (
          <div className="mt-5">
            <a
              href={`https://wa.me/${student.wa_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm"
            >
              <MessageCircle size={17} />
              <span>Chat WhatsApp (+{student.wa_number})</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};