export type TabType = 'dashboard' | 'tasks' | 'terraquiz' | 'terrafinder';

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
  birthday?: string;
  is_birthday_today?: boolean;
  major: string;
  hobbies: string[];
  motto?: string;
  mastered: boolean;
  is_officer?: boolean;
  class_code?: 'A' | 'B' | 'C' | 'D';
  password?: string;
  emergency_contact?: {
    relation: string;
    phone: string;
  };
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
  countdown_target: string;
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