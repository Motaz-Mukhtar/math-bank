import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyEmail } from "@/services/auth.api";
import { Calculator } from "lucide-react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("البريد الإلكتروني مفقود. يرجى التسجيل مرة أخرى.");
      return;
    }

    if (code.length !== 6) {
      setError("يرجى إدخال رمز مكون من 6 أرقام");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await verifyEmail({ email, code });
      toast.success("تم تفعيل حسابك بنجاح!");
      navigate("/login");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "رمز التأكيد غير صحيح";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
          <p className="text-muted-foreground font-cairo mt-2">تأكيد البريد الإلكتروني</p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm space-y-4">
          <div className="text-center space-y-2">
            <div className="text-5xl">📧</div>
            <h2 className="font-cairo font-extrabold text-xl text-foreground">أدخل رمز التأكيد</h2>
            <p className="text-muted-foreground font-cairo text-sm leading-relaxed">
              أرسلنا رمز مكون من 6 أرقام إلى <strong className="text-foreground">{email}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm font-cairo rounded-xl px-4 py-3">
                {error}
              </div>
            )}

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

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full gradient-hero text-primary-foreground font-cairo font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "جاري التأكيد..." : "تأكيد الحساب"}
            </button>

            <p className="text-center text-muted-foreground text-sm font-cairo">
              لم تستلم الرمز؟{" "}
              <button
                type="button"
                className="text-primary font-bold hover:underline"
                onClick={() => toast.info("يرجى الانتظار قليلاً ثم التحقق من صندوق البريد")}
              >
                إعادة الإرسال
              </button>
            </p>

            <p className="text-center text-muted-foreground text-sm font-cairo">
              <Link to="/login" className="text-primary font-bold hover:underline">
                العودة لتسجيل الدخول
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
