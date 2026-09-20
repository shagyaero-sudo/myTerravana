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
  Compass,
  ArrowLeft,
  X,
} from 'lucide-react';
import { StudentUser, RegionType } from '../types';

interface TerrafinderViewProps {
  students: StudentUser[];
  onSelectStudent: (student: StudentUser) => void;
  onToggleMastered?: (studentId: string) => void;
  onNavigateTab?: (tabId: string) => void;
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

// Helper Format Tanggal Indonesia
const formatIndonesianDate = (date: Date) => {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const TerrafinderView: React.FC<TerrafinderViewProps> = ({
  students,
  onSelectStudent,
  onNavigateTab,
}) => {
  const today = new Date();
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
        const matchNrp = student.nrp ? student.nrp.toLowerCase().includes(q) : false;
        const matchAddress = student.kos_address ? student.kos_address.toLowerCase().includes(q) : false;

        if (!matchName && !matchNick && !matchNrp && !matchAddress) {
          return false;
        }
      }

      return true;
    });
  }, [students, searchQuery, selectedRegion, selectedKelompok]);

  return (
    <div id="terrafinder-view-root" className="max-w-md mx-auto space-y-4 pt-2 pb-36 font-sans">
      {/* 1. TOP BAR MODEL TASKSVIEW */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab('home')}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors shrink-0"
          title="Kembali ke Dashboard Home"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="px-4 py-2 rounded-full bg-white border border-slate-200 shadow-2xs text-center">
          <span className="text-xs font-black text-slate-900 tracking-tight">
            Today: {formatIndonesianDate(today)}
          </span>
        </div>

        {/* View mode toggle (Grid vs List) */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              viewMode === 'grid'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Tampilan Grid"
          >
            <Grid size={14} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              viewMode === 'list'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Tampilan Daftar"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* 2. TITLE & DESKRIPSI RINGKAS */}
      <div className="pt-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
          Terrafinder
        </h1>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
          Directory
        </h1>
        <p className="text-xs text-slate-400 font-bold mt-2">
          Direktori & kontak mahasiswa Terravana 2026.
        </p>
      </div>

      {/* 3. SEARCH BAR & CUSTOM DROPDOWN MYTERRAVANA */}
      <div className="bg-white rounded-[28px] border border-slate-100 p-3.5 shadow-xs space-y-2.5">
        <div className="flex flex-col gap-2">
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
              className="w-full pl-9 pr-8 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* CUSTOM DROPDOWN KELOMPOK MYTERRAVANA */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsKelompokDropdownOpen(!isKelompokDropdownOpen)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between gap-2 transition-all"
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
              <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-2xl border border-slate-100 shadow-2xl py-1.5 z-30 max-h-56 overflow-y-auto font-bold text-xs text-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedKelompok('all');
                    setIsKelompokDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 transition-colors ${
                    selectedKelompok === 'all' ? 'text-purple-600 bg-purple-50/50' : ''
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
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 transition-colors ${
                        selectedKelompok === val ? 'text-purple-600 bg-purple-50/50' : ''
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
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100/80">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mr-0.5 flex items-center gap-1">
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
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#1E1B26] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. RESULT COUNT & CLEAR SEARCH */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold px-1">
        <span>
          Menampilkan <strong className="text-slate-900">{filteredStudents.length}</strong> mahasiswa
        </span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-purple-600 hover:text-purple-800 underline font-black"
          >
            Hapus Pencarian
          </button>
        )}
      </div>

      {/* 5. STUDENT CARDS CONTAINER */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-slate-200 p-6 space-y-2">
          <Users size={32} className="mx-auto text-slate-300" />
          <h4 className="text-sm font-black text-slate-700">Mahasiswa Tidak Ditemukan</h4>
          <p className="text-xs text-slate-400 font-medium">
            Coba kata kunci nama lain atau reset filter wilayah domisili.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW (CHAT WA & MAPS SAMA UKURAN, DETAIL KECIL) */
        <div
          id="student-cards-grid"
          className="space-y-3"
        >
          {filteredStudents.map((student) => {
            const waUrl = `https://wa.me/${student.wa_number}?text=${encodeURIComponent(
              `Halo ${student.nickname}! Aku dari angkatan Terravana 2026 mau koordinasi yaa 🙌`
            )}`;
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              student.kos_address || 'ITS Surabaya'
            )}`;

            return (
              <div
                key={student.id}
                id={`student-card-${student.id}`}
                className="bg-white rounded-[26px] border border-slate-100/90 p-4 shadow-xs space-y-3 relative"
              >
                <div>
                  {/* Avatar & Info Utama */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-100 cursor-pointer"
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

                      <div className="min-w-0 space-y-0.5">
                        <h4
                          onClick={() => onSelectStudent(student)}
                          className="text-sm font-black text-slate-900 hover:text-purple-600 transition-colors cursor-pointer truncate leading-tight"
                        >
                          {student.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <span className="text-purple-600">"{student.nickname}"</span>
                          <span>•</span>
                          <span>NRP {student.nrp ? student.nrp.slice(-4) : '1001'}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-900 text-white shrink-0">
                      K-{student.kelompok}
                    </span>
                  </div>

                  {/* Alamat & Domisili (SATU BARIS RAPI) */}
                  <div className="mt-2.5 bg-slate-50 rounded-xl p-2.5 border border-slate-100/80 flex items-center justify-between gap-2 text-[10px] font-bold text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate leading-none">{student.kos_address || 'Jl. Gebang Wetan No. 24'}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200/60 text-slate-700 text-[9px] font-black shrink-0 leading-none">
                      {student.region || 'Surabaya'}
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons (WA & MAPS FLEX-1 SAMAAAN, DETAIL KECIL) */}
                <div className="pt-0.5 flex items-center gap-2">
                  {/* CHAT WA (FLEX-1) */}
                  <a
                    id={`btn-wa-${student.id}`}
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl text-xs font-black text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-2xs flex items-center justify-center gap-1"
                  >
                    <MessageCircle size={13} />
                    <span>Chat WA</span>
                  </a>

                  {/* MAPS (FLEX-1 - UKURAN SAMA DENGAN WA) */}
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs flex items-center justify-center gap-1"
                    title="Buka Lokasi di Google Maps"
                  >
                    <Compass size={13} />
                    <span>Maps</span>
                  </a>

                  {/* DETAIL (RINGKAS/KECIL DI POJOK) */}
                  <button
                    type="button"
                    onClick={() => onSelectStudent(student)}
                    className="px-2.5 py-2 rounded-xl text-[10px] font-black text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
                  >
                    Detail &gt;
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
          className="bg-white rounded-[28px] border border-slate-100 divide-y divide-slate-100 shadow-xs overflow-hidden"
        >
          {filteredStudents.map((student) => {
            const waUrl = `https://wa.me/${student.wa_number}?text=${encodeURIComponent(
              `Halo ${student.nickname}! Aku dari angkatan Terravana 2026 mau koordinasi yaa 🙌`
            )}`;
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              student.kos_address || 'ITS Surabaya'
            )}`;

            return (
              <div
                key={student.id}
                id={`student-list-item-${student.id}`}
                className="p-3.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-purple-100 cursor-pointer shrink-0"
                    onClick={() => onSelectStudent(student)}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4
                        onClick={() => onSelectStudent(student)}
                        className="text-xs font-black text-slate-900 hover:text-purple-600 transition-colors cursor-pointer truncate"
                      >
                        {student.name}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-slate-900 text-white shrink-0">
                        K-{student.kelompok}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400 font-bold truncate">
                      <span>"{student.nickname}"</span>
                      <span>•</span>
                      <span className="truncate">{student.kos_address || 'Surabaya'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                    title="Chat WA"
                  >
                    <MessageCircle size={13} />
                  </a>

                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    title="Google Maps"
                  >
                    <Compass size={13} />
                  </a>

                  <button
                    type="button"
                    onClick={() => onSelectStudent(student)}
                    className="px-2 py-2 rounded-xl text-[10px] font-black text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Detail &gt;
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