import { LeaderboardEntry } from '@/types';

interface PodiumProps {
  topThree: LeaderboardEntry[];
}

const rankStyles = [
  { bg: 'gradient-warm', ring: 'ring-4 ring-secondary/30', height: 'h-24', width: 'w-20 md:w-24' },
  { bg: 'gradient-hero', ring: '', height: 'h-16', width: 'w-16 md:w-20' },
  { bg: 'gradient-accent', ring: '', height: 'h-12', width: 'w-16 md:w-20' },
];

export const Podium = ({ topThree }: PodiumProps) => {
  if (topThree.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        لا يوجد طلاب في لوحة المتصدرين بعد
      </div>
    );
  }

  // Arrange as: 2nd, 1st, 3rd
  const podiumOrder = [
    topThree[1], // 2nd place (left)
    topThree[0], // 1st place (center)
    topThree[2], // 3rd place (right)
  ].filter(Boolean);

  return (
    <div className="flex justify-center items-end gap-4 mb-10 animate-reveal-up stagger-2">
      {podiumOrder.map((student, displayIndex) => {
        if (!student) return null;
        
        const actualRank = student.rank - 1; // 0-indexed for styles
        const isFirst = student.rank === 1;
        const style = rankStyles[actualRank];

        return (
          <div key={student.userId} className="flex flex-col items-center">
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${style.bg} text-white flex items-center justify-center font-cairo font-extrabold text-xl md:text-2xl shadow-md ${isFirst ? style.ring + ' scale-110' : ''}`}
            >
              {student.fullName.charAt(0)}
            </div>
            <p className="font-cairo font-bold text-foreground mt-2 text-sm md:text-base text-center">
              {student.fullName}
            </p>
            <p className="font-cairo text-primary font-extrabold tabular-nums">
              {student.points}
            </p>
            <div
              className={`mt-2 rounded-t-lg ${style.bg} ${style.height} ${style.width}`}
            />
          </div>
        );
      })}
    </div>
  );
};
