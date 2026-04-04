import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  getDashboardStats, getLinkStats, getRegistrationChart,
  getTopStudents, getPointsDistribution, exportUsers,
  type UserWithPoints,
} from "@/services/admin.api";
import Navbar from "@/components/Navbar";
import AdminAnalytics from "@/components/AdminAnalytics";
import AdminContentManager from "@/components/AdminContentManager";
import Footer from "@/components/Footer";
import {
  AdminStatsSection,
  AdminExportSection,
  AdminUsersTable,
  AdminEditUserDialog,
  AdminDeleteUserDialog,
  VideoManagement,
  CategoryManagement,
} from "@/components/admin";
import { Loader2, ShieldCheck, LayoutDashboard, BarChart3, Settings, Database, Video } from "lucide-react";
import { toast } from "sonner";

type AdminSection = "overview" | "analytics" | "content" | "users" | "videos";

const AdminDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [editingUser, setEditingUser] = useState<UserWithPoints | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserWithPoints | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate("/login");
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) fetchStats();
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const [dashboardStats, linkStats, registrationChart, topStudents, pointsDistribution] =
        await Promise.all([
          getDashboardStats(), getLinkStats(), getRegistrationChart(30),
          getTopStudents(10), getPointsDistribution(),
        ]);
      setStats({
        totalUsers: dashboardStats.totalAccounts,
        totalStudents: dashboardStats.totalStudents,
        totalParents: dashboardStats.totalParents,
        linkedStudents: linkStats.linkedStudents,
        recentRegistrations: dashboardStats.registeredThisWeek,
        averagePoints: dashboardStats.avgPoints,
        totalLinks: linkStats.totalLinks,
        linkedParents: linkStats.linkedParents,
        topStudents: topStudents.map((s) => ({ name: s.fullName, points: s.total })),
        registrationChart,
        pointsDistribution,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "فشل تحميل الإحصائيات");
    } finally {
      setLoadingStats(false);
    }
  };

  const handleExport = async () => {
    try {
      const usersData = await exportUsers("all");
      const headers = ["الاسم", "البريد الإلكتروني", "النوع", "الرقم الأكاديمي", "النقاط", "تاريخ التسجيل"];
      const rows = usersData.map((u) => [
        u.fullName, u.email,
        u.role === "STUDENT" ? "طالب" : "ولي أمر",
        (u as any).academicNumber || "-",
        u.points || 0,
        new Date(u.createdAt).toLocaleDateString("ar-SA"),
      ]);
      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("تم تحميل التقرير");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "فشل تصدير البيانات");
    }
  };

  const handleUserMutated = () => {
    window.dispatchEvent(new Event("admin:refresh-users"));
  };

  if (authLoading) return null;

  const navItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview",  label: "نظرة عامة",      icon: LayoutDashboard },
    { id: "analytics", label: "الإحصائيات",      icon: BarChart3 },
    { id: "content",   label: "إدارة المحتوى",   icon: Settings },
    { id: "videos",    label: "الفيديوهات",      icon: Video },
    { id: "users",     label: "المستخدمون",       icon: Database },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16 font-cairo" dir="rtl">
        <div className="container max-w-6xl space-y-6">

          {/* Header */}
          <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="text-3xl font-extrabold text-foreground leading-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              لوحة إدارة النظام
            </h1>
            <p className="text-muted-foreground">إدارة شاملة للمنصة والمستخدمين والمحتوى</p>
          </div>

          {/* Section Nav */}
          <div className="flex gap-2 flex-wrap animate-in fade-in slide-in-from-top-2 duration-500 delay-75 border-b border-border pb-4">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold font-cairo transition-all duration-200 active:scale-95 ${
                  activeSection === id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* ── Overview ── */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              {loadingStats ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-7 h-7 animate-spin text-primary" />
                </div>
              ) : stats ? (
                <>
                  <AdminStatsSection stats={stats} />
                  <AdminExportSection onExport={handleExport} />
                </>
              ) : null}
            </div>
          )}

          {/* ── Analytics ── */}
          {activeSection === "analytics" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
              {loadingStats ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-7 h-7 animate-spin text-primary" />
                </div>
              ) : stats ? (
                <AdminAnalytics stats={stats} />
              ) : null}
            </div>
          )}

          {/* ── Content Management ── */}
          {activeSection === "content" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
              <AdminContentManager />
            </div>
          )}

          {/* ── Videos & Categories ── */}
          {activeSection === "videos" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-400 space-y-6">
              <CategoryManagement />
              <VideoManagement />
            </div>
          )}

          {/* ── Users ── */}
          {activeSection === "users" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
              <AdminUsersTable
                currentUserId={user?.id}
                onEdit={setEditingUser}
                onDelete={setDeletingUser}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Dialogs */}
      <AdminEditUserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={handleUserMutated}
      />
      <AdminDeleteUserDialog
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onSuccess={handleUserMutated}
      />
    </>
  );
};

export default AdminDashboard;
