// User types
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: 'STUDENT' | 'PARENT' | 'ADMIN';
  academicNumber?: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: {
    id: string;
    points: number;
    rank: number | null;
  } | null;
}

// Leaderboard types
export interface Badge {
  key: string;
  labelAr: string;
  icon: string;
  color: 'teal' | 'amber' | 'coral' | 'purple' | 'green';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  academicNumber: string | null;
  points: number;
  badges?: Badge[];
}

export interface CurrentUserRank {
  rank: number;
  points: number;
}

export interface LeaderboardResponse {
  topStudents: LeaderboardEntry[];
  currentUser: CurrentUserRank | null;
}

export interface FullLeaderboardResponse {
  entries: LeaderboardEntry[];
  meta: { page: number; limit: number; total: number; totalPages: number };
  period: 'all' | 'weekly';
  currentUser: {
    rank: number;
    total: number;
    weeklyRank: number | null;
    weeklyTotal: number;
  } | null;
}

export interface CategoryBreakdownItem {
  category: string;
  labelAr: string;
  points: number;
}

export interface MyLeaderboardStats {
  rank: number;
  total: number;
  weeklyRank: number | null;
  weeklyTotal: number;
  nextRankGap: number;
  nextRankName: string | null;
  pointsHistory: Array<{ date: string; total: number }>;
  categoryBreakdown: CategoryBreakdownItem[];
  badges: Badge[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  error: string;
  details?: Array<{
    path: string;
    message: string;
  }>;
}

// Re-export types from service files for convenience
export type { QuizCategory, QuizLevel, Question } from '@/services/quiz.api';
export type { VideoCategory, Video } from '@/services/video.api';
export type { Child, ChildProgress } from '@/services/parent.api';
export type { DashboardStats, LinkStats, UserWithPoints } from '@/services/admin.api';
