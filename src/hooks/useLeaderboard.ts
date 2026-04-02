import { useState, useEffect } from 'react';
import { LeaderboardResponse } from '@/types';
import { getLeaderboardTop } from '@/services/leaderboard.api';

export const useLeaderboard = () => {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLeaderboardTop(8);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل لوحة المتصدرين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaderboard(); }, []);

  return { data, loading, error, refetch: fetchLeaderboard };
};
