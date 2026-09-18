export type TabType = 'dashboard' | 'tweeterra' | 'terraquiz' | 'terrafinder';

export type RegionType =
  | 'All'
  | 'Surabaya Timur'
  | 'Surabaya Barat'
  | 'Surabaya Selatan'
  | 'Sidoarjo'
  | 'Jabodetabek'
  | 'Malang'
  | 'Luar Jawa';

export interface StudentUser {
  id: string;
  name: string;
  nickname: string;
  nrp: string;
  kelompok: number;
  region: RegionType;
  kos_address: string;
  wa_number: string; // e.g. "6281234567890"
  instagram?: string;
  avatar: string;
  birthday?: string; // e.g. "18 September"
  is_birthday_today?: boolean;
  major: string;
  hobbies: string[];
  motto?: string;
  mastered: boolean; // For Terraquiz KPI
  is_officer?: boolean; // NEW: Penanda akun BPH / Pengurus Angkatan
  password?: string; // NEW: Password sementara / diubah user
  emergency_contact?: {
    relation: string;
    phone: string;
  };
}

export interface PostComment {
  id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  author_name: string;
  author_nickname: string;
  author_avatar: string;
  author_kelompok: number;
  content: string;
  image_url?: string;
  created_at: string;
  likes_count: number;
  is_liked?: boolean;
  comments: PostComment[];
  category: 'Pengumuman' | 'Kaderisasi' | 'Akademik' | 'Keseruan' | 'Curhat';
}

export interface AgendaItem {
  id: string;
  title: string;
  time: string;
  date: string;
  location: string;
  type: 'cadre' | 'academic' | 'personal';
  is_completed: boolean;
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Kaderisasi' | 'Akademik' | 'Darurat';
  date: string;
  countdown_target: string; // ISO date string
  priority: 'urgent' | 'important' | 'info';
  description: string;
  action_label?: string;
  action_url?: string;
}

export interface QuizQuestion {
  student: StudentUser;
  options: string[];
  correctName: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  kelompok: number;
  score: number;
  masteredCount: number;
}