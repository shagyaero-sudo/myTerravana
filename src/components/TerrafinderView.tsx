import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  MessageCircle,
  MapPin,
  Users,
  Grid,
  List,
  CheckCircle2,
  ChevronDown,
  Navigation,
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
  
  // Custom Dropdown State
  const [isKelompokDropdownOpen, setIsKelompokDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsKelompokDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter mahasiswa berdasarkan pencarian, wilayah, dan kelompok
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      if (selectedRegion !== 'All' && student.region !== selectedRegion) {
        return false;
      }

      if (selectedKelompok !== 'all' && student.kelompok.toString() !== selectedKelompok) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = student.name.toLowerCase().includes(q);
        const matchNick = student.nickname.toLowerCase().includes(q);
        const matchNrp = student.nrp.toLowerCase().includes(q);
        const matchAddress = student.kos_address.toLowerCase().includes(q);

        if (!matchName && !matchNick && !matchNrp && !matchAddress) {
          return false;
        }
      }

      return true;
    });
  }, [students, searchQuery, selectedRegion, selectedKelompok]);

  return (
    <div id="terrafinder-view-root" className="max-w-2xl mx-auto space-y-5 pb-36 font-sans">
      {/* 1. HEADER (BERSIH & PRESISI) */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Terrafinder
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Direktori mahasiswa, lokasi kos, kontak darurat, dan WhatsApp
          </p>
        </div>

        {/* View mode toggle (Grid vs List) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-100">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-xl transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Tampilan Grid"
          >
            <Grid size={15} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-xl transition-all ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Tampilan Daftar"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* 2. SEARCH BAR & CUSTOM DROPDOWN MYTERRAVANA */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="input-search-students"
              type="text"
              placeholder="Cari nama, panggilan, NRP, atau jalan kos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* CUSTOM DROPDOWN KELOMPOK MYTERRAVANA (NON-NATIVE BROWSER) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsKelompokDropdownOpen(!isKelompokDropdownOpen)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between gap-2 transition-all"
            >
              <span>
                {selectedKelompok === 'all'
                  ? 'Semua Kelompok (1-12)'
                  : `Kelompok ${selectedKelompok}`}
              </span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform ${
                  isKelompokDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isKelompokDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl border border-slate-100 shadow-xl py-1.5 z-30 max-h-56 overflow-y-auto font-medium text-xs text-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedKelompok('all');
                    setIsKelompokDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 font-bold transition-colors ${
                    selectedKelompok === 'all' ? 'text-indigo-600 bg-indigo-50/50' : ''
                  }`}
                >
                  Semua Kelompok (1-12)
                </button>
                {Array.from({ length: 12 }).map((_, i) => {
                  const val = (i + 1).toString();
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setSelectedKelompok(val);
                        setIsKelompokDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 font-bold transition-colors ${
                        selectedKelompok === val ? 'text-indigo-600 bg-indigo-50/50' : ''
                      }`}
                    >
                      Kelompok {val}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Region Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-slate-100">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <MapPin size={11} />
            Wilayah:
          </span>
          {REGION_FILTERS.map((region) => {
            const isActive = selectedRegion === region;
            return (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
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
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
        <span>
          Menampilkan <strong className="text-slate-900">{filteredStudents.length}</strong> mahasiswa
        </span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-slate-500 hover:text-slate-900 underline font-bold"
          >
            Hapus Pencarian
          </button>
        )}
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-6">
          <Users size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-bold text-slate-800">
            Tidak ditemukan mahasiswa dengan kriteria tersebut
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Coba kata kunci nama lain atau reset filter wilayah domisili.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW (VISILY CARDS) */
        <div
          id="student-cards-grid"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
        >
          {filteredStudents.map((student) => {
            const waUrl = `https://wa.me/${student.wa_number}?text=${encodeURIComponent(
              `Halo ${student.nickname}! Aku dari angkatan Terravana 2026 mau koordinasi yaa 🙌`
            )}`;
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              student.kos_address
            )}`;

            return (
              <div
                key={student.id}
                id={`student-card-${student.id}`}
                className="bg-white rounded-3xl border border-slate-100/90 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  {/* Avatar & Info Utama */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 cursor-pointer shrink-0"
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
                          className="text-xs sm:text-sm font-extrabold text-slate-900 hover:underline cursor-pointer truncate"
                        >
                          {student.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5 text-slate-500">
                          <span className="text-xs font-bold text-slate-600">
                            "{student.nickname}"
                          </span>
                          <span>•</span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            NRP {student.nrp.slice(-4)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-900 text-white shrink-0">
                      K-{student.kelompok}
                    </span>
                  </div>

                  {/* Alamat & Domisili (Tanpa Jurusan, Sejajar Rapi) */}
                  <div className="mt-3 space-y-2 text-xs text-slate-600 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <div className="flex items-start gap-1.5">
                      <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 text-[11px] font-medium leading-snug">
                        {student.kos_address}
                      </span>
                    </div>

                    <div className="flex items-center justify-end pt-1 border-t border-slate-200/50">
                      <span className="px-2.5 py-0.5 rounded-lg bg-white text-slate-700 font-bold border border-slate-200/80 text-[10px]">
                        {student.region}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons (WA, Google Maps & Detail) */}
                <div className="pt-1 flex items-center gap-2">
                  <a
                    id={`btn-wa-${student.id}`}
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-xs"
                  >
                    <MessageCircle size={14} />
                    <span>Chat WA</span>
                  </a>

                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-2xl text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                    title="Buka Lokasi di Google Maps"
                  >
                    <Navigation size={15} />
                  </a>

                  <button
                    type="button"
                    onClick={() => onSelectStudent(student)}
                    className="px-3 py-2 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
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
          className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 shadow-xs overflow-hidden"
        >
          {filteredStudents.map((student) => {
            const waUrl = `https://wa.me/${student.wa_number}?text=${encodeURIComponent(
              `Halo ${student.nickname}! Aku dari angkatan Terravana 2026 mau koordinasi yaa 🙌`
            )}`;
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              student.kos_address
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
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100 cursor-pointer shrink-0"
                    onClick={() => onSelectStudent(student)}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        onClick={() => onSelectStudent(student)}
                        className="text-xs sm:text-sm font-extrabold text-slate-900 hover:underline cursor-pointer truncate"
                      >
                        {student.name} ({student.nickname})
                      </h4>
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-slate-900 text-white">
                        K-{student.kelompok}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-medium">
                      <span>NRP {student.nrp}</span>
                      <span>•</span>
                      <span className="truncate max-w-[180px] sm:max-w-xs">{student.kos_address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 hidden md:inline-block">
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

                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    title="Google Maps"
                  >
                    <Navigation size={13} />
                  </a>

                  <button
                    type="button"
                    onClick={() => onSelectStudent(student)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
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