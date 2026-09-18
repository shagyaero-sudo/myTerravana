import React, { useState, useMemo } from 'react';
import {
  Search,
  MessageCircle,
  MapPin,
  Filter,
  CheckCircle2,
  Users,
  Grid,
  List,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { StudentUser, RegionType } from '../types';

interface TerrafinderViewProps {
  students: StudentUser[];
  onSelectStudent: (student: StudentUser) => void;
  onToggleMastered: (studentId: string) => void;
}

const REGION_FILTERS: RegionType[] = [
  'All',
  'Surabaya Timur',
  'Surabaya Barat',
  'Surabaya Selatan',
  'Sidoarjo',
  'Jabodetabek',
  'Malang',
  'Luar Jawa',
];

export const TerrafinderView: React.FC<TerrafinderViewProps> = ({
  students,
  onSelectStudent,
  onToggleMastered,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionType>('All');
  const [selectedKelompok, setSelectedKelompok] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter students based on search query, region, and kelompok
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Region check
      if (selectedRegion !== 'All' && student.region !== selectedRegion) {
        return false;
      }

      // Kelompok check
      if (selectedKelompok !== 'all' && student.kelompok.toString() !== selectedKelompok) {
        return false;
      }

      // Query check (name, nickname, NRP, address)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = student.name.toLowerCase().includes(q);
        const matchNick = student.nickname.toLowerCase().includes(q);
        const matchNrp = student.nrp.toLowerCase().includes(q);
        const matchAddress = student.kos_address.toLowerCase().includes(q);
        const matchMajor = student.major.toLowerCase().includes(q);

        if (!matchName && !matchNick && !matchNrp && !matchAddress && !matchMajor) {
          return false;
        }
      }

      return true;
    });
  }, [students, searchQuery, selectedRegion, selectedKelompok]);

  return (
    <div id="terrafinder-view-root" className="space-y-5 pb-28">
      {/* 1. VIEW HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Terrafinder
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              Kontak Siaga 170 Mahasiswa
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Direktori mahasiswa, alamat kos, kontak darurat, dan chat WhatsApp langsung
          </p>
        </div>

        {/* View mode toggle (Grid vs List) */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-100/80 p-1 rounded-xl border border-black/[0.04]">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Tampilan Grid"
          >
            <Grid size={16} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Tampilan Daftar"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* 2. SEARCH BAR & CONTROLS */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="input-search-students"
              type="text"
              placeholder="Cari nama lengkap, panggilan, NRP, atau jalan kos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
            />
          </div>

          {/* Kelompok select filter */}
          <div className="flex items-center gap-2">
            <select
              id="select-kelompok-filter"
              value={selectedKelompok}
              onChange={(e) => setSelectedKelompok(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Semua Kelompok (1-12)</option>
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={(i + 1).toString()}>
                  Kelompok {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Region filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <MapPin size={12} />
            Wilayah:
          </span>
          {REGION_FILTERS.map((region) => {
            const isActive = selectedRegion === region;
            return (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. STUDENT CARDS CONTAINER */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Menampilkan <strong className="text-slate-900">{filteredStudents.length}</strong> mahasiswa
        </span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-slate-500 hover:text-slate-900 underline"
          >
            Hapus Pencarian
          </button>
        )}
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-black/[0.06] p-6">
          <Users size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-bold text-slate-800">
            Tidak ditemukan mahasiswa dengan kriteria tersebut
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Coba gunakan kata kunci nama atau ubah filter wilayah domisili.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div
          id="student-cards-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredStudents.map((student) => {
            const waUrl = `https://wa.me/${student.wa_number}?text=${encodeURIComponent(
              `Halo ${student.nickname}! Aku dari angkatan Terravana 2026 mau koordinasi yaa 🙌`
            )}`;

            return (
              <div
                key={student.id}
                id={`student-card-${student.id}`}
                className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Avatar & Kelompok badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-black/5 cursor-pointer"
                          onClick={() => onSelectStudent(student)}
                        />
                        {student.mastered && (
                          <span
                            title="Telah dikuasai di Terraquiz KPI"
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white"
                          >
                            <CheckCircle2 size={11} />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4
                          onClick={() => onSelectStudent(student)}
                          className="text-xs sm:text-sm font-bold text-slate-900 hover:underline cursor-pointer truncate"
                        >
                          {student.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5 text-slate-500">
                          <span className="text-xs font-semibold text-slate-600">
                            "{student.nickname}"
                          </span>
                          <span>•</span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            NRP {student.nrp.slice(-4)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-900 text-white shrink-0">
                      K-{student.kelompok}
                    </span>
                  </div>

                  {/* Location & Region */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 bg-slate-50/70 rounded-xl p-2.5 border border-slate-100">
                    <div className="flex items-start gap-1.5">
                      <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 text-[11px] leading-snug">
                        {student.kos_address}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-200/50">
                      <span>{student.major}</span>
                      <span className="px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                        {student.region}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                  <a
                    id={`btn-wa-${student.id}`}
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-xs"
                  >
                    <MessageCircle size={14} />
                    <span>Chat WA</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onSelectStudent(student)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Detail
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div
          id="student-cards-list"
          className="bg-white rounded-2xl border border-black/[0.06] divide-y divide-slate-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] overflow-hidden"
        >
          {filteredStudents.map((student) => {
            const waUrl = `https://wa.me/${student.wa_number}?text=${encodeURIComponent(
              `Halo ${student.nickname}! Aku dari angkatan Terravana 2026 mau koordinasi yaa 🙌`
            )}`;

            return (
              <div
                key={student.id}
                id={`student-list-item-${student.id}`}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-black/5 cursor-pointer shrink-0"
                    onClick={() => onSelectStudent(student)}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        onClick={() => onSelectStudent(student)}
                        className="text-xs sm:text-sm font-bold text-slate-900 hover:underline cursor-pointer truncate"
                      >
                        {student.name} ({student.nickname})
                      </h4>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-slate-900 text-white">
                        K-{student.kelompok}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span>NRP {student.nrp}</span>
                      <span>•</span>
                      <span className="truncate max-w-[200px] sm:max-w-xs">{student.kos_address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 hidden md:inline-block">
                    {student.region}
                  </span>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                  >
                    <MessageCircle size={13} />
                    <span>Chat WA</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onSelectStudent(student)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Detail
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
