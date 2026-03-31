import { QuestionType } from '@/types/question';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * QuestionTypeSelector component for admin panel
 * 
 * Displays a dropdown with all 6 question types and emits the selected type
 * to the parent component. Used in the admin panel for question creation/editing.
 * 
 * @example
 * ```tsx
 * const [questionType, setQuestionType] = useState<QuestionType>();
 * 
 * <QuestionTypeSelector 
 *   value={questionType} 
 *   onValueChange={setQuestionType} 
 * />
 * ```
 * 
 * **Validates: Requirements 10.6**
 */
interface QuestionTypeSelectorProps {
  value?: QuestionType;
  onValueChange: (type: QuestionType) => void;
}

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.MCQ]: 'Multiple Choice Question',
  [QuestionType.FILL_BLANK]: 'Fill in the Blank',
  [QuestionType.SORT_ORDER]: 'Sort Order',
  [QuestionType.MATCHING]: 'Matching Pairs',
  [QuestionType.VISUAL_MCQ]: 'Visual Multiple Choice',
  [QuestionType.CLOCK_READ]: 'Clock Reading',
};

export function QuestionTypeSelector({ value, onValueChange }: QuestionTypeSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select question type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={QuestionType.MCQ}>
          {QUESTION_TYPE_LABELS[QuestionType.MCQ]}
        </SelectItem>
        <SelectItem value={QuestionType.FILL_BLANK}>
          {QUESTION_TYPE_LABELS[QuestionType.FILL_BLANK]}
        </SelectItem>
        <SelectItem value={QuestionType.SORT_ORDER}>
          {QUESTION_TYPE_LABELS[QuestionType.SORT_ORDER]}
        </SelectItem>
        <SelectItem value={QuestionType.MATCHING}>
          {QUESTION_TYPE_LABELS[QuestionType.MATCHING]}
        </SelectItem>
        <SelectItem value={QuestionType.VISUAL_MCQ}>
          {QUESTION_TYPE_LABELS[QuestionType.VISUAL_MCQ]}
        </SelectItem>
        <SelectItem value={QuestionType.CLOCK_READ}>
          {QUESTION_TYPE_LABELS[QuestionType.CLOCK_READ]}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
