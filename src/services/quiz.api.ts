import apiClient from '@/lib/api';
import { ApiResponse } from '@/types';

export type QuizCategory = 
  | 'ADDITION' 
  | 'SUBTRACTION' 
  | 'MULTIPLICATION' 
  | 'DIVISION' 
  | 'COMPARISON' 
  | 'GEOMETRY';

export type QuizLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface Question {
  id: string;
  text: string;
  questionType: string;
  options: any; // Type-specific options structure
  category: QuizCategory;
  level: QuizLevel;
  points: number;
}

export interface StartSessionResponse {
  sessionId: string;
  category: QuizCategory;
  level: QuizLevel;
  totalQuestions: number;
  currentQuestion: number;
  question: Question;
}

export interface NextQuestionResponse {
  currentQuestion: number;
  totalQuestions: number;
  question: Question;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  pointsEarned: number;
  newTotal: number;
  sessionScore: number;
  correctAnswer: string;
  isSessionComplete: boolean;
  questionsAnswered: number;
  totalQuestions: number;
}

export interface CompleteSessionResponse {
  sessionId: string;
  category: QuizCategory;
  level: QuizLevel;
  totalScore: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  completedAt: string;
}

export interface QuizHistoryItem {
  sessionId: string;
  category: QuizCategory;
  level: QuizLevel;
  totalScore: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  completedAt: string;
}

/**
 * Start a new quiz session
 * POST /api/v1/quiz/sessions
 */
export const startSession = async (
  category: QuizCategory,
  level: QuizLevel
): Promise<StartSessionResponse> => {
  const response = await apiClient.post<ApiResponse<StartSessionResponse>>(
    '/quiz/sessions',
    { category, level }
  );
  return response.data.data;
};

/**
 * Get next question in session
 * GET /api/v1/quiz/sessions/:id/next
 */
export const getNextQuestion = async (sessionId: string): Promise<NextQuestionResponse> => {
  const response = await apiClient.get<ApiResponse<NextQuestionResponse>>(
    `/quiz/sessions/${sessionId}/next`
  );
  return response.data.data;
};

/**
 * Submit answer for a question
 * POST /api/v1/quiz/sessions/:id/answer
 */
export const submitAnswer = async (
  sessionId: string,
  questionId: string,
  userAnswer: string
): Promise<SubmitAnswerResponse> => {
  const response = await apiClient.post<ApiResponse<SubmitAnswerResponse>>(
    `/quiz/sessions/${sessionId}/answer`,
    { questionId, userAnswer }
  );
  return response.data.data;
};

/**
 * Complete quiz session
 * POST /api/v1/quiz/sessions/:id/complete
 */
export const completeSession = async (sessionId: string): Promise<CompleteSessionResponse> => {
  const response = await apiClient.post<ApiResponse<CompleteSessionResponse>>(
    `/quiz/sessions/${sessionId}/complete`
  );
  return response.data.data;
};

/**
 * Get quiz history (last 10 completed sessions)
 * GET /api/v1/quiz/sessions/history
 */
export const getHistory = async (): Promise<QuizHistoryItem[]> => {
  const response = await apiClient.get<ApiResponse<QuizHistoryItem[]>>(
    '/quiz/sessions/history'
  );
  return response.data.data;
};
