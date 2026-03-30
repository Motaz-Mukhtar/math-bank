import axios from 'axios';
import { LeaderboardResponse, ApiResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

/**
 * Get leaderboard data (top 10 students + current user rank)
 * Requires authentication
 */
export const getLeaderboard = async (token: string): Promise<LeaderboardResponse> => {
  const response = await axios.get<ApiResponse<LeaderboardResponse>>(
    `${API_URL}/leaderboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
};
