import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, TrendingUp, Award } from "lucide-react";

interface QuizResult {
  id: string;
  topic: string;
  difficulty: string;
  score: number;
  total: number;
  points_earned: number;
  created_at: string;
}

const topicLabels: Record<string, { label: string; emoji: string }> = {
  addition: { label: "الجمع", emoji: "➕" },
  subtraction: { label: "الطرح", emoji: "➖" },
  multiplication: { label: "الضرب", emoji: "✖️" },
  division: { label: "القسمة", emoji: "➗" },
  comparison: { label: "المقارنة", emoji: "⚖️" },
  geometry: { label: "الأشكال الهندسية", emoji: "📐" },
};

const difficultyLabels: Record<string, { label: string; color: string; bg: string }> = {
  easy: { label: "سهل", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  medium: { label: "متوسط", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
  hard: { label: "صعب", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30" },
};

interface Props {
  studentProfileId: string;
  studentName: string;
}

const StudentQuizHistory = ({ studentProfileId, studentName }: Props) => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("student_profile_id", studentProfileId)
        .order("created_at", { ascending: false })
        .limit(20);
      setResults((data as QuizResult[]) || []);
      setLoading(false);
    };
    fetch();
  }, [studentProfileId]);

  const totalQuizzes = results.length;
  const totalCorrect = results.reduce((s, r) => s + r.score, 0);
  const totalQuestions = results.reduce((s, r) => s + r.total, 0);
  const avgScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalPointsEarned = results.reduce((s, r) => s + r.points_earned, 0);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-5">
          <div className="h-24 bg-muted rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-muted-foreground/40 mx-auto" />
          <p className="text-sm text-muted-foreground font-cairo">
            لم يُجرِ {studentName} أي اختبار بعد
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <BookOpen className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground tabular-nums">{totalQuizzes}</p>
          <p className="text-[10px] text-muted-foreground font-cairo">اختبار</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground tabular-nums">{avgScore}%</p>
          <p className="text-[10px] text-muted-foreground font-cairo">متوسط النتيجة</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <Award className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground tabular-nums">{totalPointsEarned}</p>
          <p className="text-[10px] text-muted-foreground font-cairo">نقطة مكتسبة</p>
        </div>
      </div>

      {/* Recent results */}
      <div className="space-y-2">
        {results.slice(0, 5).map((r) => {
          const topic = topicLabels[r.topic] || { label: r.topic, emoji: "📝" };
          const diff = difficultyLabels[r.difficulty] || { label: r.difficulty, color: "text-muted-foreground", bg: "bg-muted" };
          const pct = Math.round((r.score / r.total) * 100);

          return (
            <div
              key={r.id}
              className="flex items-center gap-3 bg-card rounded-xl border border-border p-3"
            >
              <span className="text-xl shrink-0">{topic.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-cairo font-semibold text-sm text-foreground truncate">{topic.label}</span>
                  <span className={`font-cairo text-[10px] font-bold px-1.5 py-0.5 rounded-full ${diff.bg} ${diff.color}`}>
                    {diff.label}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-cairo">
                  {new Date(r.created_at).toLocaleDateString("ar-SA")}
                </p>
              </div>
              <div className="text-left shrink-0">
                <p className={`font-bold text-sm tabular-nums ${pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600"}`}>
                  {r.score}/{r.total}
                </p>
                <p className="text-[10px] text-muted-foreground tabular-nums">+{r.points_earned} ⭐</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentQuizHistory;
