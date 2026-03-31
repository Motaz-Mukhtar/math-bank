import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuizzesPage from './QuizzesPage';
import * as quizApi from '@/services/quiz.api';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock the quiz API
vi.mock('@/services/quiz.api');

// Mock the components
vi.mock('@/components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));

vi.mock('@/components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('@/components/quiz', () => ({
  QuestionRenderer: ({ question, onSubmit }: any) => (
    <div data-testid="question-renderer">
      <div data-testid="question-type">{question.questionType}</div>
      <div data-testid="question-text">{question.text}</div>
      <button onClick={() => onSubmit('test-answer')}>Submit</button>
    </div>
  )
}));

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', name: 'Test User' },
    refreshUser: vi.fn()
  }),
  AuthProvider: ({ children }: any) => <div>{children}</div>
}));

describe('QuizzesPage - QuestionRenderer Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render QuestionRenderer with correct props when quiz is started', async () => {
    // Mock API responses
    const mockSession = {
      sessionId: 'session-123',
      category: 'ADDITION' as const,
      level: 'EASY' as const,
      totalQuestions: 10,
      currentQuestion: 1,
      question: {
        id: 'q1',
        text: 'What is 2 + 2?',
        questionType: 'MCQ',
        options: ['1', '2', '3', '4'],
        category: 'ADDITION' as const,
        level: 'EASY' as const,
        points: 5
      }
    };

    vi.mocked(quizApi.startSession).mockResolvedValue(mockSession);

    const { container } = render(
      <BrowserRouter>
        <QuizzesPage />
      </BrowserRouter>
    );

    // Select category
    const additionButton = screen.getByText('الجمع');
    additionButton.click();

    // Select difficulty
    await waitFor(() => {
      const easyButton = screen.getByText('سهل');
      easyButton.click();
    });

    // Wait for QuestionRenderer to appear
    await waitFor(() => {
      expect(screen.getByTestId('question-renderer')).toBeInTheDocument();
    });

    // Verify QuestionRenderer receives correct question type
    expect(screen.getByTestId('question-type')).toHaveTextContent('MCQ');
    expect(screen.getByTestId('question-text')).toHaveTextContent('What is 2 + 2?');
  });

  it('should pass onSubmit callback to QuestionRenderer', async () => {
    const mockSession = {
      sessionId: 'session-123',
      category: 'ADDITION' as const,
      level: 'EASY' as const,
      totalQuestions: 10,
      currentQuestion: 1,
      question: {
        id: 'q1',
        text: 'What is 2 + 2?',
        questionType: 'MCQ',
        options: ['1', '2', '3', '4'],
        category: 'ADDITION' as const,
        level: 'EASY' as const,
        points: 5
      }
    };

    const mockSubmitResponse = {
      isCorrect: true,
      pointsEarned: 5,
      newTotal: 105,
      sessionScore: 5,
      correctAnswer: '4',
      isSessionComplete: false,
      questionsAnswered: 1,
      totalQuestions: 10
    };

    vi.mocked(quizApi.startSession).mockResolvedValue(mockSession);
    vi.mocked(quizApi.submitAnswer).mockResolvedValue(mockSubmitResponse);

    render(
      <BrowserRouter>
        <QuizzesPage />
      </BrowserRouter>
    );

    // Start quiz
    const additionButton = screen.getByText('الجمع');
    additionButton.click();

    await waitFor(() => {
      const easyButton = screen.getByText('سهل');
      easyButton.click();
    });

    // Wait for QuestionRenderer and submit answer
    await waitFor(() => {
      const submitButton = screen.getByText('Submit');
      submitButton.click();
    });

    // Verify submitAnswer was called with correct parameters
    await waitFor(() => {
      expect(quizApi.submitAnswer).toHaveBeenCalledWith('session-123', 'q1', 'test-answer');
    });
  });

  it('should work with different question types', async () => {
    const mockSession = {
      sessionId: 'session-123',
      category: 'GEOMETRY' as const,
      level: 'MEDIUM' as const,
      totalQuestions: 10,
      currentQuestion: 1,
      question: {
        id: 'q1',
        text: 'What time is shown?',
        questionType: 'CLOCK_READ',
        options: {
          clockTime: '03:30',
          choices: ['3:30', '3:00', '4:30', '4:00'],
          displayMode: 'analog_to_digital'
        },
        category: 'GEOMETRY' as const,
        level: 'MEDIUM' as const,
        points: 10
      }
    };

    vi.mocked(quizApi.startSession).mockResolvedValue(mockSession);

    render(
      <BrowserRouter>
        <QuizzesPage />
      </BrowserRouter>
    );

    // Start quiz with geometry category
    const geometryButton = screen.getByText('الأشكال الهندسية');
    geometryButton.click();

    await waitFor(() => {
      const mediumButton = screen.getByText('متوسط');
      mediumButton.click();
    });

    // Verify QuestionRenderer receives CLOCK_READ type
    await waitFor(() => {
      expect(screen.getByTestId('question-type')).toHaveTextContent('CLOCK_READ');
    });
  });
});
