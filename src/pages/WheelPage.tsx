import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { spin as spinWheel, startSession, submitAnswer } from "@/services/wheel.api";
import type { SpinWheelResponse } from "@/services/wheel.api";
import { QuizCategory } from "@/types/question";
import { QuestionRenderer } from "@/components/quiz";
import { Question } from "@/types";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const segments = [
  { id: "ADDITION" as QuizCategory,      label: "جمع",     color: "hsl(174, 58%, 40%)" },
  { id: "SUBTRACTION" as QuizCategory,   label: "طرح",     color: "hsl(28, 92%, 58%)"  },
  { id: "MULTIPLICATION" as QuizCategory,label: "ضرب",     color: "hsl(340, 72%, 58%)" },
  { id: "DIVISION" as QuizCategory,      label: "قسمة",    color: "hsl(190, 60%, 50%)" },
  { id: "COMPARISON" as QuizCategory,    label: "مقارنة",  color: "hsl(38, 92%, 55%)"  },
  { id: "GEOMETRY" as QuizCategory,      label: "أشكال",   color: "hsl(142, 60%, 45%)" },
];

const WheelPage = () => {
  const navigate = useNavigate();
  const wheelRef = useRef<SVGSVGElement>(null);

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState<SpinWheelResponse | null>(null);
  const [pointEarned, setPointEarned] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const segAngle = 360 / segments.length;

  const getWheelSession = async (): Promise<{ sessionId: string }> => {
    const stored = localStorage.getItem("wheelSessionId");
    if (stored) return JSON.parse(stored);
    const response = await startSession();
    localStorage.setItem("wheelSessionId", JSON.stringify(response));
    return response;
  };

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);
    setSelected(null);
    setAnswered(false);
    setQuestion(null);

    const extraSpins = 360 * 5;
    const randomAngle = Math.random() * 360;
    const newRotation = rotation + extraSpins + randomAngle;
    setRotation(newRotation);

    setTimeout(async () => {
      const finalAngle = newRotation % 360;
      const normalizedAngle = ((360 - finalAngle) + 270) % 360;
      const idx = Math.floor(normalizedAngle / segAngle) % segments.length;
      setSelected(segments[idx].id);

      try {
        const session = await getWheelSession();
        const response = await spinWheel(session.sessionId, segments[idx].id);
        setQuestion(response);
      } catch (err: any) {
        toast.error(err.response?.data?.error || "فشل تحميل السؤال");
      } finally {
        setSpinning(false);
      }
    }, 3200);
  };

  const handleAnswer = async (userAnswer: string) => {
    if (answered || !question) return;
    setIsLoading(true);
    setAnswered(true);
    setPointEarned(question.points);

    try {
      const session = await getWheelSession();
      const result = await submitAnswer(session.sessionId, question.id, userAnswer);
      setIsCorrect(result.isCorrect);
      if (result.isCorrect) setTotalPoints((p) => p + question.points);
    } catch (err: any) {
      toast.error("فشل إرسال الإجابة");
      setAnswered(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16 font-cairo" dir="rtl">
        <div className="container max-w-4xl">

          {/* Header */}
          <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="font-cairo font-extrabold text-3xl md:text-4xl text-foreground mb-2">
              عجلة الاختبارات
            </h1>
            <p className="text-muted-foreground font-cairo text-lg">
              أدِر العجلة واختبر معلوماتك — اجمع النقاط مع كل إجابة صحيحة!
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 justify-center">

            {/* Wheel */}
            <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-foreground" />

              <svg
                ref={wheelRef}
                width="300"
                height="300"
                viewBox="0 0 280 280"
                className="drop-shadow-xl"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning
                    ? "transform 3.2s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                    : "none",
                }}
              >
                {segments.map((seg, i) => {
                  const startAngle = (i * segAngle * Math.PI) / 180;
                  const endAngle = ((i + 1) * segAngle * Math.PI) / 180;
                  const x1 = 140 + 130 * Math.cos(startAngle);
                  const y1 = 140 + 130 * Math.sin(startAngle);
                  const x2 = 140 + 130 * Math.cos(endAngle);
                  const y2 = 140 + 130 * Math.sin(endAngle);
                  const midAngle = (startAngle + endAngle) / 2;
                  const tx = 140 + 85 * Math.cos(midAngle);
                  const ty = 140 + 85 * Math.sin(midAngle);
                  return (
                    <g key={seg.label}>
                      <path
                        d={`M140,140 L${x1},${y1} A130,130 0 0,1 ${x2},${y2} Z`}
                        fill={seg.color}
                      />
                      <text
                        x={tx} y={ty}
                        textAnchor="middle" dominantBaseline="middle"
                        fill="white" fontWeight="bold" fontSize="14"
                        fontFamily="Cairo, sans-serif"
                      >
                        {seg.label}
                      </text>
                    </g>
                  );
                })}
                <circle cx="140" cy="140" r="22" fill="white" />
              </svg>

              <button
                onClick={spin}
                disabled={spinning}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full gradient-hero text-primary-foreground font-cairo font-bold text-xs shadow-md hover:shadow-lg transition-shadow active:scale-95 disabled:opacity-60"
              >
                {spinning ? "..." : "أدِر"}
              </button>
            </div>

            {/* Question area */}
            <div className="flex-1 max-w-md w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              {/* Score */}
              <div className="flex items-center gap-3 bg-primary/5 rounded-xl px-5 py-3">
                <span className="text-2xl">⭐</span>
                <span className="font-cairo font-bold text-foreground">نقاطك:</span>
                <span className="font-cairo font-extrabold text-primary text-2xl tabular-nums">
                  {totalPoints}
                </span>
              </div>

              {question ? (
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-5">
                  <QuestionRenderer
                    question={{
                      ...question,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    } as Question}
                    onSubmit={handleAnswer}
                  />

                  {answered && (
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        {!isLoading && (
                          isCorrect ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-[hsl(var(--success))]" />
                              <span className="font-cairo font-bold text-[hsl(var(--success))]">
                                إجابة صحيحة! +{pointEarned}
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-destructive" />
                              <span className="font-cairo font-bold text-destructive">إجابة خاطئة</span>
                            </>
                          )
                        )}
                      </div>
                      <button
                        onClick={spin}
                        disabled={spinning || isLoading}
                        className="flex items-center gap-1.5 gradient-hero text-primary-foreground font-cairo font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow active:scale-[0.97] disabled:opacity-50 text-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        أدر مرة أخرى
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-card rounded-2xl p-10 shadow-sm border border-border text-center">
                  <p className="text-muted-foreground font-cairo text-lg">
                    {spinning ? "جاري الدوران..." : "أدِر العجلة لتحصل على سؤالك!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default WheelPage;
