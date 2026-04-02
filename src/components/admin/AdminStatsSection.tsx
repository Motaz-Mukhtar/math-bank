import { Users, GraduationCap, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AdminStatsSectionProps {
  stats: {
    totalUsers: number;
    totalStudents: number;
    totalParents: number;
  };
}

const AdminStatsSection = ({ stats }: AdminStatsSectionProps) => (
  <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="flex items-center gap-3 p-5">
        <div className="rounded-xl bg-primary/10 p-3">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{stats.totalUsers}</p>
          <p className="text-xs text-muted-foreground">إجمالي الحسابات</p>
        </div>
      </CardContent>
    </Card>
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="flex items-center gap-3 p-5">
        <div className="rounded-xl bg-secondary/10 p-3">
          <GraduationCap className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{stats.totalStudents}</p>
          <p className="text-xs text-muted-foreground">طالب</p>
        </div>
      </CardContent>
    </Card>
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="flex items-center gap-3 p-5">
        <div className="rounded-xl bg-accent/30 p-3">
          <UserCheck className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{stats.totalParents}</p>
          <p className="text-xs text-muted-foreground">ولي أمر</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AdminStatsSection;
