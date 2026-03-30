import apiClient from '@/lib/api';
import { ApiResponse } from '@/types';

export interface VideoCategory {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  videos?: Video[];
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  url: string;
  sortOrder: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
}

/**
 * Get all video categories with nested videos
 * GET /api/v1/video-categories
 */
export const getCategories = async (): Promise<VideoCategory[]> => {
  const response = await apiClient.get<ApiResponse<VideoCategory[]>>('/video-categories');
  return response.data.data;
};

/**
 * Get single video category by ID
 * GET /api/v1/video-categories/:id
 */
export const getCategoryById = async (id: string): Promise<VideoCategory> => {
  const response = await apiClient.get<ApiResponse<VideoCategory>>(`/video-categories/${id}`);
  return response.data.data;
};

/**
 * Get all videos with optional category filter
 * GET /api/v1/videos
 * GET /api/v1/videos?categoryId=uuid
 */
export const getVideos = async (categoryId?: string): Promise<Video[]> => {
  const url = categoryId ? `/videos?categoryId=${categoryId}` : '/videos';
  const response = await apiClient.get<ApiResponse<Video[]>>(url);
  return response.data.data;
};

/**
 * Get single video by ID
 * GET /api/v1/videos/:id
 */
export const getVideoById = async (id: string): Promise<Video> => {
  const response = await apiClient.get<ApiResponse<Video>>(`/videos/${id}`);
  return response.data.data;
};

/**
 * Create a new video category (Admin only)
 * POST /api/v1/video-categories
 */
export const createVideoCategory = async (data: {
  name: string;
  description?: string;
  sortOrder?: number;
}): Promise<VideoCategory> => {
  const response = await apiClient.post<ApiResponse<VideoCategory>>(
    '/video-categories',
    data
  );
  return response.data.data;
};

/**
 * Create a new video (Admin only)
 * POST /api/v1/videos
 */
export const createVideo = async (data: {
  title: string;
  description?: string;
  url: string;
  categoryId: string;
  sortOrder?: number;
}): Promise<Video> => {
  const response = await apiClient.post<ApiResponse<Video>>(
    '/videos',
    data
  );
  return response.data.data;
};
