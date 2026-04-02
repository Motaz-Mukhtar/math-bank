import apiClient from '@/lib/api';
import {
  ApiResponse,
  LeaderboardResponse,
  FullLeaderboardResponse,
  MyLeaderboardStats,
  CategoryBreakdownItem,
} from '@/types';

/** Main page — top N students, no badges, fast */
export const getLeaderboardTop = async (limit = 8): Promise<LeaderboardResponse> => {
  const res = await apiClient.get<ApiResponse<LeaderboardResponse>>(
    `/leaderboard/top?limit=${limit}`
  );
  return res.data.data;
};

/** Dedicated page — paginated full list with badges */
export const getFullLeaderboard = async (
  page = 1,
  limit = 20,
  period: 'all' | 'weekly' = 'all'
): Promise<FullLeaderboardResponse> => {
  const res = await apiClient.get<ApiResponse<FullLeaderboardResponse>>(
    `/leaderboard?page=${page}&limit=${limit}&period=${period}`
  );
  return res.data.data;
};

/** Dedicated page personal stats card */
export const getMyStats = async (): Promise<MyLeaderboardStats> => {
  const res = await apiClient.get<ApiResponse<MyLeaderboardStats>>(
    '/leaderboard/me/stats'
  );
  return res.data.data;
};

/** Row expansion — category breakdown for any student */
export const getUserCategories = async (
  userId: string
): Promise<CategoryBreakdownItem[]> => {
  const res = await apiClient.get<ApiResponse<CategoryBreakdownItem[]>>(
    `/leaderboard/users/${userId}/categories`
  );
  return res.data.data;
};

/** Legacy — kept for backward compat with useLeaderboard hook */
export const getLeaderboard = getLeaderboardTop;
