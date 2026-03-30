import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { Podium } from "./leaderboard/Podium";
import { LeaderboardList } from "./leaderboard/LeaderboardList";
import { CurrentUserRow } from "./leaderboard/CurrentUserRow";
import { useAuth } from "@/contexts/AuthContext";

const LeaderboardSection = () => {
  const ref = useScrollReveal();
  const { data, loading, error } = useLeaderboard();
  const { user } = useAuth();

  if (loading) {
    return (
      <section id="leaderboard" className="py-20">
        <div className="container max-w-2xl">
          <div className="text-center text-muted-foreground">
            جاري التحميل...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="leaderboard" className="py-20">
        <div className="container max-w-2xl">
          <div className="text-center text-destructive">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const topThree = data.topStudents.slice(0, 3);
  const restOfStudents = data.topStudents.slice(3);
  
  // Check if current user is in top 10
  const isCurrentUserInTopTen = data.currentUser 
    ? data.currentUser.rank <= 10 
    : false;

  return (
    <section id="leaderboard" className="py-20">
      <div ref={ref} className="container max-w-2xl">
        <h2 className="font-cairo font-extrabold text-3xl md:text-4xl text-center text-foreground mb-4 animate-reveal-up">
          لوحة المتصدرين
        </h2>
        <p className="text-muted-foreground text-center text-lg mb-14 max-w-xl mx-auto animate-reveal-up stagger-1">
          أفضل الطلاب أداءً هذا الأسبوع
        </p>

        {/* Top 3 podium */}
        <Podium topThree={topThree} />

        {/* Rest of top 10 */}
        {restOfStudents.length > 0 && (
          <LeaderboardList students={restOfStudents} />
        )}

        {/* Current user row (if not in top 10) */}
        {data.currentUser && user && (
          <CurrentUserRow
            currentUser={data.currentUser}
            userName={user.fullName || user.email}
            isInTopTen={isCurrentUserInTopTen}
          />
        )}
      </div>
    </section>
  );
};

export default LeaderboardSection;
