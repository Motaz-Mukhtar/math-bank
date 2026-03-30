import apiClient from '@/lib/api';
import { ApiResponse } from '@/types';
import { QuizCategory, QuizLevel } from './quiz.api';

export interface LinkChildResponse {
  childId: string;
  fullName: string;
  email: string;
  academicNumber: string | null;
  message: string;
}

export interface Child {
  childId: string;
  fullName: string;
  email: string;
  academicNumber: string | null;
  points: number;
  rank: number | null;
  linkedAt: string;
}

export interface ChildQuizHistory {
  sessionId: string;
  category: QuizCategory;
  level: QuizLevel;
  totalScore: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  completedAt: string;
}

export interface ChildProgress {
  child: {
    id: string;
    fullName: string;
    email: string;
    academicNumber: string | null;
    points: number;
    rank: number | null;
  };
  quizHistory: ChildQuizHistory[];
}

/**
 * Link a child to parent account by email
 * POST /api/v1/parent/link
 */
export const linkChild = async (childEmail: string): Promise<LinkChildResponse> => {
  const response = await apiClient.post<ApiResponse<LinkChildResponse>>(
    '/parent/link',
    { childEmail }
  );
  return response.data.data;
};

/**
 * Get all children linked to parent account
 * GET /api/v1/parent/children
 */
export const getChildren = async (): Promise<Child[]> => {
  const response = await apiClient.get<ApiResponse<Child[]>>('/parent/children');
  return response.data.data;
};

/**
 * Get detailed progress for a specific child
 * GET /api/v1/parent/children/:id/progress
 */
export const getChildProgress = async (childId: string): Promise<ChildProgress> => {
  const response = await apiClient.get<ApiResponse<ChildProgress>>(
    `/parent/children/${childId}/progress`
  );
  return response.data.data;
};
