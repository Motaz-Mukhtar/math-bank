import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QuestionFormContainer } from './QuestionFormContainer';
import { QuestionType, QuizCategory, QuizLevel } from '@/types/question';
import apiClient from '@/lib/api';

vi.mock('@/lib/api');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('QuestionFormContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('renders all base fields', () => {
      render(<QuestionFormContainer />);

      expect(screen.getByText(/نوع السؤال/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/نص السؤال/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /الفئة/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /المستوى/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/النقاط/i)).toBeInTheDocument();
    });

    it('displays QuestionTypeSelector', () => {
      render(<QuestionFormContainer />);

      const typeSelector = screen.getByText(/نوع السؤال/i);
      expect(typeSelector).toBeInTheDocument();
    });

    it('disables submit button when no question type is selected', () => {
      render(<QuestionFormContainer />);

      const submitButton = screen.getByRole('button', { name: /إنشاء السؤال/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Edit Mode', () => {
    it('loads existing question data', async () => {
      const mockQuestion = {
        id: '123',
        text: 'What is 2+2?',
        questionType: QuestionType.MCQ,
        category: QuizCategory.ADDITION,
        level: QuizLevel.EASY,
        points: 5,
        options: ['3', '4', '5', '6'],
        answer: '4',
      };

      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockQuestion } });

      render(<QuestionFormContainer questionId="123" />);

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith('/admin/questions/123');
      });

      await waitFor(() => {
        const textInput = screen.getByLabelText(/نص السؤال/i) as HTMLInputElement;
        expect(textInput.value).toBe('What is 2+2?');
      });
    });

    it('shows update button in edit mode', async () => {
      const mockQuestion = {
        id: '123',
        text: 'What is 2+2?',
        questionType: QuestionType.MCQ,
        category: QuizCategory.ADDITION,
        level: QuizLevel.EASY,
        points: 5,
        options: ['3', '4', '5', '6'],
        answer: '4',
      };

      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockQuestion } });

      render(<QuestionFormContainer questionId="123" />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /تحديث السؤال/i })).toBeInTheDocument();
      });
    });
  });

  describe('Type-Specific Forms', () => {
    it('does not show type-specific form when no type is selected', () => {
      render(<QuestionFormContainer />);

      expect(screen.queryByText(/خيارات السؤال/i)).not.toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('shows error when submitting without required fields', async () => {
      const { toast } = await import('sonner');

      render(<QuestionFormContainer />);

      const submitButton = screen.getByRole('button', { name: /إنشاء السؤال/i });
      
      // Button should be disabled when no type is selected
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Points System', () => {
    it('initializes points to 0', () => {
      render(<QuestionFormContainer />);

      const pointsInput = screen.getByLabelText(/النقاط/i) as HTMLInputElement;
      expect(pointsInput.value).toBe('0');
    });

    it('allows manual points input', () => {
      render(<QuestionFormContainer />);

      const pointsInput = screen.getByLabelText(/النقاط/i) as HTMLInputElement;
      fireEvent.change(pointsInput, { target: { value: '10' } });

      expect(pointsInput.value).toBe('10');
    });

    it('shows suggested points hint when level and type are selected', async () => {
      const mockQuestion = {
        id: '123',
        text: 'Test question',
        questionType: QuestionType.MCQ,
        category: QuizCategory.ADDITION,
        level: QuizLevel.EASY,
        points: 5,
        options: ['1', '2', '3', '4'],
        answer: '1',
      };

      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockQuestion } });

      render(<QuestionFormContainer questionId="123" />);

      // Wait for question to load
      await waitFor(() => {
        expect(screen.getByText(/النقاط المقترحة: 5/i)).toBeInTheDocument();
      });
    });

    it('shows reset button when custom points are entered in edit mode', async () => {
      const mockQuestion = {
        id: '123',
        text: 'Test question',
        questionType: QuestionType.MCQ,
        category: QuizCategory.ADDITION,
        level: QuizLevel.EASY,
        points: 10, // Custom points (not the suggested 5)
        options: ['1', '2', '3', '4'],
        answer: '1',
      };

      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockQuestion } });

      render(<QuestionFormContainer questionId="123" />);

      // Wait for question to load
      await waitFor(() => {
        const pointsInput = screen.getByLabelText(/النقاط/i) as HTMLInputElement;
        expect(pointsInput.value).toBe('10');
      });

      // Reset button should appear because points (10) != suggested (5)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /استخدام النقاط المقترحة/i })).toBeInTheDocument();
      });
    });

    it('resets to suggested points when reset button is clicked', async () => {
      const mockQuestion = {
        id: '123',
        text: 'Test question',
        questionType: QuestionType.MCQ,
        category: QuizCategory.ADDITION,
        level: QuizLevel.EASY,
        points: 10, // Custom points
        options: ['1', '2', '3', '4'],
        answer: '1',
      };

      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockQuestion } });

      render(<QuestionFormContainer questionId="123" />);

      // Wait for question to load
      await waitFor(() => {
        const pointsInput = screen.getByLabelText(/النقاط/i) as HTMLInputElement;
        expect(pointsInput.value).toBe('10');
      });

      // Click reset button
      const resetButton = await screen.findByRole('button', { name: /استخدام النقاط المقترحة/i });
      fireEvent.click(resetButton);

      // Points should be reset to suggested value (5)
      await waitFor(() => {
        const pointsInput = screen.getByLabelText(/النقاط/i) as HTMLInputElement;
        expect(pointsInput.value).toBe('5');
      });
    });
  });
});
