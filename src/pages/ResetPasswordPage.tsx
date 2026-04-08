import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPassword } from "@/services/auth.api";
import { Calculator, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("البريد الإلكتروني مفقود. يرجى طلب رمز جديد.");
      return;
    }

    if (code.length !== 6) {
      setError("يرجى إدخال رمز مكون من 6 أرقام");
      return;
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون ٦ أحرف على الأقل");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await resetPassword({ email, code, newPassword: password });
      toast.success("تم تغيير كلمة المرور بنجاح!");
      navigate("/login");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "رمز إعادة التعيين غير صحيح";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-cairo font-extrabold text-2xl">
            <Calculator className="w-8 h-8" />
            <span>بنك الرياضيات</span>
          </Link>
          <p className="text-muted-foreground font-cairo mt-2">تعيين كلمة مرور جديدة</p>
        </div>

        <form onSubmit={handleReset} className="bg-card rounded-2xl p-6 shadow-sm space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm font-cairo rounded-xl px-4 py-3">{error}</div>
          )}

          <div>
            <label className="block font-cairo font-semibold text-foreground text-sm mb-1.5">رمز إعادة التعيين</label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
                dir="ltr"
              >
                <InputOTPGroup className="flex-row-reverse">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div>
            <label className="block font-cairo font-semibold text-foreground text-sm mb-1.5">كلمة المرور الجديدة</label>
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
            disabled={loading || code.length !== 6}
            className="w-full gradient-hero text-primary-foreground font-cairo font-bold py-3 rounded-xl shadow-md active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "جاري الحفظ..." : "حفظ كلمة المرور"}
          </button>

          <p className="text-center text-muted-foreground text-sm font-cairo">
            <Link to="/login" className="text-primary font-bold hover:underline">العودة لتسجيل الدخول</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
