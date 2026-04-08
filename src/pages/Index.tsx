import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import VideosSection from "@/components/VideosSection";
import Footer from "@/components/Footer";
import LeaderboardSection from "@/components/LeaderboardSection";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, BookOpen, Zap } from "lucide-react";

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) {
    return (
      <section className="py-20 text-center">
        <div className="container max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-cairo font-extrabold text-2xl text-foreground">سجّل دخولك للمتابعة</h2>
          <p className="text-muted-foreground font-cairo">
            يجب تسجيل الدخول للوصول إلى الفيديوهات والاختبارات والترتيب
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/login"
              className="border-2 border-primary text-primary font-cairo font-bold px-6 py-2.5 rounded-full hover:bg-primary/5 transition-colors active:scale-[0.97]"
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/signup"
              className="gradient-hero text-primary-foreground font-cairo font-bold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-shadow active:scale-[0.97]"
            >
              إنشاء حساب
            </Link>
          </div>
        </div>
      </section>
    );
  }
  return <>{children}</>;
};

// Two quick-action cards replacing the wheel section
const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 bg-card">
      <div className="container max-w-3xl">
        <h2 className="font-cairo font-extrabold text-2xl md:text-3xl text-center text-foreground mb-2">
          ابدأ التعلم الآن
        </h2>
        <p className="text-muted-foreground text-center font-cairo mb-10">
          اختر نشاطك واكسب النقاط
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Quizzes card */}
          <button
            onClick={() => navigate("/quizzes")}
            className="group bg-background rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-200 active:scale-[0.97] text-center space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-200">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-cairo font-extrabold text-xl text-foreground">الاختبارات</h3>
            <p className="font-cairo text-sm text-muted-foreground leading-relaxed">
              اختر موضوعاً ومستوى الصعوبة واجب على ١٠ أسئلة لتكسب النقاط
            </p>
            <span className="inline-block font-cairo text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
              ٣ مستويات صعوبة
            </span>
          </button>

          {/* Wheel card */}
          <button
            onClick={() => navigate("/wheel")}
            className="group bg-background rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg hover:border-secondary/30 hover:-translate-y-1 transition-all duration-200 active:scale-[0.97] text-center space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto group-hover:bg-secondary/20 transition-colors duration-200">
              <Zap className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="font-cairo font-extrabold text-xl text-foreground">عجلة الاختبارات</h3>
            <p className="font-cairo text-sm text-muted-foreground leading-relaxed">
              أدِر العجلة واحصل على سؤال عشوائي من فئات مختلفة
            </p>
            <span className="inline-block font-cairo text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
              ٦ فئات رياضية
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const { refreshUser, user } = useAuth();

  // Refresh user points when visiting home page
  useEffect(() => {
    if (user) {
      refreshUser();
    }
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AuthGate>
        <VideosSection />
        <QuickActions />
        <LeaderboardSection />
      </AuthGate>
      <Footer />
    </>
  );
};

export default Index;
