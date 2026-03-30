import { useState, useEffect } from 'react';
import { LeaderboardResponse } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useLeaderboard = () => {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call when backend is connected
      // For now, using mock data
      const mockData: LeaderboardResponse = {
        topStudents: [
          { rank: 1, userId: '1', fullName: 'عبدالله محمد', academicNumber: 'std-1234567890', points: 385 },
          { rank: 2, userId: '2', fullName: 'نورة السالم', academicNumber: 'std-2345678901', points: 340 },
          { rank: 3, userId: '3', fullName: 'فهد العتيبي', academicNumber: 'std-3456789012', points: 312 },
          { rank: 4, userId: '4', fullName: 'ريم الحربي', academicNumber: 'std-4567890123', points: 287 },
          { rank: 5, userId: '5', fullName: 'سلطان الدوسري', academicNumber: 'std-5678901234', points: 265 },
          { rank: 6, userId: '6', fullName: 'لمى الشمري', academicNumber: 'std-6789012345', points: 241 },
          { rank: 7, userId: '7', fullName: 'خالد الغامدي', academicNumber: 'std-7890123456', points: 223 },
        ],
        currentUser: null, // Will be populated if user is logged in as STUDENT
      };

      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل لوحة المتصدرين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return { data, loading, error, refetch: fetchLeaderboard };
};
