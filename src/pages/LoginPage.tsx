import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { login, resendVerification } from "@/services/auth.api";
import { Calculator, Mail, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user, accessToken } = await login({ email, password });
      
      setAuth(user, accessToken);
      toast.success("تم تسجيل الدخول بنجاح");
      
      // Navigate based on role
      if (user.role === 'ADMIN') {
        navigate("/admin");
      } else if (user.role === 'PARENT') {
        navigate("/parent-dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "حدث خطأ أثناء تسجيل الدخول";
      const statusCode = err.response?.data?.statusCode;
      
      // Check if account is not verified
      if (statusCode === 403 && errorMessage.includes("تفعيل")) {
        toast.error(errorMessage, {
          duration: 8000,
          position: 'top-center',
          action: {
            label: "إعادة إرسال رمز التحقق",
            onClick: async () => {
              try {
                await resendVerification({ email });
                toast.success("تم إرسال رمز التحقق بنجاح");
                navigate("/verify-email", { state: { email } });
              } catch (resendErr: any) {
                toast.error(resendErr.response?.data?.error || "فشل إرسال رمز التحقق");
              }
            },
          },
        });
      } else {
        toast.error(errorMessage, {
          duration: 5000,
          position: 'top-center'
        });
      }
      
      setLoading(false);
      return;
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-cairo font-extrabold text-2xl">
            <Calculator className="w-8 h-8" />
            <span>بنك الرياضيات</span>
          </Link>
          <p className="text-muted-foreground font-cairo mt-2">سجّل دخولك للمتابعة</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-2xl p-6 shadow-sm space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm font-cairo rounded-xl px-4 py-3 border border-destructive/20 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{error}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block font-cairo font-semibold text-foreground text-sm mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-input rounded-xl pr-11 pl-4 py-3 font-cairo text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block font-cairo font-semibold text-foreground text-sm mb-1.5">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-input rounded-xl pr-11 pl-11 py-3 font-cairo text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="text-left">
            <Link to="/forgot-password" className="text-primary text-sm font-cairo hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-hero text-primary-foreground font-cairo font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
          </button>

          <p className="text-center text-muted-foreground text-sm font-cairo">
            ليس لديك حساب؟{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
