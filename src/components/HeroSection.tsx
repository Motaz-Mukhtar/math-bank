import heroImg from "@/assets/hero-kids.png";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const HeroSection = () => {
  const ref = useScrollReveal();

  return (
    <section
      id="home"
      className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />

      <div ref={ref} className="container flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Text */}
        <div className="flex-1 text-center md:text-right space-y-6 animate-reveal-up">
          <h1 className="font-cairo font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.15] text-balance text-foreground">
            تعلّم الرياضيات
            <br />
            <span className="text-primary">بطريقة ممتعة!</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto md:mx-0 leading-relaxed">
            منصة تفاعلية لطلاب الصف الثالث الابتدائي لتعزيز حل المسائل اللفظية الرياضية عبر فيديوهات واختبارات مشوّقة
          </p>
          <div className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl px-5 py-4 max-w-lg mx-auto md:mx-0 space-y-1.5">
            <p className="font-cairo font-bold text-sm text-foreground">
              مبادرة من روضة وابتدائية ومتوسطة تحفيظ القرآن بالعيدابي
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-cairo">
              <span>الأستاذة: <strong className="text-foreground/80">إيمان طميحي</strong></span>
              <span>مديرة المدرسة: <strong className="text-foreground/80">ليلى حسن</strong></span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#quiz"
              className="gradient-hero text-primary-foreground font-cairo font-bold px-8 py-3.5 rounded-full text-lg shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-300 active:scale-[0.97]"
            >
              جرّب الاختبار الآن
            </a>
            <a
              href="#videos"
              className="bg-card border-2 border-primary/20 text-primary font-cairo font-bold px-8 py-3.5 rounded-full text-lg hover:bg-primary/5 transition-colors duration-200 active:scale-[0.97]"
            >
              شاهد الفيديوهات
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center animate-reveal-up stagger-2">
          <img
            src={heroImg}
            alt="أطفال يتعلمون الرياضيات"
            className="w-full max-w-md animate-float"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
