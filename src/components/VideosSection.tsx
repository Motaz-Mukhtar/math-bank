import { Play, BookOpen } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";

const lessons = [
  { title: "الجمع والطرح اللفظي", count: 5, color: "gradient-hero" },
  { title: "الضرب بطريقة سهلة", count: 4, color: "gradient-warm" },
  { title: "القسمة للمبتدئين", count: 3, color: "gradient-accent" },
  { title: "مسائل الأشكال الهندسية", count: 4, color: "gradient-hero" },
  { title: "القياس والمقارنة", count: 3, color: "gradient-warm" },
  { title: "الكسور البسيطة", count: 5, color: "gradient-accent" },
];

const VideosSection = () => {
  const ref = useScrollReveal();

  return (
    <section id="videos" className="py-20">
      <div ref={ref} className="container">
        <h2 className="font-cairo font-extrabold text-3xl md:text-4xl text-center text-foreground mb-4 animate-reveal-up">
          الفيديوهات التعليمية
        </h2>
        <p className="text-muted-foreground text-center text-lg mb-14 max-w-xl mx-auto animate-reveal-up stagger-1">
          فيديوهات مصنفة حسب الدروس لحل المسائل اللفظية بطريقة مبسّطة
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((l, i) => (
            <Link
              to="/videos"
              key={l.title}
              className={`animate-reveal-up stagger-${(i % 4) + 1} group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300`}
            >
              <div className={`${l.color} h-40 flex items-center justify-center`}>
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-white fill-white mr-[-2px]" />
                </div>
              </div>
              <div className="bg-card p-5">
                <h3 className="font-cairo font-bold text-foreground mb-2">{l.title}</h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>{l.count} فيديوهات</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosSection;
