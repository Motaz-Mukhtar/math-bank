import apiClient from '@/lib/api';
import { ApiResponse } from '@/types';
import { QuizCategory, Question } from './quiz.api';

export interface StartWheelSessionResponse {
  sessionId: string;
  createdAt: string;
}

export interface SpinWheelResponse extends Question {
  // Question includes: id, text, options, category, level, points
}

export interface SubmitWheelAnswerResponse {
  isCorrect: boolean;
  pointsEarned: number;
  newTotal: number;
  correctAnswer: string;
}

/**
 * Start a new wheel session
 * POST /api/v1/wheel/sessions
 */
export const startSession = async (): Promise<StartWheelSessionResponse> => {
  const response = await apiClient.post<ApiResponse<StartWheelSessionResponse>>(
    '/wheel/sessions'
  );
  return response.data.data;
};

/**
 * Spin the wheel and get a random question
 * POST /api/v1/wheel/sessions/:id/spin
 */
export const spin = async (
  sessionId: string,
  category: QuizCategory
): Promise<SpinWheelResponse> => {
  const response = await apiClient.post<ApiResponse<SpinWheelResponse>>(
    `/wheel/sessions/${sessionId}/spin`,
    { category }
  );
  return response.data.data;
};

/**
 * Submit answer for a wheel question
 * POST /api/v1/wheel/sessions/:id/answer
 */
export const submitAnswer = async (
  sessionId: string,
  questionId: string,
  userAnswer: string
): Promise<SubmitWheelAnswerResponse> => {
  const response = await apiClient.post<ApiResponse<SubmitWheelAnswerResponse>>(
    `/wheel/sessions/${sessionId}/answer`,
    { questionId, userAnswer }
  );
  return response.data.data;
};
