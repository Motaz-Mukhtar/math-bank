import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getDashboardStats, 
  getLinkStats,
  getRegistrationChart,
  getTopStudents,
  getPointsDistribution,
  getUsers, 
  updateUser, 
  deleteUser, 
  exportUsers,
  type DashboardStats,
  type UserWithPoints
} from "@/services/admin.api";
import Navbar from "@/components/Navbar";
import AdminAnalytics from "@/components/AdminAnalytics";
import AdminContentManager from "@/components/AdminContentManager";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users, GraduationCap, UserCheck, Download, Search, ShieldCheck,
  Star, Loader2, Pencil, Trash2,
} from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<UserWithPoints[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");

  // Edit state
  const [editingUser, setEditingUser] = useState<UserWithPoints | null>(null);
  const [editName, setEditName] = useState("");
  const [editPoints, setEditPoints] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deletingUser, setDeletingUser] = useState<UserWithPoints | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [
        dashboardStats,
        linkStats,
        registrationChart,
        topStudents,
        pointsDistribution,
        usersData
      ] = await Promise.all([
        getDashboardStats(),
        getLinkStats(),
        getRegistrationChart(30),
        getTopStudents(10),
        getPointsDistribution(),
        getUsers()
      ]);

      // Combine all stats into the format AdminAnalytics expects
      const combinedStats = {
        totalUsers: dashboardStats.totalAccounts,
        totalStudents: dashboardStats.totalStudents,
        totalParents: dashboardStats.totalParents,
        linkedStudents: linkStats.linkedStudents,
        recentRegistrations: dashboardStats.registeredThisWeek,
        averagePoints: dashboardStats.avgPoints,
        totalLinks: linkStats.totalLinks,
        linkedParents: linkStats.linkedParents,
        topStudents: topStudents.map(s => ({
          name: s.fullName,
          points: s.total
        })),
        registrationChart,
        pointsDistribution,
      };

      setStats(combinedStats);
      setUsers(usersData.users);
    } catch (error: any) {
      console.error("Failed to fetch admin data:", error);
      toast.error(error.response?.data?.error || "فشل تحميل البيانات");
    } finally {
      setLoadingData(false);
    }
  };

  const handleEdit = (u: UserWithPoints) => {
    setEditingUser(u);
    setEditName(u.fullName);
    setEditPoints(String(u.points || 0));
  };

  const handleSaveEdit = async () => {
    if (!editingUser || !editName.trim()) return;
    setSaving(true);
    try {
      await updateUser(editingUser.id, {
        fullName: editName.trim(),
        points: editingUser.role === "STUDENT" ? parseInt(editPoints) || 0 : undefined,
      });
      toast.success("تم تحديث البيانات بنجاح");
      setEditingUser(null);
      fetchData();
    } catch (error: any) {
      console.error("Failed to update user:", error);
      toast.error(error.response?.data?.error || "حدث خطأ أثناء التحديث");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setDeleting(true);
    try {
      await deleteUser(deletingUser.id);
      toast.success(`تم حذف حساب "${deletingUser.fullName}" بنجاح`);
      setDeletingUser(null);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      toast.error(error.response?.data?.error || "حدث خطأ أثناء الحذف");
    } finally {
      setDeleting(false);
    }
  };

  const students = users.filter((u) => u.role === "STUDENT");
  const parents = users.filter((u) => u.role === "PARENT");

  const filtered = users.filter((u) =>
    !search.trim() ||
    u.fullName.includes(search) ||
    u.email.includes(search)
  );

  const handleExport = async () => {
    try {
      const usersData = await exportUsers('all');
      
      // Convert to CSV
      const headers = ['الاسم', 'البريد الإلكتروني', 'النوع', 'الرقم الأكاديمي', 'النقاط', 'تاريخ التسجيل'];
      const rows = usersData.map(u => [
        u.fullName,
        u.email,
        u.role === 'STUDENT' ? 'طالب' : 'ولي أمر',
        u.academicNumber || '-',
        u.points || 0,
        new Date(u.createdAt).toLocaleDateString('ar-SA')
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("تم تحميل التقرير");
    } catch (error: any) {
      console.error("Failed to export users:", error);
      toast.error(error.response?.data?.error || "فشل تصدير البيانات");
    }
  };

  if (authLoading) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16 font-cairo" dir="rtl">
        <div className="container max-w-5xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-foreground leading-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              لوحة إدارة النظام
            </h1>
            <p className="text-muted-foreground">عرض جميع الحسابات المسجلة واستخراج التقارير</p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <Card className="shadow-md shadow-primary/5">
                <CardContent className="flex items-center gap-3 p-5">
                  <div className="rounded-xl bg-primary/10 p-3"><Users className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="text-2xl font-bold text-foreground tabular-nums">{stats.totalUsers}</p>
                    <p className="text-xs text-muted-foreground">إجمالي الحسابات</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md shadow-primary/5">
                <CardContent className="flex items-center gap-3 p-5">
                  <div className="rounded-xl bg-secondary/10 p-3"><GraduationCap className="w-5 h-5 text-secondary" /></div>
                  <div>
                    <p className="text-2xl font-bold text-foreground tabular-nums">{stats.totalStudents}</p>
                    <p className="text-xs text-muted-foreground">طالب</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-md shadow-primary/5">
                <CardContent className="flex items-center gap-3 p-5">
                  <div className="rounded-xl bg-accent/30 p-3"><UserCheck className="w-5 h-5 text-foreground" /></div>
                  <div>
                    <p className="text-2xl font-bold text-foreground tabular-nums">{stats.totalParents}</p>
                    <p className="text-xs text-muted-foreground">ولي أمر</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reports */}
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                استخراج التقارير
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleExport} className="gap-2 font-cairo font-bold active:scale-[0.97]">
                  <Download className="w-4 h-4" />تصدير جميع المستخدمين
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Charts */}
          {!loadingData && stats && (
            <AdminAnalytics stats={stats} />
          )}

          {/* Content Management */}
          <AdminContentManager />

          {/* Search + Table */}
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-lg">جميع الحسابات المسجلة</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث بالاسم أو الرقم الأكاديمي..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pr-10 font-cairo text-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-cairo text-right">الاسم</TableHead>
                        <TableHead className="font-cairo text-right">النوع</TableHead>
                        <TableHead className="font-cairo text-right">البريد الإلكتروني</TableHead>
                        <TableHead className="font-cairo text-right">النقاط</TableHead>
                        <TableHead className="font-cairo text-right">تاريخ التسجيل</TableHead>
                        <TableHead className="font-cairo text-right w-24">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-cairo font-semibold">{u.fullName || "بدون اسم"}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 text-xs font-cairo font-bold px-2.5 py-1 rounded-full ${
                              u.role === "STUDENT" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                            }`}>
                              {u.role === "STUDENT" ? "طالب" : "ولي أمر"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm" dir="ltr">{u.email}</TableCell>
                          <TableCell>
                            {u.role === "STUDENT" ? (
                              <span className="flex items-center gap-1 text-primary font-bold tabular-nums">
                                <Star className="w-3.5 h-3.5" />{u.points || 0}
                              </span>
                            ) : "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(u.createdAt).toLocaleDateString("ar-SA")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEdit(u)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors active:scale-95"
                                title="تعديل"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              {u.id !== user?.id && (
                                <button
                                  onClick={() => setDeletingUser(u)}
                                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors active:scale-95"
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filtered.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8 font-cairo">
                            لا توجد نتائج
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      {/* Edit Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="font-cairo" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-cairo text-lg">تعديل بيانات الحساب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="font-cairo font-semibold">الاسم الكامل</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="font-cairo"
                maxLength={100}
              />
            </div>
            {editingUser?.role === "STUDENT" && (
              <div className="space-y-2">
                <Label className="font-cairo font-semibold">النقاط</Label>
                <Input
                  type="number"
                  min={0}
                  value={editPoints}
                  onChange={(e) => setEditPoints(e.target.value)}
                  className="font-cairo tabular-nums"
                  dir="ltr"
                />
              </div>
            )}
            <div className="rounded-xl bg-muted/50 p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">نوع الحساب</span>
                <span className="font-bold">{editingUser?.role === "STUDENT" ? "طالب" : "ولي أمر"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">البريد الإلكتروني</span>
                <span className="font-bold text-xs" dir="ltr">{editingUser?.email}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" className="font-cairo">إلغاء</Button>
            </DialogClose>
            <Button
              onClick={handleSaveEdit}
              disabled={saving || !editName.trim()}
              className="gap-2 font-cairo font-bold active:scale-[0.97]"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
              {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent className="font-cairo" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cairo text-lg">تأكيد حذف الحساب</AlertDialogTitle>
            <AlertDialogDescription className="font-cairo text-right leading-relaxed">
              هل أنت متأكد من حذف حساب <strong className="text-foreground">"{deletingUser?.fullName}"</strong>؟
              <br />
              سيتم حذف جميع بيانات المستخدم نهائياً ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="font-cairo">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2 font-cairo font-bold"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? "جاري الحذف..." : "حذف نهائياً"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminDashboard;
