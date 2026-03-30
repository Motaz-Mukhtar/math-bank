import apiClient from '@/lib/api';
import { User, ApiResponse } from '@/types';

export interface RegisterDto {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: 'STUDENT' | 'PARENT';
  childAcademicNumber?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyEmailDto {
  email: string;
  code: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  code: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const register = async (data: RegisterDto): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(
    '/auth/register',
    data
  );
  return response.data.data;
};

/**
 * Verify email with code
 * POST /api/v1/auth/verify-email
 */
export const verifyEmail = async (data: VerifyEmailDto): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(
    '/auth/verify-email',
    data
  );
  return response.data.data;
};

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const login = async (data: LoginDto): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    '/auth/login',
    data
  );
  return response.data.data;
};

/**
 * Refresh access token
 * POST /api/v1/auth/refresh
 */
export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
    '/auth/refresh'
  );
  return response.data.data;
};

/**
 * Forgot password - send reset code
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (data: ForgotPasswordDto): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(
    '/auth/forgot-password',
    data
  );
  return response.data.data;
};

/**
 * Reset password with code
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = async (data: ResetPasswordDto): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(
    '/auth/reset-password',
    data
  );
  return response.data.data;
};

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

/**
 * Get current user profile
 * GET /api/v1/users/me
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>('/users/me');
  return response.data.data;
};

/**
 * Update current user profile
 * PUT /api/v1/users/me
 */
export const updateProfile = async (data: { fullName?: string; phone?: string }): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>('/users/me', data);
  return response.data.data;
};
