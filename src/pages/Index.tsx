import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import VideosSection from "@/components/VideosSection";
import QuizWheel from "@/components/QuizWheel";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import LeaderboardSection from "@/components/LeaderboardSection";

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
          <p className="text-muted-foreground font-cairo">يجب تسجيل الدخول للوصول إلى الفيديوهات والاختبارات والترتيب</p>
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

const Index = () => (
  <>
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <AuthGate>
      <VideosSection />
      <QuizWheel />
      {/* <Leaderboard /> */}
      <LeaderboardSection />
    </AuthGate>
    <Footer />
  </>
);

export default Index;
