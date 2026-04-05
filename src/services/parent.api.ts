import apiClient from '@/lib/api';
import { ApiResponse } from '@/types';

export interface ChildInfo {
  childId: string;
  fullName: string;
  email: string;
  academicNumber: string;
  points: number;
  rank: number | null;
  linkedAt: string;
}

export interface QuizHistoryItem {
  sessionId: string;
  category: string;
  level: string;
  totalScore: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  completedAt: string;
}

export interface PointsHistoryItem {
  date: string;
  total: number;
}

export interface ChildProgress {
  child: {
    id: string;
    fullName: string;
    email: string;
    academicNumber: string;
    points: number;
    rank: number | null;
  };
  quizHistory: QuizHistoryItem[];
  pointsHistory: PointsHistoryItem[];
}

export interface LinkChildDto {
  academicNumber: string;
}

/**
 * Link a child to parent account
 * POST /api/v1/parent/link
 */
export const linkChild = async (data: LinkChildDto): Promise<any> => {
  const response = await apiClient.post<ApiResponse<any>>('/parent/link', data);
  return response.data.data;
};

/**
 * Get all children linked to parent
 * GET /api/v1/parent/children
 */
export const getChildren = async (): Promise<ChildInfo[]> => {
  const response = await apiClient.get<ApiResponse<ChildInfo[]>>('/parent/children');
  return response.data.data;
};

/**
 * Get child's progress details including quiz history and points history
 * GET /api/v1/parent/children/:id/progress
 */
export const getChildProgress = async (childId: string): Promise<ChildProgress> => {
  const response = await apiClient.get<ApiResponse<ChildProgress>>(
    `/parent/children/${childId}/progress`
  );
  return response.data.data;
};
