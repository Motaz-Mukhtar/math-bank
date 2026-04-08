import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  getFullLeaderboard, getMyStats, getUserCategories,
} from '@/services/leaderboard.api';
import {
  LeaderboardEntry, MyLeaderboardStats, CategoryBreakdownItem,
} from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Podium } from '@/components/leaderboard/Podium';
import LeaderboardRow from '@/components/leaderboard/LeaderboardRow';
import PersonalRankCard from '@/components/leaderboard/PersonalRankCard';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, ChevronDown, HelpCircle, Target, Zap, Flame, Award, Sparkles, MailOpen } from 'lucide-react';
import { toast } from 'sonner';

const BADGE_LEGEND = [
  { icon: 'star', label: 'نجم الأسبوع', desc: 'أعلى نقاط هذا الأسبوع' },
  { icon: 'rocket', label: 'متقدم سريع', desc: '٥٠ نقطة أو أكثر في آخر ٢٤ ساعة' },
  { icon: 'fire', label: 'متسق', desc: 'نشاط في ٥ أيام أو أكثر خلال ٧ أيام' },
  { icon: 'trophy', label: 'بطل الفئة', desc: 'الأعلى نقاطاً في فئة معينة' },
  { icon: 'sparkle', label: 'وافد جديد', desc: 'حساب جديد مع جلسة واحدة على الأقل' },
];

const SkeletonRow = () => (
  <div className="h-14 bg-muted/50 rounded-xl animate-pulse" />
);

type Period = 'all' | 'weekly';

const LeaderboardPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [period, setPeriod] = useState<Period>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [myStats, setMyStats] = useState<MyLeaderboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [categoryCache, setCategoryCache] = useState<Map<string, CategoryBreakdownItem[]>>(new Map());
  const [loadingCategory, setLoadingCategory] = useState(false);

  const [showBadgeLegend, setShowBadgeLegend] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch leaderboard ──────────────────────────────────────────────────────
  const fetchLeaderboard = useCallback(
    async (p: number, per: Period, append = false) => {
      try {
        if (!append) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        const data = await getFullLeaderboard(p, 20, per);
        console.log(data);
        setEntries((prev) => (append ? [...prev, ...data.entries] : data.entries));
        setHasMore(data.meta.page < data.meta.totalPages);
        setLastUpdated(new Date());
      } catch {
        setError('حدث خطأ في تحميل الترتيب — حاول مجدداً');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // ── Fetch personal stats ───────────────────────────────────────────────────
  const fetchMyStats = useCallback(async () => {
    if (user?.role !== 'STUDENT') return;
    try {
      setLoadingStats(true);
      const data = await getMyStats();
      setMyStats(data);
    } catch {
      // non-critical — just hide the card
    } finally {
      setLoadingStats(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    // Refresh user points from server when visiting leaderboard
    if (user) {
      refreshUser();
    }
    fetchLeaderboard(1, period);
    fetchMyStats();
  }, []);

  // Period change
  const handlePeriodChange = (p: Period) => {
    if (p === period) return;
    setPeriod(p);
    setPage(1);
    setEntries([]);
    setExpandedUserId(null);
    fetchLeaderboard(1, p);
    fetchMyStats();
  };

  // Load more
  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchLeaderboard(next, period, true);
  };

  // Auto-refresh every 60s (silent)
  useEffect(() => {
    autoRefreshRef.current = setInterval(() => {
      fetchLeaderboard(1, period);
    }, 60_000);
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [period, fetchLeaderboard]);

  // ── Row expansion ──────────────────────────────────────────────────────────
  const handleExpand = async (userId: string | null) => {
    if (!userId) { setExpandedUserId(null); return; }
    if (expandedUserId === userId) { setExpandedUserId(null); return; }

    setExpandedUserId(userId);

    if (!categoryCache.has(userId)) {
      try {
        setLoadingCategory(true);
        const data = await getUserCategories(userId);
        setCategoryCache((prev) => new Map(prev).set(userId, data));
      } catch {
        toast.error('فشل تحميل تفاصيل الفئات');
      } finally {
        setLoadingCategory(false);
      }
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);

  const minutesAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 60_000);
  const updatedLabel =
    minutesAgo === 0 ? 'الآن' : `منذ ${minutesAgo} دقيقة`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16 font-cairo" dir="rtl">
        <div className="container max-w-2xl space-y-6">

          {/* Header */}
          <div className="text-center space-y-1 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-7 h-7 text-primary" />
              <h1 className="font-cairo font-extrabold text-3xl text-foreground">
                لوحة المتصدرين
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">آخر تحديث: {updatedLabel}</p>
          </div>

          {/* Personal rank card */}
          {user?.role === 'STUDENT' && (
            loadingStats ? (
              <div className="h-40 bg-muted/40 rounded-2xl animate-pulse" />
            ) : myStats ? (
              <PersonalRankCard stats={myStats} period={period} />
            ) : null
          )}

          {/* Period toggle */}
          <div className="flex justify-center gap-2 animate-in fade-in duration-500 delay-100">
            {(['all', 'weekly'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                className={`px-5 py-2 rounded-full text-sm font-cairo font-bold transition-all duration-200 active:scale-95 ${
                  period === p
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'border-2 border-primary text-primary hover:bg-primary/5'
                }`}
              >
                {p === 'all' ? 'الكل' : 'هذا الأسبوع'}
              </button>
            ))}
          </div>

          {/* Error state */}
          {error && (
            <div className="text-center space-y-3 py-8">
              <p className="text-destructive font-cairo">{error}</p>
              <Button
                variant="outline"
                onClick={() => fetchLeaderboard(1, period)}
                className="font-cairo"
              >
                إعادة المحاولة
              </Button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && !error && (
            <div className="space-y-3">
              <div className="flex justify-center gap-6 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className={`rounded-full bg-muted animate-pulse ${i === 1 ? 'w-[72px] h-[72px]' : 'w-14 h-14'}`} />
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
              {[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
            </div>
          )}

          {/* Empty weekly state */}
          {!loading && !error && period === 'weekly' && entries.length < 3 && (
            <div className="text-center space-y-4 py-12 animate-in fade-in duration-500">
              <div className="w-24 h-24 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                <MailOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="font-cairo font-bold text-xl text-foreground">
                  لا يوجد نشاط هذا الأسبوع بعد
                </p>
                <p className="font-cairo text-muted-foreground text-sm max-w-md mx-auto">
                  {user?.role === 'STUDENT' 
                    ? 'الأسبوع يبدأ من يوم السبت. كن أول من يتصدر القائمة هذا الأسبوع!'
                    : 'الأسبوع يبدأ من يوم السبت. لا يوجد طلاب نشطون هذا الأسبوع بعد.'}
                </p>
              </div>
              {user?.role === 'STUDENT' && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button
                    onClick={() => navigate('/quizzes')}
                    className="font-cairo font-bold gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    ابدأ اختبار
                  </Button>
                  <Button
                    onClick={() => navigate('/wheel')}
                    variant="outline"
                    className="font-cairo font-bold gap-2"
                  >
                    <Target className="w-4 h-4" />
                    جرب عجلة الحظ
                  </Button>
                </div>
              )}
              <div className="pt-4">
                <Button
                  onClick={() => handlePeriodChange('all')}
                  variant="ghost"
                  className="font-cairo text-sm text-muted-foreground hover:text-foreground"
                >
                  عرض الترتيب الكلي ←
                </Button>
              </div>
            </div>
          )}

          {/* Leaderboard content */}
          {!loading && !error && entries.length > 0 && (
            <>
              {/* Podium */}
              {topThree.length >= 3 && (
                <Podium topThree={topThree} currentUserId={user?.id} />
              )}

              {/* Ranked list */}
              <div className="space-y-2">
                {rest.map((entry) => (
                  <LeaderboardRow
                    key={entry.userId}
                    entry={entry}
                    isCurrentUser={user?.id === entry.userId}
                    expandable
                    isExpanded={expandedUserId === entry.userId}
                    categoryBreakdown={categoryCache.get(entry.userId)}
                    onExpand={handleExpand}
                  />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="text-center pt-2">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="gap-2 font-cairo font-bold"
                  >
                    {loadingMore ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    {loadingMore ? 'جاري التحميل...' : 'تحميل المزيد'}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Badge legend — hidden for now, backend still computes badges */}
          {/* <div className="border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowBadgeLegend((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-cairo font-bold text-muted-foreground hover:bg-muted/40 transition-colors"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                كيف تكسب الشارات؟
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${showBadgeLegend ? 'rotate-180' : ''}`}
              />
            </button>
            {showBadgeLegend && (
              <div className="px-4 pb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {BADGE_LEGEND.map((b) => (
                  <div key={b.label} className="flex items-center gap-3 text-sm">
                    <span className="text-lg w-6 text-center">{b.icon}</span>
                    <span className="font-cairo font-bold text-foreground">{b.label}</span>
                    <span className="text-muted-foreground font-cairo text-xs">— {b.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div> */}

        </div>
      </main>
      <Footer />
    </>
  );
};

export default LeaderboardPage;
