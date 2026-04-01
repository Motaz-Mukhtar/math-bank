import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, ArrowLeft, Trophy, Zap, RotateCcw, ChevronLeft, Flame, Brain, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { startSession, getNextQuestion, submitAnswer, completeSession } from "@/services/quiz.api";
import type { StartSessionResponse, NextQuestionResponse } from "@/services/quiz.api";
import { QuestionRenderer } from "@/components/quiz";
import { Question } from "@/types/question";
import { toast } from "sonner";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

interface DifficultyConfig {
  label: string;
  emoji: string;
  icon: typeof Sparkles;
  color: string;
  bgColor: string;
  borderColor: string;
  pointsPerCorrect: number;
  description: string;
}

const difficultyMap: Record<Difficulty, DifficultyConfig> = {
  EASY: {
    label: "سهل",
    emoji: "🌱",
    icon: Sparkles,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800 hover:border-emerald-400",
    pointsPerCorrect: 5,
    description: "أسئلة أساسية للتدريب",
  },
  MEDIUM: {
    label: "متوسط",
    emoji: "⚡",
    icon: Zap,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800 hover:border-amber-400",
    pointsPerCorrect: 10,
    description: "تحتاج تركيز أكثر",
  },
  HARD: {
    label: "صعب",
    emoji: "🔥",
    icon: Flame,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800 hover:border-red-400",
    pointsPerCorrect: 15,
    description: "للمتميزين فقط!",
  },
};

interface Category {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

const categories: Category[] = [
  {
    id: "ADDITION",
    label: "الجمع",
    emoji: "➕",
    color: "hsl(var(--primary))",
  },
  {
    id: "SUBTRACTION",
    label: "الطرح",
    emoji: "➖",
    color: "hsl(var(--secondary))",
  },
  {
    id: "MULTIPLICATION",
    label: "الضرب",
    emoji: "✖️",
    color: "hsl(var(--accent))",
  },
  {
    id: "DIVISION",
    label: "القسمة",
    emoji: "➗",
    color: "hsl(190, 60%, 50%)",
  },
  {
    id: "COMPARISON",
    label: "المقارنة",
    emoji: "⚖️",
    color: "hsl(var(--warning))",
  },
  {
    id: "GEOMETRY",
    label: "الأشكال الهندسية",
    emoji: "📐",
    color: "hsl(var(--success))",
  },
];

const QuizzesPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [session, setSession] = useState<StartSessionResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<NextQuestionResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const pointsPerCorrect = selectedDifficulty ? difficultyMap[selectedDifficulty].pointsPerCorrect : 0;

  // Start a new quiz session
  const startQuiz = async (category: string, difficulty: Difficulty) => {
    try {
      setLoading(true);
      const newSession = await startSession(category, difficulty);
      setSession(newSession);
      setCurrentIndex(0);
      setCorrectCount(0);
      setFinished(false);

      // The first question is included in the session response
      setCurrentQuestion({
        currentQuestion: newSession.currentQuestion,
        totalQuestions: newSession.totalQuestions,
        question: newSession.question
      });
      setAnswered(false);
      setIsCorrect(null);
    } catch (error: any) {
      console.error("Failed to start quiz:", error);
      toast.error(error.response?.data?.error || "فشل بدء الاختبار");
    } finally {
      setLoading(false);
    }
  };

  // Handle difficulty selection
  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    if (selectedCategory) {
      startQuiz(selectedCategory.id, difficulty);
    }
  };

  const handleSubmit = async (userAnswer: string) => {
    if (answered || !session || !currentQuestion) return;

    setAnswered(true);

    try {
      // Submit answer to backend
      const result = await submitAnswer(session.sessionId, currentQuestion.question.id, userAnswer);
      setIsCorrect(result.isCorrect);

      if (result.isCorrect) {
        setCorrectCount((c) => c + 1);
      }
    } catch (error: any) {
      console.error("Failed to submit answer:", error);
      toast.error("فشل إرسال الإجابة");
      setAnswered(false);
    }
  };

  const nextQuestion = async () => {
    if (!session) return;

    if (currentIndex + 1 < 10) { // Fixed 10 questions per session
      try {
        setLoading(true);
        const question = await getNextQuestion(session.sessionId);
        setCurrentQuestion(question);
        setCurrentIndex((i) => i + 1);
        setAnswered(false);
        setIsCorrect(null);
      } catch (error: any) {
        console.error("Failed to get next question:", error);
        toast.error("فشل تحميل السؤال التالي");
      } finally {
        setLoading(false);
      }
    } else {
      // Complete session
      try {
        setLoading(true);
        await completeSession(session.sessionId);
        await refreshUser(); // Refresh user to get updated points
        setFinished(true);
        toast.success(`تم إضافة ${correctCount * pointsPerCorrect} نقطة إلى رصيدك!`);
      } catch (error: any) {
        console.error("Failed to complete session:", error);
        toast.error("فشل إكمال الاختبار");
      } finally {
        setLoading(false);
      }
    }
  };

  const reset = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSession(null);
    setCurrentQuestion(null);
    setCurrentIndex(0);
    setAnswered(false);
    setIsCorrect(null);
    setCorrectCount(0);
    setFinished(false);
  };

  const backToCategories = () => {
    setSelectedDifficulty(null);
    setSession(null);
    setCurrentQuestion(null);
    setCurrentIndex(0);
    setAnswered(false);
    setIsCorrect(null);
    setCorrectCount(0);
    setFinished(false);
  };

  const retryCategory = () => {
    if (selectedCategory && selectedDifficulty) {
      startQuiz(selectedCategory.id, selectedDifficulty);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-background">
        <div className="container max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-cairo font-extrabold text-3xl md:text-4xl text-foreground mb-2">
              الاختبارات التفاعلية
            </h1>
            <p className="text-muted-foreground font-cairo text-lg">
              اختر موضوعًا ومستوى الصعوبة لتكسب النقاط ⭐
            </p>
          </div>

          {/* Category selection */}
          {!selectedCategory && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className="group bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md hover:border-primary/30 transition-all duration-200 active:scale-[0.97] text-center space-y-2"
                >
                  <span className="text-4xl block group-hover:scale-110 transition-transform duration-200">{cat.emoji}</span>
                  <span className="font-cairo font-bold text-foreground block">{cat.label}</span>
                  <span className="font-cairo text-xs text-muted-foreground">٣ مستويات</span>
                </button>
              ))}
            </div>
          )}

          {/* Difficulty selection */}
          {selectedCategory && !selectedDifficulty && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-cairo font-semibold text-sm transition-colors active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                  المواضيع
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedCategory.emoji}</span>
                  <span className="font-cairo font-bold text-foreground">{selectedCategory.label}</span>
                </div>
              </div>

              <div className="text-center mb-2">
                <h2 className="font-cairo font-bold text-xl text-foreground">اختر مستوى الصعوبة</h2>
              </div>

              <div className="grid gap-3">
                {(["EASY", "MEDIUM", "HARD"] as Difficulty[]).map((diff) => {
                  const config = difficultyMap[diff];
                  const Icon = config.icon;
                  return (
                    <button
                      key={diff}
                      onClick={() => handleDifficultySelect(diff)}
                      disabled={loading}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 ${config.borderColor} ${config.bgColor} transition-all duration-200 active:scale-[0.97] text-start disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="text-3xl">{config.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-cairo font-bold text-lg ${config.color}`}>{config.label}</span>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <p className="font-cairo text-sm text-muted-foreground">{config.description}</p>
                      </div>
                      <div className="text-left shrink-0">
                        <p className={`font-cairo font-extrabold text-lg tabular-nums ${config.color}`}>+{config.pointsPerCorrect}</p>
                        <p className="font-cairo text-xs text-muted-foreground">لكل إجابة</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quiz in progress */}
          {selectedCategory && selectedDifficulty && !finished && session && currentQuestion && (
            <div className="space-y-6">
              {/* Top bar */}
              <div className="flex items-center justify-between">
                <button
                  onClick={backToCategories}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-cairo font-semibold text-sm transition-colors active:scale-95 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                  المستويات
                </button>
                <div className="flex items-center gap-3">
                  <span className={`font-cairo text-xs font-bold px-2.5 py-1 rounded-full ${difficultyMap[selectedDifficulty].bgColor} ${difficultyMap[selectedDifficulty].color}`}>
                    {difficultyMap[selectedDifficulty].emoji} {difficultyMap[selectedDifficulty].label}
                  </span>
                  <span className="font-cairo text-sm text-muted-foreground">
                    {currentIndex + 1} / 10
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((currentIndex + (answered ? 1 : 0)) / 10) * 100}%`,
                    backgroundColor: selectedCategory.color,
                  }}
                />
              </div>

              {/* Question card */}
              <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border space-y-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{selectedCategory.emoji}</span>
                  <h2 className="font-cairo font-bold text-foreground text-lg md:text-xl leading-relaxed">
                    {currentQuestion.question.text}
                  </h2>
                </div>

                {/* Use QuestionRenderer for all question types */}
                <QuestionRenderer
                  question={{
                    ...currentQuestion.question,
                    createdAt: new Date(),
                    updatedAt: new Date()
                  } as Question}
                  onSubmit={handleSubmit}
                />

                {answered && isCorrect !== null && (
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-[hsl(var(--success))]" />
                          <span className="font-cairo font-bold text-[hsl(var(--success))]">إجابة صحيحة! +{pointsPerCorrect}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-destructive" />
                          <span className="font-cairo font-bold text-destructive">إجابة خاطئة</span>
                        </>
                      )}
                    </div>
                    <button
                      onClick={nextQuestion}
                      disabled={loading}
                      className="flex items-center gap-1.5 gradient-hero text-primary-foreground font-cairo font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-shadow active:scale-[0.97] disabled:opacity-50"
                    >
                      {loading ? "جاري التحميل..." : currentIndex + 1 < 10 ? "التالي" : "النتيجة"}
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          {finished && selectedCategory && selectedDifficulty && (
            <div className="bg-card rounded-2xl p-8 md:p-10 shadow-sm border border-border text-center space-y-6">
              <div className="space-y-3">
                {correctCount === 10 ? (
                  <span className="text-6xl block">🏆</span>
                ) : correctCount >= 6 ? (
                  <span className="text-6xl block">🎉</span>
                ) : (
                  <span className="text-6xl block">💪</span>
                )}

                <h2 className="font-cairo font-extrabold text-2xl text-foreground">
                  {correctCount === 10
                    ? "ممتاز! درجة كاملة!"
                    : correctCount >= 6
                      ? "أحسنت! نتيجة جيدة"
                      : "حاول مرة أخرى"}
                </h2>

                <span className={`inline-block font-cairo text-sm font-bold px-3 py-1 rounded-full ${difficultyMap[selectedDifficulty].bgColor} ${difficultyMap[selectedDifficulty].color}`}>
                  {difficultyMap[selectedDifficulty].emoji} {difficultyMap[selectedDifficulty].label} — {selectedCategory.label}
                </span>
              </div>

              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="font-cairo text-sm text-muted-foreground">الإجابات الصحيحة</p>
                  <p className="font-cairo font-extrabold text-3xl text-foreground tabular-nums">
                    {correctCount}/10
                  </p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <p className="font-cairo text-sm text-muted-foreground">النقاط المكتسبة</p>
                  <p className="font-cairo font-extrabold text-3xl text-primary tabular-nums">
                    +{correctCount * pointsPerCorrect}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={retryCategory}
                  disabled={loading}
                  className="flex items-center gap-2 border-2 border-primary text-primary font-cairo font-bold px-5 py-2.5 rounded-xl hover:bg-primary/5 transition-colors active:scale-[0.97] disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  إعادة المحاولة
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-2 gradient-hero text-primary-foreground font-cairo font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-shadow active:scale-[0.97]"
                >
                  <Trophy className="w-4 h-4" />
                  اختبار آخر
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default QuizzesPage;
