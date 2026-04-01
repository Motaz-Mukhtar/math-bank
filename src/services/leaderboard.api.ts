import axios from 'axios';
import { LeaderboardResponse, ApiResponse } from '@/types';
import apiClient from '@/lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

/**
 * Get leaderboard data (top 10 students + current user rank)
 * Requires authentication
 */
export const getLeaderboard = async (): Promise<LeaderboardResponse> => {
  const response = await apiClient.get<ApiResponse<LeaderboardResponse>>('/leaderboard');

  return response.data.data;
};
