import { Video, Trophy, Star, Users } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: Video,
    title: "فيديوهات تعليمية",
    desc: "فيديوهات مسجّلة لحل المسائل اللفظية مصنفة حسب الدروس",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Star,
    title: "عجلة الاختبارات",
    desc: "اختبر مهاراتك عبر عجلة تفاعلية تختار لك أسئلة عشوائية",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Trophy,
    title: "نظام النقاط والترتيب",
    desc: "اجمع النقاط من الإجابات الصحيحة وتنافس مع زملائك",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Users,
    title: "حساب ولي الأمر",
    desc: "تابع أداء طفلك ونقاطه وترتيبه في الاختبارات بسهولة",
    color: "bg-primary/10 text-primary",
  },
];

const FeaturesSection = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-20 bg-card">
      <div ref={ref} className="container">
        <h2 className="font-cairo font-extrabold text-3xl md:text-4xl text-center text-foreground mb-4 animate-reveal-up">
          مميزات المنصة
        </h2>
        <p className="text-muted-foreground text-center text-lg mb-14 max-w-xl mx-auto animate-reveal-up stagger-1">
          أدوات تعليمية مبتكرة تجعل تعلّم الرياضيات مغامرة ممتعة
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`animate-reveal-up stagger-${i + 1} group bg-background rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300`}
            >
              <div className={`w-14 h-14 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="font-cairo font-bold text-lg text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
