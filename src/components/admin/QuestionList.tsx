import { useState, useEffect } from 'react';
import { Question, QuestionType, QuizCategory, QuizLevel } from '@/types/question';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import apiClient from '@/lib/api';
import { toast } from 'sonner';
import { Pencil, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const PAGE_SIZE = 10;

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.MCQ]: 'اختيار من متعدد',
  [QuestionType.FILL_BLANK]: 'املأ الفراغ',
  [QuestionType.SORT_ORDER]: 'ترتيب',
  [QuestionType.MATCHING]: 'مطابقة',
  [QuestionType.VISUAL_MCQ]: 'اختيار مرئي',
  [QuestionType.CLOCK_READ]: 'قراءة الساعة',
};

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

const LEVEL_LABELS: Record<QuizLevel, string> = {
  [QuizLevel.EASY]: 'سهل',
  [QuizLevel.MEDIUM]: 'متوسط',
  [QuizLevel.HARD]: 'صعب',
};

interface QuestionListProps {
  onEdit?: (questionId: string) => void;
  onDelete?: (questionId: string) => void;
}

export function QuestionList({ onEdit, onDelete }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filterType, setFilterType] = useState<QuestionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<QuizCategory | 'all'>('all');
  const [filterLevel, setFilterLevel] = useState<QuizLevel | 'all'>('all');

  useEffect(() => {
    setPage(1);
    fetchQuestions(1);
  }, [filterType, filterCategory, filterLevel]);

  const fetchQuestions = async (p = page) => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = { page: p, limit: PAGE_SIZE };
      if (filterType !== 'all') params.questionType = filterType;
      if (filterCategory !== 'all') params.category = filterCategory;
      if (filterLevel !== 'all') params.level = filterLevel;

      const response = await apiClient.get('/admin/questions', { params });
      const data = response.data.data;
      if (Array.isArray(data)) {
        setQuestions(data);
        setTotal(data.length);
        setTotalPages(1);
      } else {
        setQuestions(data.questions || []);
        setTotal(data.total ?? data.questions?.length ?? 0);
        setTotalPages(data.totalPages ?? 1);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      toast.error('فشل تحميل الأسئلة');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchQuestions(p);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    try {
      await apiClient.delete(`/admin/questions/${questionId}`);
      toast.success('تم حذف السؤال بنجاح');
      fetchQuestions(page);
      onDelete?.(questionId);
    } catch (error) {
      console.error('Failed to delete question:', error);
      toast.error('فشل حذف السؤال');
    }
  };

  const truncateText = (text: string, max = 50) =>
    text.length <= max ? text : text.substring(0, max) + '...';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="font-cairo">
            قائمة الأسئلة
            {!isLoading && (
              <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full mr-2">
                {total}
              </span>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="filter-type" className="font-cairo text-sm">نوع السؤال</Label>
            <Select value={filterType} onValueChange={(v) => setFilterType(v as QuestionType | 'all')}>
              <SelectTrigger id="filter-type" className="font-cairo">
                <SelectValue placeholder="جميع الأنواع" />
              </SelectTrigger>
              <SelectContent className="font-cairo">
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {Object.entries(QUESTION_TYPE_LABELS).map(([type, label]) => (
                  <SelectItem key={type} value={type}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-category" className="font-cairo text-sm">الفئة</Label>
            <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as QuizCategory | 'all')}>
              <SelectTrigger id="filter-category" className="font-cairo">
                <SelectValue placeholder="جميع الفئات" />
              </SelectTrigger>
              <SelectContent className="font-cairo">
                <SelectItem value="all">جميع الفئات</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
                  <SelectItem key={cat} value={cat}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-level" className="font-cairo text-sm">المستوى</Label>
            <Select value={filterLevel} onValueChange={(v) => setFilterLevel(v as QuizLevel | 'all')}>
              <SelectTrigger id="filter-level" className="font-cairo">
                <SelectValue placeholder="جميع المستويات" />
              </SelectTrigger>
              <SelectContent className="font-cairo">
                <SelectItem value="all">جميع المستويات</SelectItem>
                {Object.entries(LEVEL_LABELS).map(([lvl, label]) => (
                  <SelectItem key={lvl} value={lvl}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : questions.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground font-cairo">
            لا توجد أسئلة
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="font-cairo text-right">نص السؤال</TableHead>
                    <TableHead className="font-cairo text-right">النوع</TableHead>
                    <TableHead className="font-cairo text-right">الفئة</TableHead>
                    <TableHead className="font-cairo text-right">المستوى</TableHead>
                    <TableHead className="font-cairo text-right">النقاط</TableHead>
                    <TableHead className="font-cairo text-right w-24">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((q, idx) => (
                    <TableRow
                      key={q.id}
                      className="hover:bg-muted/30 transition-colors animate-in fade-in"
                      style={{ animationDelay: `${idx * 25}ms` }}
                    >
                      <TableCell className="font-cairo font-medium max-w-[200px]">
                        {truncateText(q.text)}
                      </TableCell>
                      <TableCell className="font-cairo text-sm">
                        {QUESTION_TYPE_LABELS[q.questionType]}
                      </TableCell>
                      <TableCell className="font-cairo text-sm">
                        {CATEGORY_LABELS[q.category]}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-cairo font-bold px-2 py-0.5 rounded-full ${
                          q.level === QuizLevel.EASY ? 'bg-emerald-100 text-emerald-700' :
                          q.level === QuizLevel.MEDIUM ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {LEVEL_LABELS[q.level]}
                        </span>
                      </TableCell>
                      <TableCell className="font-cairo tabular-nums font-bold text-primary">
                        {q.points}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => onEdit?.(q.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors active:scale-95"
                            title="تعديل"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors active:scale-95"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-1">
                <p className="text-sm text-muted-foreground font-cairo">
                  صفحة {page} من {totalPages} — {total} سؤال
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline" size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="gap-1 font-cairo"
                  >
                    <ChevronRight className="w-4 h-4" />السابق
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-8 h-8 rounded-lg text-sm font-cairo font-bold transition-colors ${
                            p === page ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="gap-1 font-cairo"
                  >
                    التالي<ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
