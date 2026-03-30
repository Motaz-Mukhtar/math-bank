import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import {
  TrendingUp, Award, Calendar, Target, BarChart3, PiIcon,
  Trophy, Users, Activity,
} from "lucide-react";
import type { DashboardStats } from "@/services/admin.api";

interface AdminAnalyticsProps {
  stats: DashboardStats;
}

const CHART_COLORS = [
  "hsl(174, 58%, 40%)",
  "hsl(28, 92%, 58%)",
  "hsl(340, 72%, 58%)",
  "hsl(190, 60%, 50%)",
  "hsl(38, 92%, 55%)",
  "hsl(142, 60%, 45%)",
];

const AdminAnalytics = ({ stats }: AdminAnalyticsProps) => {
  // User type distribution
  const typeDistribution = [
    { name: "طلاب", value: stats.totalStudents },
    { name: "أولياء أمور", value: stats.totalParents },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-popover border border-border rounded-xl px-4 py-3 shadow-lg font-cairo text-sm">
        <p className="font-bold text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-muted-foreground">
            <span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
            {p.name}: <span className="font-bold text-foreground">{p.value}</span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick insight cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground tabular-nums">{stats.averagePoints}</p>
              <p className="text-[11px] text-muted-foreground">متوسط النقاط</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-secondary/10 p-2.5">
              <Trophy className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground tabular-nums">{stats.topStudents[0]?.points || 0}</p>
              <p className="text-[11px] text-muted-foreground">أعلى نقاط</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-accent/30 p-2.5">
              <Activity className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground tabular-nums">{stats.recentRegistrations}</p>
              <p className="text-[11px] text-muted-foreground">تسجيل هذا الأسبوع</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground tabular-nums">{stats.linkedStudents}</p>
              <p className="text-[11px] text-muted-foreground">طالب مرتبط بولي أمر</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registration trend + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-md lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 font-cairo">
              <Calendar className="w-4 h-4 text-primary" />
              التسجيلات خلال آخر ٣٠ يومًا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.registrationChart} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(174, 58%, 40%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(174, 58%, 40%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradParents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(28, 92%, 58%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(28, 92%, 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "Cairo" }} interval="preserveStartEnd" className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} className="text-muted-foreground" />
                  <ReTooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontFamily: "Cairo", fontSize: 12 }} />
                  <Area type="monotone" dataKey="students" name="طلاب" stroke="hsl(174, 58%, 40%)" fill="url(#gradStudents)" strokeWidth={2} />
                  <Area type="monotone" dataKey="parents" name="أولياء أمور" stroke="hsl(28, 92%, 58%)" fill="url(#gradParents)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 font-cairo">
              <PiIcon className="w-4 h-4 text-primary" />
              توزيع المستخدمين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    style={{ fontFamily: "Cairo", fontSize: 11 }}
                  >
                    <Cell fill="hsl(174, 58%, 40%)" />
                    <Cell fill="hsl(28, 92%, 58%)" />
                  </Pie>
                  <ReTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {typeDistribution.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs font-cairo">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                  {d.name}: <span className="font-bold">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top students bar chart */}
      {stats.topStudents.length > 0 && (
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 font-cairo">
              <Award className="w-4 h-4 text-primary" />
              أعلى ١٠ طلاب بالنقاط
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topStudents} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fontFamily: "Cairo" }} className="text-muted-foreground" />
                  <ReTooltip content={<CustomTooltip />} />
                  <Bar dataKey="points" name="النقاط" radius={[0, 6, 6, 0]} maxBarSize={28}>
                    {stats.topStudents.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Points distribution */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 font-cairo">
            <BarChart3 className="w-4 h-4 text-primary" />
            توزيع نقاط الطلاب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.pointsDistribution} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fontFamily: "Cairo" }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} className="text-muted-foreground" />
                <ReTooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="عدد الطلاب" fill="hsl(174, 58%, 40%)" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Linking stats */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 font-cairo">
            <TrendingUp className="w-4 h-4 text-primary" />
            إحصائيات الربط
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold text-foreground tabular-nums">{stats.totalLinks}</p>
              <p className="text-xs text-muted-foreground font-cairo mt-1">إجمالي الروابط</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold text-foreground tabular-nums">{stats.linkedParents}</p>
              <p className="text-xs text-muted-foreground font-cairo mt-1">ولي أمر مرتبط</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold text-foreground tabular-nums">{stats.linkedStudents}</p>
              <p className="text-xs text-muted-foreground font-cairo mt-1">طالب مرتبط</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {stats.totalStudents > 0 ? Math.round((stats.linkedStudents / stats.totalStudents) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground font-cairo mt-1">نسبة الربط</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
