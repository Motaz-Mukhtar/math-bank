import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QuestionList } from './QuestionList';
import apiClient from '@/lib/api';
import { QuestionType, QuizCategory, QuizLevel } from '@/types/question';

// Mock dependencies
vi.mock('@/lib/api');
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

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
];

describe('QuestionList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(apiClient.get).mockImplementation(() => new Promise(() => {}));
    
    render(<QuestionList />);
    
    expect(screen.getByText('جاري التحميل...')).toBeInTheDocument();
  });

  it('should fetch and display questions', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockQuestions },
    });

    render(<QuestionList />);

    await waitFor(() => {
      expect(screen.getByText('ما هو ٢ + ٢؟')).toBeInTheDocument();
      expect(screen.getByText('أكمل: ٥ + ___ = ١٠')).toBeInTheDocument();
    });

    expect(screen.getByText('اختيار من متعدد')).toBeInTheDocument();
    expect(screen.getByText('املأ الفراغ')).toBeInTheDocument();
  });

  it('should display empty state when no questions', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: [] },
    });

    render(<QuestionList />);

    await waitFor(() => {
      expect(screen.getByText('لا توجد أسئلة')).toBeInTheDocument();
    });
  });

  it('should filter questions by type', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockQuestions },
    });

    render(<QuestionList />);

    await waitFor(() => {
      expect(screen.getByText('ما هو ٢ + ٢؟')).toBeInTheDocument();
    });

    // Open type filter dropdown
    const typeFilter = screen.getByRole('combobox', { name: /نوع السؤال/i });
    fireEvent.click(typeFilter);

    // Select MCQ filter
    const mcqOption = screen.getByRole('option', { name: 'اختيار من متعدد' });
    fireEvent.click(mcqOption);

    // Verify API was called with filter
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith(
        '/admin/questions',
        expect.objectContaining({
          params: expect.objectContaining({
            questionType: QuestionType.MCQ,
          }),
        })
      );
    });
  });

  it('should filter questions by category', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockQuestions },
    });

    render(<QuestionList />);

    await waitFor(() => {
      expect(screen.getByText('ما هو ٢ + ٢؟')).toBeInTheDocument();
    });

    // Open category filter dropdown
    const categoryFilter = screen.getByRole('combobox', { name: /الفئة/i });
    fireEvent.click(categoryFilter);

    // Select addition filter
    const additionOption = screen.getByRole('option', { name: 'جمع' });
    fireEvent.click(additionOption);

    // Verify API was called with filter
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith(
        '/admin/questions',
        expect.objectContaining({
          params: expect.objectContaining({
            category: QuizCategory.ADDITION,
          }),
        })
      );
    });
  });

  it('should filter questions by level', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockQuestions },
    });

    render(<QuestionList />);

    await waitFor(() => {
      expect(screen.getByText('ما هو ٢ + ٢؟')).toBeInTheDocument();
    });

    // Open level filter dropdown
    const levelFilter = screen.getByRole('combobox', { name: /المستوى/i });
    fireEvent.click(levelFilter);

    // Select easy filter
    const easyOption = screen.getByRole('option', { name: 'سهل' });
    fireEvent.click(easyOption);

    // Verify API was called with filter
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith(
        '/admin/questions',
        expect.objectContaining({
          params: expect.objectContaining({
            level: QuizLevel.EASY,
          }),
        })
      );
    });
  });

  it('should call onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockQuestions },
    });

    render(<QuestionList onEdit={onEdit} />);

    await waitFor(() => {
      expect(screen.getByText('ما هو ٢ + ٢؟')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole('button', { name: '' });
    const firstEditButton = editButtons[0];
    fireEvent.click(firstEditButton);

    expect(onEdit).toHaveBeenCalledWith('1');
  });

  it('should delete question when delete button is clicked and confirmed', async () => {
    const onDelete = vi.fn();
    
    // Mock window.confirm
    vi.stubGlobal('confirm', vi.fn(() => true));
    
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockQuestions },
    });
    vi.mocked(apiClient.delete).mockResolvedValue({ data: { success: true } });

    render(<QuestionList onDelete={onDelete} />);

    await waitFor(() => {
      expect(screen.getByText('ما هو ٢ + ٢؟')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: '' });
    const firstDeleteButton = deleteButtons[1];
    fireEvent.click(firstDeleteButton);

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith('/admin/questions/1');
      expect(onDelete).toHaveBeenCalledWith('1');
    });

    vi.unstubAllGlobals();
  });

  it('should not delete question when delete is cancelled', async () => {
    // Mock window.confirm to return false
    vi.stubGlobal('confirm', vi.fn(() => false));
    
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockQuestions },
    });

    render(<QuestionList />);

    await waitFor(() => {
      expect(screen.getByText('ما هو ٢ + ٢؟')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: '' });
    const firstDeleteButton = deleteButtons[1];
    fireEvent.click(firstDeleteButton);

    expect(apiClient.delete).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it('should truncate long question text', async () => {
    const longQuestion = {
      ...mockQuestions[0],
      text: 'هذا سؤال طويل جداً يحتوي على الكثير من النص الذي يجب أن يتم اختصاره في العرض',
    };

    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: [longQuestion] },
    });

    render(<QuestionList />);

    await waitFor(() => {
      const truncatedText = screen.getByText(/\.\.\./);
      expect(truncatedText).toBeInTheDocument();
    });
  });

  it('should display correct Arabic labels for question types', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockQuestions },
    });

    render(<QuestionList />);

    await waitFor(() => {
      expect(screen.getByText('اختيار من متعدد')).toBeInTheDocument();
      expect(screen.getByText('املأ الفراغ')).toBeInTheDocument();
    });
  });

  it('should display correct Arabic labels for categories', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockQuestions },
    });

    render(<QuestionList />);

    await waitFor(() => {
      const additionLabels = screen.getAllByText('جمع');
      expect(additionLabels.length).toBeGreaterThan(0);
    });
  });

  it('should display correct Arabic labels for levels', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockQuestions },
    });

    render(<QuestionList />);

    await waitFor(() => {
      expect(screen.getByText('سهل')).toBeInTheDocument();
      expect(screen.getByText('متوسط')).toBeInTheDocument();
    });
  });
});
