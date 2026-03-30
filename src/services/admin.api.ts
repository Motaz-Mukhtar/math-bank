import apiClient from '@/lib/api';
import { ApiResponse, User } from '@/types';

export interface BackendDashboardStats {
  totalAccounts: number;
  totalStudents: number;
  totalParents: number;
  linkedStudents: number;
  registeredThisWeek: number;
  highestPoints: number;
  avgPoints: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalParents: number;
  linkedStudents: number;
  recentRegistrations: number;
  averagePoints: number;
  totalLinks: number;
  linkedParents: number;
  topStudents: Array<{ name: string; points: number }>;
  registrationChart: Array<{ date: string; students: number; parents: number }>;
  pointsDistribution: Array<{ range: string; count: number }>;
}

export interface LinkStats {
  totalLinks: number;
  linkedParents: number;
  linkedStudents: number;
  linkingRate: number;
}

export interface RegistrationChartData {
  date: string;
  students: number;
  parents: number;
}

export interface TopStudent {
  id: string;
  fullName: string;
  academicNumber: string | null;
  total: number;
}

export interface PointsDistribution {
  range: string;
  count: number;
}

export interface UserWithPoints extends User {
  points: number;
}

export interface PaginatedUsers {
  users: UserWithPoints[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: 'STUDENT' | 'PARENT' | 'ADMIN';
  search?: string;
}

export interface UpdateUserDto {
  fullName?: string;
  points?: number;
}

/**
 * Get dashboard statistics
 * GET /api/v1/admin/dashboard/stats
 */
export const getDashboardStats = async (): Promise<BackendDashboardStats> => {
  const response = await apiClient.get<ApiResponse<BackendDashboardStats>>(
    '/admin/dashboard/stats'
  );
  return response.data.data;
};

/**
 * Get parent-child link statistics
 * GET /api/v1/admin/dashboard/link-stats
 */
export const getLinkStats = async (): Promise<LinkStats> => {
  const response = await apiClient.get<ApiResponse<LinkStats>>(
    '/admin/dashboard/link-stats'
  );
  return response.data.data;
};

/**
 * Get registration chart data
 * GET /api/v1/admin/dashboard/registration-chart?days=30
 */
export const getRegistrationChart = async (days: number = 30): Promise<RegistrationChartData[]> => {
  const response = await apiClient.get<ApiResponse<RegistrationChartData[]>>(
    `/admin/dashboard/registration-chart?days=${days}`
  );
  return response.data.data;
};

/**
 * Get top students by points
 * GET /api/v1/admin/dashboard/top-students?limit=10
 */
export const getTopStudents = async (limit: number = 10): Promise<TopStudent[]> => {
  const response = await apiClient.get<ApiResponse<TopStudent[]>>(
    `/admin/dashboard/top-students?limit=${limit}`
  );
  return response.data.data;
};

/**
 * Get points distribution for histogram
 * GET /api/v1/admin/dashboard/points-distribution
 */
export const getPointsDistribution = async (): Promise<PointsDistribution[]> => {
  const response = await apiClient.get<ApiResponse<PointsDistribution[]>>(
    '/admin/dashboard/points-distribution'
  );
  return response.data.data;
};

/**
 * Get paginated users with optional filters
 * GET /api/v1/admin/users?page=1&limit=10&role=STUDENT&search=ahmed
 */
export const getUsers = async (params: GetUsersParams = {}): Promise<PaginatedUsers> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.role) queryParams.append('role', params.role);
  if (params.search) queryParams.append('search', params.search);

  const url = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await apiClient.get<ApiResponse<PaginatedUsers>>(url);
  return response.data.data;
};

/**
 * Update user information
 * PUT /api/v1/admin/users/:id
 */
export const updateUser = async (id: string, data: UpdateUserDto): Promise<UserWithPoints> => {
  const response = await apiClient.put<ApiResponse<UserWithPoints>>(
    `/admin/users/${id}`,
    data
  );
  return response.data.data;
};

/**
 * Delete user
 * DELETE /api/v1/admin/users/:id
 */
export const deleteUser = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<ApiResponse<{ message: string }>>(
    `/admin/users/${id}`
  );
  return response.data.data;
};

/**
 * Export users for CSV generation
 * GET /api/v1/admin/users/export?type=students
 */
export const exportUsers = async (type: 'students' | 'parents' | 'all'): Promise<UserWithPoints[]> => {
  const response = await apiClient.get<ApiResponse<UserWithPoints[]>>(
    `/admin/users/export?type=${type}`
  );
  return response.data.data;
};
