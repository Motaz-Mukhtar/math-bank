import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "@/services/auth.api";
import { Calculator, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const SignupPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"STUDENT" | "PARENT">("STUDENT");
  const [childAcademicNumber, setChildAcademicNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون ٦ أحرف على الأقل");
      setLoading(false);
      return;
    }

    try {
      await register({
        fullName,
        email,
        phone: phone || undefined,
        password,
        role,
        childAcademicNumber: role === "PARENT" && childAcademicNumber ? childAcademicNumber : undefined,
      });

      setSuccess(true);
      toast.success("تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "حدث خطأ أثناء إنشاء الحساب";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-sm text-center">
          <div className="bg-card rounded-2xl p-8 shadow-sm space-y-4">
            <div className="text-5xl">📧</div>
            <h2 className="font-cairo font-extrabold text-xl text-foreground">تحقق من بريدك الإلكتروني</h2>
            <p className="text-muted-foreground font-cairo text-sm leading-relaxed">
              أرسلنا رمز تأكيد مكون من 6 أرقام إلى <strong className="text-foreground">{email}</strong>. 
              أدخل الرمز لتفعيل حسابك.
            </p>
            <button
              onClick={() => navigate("/verify-email", { state: { email } })}
              className="inline-block gradient-hero text-primary-foreground font-cairo font-bold px-6 py-2.5 rounded-xl mt-2"
            >
              إدخال رمز التأكيد
            </button>
            <Link
              to="/login"
              className="block text-primary text-sm font-cairo hover:underline mt-2"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-cairo font-extrabold text-2xl">
            <Calculator className="w-8 h-8" />
            <span>بنك الرياضيات</span>
          </Link>
          <p className="text-muted-foreground font-cairo mt-2">أنشئ حسابك الجديد</p>
        </div>

        <form onSubmit={handleSignup} className="bg-card rounded-2xl p-6 shadow-sm space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm font-cairo rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* User type selector */}
          <div>
            <label className="block font-cairo font-semibold text-foreground text-sm mb-2">نوع الحساب</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all active:scale-[0.97] font-cairo ${
                  role === "STUDENT"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                <span className="text-2xl">🎒</span>
                <span className="font-bold text-sm">طالب</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("PARENT")}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all active:scale-[0.97] font-cairo ${
                  role === "PARENT"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                <span className="text-2xl">👨‍👩‍👧</span>
                <span className="font-bold text-sm">ولي أمر</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-cairo font-semibold text-foreground text-sm mb-1.5">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-background border border-input rounded-xl pr-11 pl-4 py-3 font-cairo text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="أدخل اسمك الكامل"
                maxLength={100}
              />
            </div>
          </div>

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
            <label className="block font-cairo font-semibold text-foreground text-sm mb-1.5">
              رقم الهاتف <span className="text-muted-foreground">(اختياري)</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-background border border-input rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="+966 XX XXX XXXX"
                dir="ltr"
              />
            </div>
          </div>

          {/* Academic number for parents */}
          {role === "PARENT" && (
            <div>
              <label className="block font-cairo font-semibold text-foreground text-sm mb-1.5">
                الرقم الأكاديمي للطالب <span className="text-muted-foreground">(اختياري)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={childAcademicNumber}
                  onChange={(e) => setChildAcademicNumber(e.target.value)}
                  className="w-full bg-background border border-input rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="أدخل الرقم الأكاديمي لربط حساب الطالب"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-muted-foreground font-cairo mt-1.5">
                يمكنك ربط حساب طالب بحسابك الآن أو لاحقاً من لوحة التحكم
              </p>
            </div>
          )}

          <div>
            <label className="block font-cairo font-semibold text-foreground text-sm mb-1.5">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-input rounded-xl pr-11 pl-11 py-3 font-cairo text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="٦ أحرف على الأقل"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-hero text-primary-foreground font-cairo font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </button>

          <p className="text-center text-muted-foreground text-sm font-cairo">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
