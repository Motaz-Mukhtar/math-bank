import { LeaderboardEntry } from '@/types';

interface PodiumProps {
  topThree: LeaderboardEntry[];
  currentUserId?: string;
}

const PLACE_CONFIG = [
  // 2nd — left
  {
    avatarSize: 'w-14 h-14',
    barHeight: 'h-14',
    bgClass: 'gradient-hero',
    label: '🥈',
  },
  // 1st — center (elevated)
  {
    avatarSize: 'w-[72px] h-[72px]',
    barHeight: 'h-20',
    bgClass: 'gradient-warm',
    label: '🥇',
  },
  // 3rd — right
  {
    avatarSize: 'w-14 h-14',
    barHeight: 'h-10',
    bgClass: 'gradient-accent',
    label: '🥉',
  },
];

// Display order: 2nd, 1st, 3rd
const DISPLAY_ORDER = [1, 0, 2];

export const Podium = ({ topThree, currentUserId }: PodiumProps) => {
  if (topThree.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground font-cairo">
        لا يوجد طلاب في لوحة المتصدرين بعد
      </div>
    );
  }

  return (
    <div className="flex justify-center items-end gap-3 mb-10 animate-reveal-up stagger-2">
      {DISPLAY_ORDER.map((rankIdx) => {
        const student = topThree[rankIdx];
        if (!student) return null;
        const cfg = PLACE_CONFIG[rankIdx];
        const isMe = currentUserId && student.userId === currentUserId;

        return (
          <div key={student.userId} className="flex flex-col items-center gap-1">
            <span className="text-lg">{cfg.label}</span>
            <div
              className={`${cfg.avatarSize} rounded-full ${cfg.bgClass} text-white flex items-center justify-center font-cairo font-extrabold text-xl shadow-md transition-transform duration-200
                ${rankIdx === 0 ? 'scale-110' : ''}
                ${isMe ? 'ring-4 ring-primary/60' : ''}`}
            >
              {student.fullName.charAt(0)}
            </div>
            <p className="font-cairo font-bold text-foreground text-sm text-center max-w-[80px] truncate">
              {student.fullName}
            </p>
            <p className="font-cairo font-extrabold text-primary tabular-nums text-sm">
              ⭐ {student.points}
            </p>
            <div className={`w-16 rounded-t-lg ${cfg.bgClass} ${cfg.barHeight} opacity-80`} />
          </div>
        );
      })}
    </div>
  );
};
