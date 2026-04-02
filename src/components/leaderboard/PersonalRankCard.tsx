import { MyLeaderboardStats } from '@/types';
import BadgePill from './BadgePill';
import PointsProgressChart from './PointsProgressChart';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface PersonalRankCardProps {
  stats: MyLeaderboardStats;
  period: 'all' | 'weekly';
}

const PersonalRankCard = ({ stats, period }: PersonalRankCardProps) => {
  const rank = period === 'weekly' ? stats.weeklyRank : stats.rank;
  const points = period === 'weekly' ? stats.weeklyTotal : stats.total;
  const noWeeklyActivity = period === 'weekly' && stats.weeklyRank === null;

  return (
    <Card className="shadow-md border-primary/20 animate-in fade-in slide-in-from-top-4 duration-500">
      <CardContent className="p-5 space-y-4">
        {/* Top row — rank + points */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-primary/5 p-4 text-center space-y-1">
            <p className="text-xs text-muted-foreground font-cairo">مرتبتك</p>
            {noWeeklyActivity ? (
              <p className="text-sm font-cairo font-bold text-muted-foreground">
                لم تلعب هذا الأسبوع
              </p>
            ) : (
              <p className="text-3xl font-extrabold text-primary font-cairo tabular-nums">
                #{rank}
              </p>
            )}
          </div>
          <div className="rounded-xl bg-secondary/5 p-4 text-center space-y-1">
            <p className="text-xs text-muted-foreground font-cairo">نقاطك</p>
            <p className="text-3xl font-extrabold text-foreground font-cairo tabular-nums">
              {points}
            </p>
            <p className="text-[10px] text-muted-foreground font-cairo">نقطة</p>
          </div>
        </div>

        {/* Motivation line */}
        {rank === 1 ? (
          <div className="text-center rounded-xl bg-primary/10 py-2 px-3">
            <p className="font-cairo font-bold text-primary text-sm">
              أنت في المقدمة! 🏆
            </p>
          </div>
        ) : stats.nextRankGap > 0 && !noWeeklyActivity ? (
          <div className="text-center rounded-xl bg-muted/60 py-2 px-3">
            <p className="font-cairo text-sm text-muted-foreground leading-relaxed">
              تفصلك عن{' '}
              {stats.nextRankName ? (
                <strong className="text-foreground">{stats.nextRankName}</strong>
              ) : (
                'المركز التالي'
              )}
              {': '}
              <strong className="text-primary">{stats.nextRankGap} نقطة</strong>
            </p>
          </div>
        ) : null}

        {/* Badges — hidden for now, backend still computes them */}
        {/* {stats.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {stats.badges.map((b) => (
              <BadgePill key={b.key} badge={b} size="md" />
            ))}
          </div>
        )} */}

        {/* Points history chart */}
        <PointsProgressChart history={stats.pointsHistory} />
      </CardContent>
    </Card>
  );
};

export default PersonalRankCard;
