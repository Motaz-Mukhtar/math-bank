import { useQuery } from '@tanstack/react-query';
import { getTopLeaderboard, getFullLeaderboard } from '@/services/leaderboard.api';

/**
 * Hook to fetch top leaderboard entries (for main page)
 * Cached for 60 seconds to match backend cache
 */
export function useTopLeaderboard(limit: number = 8) {
  return useQuery({
    queryKey: ['leaderboard', 'top', limit],
    queryFn: () => getTopLeaderboard(limit),
    staleTime: 1000 * 60, // 60 seconds - matches backend cache
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });
}

/**
 * Hook to fetch full paginated leaderboard
 * Cached for 30 seconds to match backend cache
 */
export function useFullLeaderboard(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['leaderboard', 'full', page, limit],
    queryFn: () => getFullLeaderboard(page, limit),
    staleTime: 1000 * 30, // 30 seconds - matches backend cache
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    keepPreviousData: true, // Keep previous page data while fetching new page
  });
}

/**
 * Hook to fetch weekly leaderboard
 * Cached for 60 seconds
 */
export function useWeeklyLeaderboard(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['leaderboard', 'weekly', page, limit],
    queryFn: () => getFullLeaderboard(page, limit, 'weekly'),
    staleTime: 1000 * 60, // 60 seconds
    gcTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });
}
