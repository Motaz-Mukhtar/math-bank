import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/services/auth.api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BadgesDisplay from "@/components/BadgesDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Star, Calendar, Loader2, Hash, Copy, Check, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, loading, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user || !fullName.trim()) {
      toast.error("الاسم مطلوب");
      return;
    }

    if (fullName.trim().length > 100) {
      toast.error("الاسم يجب أن يكون أقل من 100 حرف");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ 
        fullName: fullName.trim(),
        phone: phone.trim() || undefined
      });
      await refreshUser();
      toast.success("تم حفظ التعديلات بنجاح");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.error || "حدث خطأ أثناء حفظ البيانات");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return null;

  const initials = user.fullName?.charAt(0) || "؟";
  const joinDate = new Date(user.createdAt).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16 font-cairo" dir="rtl">
        <div className="container max-w-lg space-y-6">
          {/* Avatar section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shadow-lg shadow-primary/10">
              <UserIcon className="w-14 h-14 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{user.fullName}</h2>
          </div>

          {/* Info card */}
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">معلومات الحساب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="full-name" className="font-cairo font-semibold">
                  الاسم الكامل
                </Label>
                <Input
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="font-cairo"
                  maxLength={100}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-cairo font-semibold">
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="font-cairo"
                  dir="ltr"
                  placeholder="+966501234567"
                />
              </div>

              {/* Read-only info */}
              <div className="space-y-3 rounded-xl bg-muted/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">نوع الحساب</span>
                  <span className="font-bold text-foreground">
                    {user.role === "STUDENT" ? "طالب" : user.role === "PARENT" ? "ولي أمر" : "مدير"}
                  </span>
                </div>
                {user.role === "STUDENT" && user.academicNumber && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5" /> الرقم الأكاديمي
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-foreground tabular-nums tracking-widest" dir="ltr">
                        {user.academicNumber}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(user.academicNumber!);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors active:scale-95"
                        title="نسخ الرقم"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
                {user.role === "STUDENT" && user.profile && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" /> النقاط
                    </span>
                    <span className="font-bold text-primary tabular-nums">{user.profile.points}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> تاريخ الانضمام
                  </span>
                  <span className="font-semibold text-foreground">{joinDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">البريد الإلكتروني</span>
                  <span className="font-semibold text-foreground text-xs">{user.email}</span>
                </div>
              </div>

              {user.role === "STUDENT" && user.academicNumber && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center space-y-1">
                  <p className="text-xs text-muted-foreground font-cairo">شارك هذا الرقم مع ولي أمرك لربط حسابه بحسابك</p>
                  <p className="text-2xl font-extrabold text-primary tabular-nums tracking-[0.3em]" dir="ltr">
                    {user.academicNumber}
                  </p>
                </div>
              )}

              <Button
                onClick={handleSave}
                disabled={saving || (fullName.trim() === user.fullName && phone.trim() === (user.phone || ""))}
                className="w-full gap-2 font-cairo font-bold active:scale-[0.97]"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
            </CardContent>
          </Card>

          {/* Badges */}
          {user.role === "STUDENT" && user.profile && (
            <BadgesDisplay studentProfileId={user.profile.id} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
