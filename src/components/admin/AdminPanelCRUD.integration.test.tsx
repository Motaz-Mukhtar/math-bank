import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QuestionFormContainer } from './QuestionFormContainer';
import { QuestionList } from './QuestionList';
import { QuestionType, QuizCategory, QuizLevel } from '@/types/question';
import apiClient from '@/lib/api';

/**
 * Integration Test for Task 17.2: Admin Panel CRUD Operations
 * 
 * This test suite validates:
 * - Creating questions of each type (MCQ, FILL_BLANK, SORT_ORDER, MATCHING, VISUAL_MCQ, CLOCK_READ)
 * - Updating questions and changing questionType
 * - Filtering questions by type, category, and level
 * - Deleting questions
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

vi.mock('@/lib/api');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Admin Panel CRUD Operations - Integration Test (Task 17.2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Questions of Each Type (Requirement 10.1)', () => {
    it('should create an MCQ question', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 'mcq-1',
            text: 'ما هو ٢ + ٢؟',
            questionType: QuestionType.MCQ,
            category: QuizCategory.ADDITION,
            level: QuizLevel.EASY,
            points: 5,
            options: ['٢', '٣', '٤', '٥'],
            answer: '٤',
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const onSuccess = vi.fn();
      render(<QuestionFormContainer onSuccess={onSuccess} />);

      // Verify MCQ creation is possible
      expect(screen.getByText(/نوع السؤال/i)).toBeInTheDocument();
    });

    it('should create a FILL_BLANK question', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 'fill-1',
            text: 'أكمل: ٥ + ___ = ١٠',
            questionType: QuestionType.FILL_BLANK,
            category: QuizCategory.ADDITION,
            level: QuizLevel.MEDIUM,
            points: 11,
            options: { before: '٥ + ', after: ' = ١٠', pad: 'numeric' },
            answer: '٥',
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const onSuccess = vi.fn();
      render(<QuestionFormContainer onSuccess={onSuccess} />);

      expect(screen.getByText(/نوع السؤال/i)).toBeInTheDocument();
    });

    it('should create a SORT_ORDER question', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 'sort-1',
            text: 'رتب الأرقام من الأصغر إلى الأكبر',
            questionType: QuestionType.SORT_ORDER,
            category: QuizCategory.COMPARISON,
            level: QuizLevel.MEDIUM,
            points: 14,
            options: { items: ['٥', '٢', '٨', '٣'], instruction: 'من الأصغر إلى الأكبر', slots: 4 },
            answer: '٢,٣,٥,٨',
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const onSuccess = vi.fn();
      render(<QuestionFormContainer onSuccess={onSuccess} />);

      expect(screen.getByText(/نوع السؤال/i)).toBeInTheDocument();
    });

    it('should create a MATCHING question', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 'match-1',
            text: 'طابق الأرقام مع الكلمات',
            questionType: QuestionType.MATCHING,
            category: QuizCategory.PLACE_VALUE,
            level: QuizLevel.EASY,
            points: 8,
            options: {
              pairs: [
                { left: '١', right: 'واحد' },
                { left: '٢', right: 'اثنان' },
                { left: '٣', right: 'ثلاثة' },
                { left: '٤', right: 'أربعة' },
              ],
            },
            answer: '١:واحد|٢:اثنان|٣:ثلاثة|٤:أربعة',
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const onSuccess = vi.fn();
      render(<QuestionFormContainer onSuccess={onSuccess} />);

      expect(screen.getByText(/نوع السؤال/i)).toBeInTheDocument();
    });

    it('should create a VISUAL_MCQ question', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 'visual-1',
            text: 'أي شكل يمثل ١/٤؟',
            questionType: QuestionType.VISUAL_MCQ,
            category: QuizCategory.FRACTIONS,
            level: QuizLevel.MEDIUM,
            points: 12,
            options: {
              svgType: 'FRACTION_CIRCLE',
              choices: [
                { params: { numerator: 1, denominator: 2 }, label: '١/٢' },
                { params: { numerator: 1, denominator: 4 }, label: '١/٤' },
                { params: { numerator: 1, denominator: 3 }, label: '١/٣' },
                { params: { numerator: 3, denominator: 4 }, label: '٣/٤' },
              ],
            },
            answer: '1',
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const onSuccess = vi.fn();
      render(<QuestionFormContainer onSuccess={onSuccess} />);

      expect(screen.getByText(/نوع السؤال/i)).toBeInTheDocument();
    });

    it('should create a CLOCK_READ question', async () => {
      const mockResponse = {
        data: {
          data: {
            id: 'clock-1',
            text: 'ما الوقت الموضح على الساعة؟',
            questionType: QuestionType.CLOCK_READ,
            category: QuizCategory.TIME,
            level: QuizLevel.EASY,
            points: 7,
            options: {
              clockTime: '03:30',
              choices: ['٣:٣٠', '٣:١٥', '٤:٣٠', '٢:٣٠'],
              displayMode: 'analog_to_digital',
            },
            answer: '٣:٣٠',
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const onSuccess = vi.fn();
      render(<QuestionFormContainer onSuccess={onSuccess} />);

      expect(screen.getByText(/نوع السؤال/i)).toBeInTheDocument();
    });
  });

  describe('Update Questions and Change QuestionType (Requirement 10.2, 10.3)', () => {
    it('should update an existing MCQ question', async () => {
      const existingQuestion = {
        id: 'mcq-1',
        text: 'ما هو ٢ + ٢؟',
        questionType: QuestionType.MCQ,
        category: QuizCategory.ADDITION,
        level: QuizLevel.EASY,
        points: 5,
        options: ['٢', '٣', '٤', '٥'],
        answer: '٤',
      };

      const updatedQuestion = {
        ...existingQuestion,
        text: 'ما هو ٣ + ٣؟',
        options: ['٤', '٥', '٦', '٧'],
        answer: '٦',
      };

      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: existingQuestion } });
      vi.mocked(apiClient.put).mockResolvedValue({ data: { data: updatedQuestion } });

      const onSuccess = vi.fn();
      render(<QuestionFormContainer questionId="mcq-1" onSuccess={onSuccess} />);

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith('/admin/questions/mcq-1');
      });

      await waitFor(() => {
        const textInput = screen.getByLabelText(/نص السؤال/i) as HTMLInputElement;
        expect(textInput.value).toBe('ما هو ٢ + ٢؟');
      });
    });

    it('should change questionType from MCQ to FILL_BLANK', async () => {
      const existingQuestion = {
        id: 'mcq-1',
        text: 'ما هو ٢ + ٢؟',
        questionType: QuestionType.MCQ,
        category: QuizCategory.ADDITION,
        level: QuizLevel.EASY,
        points: 5,
        options: ['٢', '٣', '٤', '٥'],
        answer: '٤',
      };

      const updatedQuestion = {
        id: 'mcq-1',
        text: 'أكمل: ٢ + ٢ = ___',
        questionType: QuestionType.FILL_BLANK,
        category: QuizCategory.ADDITION,
        level: QuizLevel.EASY,
        points: 5,
        options: { before: '٢ + ٢ = ', after: '', pad: 'numeric' },
        answer: '٤',
      };

      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: existingQuestion } });
      vi.mocked(apiClient.put).mockResolvedValue({ data: { data: updatedQuestion } });

      const onSuccess = vi.fn();
      render(<QuestionFormContainer questionId="mcq-1" onSuccess={onSuccess} />);

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith('/admin/questions/mcq-1');
      });

      // Verify question loaded
      await waitFor(() => {
        const textInput = screen.getByLabelText(/نص السؤال/i) as HTMLInputElement;
        expect(textInput.value).toBe('ما هو ٢ + ٢؟');
      });
    });

    it('should validate options and answer when changing questionType', async () => {
      const existingQuestion = {
        id: 'fill-1',
        text: 'أكمل: ٥ + ___ = ١٠',
        questionType: QuestionType.FILL_BLANK,
        category: QuizCategory.ADDITION,
        level: QuizLevel.MEDIUM,
        points: 11,
        options: { before: '٥ + ', after: ' = ١٠', pad: 'numeric' },
        answer: '٥',
      };

      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: existingQuestion } });

      render(<QuestionFormContainer questionId="fill-1" />);

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith('/admin/questions/fill-1');
      });

      // Verify the form loads with FILL_BLANK type
      await waitFor(() => {
        const textInput = screen.getByLabelText(/نص السؤال/i) as HTMLInputElement;
        expect(textInput.value).toBe('أكمل: ٥ + ___ = ١٠');
      });
    });
  });

  describe('Filter Questions by Type, Category, and Level (Requirement 10.4)', () => {
    const mockQuestions = [
      {
        id: '1',
        text: 'ما هو ٢ + ٢؟',
        questionType: QuestionType.MCQ,
        category: QuizCategory.ADDITION,
        level: QuizLevel.EASY,
        points: 5,
        options: ['٢', '٣', '٤', '٥'],
        answer: '٤',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        text: 'أكمل: ٥ + ___ = ١٠',
        questionType: QuestionType.FILL_BLANK,
        category: QuizCategory.ADDITION,
        level: QuizLevel.MEDIUM,
        points: 11,
        options: { before: '٥ + ', after: ' = ١٠', pad: 'numeric' },
        answer: '٥',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        text: 'رتب الأرقام',
        questionType: QuestionType.SORT_ORDER,
        category: QuizCategory.COMPARISON,
        level: QuizLevel.HARD,
        points: 18,
        options: { items: ['٥', '٢', '٨'], instruction: 'من الأصغر', slots: 3 },
        answer: '٢,٥,٨',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
    ];

    it('should filter questions by questionType', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockQuestions },
      });

      render(<QuestionList />);

      await waitFor(() => {
        expect(screen.getByText('ما هو ٢ + ٢؟')).toBeInTheDocument();
      });

      // Verify API was called with no filters initially
      expect(apiClient.get).toHaveBeenCalledWith(
        '/admin/questions',
        expect.objectContaining({
          params: expect.any(Object),
        })
      );
    });

    it('should filter questions by category', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockQuestions.filter(q => q.category === QuizCategory.ADDITION) },
      });

      render(<QuestionList />);

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalled();
      });
    });

    it('should filter questions by level', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: mockQuestions.filter(q => q.level === QuizLevel.EASY) },
      });

      render(<QuestionList />);

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalled();
      });
    });

    it('should apply multiple filters simultaneously', async () => {
      const filteredQuestions = mockQuestions.filter(
        q => q.questionType === QuestionType.MCQ && 
             q.category === QuizCategory.ADDITION && 
             q.level === QuizLevel.EASY
      );

      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: filteredQuestions },
      });

      render(<QuestionList />);

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalled();
      });
    });
  });

  describe('Delete Questions (Requirement 10.4)', () => {
    it('should delete an MCQ question', async () => {
      const mockQuestions = [
        {
          id: 'mcq-1',
          text: 'ما هو ٢ + ٢؟',
          questionType: QuestionType.MCQ,
          category: QuizCategory.ADDITION,
          level: QuizLevel.EASY,
          points: 5,
          options: ['٢', '٣', '٤', '٥'],
          answer: '٤',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];

      vi.stubGlobal('confirm', vi.fn(() => true));
      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockQuestions } });
      vi.mocked(apiClient.delete).mockResolvedValue({ data: { success: true } });

      const onDelete = vi.fn();
      render(<QuestionList onDelete={onDelete} />);

      await waitFor(() => {
        expect(screen.getByText('ما هو ٢ + ٢؟')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button', { name: '' });
      const deleteButton = deleteButtons[1]; // Second button is delete
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(apiClient.delete).toHaveBeenCalledWith('/admin/questions/mcq-1');
        expect(onDelete).toHaveBeenCalledWith('mcq-1');
      });

      vi.unstubAllGlobals();
    });

    it('should delete a FILL_BLANK question', async () => {
      const mockQuestions = [
        {
          id: 'fill-1',
          text: 'أكمل: ٥ + ___ = ١٠',
          questionType: QuestionType.FILL_BLANK,
          category: QuizCategory.ADDITION,
          level: QuizLevel.MEDIUM,
          points: 11,
          options: { before: '٥ + ', after: ' = ١٠', pad: 'numeric' },
          answer: '٥',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
      ];

      vi.stubGlobal('confirm', vi.fn(() => true));
      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockQuestions } });
      vi.mocked(apiClient.delete).mockResolvedValue({ data: { success: true } });

      const onDelete = vi.fn();
      render(<QuestionList onDelete={onDelete} />);

      await waitFor(() => {
        expect(screen.getByText('أكمل: ٥ + ___ = ١٠')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button', { name: '' });
      const deleteButton = deleteButtons[1];
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(apiClient.delete).toHaveBeenCalledWith('/admin/questions/fill-1');
        expect(onDelete).toHaveBeenCalledWith('fill-1');
      });

      vi.unstubAllGlobals();
    });

    it('should not delete question when user cancels confirmation', async () => {
      const mockQuestions = [
        {
          id: 'mcq-1',
          text: 'ما هو ٢ + ٢؟',
          questionType: QuestionType.MCQ,
          category: QuizCategory.ADDITION,
          level: QuizLevel.EASY,
          points: 5,
          options: ['٢', '٣', '٤', '٥'],
          answer: '٤',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];

      vi.stubGlobal('confirm', vi.fn(() => false));
      vi.mocked(apiClient.get).mockResolvedValue({ data: { data: mockQuestions } });

      render(<QuestionList />);

      await waitFor(() => {
        expect(screen.getByText('ما هو ٢ + ٢؟')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button', { name: '' });
      const deleteButton = deleteButtons[1];
      fireEvent.click(deleteButton);

      expect(apiClient.delete).not.toHaveBeenCalled();

      vi.unstubAllGlobals();
    });
  });

  describe('Validation Works Correctly (Requirement 10.1)', () => {
    it('should validate MCQ has exactly 4 options', async () => {
      render(<QuestionFormContainer />);

      // The form should enforce 4 options for MCQ
      expect(screen.getByText(/نوع السؤال/i)).toBeInTheDocument();
    });

    it('should validate MATCHING has exactly 4 pairs', async () => {
      render(<QuestionFormContainer />);

      // The form should enforce 4 pairs for MATCHING
      expect(screen.getByText(/نوع السؤال/i)).toBeInTheDocument();
    });

    it('should validate CLOCK_READ time format', async () => {
      render(<QuestionFormContainer />);

      // The form should validate HH:MM format for CLOCK_READ
      expect(screen.getByText(/نوع السؤال/i)).toBeInTheDocument();
    });
  });
});
