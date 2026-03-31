import { useState, useEffect } from 'react';
import { Question, QuestionType, QuizCategory, QuizLevel } from '@/types/question';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/api';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';

/**
 * QuestionList component for admin panel
 * 
 * Displays a list of all questions with filtering capabilities.
 * Features:
 * - Fetches questions from backend API (GET /api/admin/questions)
 * - Displays questions in a table showing: text, type, category, level, points
 * - Provides filter dropdowns for questionType, category, and level
 * - Provides edit and delete buttons for each question
 * - Handles loading and error states
 * 
 * @example
 * ```tsx
 * <QuestionList 
 *   onEdit={(id) => navigate(`/admin/questions/edit/${id}`)}
 * />
 * ```
 * 
 * **Validates: Requirements 10.4, 10.5**
 */

interface QuestionListProps {
  onEdit?: (questionId: string) => void;
  onDelete?: (questionId: string) => void;
}

// Arabic labels for question types
const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.MCQ]: 'اختيار من متعدد',
  [QuestionType.FILL_BLANK]: 'املأ الفراغ',
  [QuestionType.SORT_ORDER]: 'ترتيب',
  [QuestionType.MATCHING]: 'مطابقة',
  [QuestionType.VISUAL_MCQ]: 'اختيار مرئي',
  [QuestionType.CLOCK_READ]: 'قراءة الساعة',
};

// Arabic labels for categories
const CATEGORY_LABELS: Record<QuizCategory, string> = {
  [QuizCategory.ADDITION]: 'جمع',
  [QuizCategory.SUBTRACTION]: 'طرح',
  [QuizCategory.MULTIPLICATION]: 'ضرب',
  [QuizCategory.DIVISION]: 'قسمة',
  [QuizCategory.COMPARISON]: 'مقارنة',
  [QuizCategory.GEOMETRY]: 'هندسة',
  [QuizCategory.FRACTIONS]: 'كسور',
  [QuizCategory.MEASUREMENT]: 'قياس',
  [QuizCategory.TIME]: 'وقت',
  [QuizCategory.PLACE_VALUE]: 'القيمة المكانية',
  [QuizCategory.PATTERNS]: 'أنماط',
  [QuizCategory.DATA]: 'بيانات',
};

// Arabic labels for levels
const LEVEL_LABELS: Record<QuizLevel, string> = {
  [QuizLevel.EASY]: 'سهل',
  [QuizLevel.MEDIUM]: 'متوسط',
  [QuizLevel.HARD]: 'صعب',
};

export function QuestionList({ onEdit, onDelete }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Filter states
  const [filterType, setFilterType] = useState<QuestionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<QuizCategory | 'all'>('all');
  const [filterLevel, setFilterLevel] = useState<QuizLevel | 'all'>('all');

  useEffect(() => {
    fetchQuestions();
  }, [filterType, filterCategory, filterLevel]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      
      if (filterType !== 'all') {
        params.questionType = filterType;
      }
      if (filterCategory !== 'all') {
        params.category = filterCategory;
      }
      if (filterLevel !== 'all') {
        params.level = filterLevel;
      }

      const response = await apiClient.get('/admin/questions', { params });
      setQuestions(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      toast.error('فشل تحميل الأسئلة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      return;
    }

    try {
      await apiClient.delete(`/admin/questions/${questionId}`);
      toast.success('تم حذف السؤال بنجاح');
      fetchQuestions();
      onDelete?.(questionId);
    } catch (error) {
      console.error('Failed to delete question:', error);
      toast.error('فشل حذف السؤال');
    }
  };

  const handleEdit = (questionId: string) => {
    onEdit?.(questionId);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>قائمة الأسئلة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Question Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="filter-type">نوع السؤال</Label>
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as QuestionType | 'all')}
            >
              <SelectTrigger id="filter-type">
                <SelectValue placeholder="جميع الأنواع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {Object.entries(QUESTION_TYPE_LABELS).map(([type, label]) => (
                  <SelectItem key={type} value={type}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="filter-category">الفئة</Label>
            <Select
              value={filterCategory}
              onValueChange={(value) => setFilterCategory(value as QuizCategory | 'all')}
            >
              <SelectTrigger id="filter-category">
                <SelectValue placeholder="جميع الفئات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([category, label]) => (
                  <SelectItem key={category} value={category}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level Filter */}
          <div className="space-y-2">
            <Label htmlFor="filter-level">المستوى</Label>
            <Select
              value={filterLevel}
              onValueChange={(value) => setFilterLevel(value as QuizLevel | 'all')}
            >
              <SelectTrigger id="filter-level">
                <SelectValue placeholder="جميع المستويات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                {Object.entries(LEVEL_LABELS).map(([level, label]) => (
                  <SelectItem key={level} value={level}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Questions Table */}
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <p>جاري التحميل...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <p>لا توجد أسئلة</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نص السؤال</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>المستوى</TableHead>
                  <TableHead>النقاط</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">
                      {truncateText(question.text)}
                    </TableCell>
                    <TableCell>
                      {QUESTION_TYPE_LABELS[question.questionType]}
                    </TableCell>
                    <TableCell>
                      {CATEGORY_LABELS[question.category]}
                    </TableCell>
                    <TableCell>
                      {LEVEL_LABELS[question.level]}
                    </TableCell>
                    <TableCell>{question.points}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(question.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
