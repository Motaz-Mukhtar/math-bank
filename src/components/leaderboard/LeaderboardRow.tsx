import { useState } from 'react';
import { LeaderboardEntry, Badge, CategoryBreakdownItem } from '@/types';
import BadgePill from './BadgePill';
import { ChevronDown } from 'lucide-react';

interface LeaderboardRowProps {
  entry: LeaderboardEntry & { badges?: Badge[] };
  isCurrentUser: boolean;
  expandable?: boolean;
  categoryBreakdown?: CategoryBreakdownItem[];
  onExpand?: (userId: string | null) => void;
  isExpanded?: boolean;
}

const AVATAR_COLORS = ['gradient-warm', 'gradient-hero', 'gradient-accent'];

const LeaderboardRow = ({
  entry,
  isCurrentUser,
  expandable = false,
  categoryBreakdown,
  onExpand,
  isExpanded = false,
}: LeaderboardRowProps) => {
  const avatarClass = entry.rank <= 3 ? AVATAR_COLORS[entry.rank - 1] : '';
  const maxCatPoints = categoryBreakdown
    ? Math.max(...categoryBreakdown.map((c) => c.points), 1)
    : 1;

  const badges = entry.badges || [];
  const visibleBadges = badges.slice(0, 2);
  const extraBadges = badges.length - visibleBadges.length;

  const handleClick = () => {
    if (!expandable || !onExpand) return;
    onExpand(isExpanded ? null : entry.userId);
  };

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all duration-200 ${
        isCurrentUser ? 'ring-2 ring-primary/30 bg-primary/5' : 'bg-card'
      } shadow-sm hover:shadow-md`}
    >
      {/* Main row */}
      <div
        className={`flex items-center gap-3 px-4 py-3 ${expandable ? 'cursor-pointer active:scale-[0.99]' : ''}`}
        onClick={handleClick}
      >
        {/* Rank */}
        <span
          className={`font-cairo font-extrabold tabular-nums w-7 text-center shrink-0 ${
            entry.rank <= 3 ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {entry.rank}
        </span>

        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-cairo font-bold text-sm shrink-0 ${
            avatarClass ? `${avatarClass} text-white` : 'bg-muted text-foreground'
          }`}
        >
          {entry.fullName.charAt(0)}
        </div>

        {/* Name + academic number */}
        <div className="flex-1 min-w-0">
          <p className="font-cairo font-bold text-foreground text-sm truncate">
            {entry.fullName}
            {isCurrentUser && (
              <span className="mr-1.5 text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                أنت
              </span>
            )}
          </p>
          <p className="text-muted-foreground text-xs font-mono truncate">
            {entry.academicNumber || '—'}
          </p>
        </div>

        {/* Badges — hidden for now, backend still computes them */}
        {/* {visibleBadges.length > 0 && (
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            {visibleBadges.map((b) => (
              <BadgePill key={b.key} badge={b} />
            ))}
            {extraBadges > 0 && (
              <span className="text-[10px] font-cairo font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                +{extraBadges}
              </span>
            )}
          </div>
        )} */}

        {/* Points */}
        <span className="font-cairo font-extrabold text-primary tabular-nums text-sm shrink-0">
          {entry.points}
        </span>

        {/* Expand chevron */}
        {expandable && (
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        )}
      </div>

      {/* Expanded category breakdown */}
      {expandable && isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-border space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {categoryBreakdown && categoryBreakdown.length > 0 ? (
            categoryBreakdown.map((cat) => (
              <div key={cat.category} className="flex items-center gap-2">
                <span className="font-cairo text-xs text-muted-foreground w-24 shrink-0 text-right">
                  {cat.labelAr}
                </span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(cat.points / maxCatPoints) * 100}%` }}
                  />
                </div>
                <span className="font-cairo font-bold text-xs text-primary tabular-nums w-8 text-left">
                  {cat.points}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground text-xs font-cairo py-2">
              لا توجد بيانات
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaderboardRow;
