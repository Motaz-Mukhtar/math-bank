import { useState, useEffect } from 'react';
import { QuestionType, QuizCategory, QuizLevel } from '@/types/question';
import { QuestionTypeSelector } from './QuestionTypeSelector';
import { MCQForm, MCQFormData } from './forms/MCQForm';
import { FillBlankForm, FillBlankFormData } from './forms/FillBlankForm';
import { SortOrderForm, SortOrderFormData } from './forms/SortOrderForm';
import { MatchingForm, MatchingFormData } from './forms/MatchingForm';
import { VisualMCQForm, VisualMCQFormData } from './forms/VisualMCQForm';
import { ClockReadForm, ClockReadFormData } from './forms/ClockReadForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiClient from '@/lib/api';
import { toast } from 'sonner';

/**
 * QuestionFormContainer component for admin panel
 * 
 * Main container that brings together all form components for question creation/editing.
 * Features:
 * - QuestionTypeSelector for choosing question type
 * - Base fields (text, category, level, points)
 * - Conditionally renders type-specific form based on selected type
 * - Handles form submission with validation
 * - Calls backend API to create/update question
 * - Shows suggested points based on level and question type
 * - Supports both create and edit modes
 * 
 * @example
 * ```tsx
 * // Create mode
 * <QuestionFormContainer onSuccess={() => navigate('/admin/questions')} />
 * 
 * // Edit mode
 * <QuestionFormContainer 
 *   questionId="123" 
 *   onSuccess={() => navigate('/admin/questions')} 
 * />
 * ```
 * 
 * **Validates: Requirements 10.1, 10.2, 10.6**
 */

interface QuestionFormContainerProps {
  questionId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Points calculation based on level and question type
const POINT_VALUES: Record<QuizLevel, Record<QuestionType, number>> = {
  [QuizLevel.EASY]: {
    [QuestionType.MCQ]: 5,
    [QuestionType.FILL_BLANK]: 6,
    [QuestionType.VISUAL_MCQ]: 6,
    [QuestionType.CLOCK_READ]: 7,
    [QuestionType.MATCHING]: 8,
    [QuestionType.SORT_ORDER]: 8,
  },
  [QuizLevel.MEDIUM]: {
    [QuestionType.MCQ]: 10,
    [QuestionType.FILL_BLANK]: 11,
    [QuestionType.VISUAL_MCQ]: 12,
    [QuestionType.CLOCK_READ]: 13,
    [QuestionType.MATCHING]: 13,
    [QuestionType.SORT_ORDER]: 14,
  },
  [QuizLevel.HARD]: {
    [QuestionType.MCQ]: 15,
    [QuestionType.FILL_BLANK]: 18,
    [QuestionType.VISUAL_MCQ]: 17,
    [QuestionType.CLOCK_READ]: 18,
    [QuestionType.MATCHING]: 19,
    [QuestionType.SORT_ORDER]: 20,
  },
};

function getSuggestedPoints(level: QuizLevel, questionType: QuestionType): number {
  return POINT_VALUES[level][questionType];
}

export function QuestionFormContainer({ 
  questionId, 
  onSuccess, 
  onCancel 
}: QuestionFormContainerProps) {
  const isEditMode = !!questionId;

  // Base fields
  const [questionType, setQuestionType] = useState<QuestionType>();
  const [text, setText] = useState<string>('');
  const [category, setCategory] = useState<QuizCategory>();
  const [level, setLevel] = useState<QuizLevel>();
  const [points, setPoints] = useState<number>(0);
  const [useCustomPoints, setUseCustomPoints] = useState<boolean>(false);

  // Type-specific form data
  const [mcqData, setMcqData] = useState<MCQFormData>({ options: ['', '', '', ''], answer: '' });
  const [fillBlankData, setFillBlankData] = useState<FillBlankFormData>({ 
    before: '', 
    after: '', 
    pad: 'numeric', 
    answer: '' 
  });
  const [sortOrderData, setSortOrderData] = useState<SortOrderFormData>({ 
    items: ['', '', ''], 
    instruction: '', 
    answer: '' 
  });
  const [matchingData, setMatchingData] = useState<MatchingFormData>({ 
    pairs: [
      { left: '', right: '' },
      { left: '', right: '' },
      { left: '', right: '' },
      { left: '', right: '' },
    ], 
    answer: '' 
  });
  const [visualMcqData, setVisualMcqData] = useState<VisualMCQFormData>();
  const [clockReadData, setClockReadData] = useState<ClockReadFormData>();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Update suggested points when level or questionType changes
  useEffect(() => {
    if (level && questionType && !useCustomPoints) {
      setPoints(getSuggestedPoints(level, questionType));
    }
  }, [level, questionType, useCustomPoints]);

  // Load question data in edit mode
  useEffect(() => {
    if (isEditMode && questionId) {
      loadQuestion(questionId);
    }
  }, [isEditMode, questionId]);

  const loadQuestion = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/admin/questions/${id}`);
      const question = response.data.data;

      setQuestionType(question.questionType);
      setText(question.text);
      setCategory(question.category);
      setLevel(question.level);
      setPoints(question.points);
      setUseCustomPoints(true);

      // Load type-specific data
      switch (question.questionType) {
        case QuestionType.MCQ:
          setMcqData({ options: question.options, answer: question.answer });
          break;
        case QuestionType.FILL_BLANK:
          setFillBlankData({ ...question.options, answer: question.answer });
          break;
        case QuestionType.SORT_ORDER:
          setSortOrderData({ ...question.options, answer: question.answer });
          break;
        case QuestionType.MATCHING:
          setMatchingData({ ...question.options, answer: question.answer });
          break;
        case QuestionType.VISUAL_MCQ:
          setVisualMcqData({ ...question.options, answer: question.answer });
          break;
        case QuestionType.CLOCK_READ:
          setClockReadData({ ...question.options, answer: question.answer });
          break;
      }
    } catch (error) {
      console.error('Failed to load question:', error);
      toast.error('فشل تحميل السؤال');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionType || !category || !level) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);

    try {
      let payload: any = {
        text,
        questionType,
        category,
        level,
        points,
      };

      // Add type-specific data
      switch (questionType) {
        case QuestionType.MCQ:
          if (!mcqData.answer) {
            toast.error('يرجى تحديد الإجابة الصحيحة');
            setIsSubmitting(false);
            return;
          }
          payload.options = mcqData.options;
          payload.answer = mcqData.answer;
          break;

        case QuestionType.FILL_BLANK:
          if (!fillBlankData.answer) {
            toast.error('يرجى إدخال الإجابة');
            setIsSubmitting(false);
            return;
          }
          payload.options = {
            before: fillBlankData.before,
            after: fillBlankData.after,
            pad: fillBlankData.pad,
          };
          payload.answer = fillBlankData.answer;
          break;

        case QuestionType.SORT_ORDER:
          if (!sortOrderData.answer) {
            toast.error('يرجى تحديد الترتيب الصحيح');
            setIsSubmitting(false);
            return;
          }
          payload.options = {
            items: sortOrderData.items,
            instruction: sortOrderData.instruction,
            slots: sortOrderData.items.length,
          };
          payload.answer = sortOrderData.answer;
          break;

        case QuestionType.MATCHING:
          if (!matchingData.answer) {
            toast.error('يرجى إكمال جميع الأزواج');
            setIsSubmitting(false);
            return;
          }
          payload.options = {
            pairs: matchingData.pairs,
          };
          payload.answer = matchingData.answer;
          break;

        case QuestionType.VISUAL_MCQ:
          if (!visualMcqData) {
            toast.error('يرجى إكمال بيانات السؤال المرئي');
            setIsSubmitting(false);
            return;
          }
          // Debug: Log the visual MCQ data before sending
          payload.options = {
            svgType: visualMcqData.svgType,
            choices: visualMcqData.choices,
          };
          payload.answer = visualMcqData.answer;
          break;

        case QuestionType.CLOCK_READ:
          if (!clockReadData || !clockReadData.clockTime || !clockReadData.answer) {
            toast.error('يرجى إكمال بيانات سؤال الساعة');
            setIsSubmitting(false);
            return;
          }
          payload.options = {
            clockTime: clockReadData.clockTime,
            choices: clockReadData.choices,
            displayMode: clockReadData.displayMode,
          };
          payload.answer = clockReadData.answer;
          break;
      }

      if (isEditMode) {
        await apiClient.put(`/admin/questions/${questionId}`, payload);
        toast.success('تم تحديث السؤال بنجاح');
      } else {
        await apiClient.post('/admin/questions', payload);
        toast.success('تم إنشاء السؤال بنجاح');
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to save question:', error);
      const errorMessage = error.response?.data?.message || 'فشل حفظ السؤال';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'تعديل السؤال' : 'إنشاء سؤال جديد'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Type Selector */}
          <div className="space-y-2">
            <Label htmlFor="question-type" className="text-base font-semibold">
              نوع السؤال
            </Label>
            <QuestionTypeSelector
              value={questionType}
              onValueChange={setQuestionType}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="question-text" className="text-base font-semibold">
              نص السؤال
            </Label>
            <Input
              id="question-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="أدخل نص السؤال"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base font-semibold">
              الفئة
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as QuizCategory)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={QuizCategory.ADDITION}>جمع</SelectItem>
                <SelectItem value={QuizCategory.SUBTRACTION}>طرح</SelectItem>
                <SelectItem value={QuizCategory.MULTIPLICATION}>ضرب</SelectItem>
                <SelectItem value={QuizCategory.DIVISION}>قسمة</SelectItem>
                <SelectItem value={QuizCategory.COMPARISON}>مقارنة</SelectItem>
                <SelectItem value={QuizCategory.GEOMETRY}>هندسة</SelectItem>
                <SelectItem value={QuizCategory.FRACTIONS}>كسور</SelectItem>
                <SelectItem value={QuizCategory.MEASUREMENT}>قياس</SelectItem>
                <SelectItem value={QuizCategory.TIME}>وقت</SelectItem>
                <SelectItem value={QuizCategory.PLACE_VALUE}>القيمة المكانية</SelectItem>
                <SelectItem value={QuizCategory.PATTERNS}>أنماط</SelectItem>
                <SelectItem value={QuizCategory.DATA}>بيانات</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Level */}
          <div className="space-y-2">
            <Label htmlFor="level" className="text-base font-semibold">
              المستوى
            </Label>
            <Select
              value={level}
              onValueChange={(value) => setLevel(value as QuizLevel)}
            >
              <SelectTrigger id="level">
                <SelectValue placeholder="اختر المستوى" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={QuizLevel.EASY}>سهل</SelectItem>
                <SelectItem value={QuizLevel.MEDIUM}>متوسط</SelectItem>
                <SelectItem value={QuizLevel.HARD}>صعب</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Points */}
          <div className="space-y-2">
            <Label htmlFor="points" className="text-base font-semibold">
              النقاط
            </Label>
            {level && questionType && (
              <p className="text-sm text-muted-foreground">
                النقاط المقترحة: {getSuggestedPoints(level, questionType)}
              </p>
            )}
            <div className="flex items-center gap-3">
              <Input
                id="points"
                type="number"
                value={points}
                onChange={(e) => {
                  setPoints(Number(e.target.value));
                  setUseCustomPoints(true);
                }}
                min={1}
                required
                className="w-32"
              />
              {level && questionType && useCustomPoints && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPoints(getSuggestedPoints(level, questionType));
                    setUseCustomPoints(false);
                  }}
                >
                  استخدام النقاط المقترحة
                </Button>
              )}
            </div>
          </div>

          {/* Type-Specific Forms */}
          {questionType === QuestionType.MCQ && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">خيارات السؤال</h3>
              <MCQForm value={mcqData} onChange={setMcqData} />
            </div>
          )}

          {questionType === QuestionType.FILL_BLANK && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">خيارات السؤال</h3>
              <FillBlankForm value={fillBlankData} onChange={setFillBlankData} />
            </div>
          )}

          {questionType === QuestionType.SORT_ORDER && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">خيارات السؤال</h3>
              <SortOrderForm value={sortOrderData} onChange={setSortOrderData} />
            </div>
          )}

          {questionType === QuestionType.MATCHING && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">خيارات السؤال</h3>
              <MatchingForm value={matchingData} onChange={setMatchingData} />
            </div>
          )}

          {questionType === QuestionType.VISUAL_MCQ && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">خيارات السؤال</h3>
              <VisualMCQForm value={visualMcqData} onChange={setVisualMcqData} />
            </div>
          )}

          {questionType === QuestionType.CLOCK_READ && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">خيارات السؤال</h3>
              <ClockReadForm value={clockReadData} onChange={setClockReadData} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !questionType}>
          {isSubmitting ? 'جاري الحفظ...' : isEditMode ? 'تحديث السؤال' : 'إنشاء السؤال'}
        </Button>
      </div>
    </form>
  );
}
