import apiClient from '@/lib/api';
import { ApiResponse } from '@/types';

export interface VideoCategory {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    videos: number;
  };
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

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedVideosResponse {
  videos: Video[];
  pagination: PaginationMeta;
}

export interface PaginatedCategoriesResponse {
  categories: VideoCategory[];
  pagination: PaginationMeta;
}

export interface CategoryWithVideos {
  categoryId: string;
  categoryName: string;
  categoryDescription: string | null;
  sortOrder: number;
  videos: Video[];
}

/**
 * Get all video categories with nested videos and pagination
 * GET /api/v1/video-categories?page=1&limit=10&search=query
 */
export const getCategories = async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedCategoriesResponse> => {
  let url = `/video-categories?page=${page}&limit=${limit}`;
  if (search?.trim()) {
    url += `&search=${encodeURIComponent(search.trim())}`;
  }
  const response = await apiClient.get<ApiResponse<PaginatedCategoriesResponse>>(url);
  return response.data.data;
};

/**
 * Get all categories without pagination (for dropdowns)
 * GET /api/v1/video-categories/list/all
 */
export const getAllCategoriesNoPagination = async (): Promise<{ categories: VideoCategory[] }> => {
  const response = await apiClient.get<ApiResponse<{ categories: VideoCategory[] }>>(
    '/video-categories/list/all'
  );
  return response.data.data;
};

/**
 * Get all categories with their videos (no pagination)
 * Returns categories grouped with their videos for display
 * GET /api/v1/video-categories/videos
 */
export const getCategoriesWithVideos = async (): Promise<CategoryWithVideos[]> => {
  const response = await apiClient.get<ApiResponse<CategoryWithVideos[]>>(
    '/video-categories/videos'
  );
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
 * Get all videos with optional category filter, search, and pagination
 * GET /api/v1/videos?page=1&limit=10
 * GET /api/v1/videos?categoryId=uuid&page=1&limit=10
 * GET /api/v1/videos?search=query&page=1&limit=10
 */
export const getVideos = async (
  page: number = 1,
  limit: number = 10,
  categoryId?: string,
  search?: string
): Promise<PaginatedVideosResponse> => {
  let url = `/videos?page=${page}&limit=${limit}`;
  if (categoryId) {
    url += `&categoryId=${categoryId}`;
  }
  if (search?.trim()) {
    url += `&search=${search.trim()}`;
  }
  const response = await apiClient.get<ApiResponse<PaginatedVideosResponse>>(url);
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

/**
 * Update video category (Admin only)
 * PUT /api/v1/video-categories/:id
 */
export const updateVideoCategory = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    sortOrder?: number;
  }
): Promise<VideoCategory> => {
  const response = await apiClient.put<ApiResponse<VideoCategory>>(
    `/video-categories/${id}`,
    data
  );
  return response.data.data;
};

/**
 * Delete video category (Admin only)
 * DELETE /api/v1/video-categories/:id
 */
export const deleteVideoCategory = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<ApiResponse<{ message: string }>>(
    `/video-categories/${id}`
  );
  return response.data.data;
};

/**
 * Update video (Admin only)
 * PUT /api/v1/videos/:id
 */
export const updateVideo = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    url?: string;
    categoryId?: string;
    sortOrder?: number;
  }
): Promise<Video> => {
  const response = await apiClient.put<ApiResponse<Video>>(
    `/videos/${id}`,
    data
  );
  return response.data.data;
};

/**
 * Delete video (Admin only)
 * DELETE /api/v1/videos/:id
 */
export const deleteVideo = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<ApiResponse<{ message: string }>>(
    `/videos/${id}`
  );
  return response.data.data;
};

/**
 * Move video to different category (Admin only)
 * PATCH /api/v1/videos/:id/move
 */
export const moveVideo = async (
  id: string,
  categoryId: string
): Promise<Video> => {
  const response = await apiClient.patch<ApiResponse<Video>>(
    `/videos/${id}/move`,
    { categoryId }
  );
  return response.data.data;
};
