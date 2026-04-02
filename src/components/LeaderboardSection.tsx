import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getLeaderboardTop } from '@/services/leaderboard.api';
import { LeaderboardEntry, CurrentUserRank } from '@/types';
import { Podium } from './leaderboard/Podium';
import LeaderboardRow from './leaderboard/LeaderboardRow';
import { Button } from './ui/button';
import { ChevronLeft, Trophy } from 'lucide-react';

const SkeletonRow = () => (
  <div className="h-14 bg-muted/50 rounded-xl animate-pulse" />
);

const LeaderboardSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const [topStudents, setTopStudents] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUserRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboardTop(8);
        if (!cancelled) {
          setTopStudents(data.topStudents);
          setCurrentUser(data.currentUser);
        }
      } catch {
        if (!cancelled) setError('حدث خطأ في تحميل لوحة المتصدرين');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, []);

  const topThree = topStudents.slice(0, 3);
  const rest = topStudents.slice(3);
  const isCurrentUserVisible = currentUser ? currentUser.rank <= 8 : false;

  return (
    <section id="leaderboard" className="py-20">
      <div ref={ref} className="container max-w-2xl">
        {/* Heading */}
        <div className="text-center mb-12 space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-7 h-7 text-primary" />
            <h2 className="font-cairo font-extrabold text-3xl md:text-4xl text-foreground">
              لوحة المتصدرين
            </h2>
          </div>
          <p className="text-muted-foreground font-cairo text-lg">
            أفضل الطلاب أداءً
          </p>
        </div>

        {error ? (
          <div className="text-center text-destructive font-cairo py-8">{error}</div>
        ) : loading ? (
          <div className="space-y-3">
            <div className="flex justify-center gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`rounded-full bg-muted animate-pulse ${i === 1 ? 'w-[72px] h-[72px]' : 'w-14 h-14'}`} />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
            {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
          </div>
        ) : (
          <>
            {topThree.length >= 3 && (
              <Podium topThree={topThree} currentUserId={user?.id} />
            )}

            {rest.length > 0 && (
              <div className="space-y-2 mb-4">
                {rest.map((entry) => (
                  <LeaderboardRow
                    key={entry.userId}
                    entry={entry}
                    isCurrentUser={user?.id === entry.userId}
                    expandable={false}
                  />
                ))}
              </div>
            )}

            {/* Current user row if outside top 8 */}
            {currentUser && user && !isCurrentUserVisible && (
              <div className="mt-4 pt-4 border-t border-dashed border-border">
                <LeaderboardRow
                  entry={{
                    rank: currentUser.rank,
                    userId: user.id,
                    fullName: user.fullName || user.email,
                    academicNumber: user.academicNumber || null,
                    points: currentUser.points,
                  }}
                  isCurrentUser
                  expandable={false}
                />
              </div>
            )}

            {/* Link to full page */}
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/leaderboard')}
                className="gap-2 font-cairo font-bold border-primary text-primary hover:bg-primary/5 w-full sm:w-auto"
              >
                عرض الترتيب كاملاً
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LeaderboardSection;
