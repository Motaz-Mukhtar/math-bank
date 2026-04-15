import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { LeaderboardEntry } from '@/services/leaderboard.api';
import { Trophy, Medal, Award } from 'lucide-react';

interface VirtualizedLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

/**
 * Virtualized leaderboard list for rendering 100+ entries efficiently
 * Only renders visible rows + buffer, dramatically improves performance
 */
export function VirtualizedLeaderboard({
  entries,
  currentUserId,
  className = '',
}: VirtualizedLeaderboardProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Estimated row height in pixels
    overscan: 5, // Render 5 extra rows above/below viewport
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-amber-600 text-white';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{ height: '600px' }} // Fixed height for virtualization
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const entry = entries[virtualRow.index];
          const isCurrentUser = entry.userId === currentUserId;

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className={`
                  flex items-center gap-4 p-4 rounded-lg transition-colors
                  ${isCurrentUser ? 'bg-primary/10 border-2 border-primary' : 'bg-card hover:bg-accent/50'}
                  ${virtualRow.index < entries.length - 1 ? 'mb-2' : ''}
                `}
              >
                {/* Rank */}
                <div className="flex items-center gap-2 min-w-[60px]">
                  {getRankIcon(entry.rank)}
                  <span
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                      ${getRankBadgeColor(entry.rank)}
                    `}
                  >
                    {entry.rank}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${isCurrentUser ? 'text-primary' : ''}`}>
                    {entry.fullName}
                    {isCurrentUser && (
                      <span className="mr-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        أنت
                      </span>
                    )}
                  </p>
                  {entry.academicNumber && (
                    <p className="text-sm text-muted-foreground">
                      {entry.academicNumber}
                    </p>
                  )}
                </div>

                {/* Points */}
                <div className="text-left">
                  <p className="text-2xl font-bold text-primary">
                    {entry.points.toLocaleString('ar-SA')}
                  </p>
                  <p className="text-xs text-muted-foreground">نقطة</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Usage example:
 * 
 * import { VirtualizedLeaderboard } from '@/components/VirtualizedLeaderboard';
 * import { useFullLeaderboard } from '@/hooks/useLeaderboard';
 * 
 * function LeaderboardPage() {
 *   const { data } = useFullLeaderboard(1, 1000); // Fetch all entries
 *   const { user } = useAuth();
 *   
 *   return (
 *     <VirtualizedLeaderboard
 *       entries={data?.entries || []}
 *       currentUserId={user?.id}
 *       className="border rounded-lg"
 *     />
 *   );
 * }
 */
