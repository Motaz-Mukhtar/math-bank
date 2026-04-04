import {
  BarChart, Bar, XAxis, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';

const DAY_LABELS: Record<number, string> = {
  0: 'أحد',
  1: 'إث',
  2: 'ثل',
  3: 'أرب',
  4: 'خم',
  5: 'جم',
  6: 'سبت',
};

interface PointsProgressChartProps {
  history: Array<{ date: string; total: number }>;
}

const PointsProgressChart = ({ history }: PointsProgressChartProps) => {
  const allZero = history.every((d) => d.total === 0);

  if (allZero) {
    return (
      <p className="text-center text-muted-foreground text-xs font-cairo py-3">
        لا يوجد نشاط هذا الأسبوع
      </p>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  const data = history.map((d) => ({
    ...d,
    dayLabel: DAY_LABELS[new Date(d.date + 'T12:00:00').getDay()] ?? d.date,
    isToday: d.date === today,
  })).reverse(); // Reverse for RTL display: Saturday (سبت) on right, Friday (جم) on left

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-1.5 text-xs font-cairo shadow-md">
        {payload[0].value} نقطة
      </div>
    );
  };

  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-[11px] font-cairo">نشاطك خلال ٧ أيام</p>
      <div className="h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="dayLabel"
              tick={{ fontSize: 10, fontFamily: 'Cairo' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.total === 0
                      ? 'hsl(var(--muted))'
                      : entry.isToday
                      ? 'hsl(174, 70%, 35%)'
                      : 'hsl(174, 58%, 45%)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PointsProgressChart;
