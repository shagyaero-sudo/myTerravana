import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { AgendaItem } from '../types';

interface AddAgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (agenda: AgendaItem) => void;
}

export const AddAgendaModal: React.FC<AddAgendaModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('Besok');
  const [time, setTime] = useState('19:00 WIB');
  const [location, setLocation] = useState('Lab Pemrograman');
  const [type, setType] = useState<'cadre' | 'academic' | 'personal'>('personal');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAgenda: AgendaItem = {
      id: `ag-custom-${Date.now()}`,
      title: title.trim(),
      date: date.trim() || 'Hari ini',
      time: time.trim() || '19:00 WIB',
      location: location.trim() || 'Kampus',
      type,
      is_completed: false,
      notes: notes.trim() || undefined,
    };

    onAdd(newAgenda);
    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div
      id="add-agenda-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="add-agenda-modal-dialog"
        className="relative w-full max-w-lg bg-white rounded-2xl border border-black/[0.08] shadow-2xl p-6 overflow-hidden"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Tambah Agenda Baru
            </h3>
            <p className="text-xs text-slate-500">
              Catat jadwal kaderisasi, kuliah, atau agenda kelompok Anda
            </p>
          </div>
          <button
            id="btn-close-agenda-modal"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Judul Agenda *
            </label>
            <input
              id="input-agenda-title"
              type="text"
              required
              placeholder="Contoh: Diskusi Buku Angkatan Kelompok 4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar size={13} className="text-slate-400" />
                Tanggal
              </label>
              <input
                id="input-agenda-date"
                type="text"
                placeholder="Hari ini / 22 Sep"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock size={13} className="text-slate-400" />
                Waktu
              </label>
              <input
                id="input-agenda-time"
                type="text"
                placeholder="19:30 WIB"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin size={13} className="text-slate-400" />
              Lokasi / Media
            </label>
            <input
              id="input-agenda-location"
              type="text"
              placeholder="Contoh: Gedung Rektorat Lt. 2 / Zoom Meeting"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Tag size={13} className="text-slate-400" />
              Kategori
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('cadre')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  type === 'cadre'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Kaderisasi
              </button>
              <button
                type="button"
                onClick={() => setType('academic')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  type === 'academic'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Akademik
              </button>
              <button
                type="button"
                onClick={() => setType('personal')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  type === 'personal'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Personal / Tim
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Catatan Singkat (Opsional)
            </label>
            <textarea
              id="input-agenda-notes"
              rows={2}
              placeholder="Catatan penugasan, pakaian yang dikenakan, perlengkapan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              id="btn-save-agenda"
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
            >
              Simpan Agenda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
