import { useQuery } from '@tanstack/react-query';
import {
  getVideos,
  getCategories,
  getCategoriesWithVideos,
  getAllCategoriesNoPagination,
} from '@/services/video.api';

/**
 * Hook to fetch videos with pagination and optional filters
 * Cached for 3 minutes
 */
export function useVideos(
  page: number = 1,
  limit: number = 10,
  categoryId?: string,
  search?: string
) {
  return useQuery({
    queryKey: ['videos', page, limit, categoryId, search],
    queryFn: () => getVideos(page, limit, categoryId, search),
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    keepPreviousData: true,
  });
}

/**
 * Hook to fetch video categories with pagination
 * Cached for 5 minutes
 */
export function useVideoCategories(
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  return useQuery({
    queryKey: ['video-categories', page, limit, search],
    queryFn: () => getCategories(page, limit, search),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    keepPreviousData: true,
  });
}

/**
 * Hook to fetch all categories with their videos (no pagination)
 * Perfect for displaying videos grouped by category
 * Cached for 5 minutes
 */
export function useCategoriesWithVideos() {
  return useQuery({
    queryKey: ['categories-with-videos'],
    queryFn: () => getCategoriesWithVideos(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Hook to fetch all categories without pagination (for dropdowns)
 * Cached for 10 minutes
 */
export function useAllCategories() {
  return useQuery({
    queryKey: ['video-categories', 'all'],
    queryFn: () => getAllCategoriesNoPagination(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}
