import { LeaderboardEntry } from '@/types';

interface LeaderboardListProps {
  students: LeaderboardEntry[];
  startRank?: number;
}

export const LeaderboardList = ({ students, startRank = 4 }: LeaderboardListProps) => {
  if (students.length === 0) {
    return null;
  }

  // Extract grade/section from academic number if available
  // For now, we'll show the academic number as-is
  const formatAcademicNumber = (academicNumber: string | null) => {
    if (!academicNumber) return '—';
    // If you want to format it differently, you can parse it here
    return academicNumber;
  };

  return (
    <div className="space-y-3 animate-reveal-up stagger-3">
      {students.map((student) => (
        <div
          key={student.userId}
          className="flex items-center gap-4 bg-card rounded-xl px-5 py-3 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <span className="font-cairo font-bold text-muted-foreground w-8 text-center tabular-nums">
            {student.rank}
          </span>
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-cairo font-bold text-foreground">
            {student.fullName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-cairo font-bold text-foreground text-sm">
              {student.fullName}
            </p>
            <p className="text-muted-foreground text-xs">
              {formatAcademicNumber(student.academicNumber)}
            </p>
          </div>
          <span className="font-cairo font-extrabold text-primary tabular-nums">
            {student.points}
          </span>
        </div>
      ))}
    </div>
  );
};
