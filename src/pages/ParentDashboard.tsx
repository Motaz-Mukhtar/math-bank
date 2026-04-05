import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { linkChild, getChildren, type Child } from "@/services/parent.api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudentPointsChart from "@/components/StudentPointsChart";
import StudentQuizHistory from "@/components/StudentQuizHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Users, Star, TrendingUp, UserPlus, Search, BarChart3, BookOpen,
  ChevronLeft, ChevronRight, Loader2, GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 5;

const ParentDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Child[]>([]);
  const [academicNumber, setAcademicNumber] = useState("");
  const [searching, setSearching] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const paginatedStudents = students.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/login");
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) fetchLinkedStudents();
  }, [isAuthenticated]);

  const fetchLinkedStudents = async () => {
    try {
      setLoadingStudents(true);
      const data = await getChildren();
      setStudents(data);
    } catch (error: any) {
      console.error("Failed to fetch children:", error);
      toast.error(error.response?.data?.error || "فشل تحميل قائمة الأبناء");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleAddStudent = async () => {
    const trimmed = academicNumber.trim();
    if (!trimmed) return;

    if (!/^std-\d{10}$/.test(trimmed)) {
      toast.error("الرقم الأكاديمي غير صحيح — يجب أن يكون بصيغة std-XXXXXXXXXX");
      return;
    }

    setSearching(true);
    try {
      await linkChild(trimmed);
      toast.success("تم ربط الطالب بنجاح");
      setAcademicNumber("");
      fetchLinkedStudents();
    } catch (error: any) {
      console.error("Failed to link child:", error);
      toast.error(error.response?.data?.error || "فشل ربط الطالب");
    } finally {
      setSearching(false);
    }
  };

  const maxPoints = Math.max(...students.map((s) => s.points), 100);

  if (loading) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16 font-cairo" dir="rtl">
        <div className="container max-w-4xl space-y-8">

          {/* Header */}
          <div className="space-y-1 animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="text-3xl font-extrabold text-foreground leading-tight">
              لوحة تحكم ولي الأمر
            </h1>
            <p className="text-muted-foreground text-base">
              تابع أداء أبنائك ونقاطهم في بنك الرياضيات
            </p>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <Card className="shadow-md shadow-primary/5 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="flex items-center gap-3 p-5">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground tabular-nums">{students.length}</p>
                  <p className="text-xs text-muted-foreground">طالب مرتبط</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md shadow-secondary/5 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="flex items-center gap-3 p-5">
                <div className="rounded-xl bg-secondary/10 p-3">
                  <Star className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground tabular-nums">
                    {students.reduce((sum, s) => sum + (s.points || 0), 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">إجمالي النقاط</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add student */}
          <Card className="shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                ربط طالب جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                أدخل الرقم الأكاديمي للطالب لربطه بحسابك
              </p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="student-search" className="sr-only">الرقم الأكاديمي</Label>
                  <div className="relative">
                    <GraduationCap className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="student-search"
                      type="text"
                      placeholder="std-0248673313"
                      value={academicNumber}
                      onChange={(e) => setAcademicNumber(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddStudent()}
                      className="font-cairo pr-10"
                      dir="ltr"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    الصيغة: std- متبوعة بـ ١٠ أرقام
                  </p>
                </div>
                <Button
                  onClick={handleAddStudent}
                  disabled={searching || !academicNumber.trim()}
                  className="gap-2 font-cairo font-bold active:scale-[0.97] self-start"
                >
                  {searching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {searching ? "جاري الربط..." : "ربط"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Students list */}
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                أداء الطلاب
              </h2>
              {students.length > 0 && (
                <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  {students.length} طالب
                </span>
              )}
            </div>

            {loadingStudents ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-5">
                      <div className="h-16 bg-muted rounded-lg" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : students.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="p-8 text-center space-y-3">
                  <Users className="w-12 h-12 text-muted-foreground/40 mx-auto" />
                  <p className="text-muted-foreground font-semibold">لم يتم ربط أي طالب بعد</p>
                  <p className="text-sm text-muted-foreground">
                    أدخل الرقم الأكاديمي للطالب أعلاه لربطه بحسابك
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedStudents.map((student, idx) => (
                    <Card
                      key={student.childId}
                      className="shadow-md shadow-primary/5 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 ring-2 ring-primary/20">
                              <span className="text-primary font-bold text-lg">
                                {student.fullName.charAt(0) || "؟"}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-foreground truncate">{student.fullName || "بدون اسم"}</p>
                              <p className="text-xs text-muted-foreground font-mono">{student.academicNumber || "—"}</p>
                              <p className="text-xs text-muted-foreground">الترتيب: #{student.rank || "—"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">النقاط</span>
                              <span className="font-bold text-primary tabular-nums">⭐ {student.points}</span>
                            </div>
                            <Progress value={(student.points / maxPoints) * 100} className="h-2.5 bg-muted" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="gap-1 font-cairo"
                    >
                      <ChevronRight className="w-4 h-4" />
                      السابق
                    </Button>
                    <span className="text-sm text-muted-foreground font-cairo tabular-nums">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="gap-1 font-cairo"
                    >
                      التالي
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quiz history */}
          {students.length > 0 && (
            <div className="space-y-4 animate-in fade-in duration-500 delay-300">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                نتائج الاختبارات
              </h2>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.childId} className="space-y-2">
                    <p className="font-cairo font-semibold text-sm text-muted-foreground">
                      {student.fullName || "طالب"}
                    </p>
                    <StudentQuizHistory
                      studentProfileId={student.childId}
                      studentName={student.fullName || "طالب"}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Points charts */}
          {students.length > 0 && (
            <div className="space-y-4 animate-in fade-in duration-500 delay-400">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                تطور النقاط بمرور الوقت
              </h2>
              <div className="space-y-4">
                {students.map((student) => (
                  <StudentPointsChart
                    key={student.childId}
                    studentProfileId={student.childId}
                    studentName={student.fullName || "طالب"}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ParentDashboard;
