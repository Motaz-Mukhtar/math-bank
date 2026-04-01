import { Trophy, Medal } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect, useState } from "react";
import { getLeaderboard } from "@/services/leaderboard.api";

const students = [
  { name: "عبدالله محمد", points: 385, grade: "٣/أ" },
  { name: "نورة السالم", points: 340, grade: "٣/ب" },
  { name: "فهد العتيبي", points: 312, grade: "٣/أ" },
  { name: "ريم الحربي", points: 287, grade: "٣/ج" },
  { name: "سلطان الدوسري", points: 265, grade: "٣/ب" },
  { name: "لمى الشمري", points: 241, grade: "٣/أ" },
  { name: "خالد الغامدي", points: 223, grade: "٣/ج" },
];

const rankStyles = [
  "gradient-warm text-white",
  "bg-muted text-foreground",
  "bg-secondary/20 text-secondary",
];

const Leaderboard = () => {
  const ref = useScrollReveal();

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const response = await getLeaderboard();

    setStudents(response.topStudents);
  };

  return (
    <section id="leaderboard" className="py-20">
      <div ref={ref} className="container max-w-2xl">
        <h2 className="font-cairo font-extrabold text-3xl md:text-4xl text-center text-foreground mb-4 animate-reveal-up">
          لوحة المتصدرين
        </h2>
        <p className="text-muted-foreground text-center text-lg mb-14 max-w-xl mx-auto animate-reveal-up stagger-1">
          أفضل الطلاب أداءً هذا الأسبوع
        </p>

        {/* Top 3 podium */}
        <div className="flex justify-center items-end gap-4 mb-10 animate-reveal-up stagger-2">
          {[1, 0, 2].map((rank) => {
            const s = students[rank];
            const isFirst = rank === 0;
            return (
              <div key={s?.id} className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${rankStyles[rank]} flex items-center justify-center font-cairo font-extrabold text-xl md:text-2xl shadow-md ${isFirst ? "ring-4 ring-secondary/30 scale-110" : ""}`}
                >
                  {s?.fullName.charAt(0)}
                </div>
                <p className="font-cairo font-bold text-foreground mt-2 text-sm md:text-base">{s?.fullName}</p>
                <p className="font-cairo text-primary font-extrabold tabular-nums">{s?.profile?.points}</p>
                <div
                  className={`mt-2 rounded-t-lg ${isFirst ? "gradient-warm h-24 w-20 md:w-24" : rank === 1 ? "gradient-hero h-16 w-16 md:w-20" : "gradient-accent h-12 w-16 md:w-20"}`}
                />
              </div>
            );
          })}
        </div>

        {/* Rest */}
        <div className="space-y-3 animate-reveal-up stagger-3">
          {students?.slice(3).map((s, i) => (
            <div
              key={s?.id}
              className="flex items-center gap-4 bg-card rounded-xl px-5 py-3 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <span className="font-cairo font-bold text-muted-foreground w-8 text-center tabular-nums">
                {i + 4}
              </span>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-cairo font-bold text-foreground">
                {s?.fullName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-cairo font-bold text-foreground text-sm">{s?.fullName}</p>
                <p className="text-muted-foreground text-xs">{s?.profile?.grade}</p>
              </div>
              <span className="font-cairo font-extrabold text-primary tabular-nums">{s?.profile?.points}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
