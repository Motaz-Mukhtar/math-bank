// ─── Question Type Enums ─────────────────────────────────────────────────────

export enum QuestionType {
  MCQ = 'MCQ',
  FILL_BLANK = 'FILL_BLANK',
  SORT_ORDER = 'SORT_ORDER',
  MATCHING = 'MATCHING',
  VISUAL_MCQ = 'VISUAL_MCQ',
  CLOCK_READ = 'CLOCK_READ',
}

export enum QuizCategory {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  MULTIPLICATION = 'MULTIPLICATION',
  DIVISION = 'DIVISION',
  COMPARISON = 'COMPARISON',
  GEOMETRY = 'GEOMETRY',
  FRACTIONS = 'FRACTIONS',
  MEASUREMENT = 'MEASUREMENT',
  TIME = 'TIME',
  PLACE_VALUE = 'PLACE_VALUE',
  PATTERNS = 'PATTERNS',
  DATA = 'DATA',
}

export enum QuizLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum SVGType {
  FRACTION_CIRCLE = 'FRACTION_CIRCLE',
  FRACTION_RECT = 'FRACTION_RECT',
  FRACTION_GROUP = 'FRACTION_GROUP',
  SHAPE_2D = 'SHAPE_2D',
  SHAPE_3D = 'SHAPE_3D',
  DOT_ARRAY = 'DOT_ARRAY',
  SYMMETRY = 'SYMMETRY',
  GRID_AREA = 'GRID_AREA',
  BAR_CHART = 'BAR_CHART',
  CLOCK_FACE = 'CLOCK_FACE',
}

// ─── Base Question Interface ─────────────────────────────────────────────────

export interface BaseQuestion {
  id: string;
  text: string;
  category: QuizCategory;
  level: QuizLevel;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Type-Specific Option Interfaces ─────────────────────────────────────────

export interface MCQOptions {
  options: string[];
}

export interface MCQQuestion extends BaseQuestion {
  questionType: QuestionType.MCQ;
  options: string[];
  answer: string;
}

export interface FillBlankOptions {
  before: string;
  after?: string;
  pad: 'numeric' | 'fraction';
}

export interface FillBlankQuestion extends BaseQuestion {
  questionType: QuestionType.FILL_BLANK;
  options: FillBlankOptions;
  answer: string;
}

export interface SortOrderOptions {
  items: string[];
  instruction: string;
  slots: number;
}

export interface SortOrderQuestion extends BaseQuestion {
  questionType: QuestionType.SORT_ORDER;
  options: SortOrderOptions;
  answer: string;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingOptions {
  pairs: MatchingPair[];
}

export interface MatchingQuestion extends BaseQuestion {
  questionType: QuestionType.MATCHING;
  options: MatchingOptions;
  answer: string;
}

export interface VisualMCQChoice {
  params: Record<string, unknown>;
  label: string;
}

export interface VisualMCQOptions {
  svgType: SVGType;
  choices: VisualMCQChoice[];
}

export interface VisualMCQQuestion extends BaseQuestion {
  questionType: QuestionType.VISUAL_MCQ;
  options: VisualMCQOptions;
  answer: '0' | '1' | '2' | '3';
}

export interface ClockReadOptions {
  clockTime: string;
  choices: string[];
  displayMode: 'analog_to_digital' | 'digital_to_analog' | 'elapsed_time';
}

export interface ClockReadQuestion extends BaseQuestion {
  questionType: QuestionType.CLOCK_READ;
  options: ClockReadOptions;
  answer: string;
}

// ─── Discriminated Union Type ────────────────────────────────────────────────

export type Question =
  | MCQQuestion
  | FillBlankQuestion
  | SortOrderQuestion
  | MatchingQuestion
  | VisualMCQQuestion
  | ClockReadQuestion;

// ─── Type Guards ─────────────────────────────────────────────────────────────

export function isMCQQuestion(question: Question): question is MCQQuestion {
  return question.questionType === QuestionType.MCQ;
}

export function isFillBlankQuestion(question: Question): question is FillBlankQuestion {
  return question.questionType === QuestionType.FILL_BLANK;
}

export function isSortOrderQuestion(question: Question): question is SortOrderQuestion {
  return question.questionType === QuestionType.SORT_ORDER;
}

export function isMatchingQuestion(question: Question): question is MatchingQuestion {
  return question.questionType === QuestionType.MATCHING;
}

export function isVisualMCQQuestion(question: Question): question is VisualMCQQuestion {
  return question.questionType === QuestionType.VISUAL_MCQ;
}

export function isClockReadQuestion(question: Question): question is ClockReadQuestion {
  return question.questionType === QuestionType.CLOCK_READ;
}
