import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

interface PointsEntry {
  date: string;
  points: number;
}

interface StudentPointsChartProps {
  studentProfileId: string;
  studentName: string;
}

const StudentPointsChart = ({ studentProfileId, studentName }: StudentPointsChartProps) => {
  const [data, setData] = useState<PointsEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const { data: history } = await supabase
        .from("points_history")
        .select("points, created_at")
        .eq("student_profile_id", studentProfileId)
        .order("created_at", { ascending: true });

      if (history && history.length > 0) {
        const mapped: PointsEntry[] = history.map((h: any) => ({
          date: new Date(h.created_at).toLocaleDateString("ar-SA", {
            month: "short",
            day: "numeric",
          }),
          points: h.points,
        }));
        setData(mapped);
      } else {
        setData([]);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [studentProfileId]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-5">
          <div className="h-48 bg-muted rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            لا توجد بيانات نقاط بعد لـ {studentName}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md shadow-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          تطور نقاط {studentName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pr-1 pl-4 pb-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                fontFamily: "Cairo",
                fontSize: 13,
                boxShadow: "0 4px 12px hsl(var(--foreground) / 0.08)",
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: 4 }}
              formatter={(value: number) => [`⭐ ${value}`, "النقاط"]}
            />
            <Line
              type="monotone"
              dataKey="points"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--card))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StudentPointsChart;
