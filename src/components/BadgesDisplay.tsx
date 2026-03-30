import { useStudentBadges } from "@/hooks/useStudentBadges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Award, Lock } from "lucide-react";

interface BadgesDisplayProps {
  studentProfileId: string;
  compact?: boolean;
}

const BadgesDisplay = ({ studentProfileId, compact = false }: BadgesDisplayProps) => {
  const { allBadges, earnedBadges, loading } = useStudentBadges(studentProfileId);

  if (loading) {
    return (
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-14 h-14 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {earnedBadges.length === 0 ? (
          <p className="text-xs text-muted-foreground font-cairo">لا شارات بعد</p>
        ) : (
          earnedBadges.map((badge) => (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg cursor-default hover:bg-primary/15 transition-colors">
                  {badge.icon}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-cairo text-center">
                <p className="font-bold">{badge.title}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </TooltipContent>
            </Tooltip>
          ))
        )}
      </div>
    );
  }

  const earnedIds = new Set(earnedBadges.map((b) => b.id));

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 font-cairo">
          <Award className="w-5 h-5 text-primary" />
          الشارات والإنجازات
          <span className="text-sm font-normal text-muted-foreground mr-auto">
            {earnedBadges.length}/{allBadges.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {allBadges.map((badge) => {
            const earned = earnedIds.has(badge.id);
            const earnedData = earnedBadges.find((b) => b.id === badge.id);

            return (
              <Tooltip key={badge.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all cursor-default ${
                      earned
                        ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                        : "border-border/50 bg-muted/30 opacity-50"
                    }`}
                  >
                    <div className={`text-3xl ${earned ? "" : "grayscale"}`}>
                      {badge.icon}
                    </div>
                    <p className="text-[10px] font-cairo font-bold text-center leading-tight line-clamp-2">
                      {badge.title}
                    </p>
                    {!earned && (
                      <div className="absolute top-1.5 left-1.5">
                        <Lock className="w-3 h-3 text-muted-foreground/60" />
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-cairo text-center max-w-48">
                  <p className="font-bold">{badge.title}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  {earned && earnedData && (
                    <p className="text-[10px] text-primary mt-1">
                      حصلت عليها {new Date(earnedData.earned_at).toLocaleDateString("ar-SA")}
                    </p>
                  )}
                  {!earned && badge.points_required && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      تحتاج {badge.points_required} نقطة
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgesDisplay;
