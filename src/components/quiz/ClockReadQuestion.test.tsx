import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClockReadQuestion } from './ClockReadQuestion';
import { QuestionType, QuizCategory, QuizLevel } from '@/types/question';

describe('ClockReadQuestion', () => {
  const mockAnalogToDigitalQuestion = {
    id: '1',
    text: 'ما الوقت الموضح على الساعة؟',
    questionType: QuestionType.CLOCK_READ,
    category: QuizCategory.TIME,
    level: QuizLevel.EASY,
    points: 6,
    options: {
      clockTime: '03:15',
      choices: ['٣:١٥', '٣:٣٠', '٣:٤٥', '٤:١٥'],
      displayMode: 'analog_to_digital' as const,
    },
    answer: '٣:١٥',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDigitalToAnalogQuestion = {
    id: '2',
    text: 'أي ساعة تعرض الوقت ٦:٣٠؟',
    questionType: QuestionType.CLOCK_READ,
    category: QuizCategory.TIME,
    level: QuizLevel.MEDIUM,
    points: 8,
    options: {
      clockTime: '06:30',
      choices: ['06:00', '06:15', '06:30', '06:45'],
      displayMode: 'digital_to_analog' as const,
    },
    answer: '06:30',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockElapsedTimeQuestion = {
    id: '3',
    text: 'كم ساعة مرت من ٢:٠٠ إلى ٥:٠٠؟',
    questionType: QuestionType.CLOCK_READ,
    category: QuizCategory.TIME,
    level: QuizLevel.HARD,
    points: 10,
    options: {
      clockTime: '02:00',
      choices: ['ساعة واحدة', 'ساعتان', '٣ ساعات', '٤ ساعات'],
      displayMode: 'elapsed_time' as const,
    },
    answer: '٣ ساعات',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('renders question text for analog_to_digital mode', () => {
    const onSubmit = vi.fn();
    render(<ClockReadQuestion question={mockAnalogToDigitalQuestion} onSubmit={onSubmit} />);
    expect(screen.getByText('ما الوقت الموضح على الساعة؟')).toBeInTheDocument();
  });

  it('renders digital time choices for analog_to_digital mode', () => {
    const onSubmit = vi.fn();
    render(<ClockReadQuestion question={mockAnalogToDigitalQuestion} onSubmit={onSubmit} />);
    expect(screen.getByText('٣:١٥')).toBeInTheDocument();
    expect(screen.getByText('٣:٣٠')).toBeInTheDocument();
  });

  it('calls onSubmit with selected choice for analog_to_digital mode', () => {
    const onSubmit = vi.fn();
    render(<ClockReadQuestion question={mockAnalogToDigitalQuestion} onSubmit={onSubmit} />);
    
    const choice = screen.getByText('٣:١٥');
    fireEvent.click(choice);
    
    expect(onSubmit).toHaveBeenCalledWith('٣:١٥');
  });

  it('renders digital time display for digital_to_analog mode', () => {
    const onSubmit = vi.fn();
    render(<ClockReadQuestion question={mockDigitalToAnalogQuestion} onSubmit={onSubmit} />);
    expect(screen.getByText('06:30')).toBeInTheDocument();
  });

  it('renders text choices for elapsed_time mode', () => {
    const onSubmit = vi.fn();
    render(<ClockReadQuestion question={mockElapsedTimeQuestion} onSubmit={onSubmit} />);
    expect(screen.getByText('ساعة واحدة')).toBeInTheDocument();
    expect(screen.getByText('٣ ساعات')).toBeInTheDocument();
  });
});
