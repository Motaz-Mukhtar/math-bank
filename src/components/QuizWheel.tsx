import { useState, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { spin as spinWheel, SpinWheelResponse, startSession, submitAnswer } from "@/services/wheel.api";
import { QuizCategory, BaseQuestion } from "@/types/question";
import { QuestionRenderer } from "./quiz";
import { Question } from "@/types";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

// FRACTIONS = 'FRACTIONS',
// MEASUREMENT = 'MEASUREMENT',
// TIME = 'TIME',
// PLACE_VALUE = 'PLACE_VALUE',
// PATTERNS = 'PATTERNS',
// DATA = 'DATA',

const segments = [
  {
    id: "ADDITION" as QuizCategory,
    label: "جمع",
    color: "hsl(174, 58%, 40%)"
  },
  {
    id: "SUBTRACTION" as QuizCategory,
    label: "طرح",
    color: "hsl(28, 92%, 58%)"
  },
  {
    id: "MULTIPLICATION" as QuizCategory,
    label: "ضرب",
    color: "hsl(340, 72%, 58%)"
  },
  {
    id: "DIVISION" as QuizCategory,
    label: "قسمة",
    color: "hsl(190, 60%, 50%)"
  },
  {
    id: "COMPARISON" as QuizCategory,
    label: "مقارنة",
    color: "hsl(38, 92%, 55%)"
  },
  {
    id: "GEOMETRY" as QuizCategory,
    label: "أشكال",
    color: "hsl(142, 60%, 45%)"
  },
];

const questions: Record<string, { q: string; options: string[]; answer: number }> = {
  "جمع": { q: "اشترى أحمد ٧ تفاحات و ٥ برتقالات. كم فاكهة لديه؟", options: ["١٠", "١٢", "١١", "١٣"], answer: 1 },
  "طرح": { q: "كان لدى سارة ١٥ قلمًا، أعطت ٦ لصديقتها. كم بقي؟", options: ["٨", "٩", "٧", "١٠"], answer: 1 },
  "ضرب": { q: "إذا كان لكل طالب ٣ كتب و عدد الطلاب ٤، كم كتابًا؟", options: ["١٢", "١٠", "٧", "١٥"], answer: 0 },
  "قسمة": { q: "وزّع المعلم ٢٠ حلوى على ٥ طلاب بالتساوي. كم لكل طالب؟", options: ["٣", "٥", "٤", "٦"], answer: 2 },
  "مقارنة": { q: "أيهما أكبر: ٤٥ أم ٥٤؟", options: ["٤٥", "٥٤", "متساويان", "لا يمكن"], answer: 1 },
  "أشكال": { q: "كم ضلعًا للمثلث؟", options: ["٤", "٢", "٣", "٥"], answer: 2 },
};

const QuizWheel = () => {
  const ref = useScrollReveal();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState<SpinWheelResponse | null>(null);
  const [pointEarned, setPointEarned] = useState<number>(0);
  const wheelRef = useRef<SVGSVGElement>(null);

  const segAngle = 360 / segments.length;

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);
    setSelected(null);
    setAnswered(null);
    setQuestion(null);

    const extraSpins = 360 * 5;
    const randomAngle = Math.random() * 360;
    const newRotation = rotation + extraSpins + randomAngle;
    setRotation(newRotation);

    setTimeout(async () => {
      // SVG 0° is at 3 o'clock; pointer is at 12 o'clock (top), which is 270° in SVG.
      // We add 90° to shift the reference so that segment 0 aligns with the top pointer.
      const finalAngle = newRotation % 360;
      const normalizedAngle = ((360 - finalAngle) + 270) % 360;
      const idx = Math.floor(normalizedAngle / segAngle) % segments.length;
      setSelected(segments[idx].id);

      const wheelSession = await getWheelSession();
      console.log(wheelSession);

      const response = await spinWheel(wheelSession.sessionId, segments[idx].id);

      setQuestion(response);
      setSpinning(false);
    }, 3200);

  };

  const getWheelSession = async (): Promise<{ sessionId: string }> => {
    if (localStorage.getItem('wheelSessionId'))
      return JSON.parse(localStorage.getItem('wheelSessionId') || '{}');

    const response = await startSession();

    localStorage.setItem("wheelSessionId", JSON.stringify(response));

    return response;
  }

  const handleAnswer = async (userAnswer: string) => {
    // Submit answer to backend
    const wheelSession = await getWheelSession();

    if (answered || !wheelSession || !question) return;

    setIsLoading(true);
    setAnswered(true);
    setPointEarned(question.points);

    try {

      const result = await submitAnswer(wheelSession.sessionId, question.id, userAnswer);
      setIsCorrect(result.isCorrect);

    } catch (error: any) {
      console.error("Failed to submit answer:", error);

      toast.error("فشل إرسال الإجابة");
      setAnswered(false);
    } finally {
      setIsLoading(false);
    }

  };

  const currentQ = selected ? questions[selected] : null;

  return (
    <section id="quiz" className="py-20 bg-card">
      <div ref={ref} className="container">
        <h2 className="font-cairo font-extrabold text-3xl md:text-4xl text-center text-foreground mb-4 animate-reveal-up">
          عجلة الاختبارات
        </h2>
        <p className="text-muted-foreground text-center text-lg mb-14 max-w-xl mx-auto animate-reveal-up stagger-1">
          أدِر العجلة واختبر معلوماتك — اجمع النقاط مع كل إجابة صحيحة!
        </p>

        <div className="flex flex-col lg:flex-row items-center gap-12 justify-center">
          {/* Wheel */}
          <div className="relative animate-reveal-up stagger-2">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-foreground" />

            <svg
              ref={wheelRef}
              width="280"
              height="280"
              viewBox="0 0 280 280"
              className="drop-shadow-lg"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? "transform 3.2s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
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
                      x={tx}
                      y={ty}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontWeight="bold"
                      fontSize="14"
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
              أدِر
            </button>
          </div>

          {/* Question area */}
          <div className="flex-1 max-w-md animate-reveal-up stagger-3">
            {/* Score */}
            <div className="flex items-center gap-3 mb-6 bg-primary/5 rounded-xl px-5 py-3">
              <span className="text-2xl">⭐</span>
              <span className="font-cairo font-bold text-foreground">نقاطك:</span>
              <span className="font-cairo font-extrabold text-primary text-2xl tabular-nums">{score}</span>
            </div>

            {question ? (
              <div className="bg-background rounded-2xl p-6 shadow-sm space-y-5">

                <QuestionRenderer
                  question={{
                    ...question,
                    createdAt: new Date(),
                    updatedAt: new Date()
                  } as Question}
                  onSubmit={handleAnswer}
                />
                {answered && isCorrect !== null && (
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {!isLoading && (isCorrect ? (
                        <>

                          <CheckCircle className="w-5 h-5 text-[hsl(var(--success))]" />
                          <span className="font-cairo font-bold text-[hsl(var(--success))]">إجابة صحيحة! +{pointEarned}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-destructive" />
                          <span className="font-cairo font-bold text-destructive">إجابة خاطئة</span>
                        </>
                      ))}
                    </div>
                    <button
                      disabled={isLoading}
                      className="flex items-center gap-1.5 gradient-hero text-primary-foreground
                                 font-cairo font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md
                                 transition-shadow active:scale-[0.97] disabled:opacity-50"
                      onClick={spin}
                    >
                      {isLoading ? "جاري التحميل..." : "أدر العجلة مرة أخرى"}

                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-background rounded-2xl p-10 shadow-sm text-center">
                <p className="text-muted-foreground font-cairo text-lg">
                  أدِر العجلة لتحصل على سؤالك!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizWheel;
