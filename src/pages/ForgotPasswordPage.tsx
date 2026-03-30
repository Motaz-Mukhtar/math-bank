import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "@/services/auth.api";
import { Calculator, Mail } from "lucide-react";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword({ email });
      setSent(true);
      toast.success("تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "حدث خطأ أثناء إرسال الرمز";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-sm text-center bg-card rounded-2xl p-8 shadow-sm space-y-4">
          <div className="text-5xl">📧</div>
          <h2 className="font-cairo font-extrabold text-xl text-foreground">تحقق من بريدك</h2>
          <p className="text-muted-foreground font-cairo text-sm leading-relaxed">
            أرسلنا رمز إعادة تعيين كلمة المرور مكون من 6 أرقام إلى <strong className="text-foreground">{email}</strong>
          </p>
          <button
            onClick={() => navigate("/reset-password", { state: { email } })}
            className="inline-block gradient-hero text-primary-foreground font-cairo font-bold px-6 py-2.5 rounded-xl"
          >
            إدخال رمز إعادة التعيين
          </button>
          <Link to="/login" className="block text-primary text-sm font-cairo hover:underline mt-2">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-cairo font-extrabold text-2xl">
            <Calculator className="w-8 h-8" />
            <span>بنك الرياضيات</span>
          </Link>
          <p className="text-muted-foreground font-cairo mt-2">استعادة كلمة المرور</p>
        </div>

        <form onSubmit={handleReset} className="bg-card rounded-2xl p-6 shadow-sm space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm font-cairo rounded-xl px-4 py-3">{error}</div>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-hero text-primary-foreground font-cairo font-bold py-3 rounded-xl shadow-md active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "جاري الإرسال..." : "إرسال رابط الاستعادة"}
          </button>

          <p className="text-center text-muted-foreground text-sm font-cairo">
            <Link to="/login" className="text-primary font-bold hover:underline">العودة لتسجيل الدخول</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
