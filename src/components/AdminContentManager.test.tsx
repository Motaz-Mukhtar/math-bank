import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminContentManager from './AdminContentManager';
import * as videoApi from '@/services/video.api';

// Mock the video API
vi.mock('@/services/video.api', () => ({
  getCategories: vi.fn(),
  createVideoCategory: vi.fn(),
  createVideo: vi.fn(),
}));

// Mock the admin components
vi.mock('@/components/admin/QuestionFormContainer', () => ({
  QuestionFormContainer: ({ onSuccess, onCancel, questionId }: any) => (
    <div data-testid="question-form-container">
      <div>Question Form Container</div>
      {questionId && <div>Editing: {questionId}</div>}
      <button onClick={onSuccess}>Success</button>
      {onCancel && <button onClick={onCancel}>Cancel</button>}
    </div>
  ),
}));

vi.mock('@/components/admin/QuestionList', () => ({
  QuestionList: ({ onEdit }: any) => (
    <div data-testid="question-list">
      <div>Question List</div>
      <button onClick={() => onEdit('test-question-id')}>Edit Question</button>
    </div>
  ),
}));

describe('AdminContentManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(videoApi.getCategories).mockResolvedValue([]);
  });

  it('renders the component with tabs', async () => {
    render(<AdminContentManager />);
    
    await waitFor(() => {
      expect(screen.getByText('إدارة المحتوى')).toBeInTheDocument();
    });
    
    expect(screen.getByText('إدارة الأسئلة')).toBeInTheDocument();
    expect(screen.getByText('إضافة فصل')).toBeInTheDocument();
    expect(screen.getByText('إضافة فيديو')).toBeInTheDocument();
  });

  it('displays QuestionFormContainer and QuestionList in question tab', async () => {
    render(<AdminContentManager />);
    
    await waitFor(() => {
      expect(screen.getByTestId('question-form-container')).toBeInTheDocument();
      expect(screen.getByTestId('question-list')).toBeInTheDocument();
    });
  });

  it('handles question edit flow', async () => {
    render(<AdminContentManager />);
    
    await waitFor(() => {
      expect(screen.getByTestId('question-list')).toBeInTheDocument();
    });
    
    // Click edit button in question list
    const editButton = screen.getByText('Edit Question');
    fireEvent.click(editButton);
    
    // Should show editing state
    await waitFor(() => {
      expect(screen.getByText('Editing: test-question-id')).toBeInTheDocument();
    });
    
    // Should show cancel button
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('handles question success and refreshes list', async () => {
    render(<AdminContentManager />);
    
    await waitFor(() => {
      expect(screen.getByTestId('question-form-container')).toBeInTheDocument();
    });
    
    // Click edit to enter edit mode
    const editButton = screen.getByText('Edit Question');
    fireEvent.click(editButton);
    
    await waitFor(() => {
      expect(screen.getByText('Editing: test-question-id')).toBeInTheDocument();
    });
    
    // Click success button
    const successButton = screen.getByText('Success');
    fireEvent.click(successButton);
    
    // Should clear editing state
    await waitFor(() => {
      expect(screen.queryByText('Editing: test-question-id')).not.toBeInTheDocument();
    });
  });

  it('handles question cancel', async () => {
    render(<AdminContentManager />);
    
    await waitFor(() => {
      expect(screen.getByTestId('question-list')).toBeInTheDocument();
    });
    
    // Click edit to enter edit mode
    const editButton = screen.getByText('Edit Question');
    fireEvent.click(editButton);
    
    await waitFor(() => {
      expect(screen.getByText('Editing: test-question-id')).toBeInTheDocument();
    });
    
    // Click cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Should clear editing state
    await waitFor(() => {
      expect(screen.queryByText('Editing: test-question-id')).not.toBeInTheDocument();
    });
  });

  it('fetches video categories on mount', async () => {
    const mockCategories: videoApi.VideoCategory[] = [
      { 
        id: '1', 
        name: 'Category 1', 
        sortOrder: 0,
        description: 'Test category 1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '2', 
        name: 'Category 2', 
        sortOrder: 1,
        description: 'Test category 2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    ];
    
    vi.mocked(videoApi.getCategories).mockResolvedValue(mockCategories);
    
    render(<AdminContentManager />);
    
    await waitFor(() => {
      expect(videoApi.getCategories).toHaveBeenCalledTimes(1);
    });
  });
});
