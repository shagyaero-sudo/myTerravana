import { StudentUser, Post, AgendaItem, Announcement, LeaderboardEntry } from '../types';

export const CURRENT_USER: StudentUser = {
  id: 'usr-001',
  name: 'Kalandra Raditya Pratama',
  nickname: 'Kalan',
  nrp: '5025211042',
  kelompok: 4,
  region: 'Surabaya Timur',
  kos_address: 'Kost Graha Keputih Permai No. 12, Sukolilo',
  wa_number: '6281234567890',
  instagram: 'kalandra.radit',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  major: 'Teknik Informatika',
  hobbies: ['Fotografi', 'Badminton', 'Ngopi Santai'],
  motto: 'Satu angkatan, satu suara, selesai bersama.',
  mastered: true,
};

export const MOCK_STUDENTS: StudentUser[] = [
  {
    id: 's-01',
    name: 'Alika Nabila Putri',
    nickname: 'Alika',
    nrp: '5025211001',
    kelompok: 1,
    region: 'Surabaya Timur',
    kos_address: 'Jl. Gebang Wetan No. 24, Sukolilo',
    wa_number: '6281122334455',
    instagram: 'alikanbl',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    birthday: '18 September',
    is_birthday_today: true,
    major: 'Teknik Informatika',
    hobbies: ['UI Design', 'Baking', 'K-Pop'],
    motto: 'Keep iterating until it feels effortless.',
    mastered: true,
    emergency_contact: { relation: 'Kakak', phone: '628122334455' }
  },
  {
    id: 's-02',
    name: 'Bima Arya Wicaksono',
    nickname: 'Bima',
    nrp: '5025211015',
    kelompok: 1,
    region: 'Sidoarjo',
    kos_address: 'Waru Indah Regency Blok B4, Sidoarjo',
    wa_number: '6281298765432',
    instagram: 'bimaarya.w',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    major: 'Sistem Informasi',
    hobbies: ['Basketball', 'Mechanical Keyboards', 'Robotics'],
    motto: 'Bekerja cerdas sebelum bekerja keras.',
    mastered: true,
    emergency_contact: { relation: 'Orang Tua', phone: '628139876543' }
  },
  {
    id: 's-03',
    name: 'Clarissa Maharani Dewi',
    nickname: 'Clara',
    nrp: '5025211028',
    kelompok: 2,
    region: 'Jabodetabek',
    kos_address: 'Pondok Melati Indah, Keputih Gg. 1B',
    wa_number: '6281345678901',
    instagram: 'clarissamhrn',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    major: 'Teknologi Informasi',
    hobbies: ['Digital Art', 'Podcasting', 'Film Photography'],
    motto: 'Be the light wherever you are placed.',
    mastered: false,
    emergency_contact: { relation: 'Ibu', phone: '6281356789012' }
  },
  {
    id: 's-04',
    name: 'Daffa Rizky Ramadhan',
    nickname: 'Daffa',
    nrp: '5025211033',
    kelompok: 2,
    region: 'Surabaya Barat',
    kos_address: 'CitraLand Villa Taman Telaga, Lidah Kulon',
    wa_number: '6281233445566',
    instagram: 'daffa.rzky',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    major: 'Teknik Informatika',
    hobbies: ['Competitive Programming', 'Chess', 'Futsal'],
    motto: 'Algorithm is poetry in logic.',
    mastered: true,
    emergency_contact: { relation: 'Ayah', phone: '6281299887766' }
  },
  {
    id: 's-05',
    name: 'Elvira Zahra Khairunnisa',
    nickname: 'Elvira',
    nrp: '5025211047',
    kelompok: 3,
    region: 'Malang',
    kos_address: 'Graha Sakura Residence, Mulyorejo No. 8',
    wa_number: '6281567890123',
    instagram: 'elvirazahra',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    major: 'Sistem Informasi',
    hobbies: ['Public Speaking', 'Reading', 'Acoustic Guitar'],
    motto: 'Empati di atas segalanya.',
    mastered: false,
    emergency_contact: { relation: 'Ibu', phone: '6281578901234' }
  },
  {
    id: 's-06',
    name: 'Farhan Maulana Hakim',
    nickname: 'Farhan',
    nrp: '5025211059',
    kelompok: 3,
    region: 'Surabaya Timur',
    kos_address: 'Asrama Mahasiswa Tower C-302, Gebang',
    wa_number: '6281789012345',
    instagram: 'farhanm.hakim',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    major: 'Sains Data',
    hobbies: ['Data Analytics', 'Gaming', 'Coffee Cupping'],
    motto: 'In God we trust, all others must bring data.',
    mastered: true,
    emergency_contact: { relation: 'Kakak', phone: '628178900012' }
  },
  {
    id: 's-07',
    name: 'Gisella Amanda Setiawan',
    nickname: 'Gisel',
    nrp: '5025211064',
    kelompok: 4,
    region: 'Surabaya Selatan',
    kos_address: 'Jl. Kutisari Indah Barat No. 19, Tenggilis',
    wa_number: '6281890123456',
    instagram: 'gisellasetiawan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    major: 'Teknologi Informasi',
    hobbies: ['Web Development', 'Pilates', 'Organizing Events'],
    motto: 'Consistency beats talent when talent slacks.',
    mastered: false,
    emergency_contact: { relation: 'Ayah', phone: '628189012300' }
  },
  {
    id: 's-08',
    name: 'Hafizh Nurrohman',
    nickname: 'Hafizh',
    nrp: '5025211072',
    kelompok: 4,
    region: 'Jabodetabek',
    kos_address: 'Kost D’Corner Keputih Timur IV No. 5',
    wa_number: '6281901234567',
    instagram: 'hafizhnurrohman',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    major: 'Teknik Informatika',
    hobbies: ['Running', 'Cloud Architecture', 'Volunteering'],
    motto: 'Run your own race with joy.',
    mastered: true,
    emergency_contact: { relation: 'Ibu', phone: '628190123499' }
  },
  {
    id: 's-09',
    name: 'Indira Callista Putri',
    nickname: 'Indi',
    nrp: '5025211081',
    kelompok: 5,
    region: 'Luar Jawa',
    kos_address: 'Dormitory Jasmine Sukolilo Blok D-11',
    wa_number: '6282123456789',
    instagram: 'indiracallista',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    major: 'Sistem Informasi',
    hobbies: ['Traditional Dance', 'Debate', 'Badminton'],
    motto: 'Biar jauh dari rumah, semangat pantang punah!',
    mastered: false,
    emergency_contact: { relation: 'Wali', phone: '6282123456700' }
  },
  {
    id: 's-10',
    name: 'Jonathan Kevin Prasetyo',
    nickname: 'Kevin',
    nrp: '5025211095',
    kelompok: 5,
    region: 'Surabaya Barat',
    kos_address: 'Pakuwon City Palm Beach Blok BB2, Sukolilo',
    wa_number: '6282234567890',
    instagram: 'jkevinprasetyo',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    major: 'Teknik Informatika',
    hobbies: ['Mobile Dev', 'Bouldering', 'Mechanical Puzzles'],
    motto: 'Build things people actually love.',
    mastered: true,
    emergency_contact: { relation: 'Ayah', phone: '6282234567811' }
  },
  {
    id: 's-11',
    name: 'Kezia Aurelia Simanjuntak',
    nickname: 'Kezia',
    nrp: '5025211103',
    kelompok: 6,
    region: 'Luar Jawa',
    kos_address: 'Griya Asri Keputih Tegal No. 33',
    wa_number: '6282345678901',
    instagram: 'kezia.aureliaa',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    major: 'Sains Data',
    hobbies: ['Violin', 'Reading Philosophy', 'Culinary Hunt'],
    motto: 'Harmony in diversity.',
    mastered: false,
    emergency_contact: { relation: 'Tante', phone: '6282345678999' }
  },
  {
    id: 's-12',
    name: 'Luthfi Fauzan Nugraha',
    nickname: 'Luthfi',
    nrp: '5025211118',
    kelompok: 6,
    region: 'Jabodetabek',
    kos_address: 'Pondok An-Nur Gebang Lor No. 17',
    wa_number: '6282456789012',
    instagram: 'luthfauzan',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    major: 'Teknologi Informasi',
    hobbies: ['Cybersecurity', 'Drone Racing', 'Camping'],
    motto: 'Security is not a product, but a process.',
    mastered: true,
    emergency_contact: { relation: 'Kakak', phone: '6282456789000' }
  }
];

export const MOCK_ANNOUNCEMENT: Announcement = {
  id: 'ann-01',
  title: 'Grand Briefing Kaderisasi Terravana: Evaluasi Nilai Dasar & Persiapan Sidang Angkatan',
  category: 'Kaderisasi',
  date: 'Besok Lusa, 19:30 WIB',
  countdown_target: new Date(Date.now() + 48 * 3600 * 1000 + 15 * 60 * 1000).toISOString(),
  priority: 'urgent',
  description: 'Wajib dihadiri seluruh 170 mahasiswa Terravana 2026. Dresscode: PDH Angkatan / Kemeja Putih rapi. Membawa buku angkatan fisik & resume nilai esai.',
  action_label: 'Lihat Ketentuan & Link Zoom',
};

export const MOCK_AGENDAS: AgendaItem[] = [
  {
    id: 'ag-01',
    title: 'Simulasi Evaluasi Terbuka Kaderisasi #2',
    time: '19:30 - 21:30 WIB',
    date: 'Hari ini',
    location: 'Teater A Gedung Pascasarjana',
    type: 'cadre',
    is_completed: false,
    notes: 'Presensi dibuka 15 menit sebelum forum.'
  },
  {
    id: 'ag-02',
    title: 'Deadline Pengumpulan Esai Komparasi Nilai',
    time: '23:59 WIB',
    date: 'Besok',
    location: 'Google Classroom Angkatan',
    type: 'cadre',
    is_completed: false,
    notes: 'Format PDF: Kelompok_NamaLengkap_NRP.pdf'
  },
  {
    id: 'ag-03',
    title: 'Kuis Struktur Data & Algoritma (Materi Graph)',
    time: '08:00 - 09:40 WIB',
    date: '20 Sep 2026',
    location: 'Lab Pemrograman 2',
    type: 'academic',
    is_completed: false,
    notes: 'Bawa kartu ujian mahasiswa.'
  },
  {
    id: 'ag-04',
    title: 'Briefing Internal Kelompok 4 (Review Anggota)',
    time: '16:00 WIB',
    date: '21 Sep 2026',
    location: 'Kantin Pusat Lt. 2',
    type: 'personal',
    is_completed: true,
    notes: 'Review penghafalan wajah dan biodata teman kelompok.'
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Alika Nabila Putri',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    kelompok: 1,
    score: 1680,
    masteredCount: 168
  },
  {
    rank: 2,
    name: 'Daffa Rizky Ramadhan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    kelompok: 2,
    score: 1590,
    masteredCount: 159
  },
  {
    rank: 3,
    name: 'Farhan Maulana Hakim',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    kelompok: 3,
    score: 1420,
    masteredCount: 142
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    author_id: 's-01',
    author_name: 'Alika Nabila Putri',
    author_nickname: 'alikanbl',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    author_kelompok: 1,
    content: 'Teman-teman kelompok 1 sampai 12 jangan lupa latihan Terraquiz yaa! Target KPI angkatan minggu ini 100% harus hafal wajah & nama lengkap 170 anak sebelum Sidang Kader ✊ Tetap semangat!',
    created_at: '24 menit yang lalu',
    likes_count: 38,
    is_liked: true,
    comments: [
      {
        id: 'c-1',
        author_name: 'Bima Arya',
        author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        content: 'Gaspol! Aku udah hafal 120 anak hari ini 🔥',
        created_at: '18 menit yang lalu'
      },
      {
        id: 'c-2',
        author_name: 'Hafizh Nurrohman',
        author_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
        content: 'Foto-fotonya udah update semua kan di Terraquiz?',
        created_at: '10 menit yang lalu'
      }
    ],
    category: 'Kaderisasi'
  },
  {
    id: 'post-2',
    author_id: 's-04',
    author_name: 'Daffa Rizky Ramadhan',
    author_nickname: 'daffarizky',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    author_kelompok: 2,
    content: 'Btw yang kosan di daerah Gebang / Keputih mau tebengan bareng ke Teater Pasca nanti malem jam 19.00 kabarin ya! Motor masih kosong satu slot. DM atau WA langsung aja.',
    created_at: '1 jam yang lalu',
    likes_count: 24,
    is_liked: false,
    comments: [
      {
        id: 'c-3',
        author_name: 'Kezia Aurelia',
        author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        content: 'Daf aku mau ikut nebeng dari gang 1B dong!',
        created_at: '45 menit yang lalu'
      }
    ],
    category: 'Keseruan'
  },
  {
    id: 'post-3',
    author_id: 's-06',
    author_name: 'Farhan Maulana Hakim',
    author_nickname: 'farhanm',
    author_avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    author_kelompok: 3,
    content: 'Format esai tugas kaderisasi sudah diperbarui panitia di Google Classroom: Margin 3-3-3-3, font Times New Roman 12, spasi 1.15. Jangan ada yang typo nama angkatan "TERRAVANA 2026" ya kawan-kawan.',
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    created_at: '3 jam yang lalu',
    likes_count: 52,
    is_liked: true,
    comments: [],
    category: 'Pengumuman'
  },
  {
    id: 'post-4',
    author_id: 's-03',
    author_name: 'Clarissa Maharani Dewi',
    author_nickname: 'claramhrn',
    author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    author_kelompok: 2,
    content: 'Capek banget seharian revisi tugas esai + ngapalin nama 170 anak, tapi ngeliat progress bar cohort pulse naik terus jadi semangat lagi 🥹 We got this Terravana!',
    created_at: '5 jam yang lalu',
    likes_count: 46,
    is_liked: false,
    comments: [
      {
        id: 'c-4',
        author_name: 'Alika Nabila',
        author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        content: 'Peluk jauh Claraa! Tinggal 2 minggu lagi kita wisuda kader bareng 🤍',
        created_at: '4 jam yang lalu'
      }
    ],
    category: 'Curhat'
  }
];
