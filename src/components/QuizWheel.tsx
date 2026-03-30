import { useState, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const segments = [
  { label: "جمع", color: "hsl(174, 58%, 40%)" },
  { label: "طرح", color: "hsl(28, 92%, 58%)" },
  { label: "ضرب", color: "hsl(340, 72%, 58%)" },
  { label: "قسمة", color: "hsl(190, 60%, 50%)" },
  { label: "مقارنة", color: "hsl(38, 92%, 55%)" },
  { label: "أشكال", color: "hsl(142, 60%, 45%)" },
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
  const [answered, setAnswered] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);

  const segAngle = 360 / segments.length;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setSelected(null);
    setAnswered(null);

    const extraSpins = 360 * 5;
    const randomAngle = Math.random() * 360;
    const newRotation = rotation + extraSpins + randomAngle;
    setRotation(newRotation);

    setTimeout(() => {
      const normalizedAngle = (360 - (newRotation % 360)) % 360;
      const idx = Math.floor(normalizedAngle / segAngle) % segments.length;
      setSelected(segments[idx].label);
      setSpinning(false);
    }, 3200);
  };

  const handleAnswer = (idx: number) => {
    if (!selected || answered !== null) return;
    setAnswered(idx);
    if (idx === questions[selected].answer) {
      setScore((s) => s + 10);
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

            {currentQ ? (
              <div className="bg-background rounded-2xl p-6 shadow-sm space-y-5">
                <p className="font-cairo font-bold text-foreground text-lg leading-relaxed">
                  {currentQ.q}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {currentQ.options.map((opt, idx) => {
                    let cls =
                      "font-cairo font-semibold rounded-xl px-4 py-3 border-2 transition-all duration-200 active:scale-[0.97] ";
                    if (answered === null) {
                      cls += "border-border hover:border-primary hover:bg-primary/5 cursor-pointer";
                    } else if (idx === currentQ.answer) {
                      cls += "border-[hsl(var(--success))] bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]";
                    } else if (idx === answered) {
                      cls += "border-destructive bg-destructive/10 text-destructive";
                    } else {
                      cls += "border-border opacity-50";
                    }

                    return (
                      <button key={idx} onClick={() => handleAnswer(idx)} className={cls}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {answered !== null && (
                  <p className={`font-cairo font-bold text-center ${answered === currentQ.answer ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
                    {answered === currentQ.answer ? "🎉 إجابة صحيحة! +١٠ نقاط" : "❌ حاول مرة أخرى"}
                  </p>
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
