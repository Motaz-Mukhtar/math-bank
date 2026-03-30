import { CurrentUserRank } from '@/types';

interface CurrentUserRowProps {
  currentUser: CurrentUserRank;
  userName: string;
  isInTopTen: boolean;
}

export const CurrentUserRow = ({ currentUser, userName, isInTopTen }: CurrentUserRowProps) => {
  // Don't show if user is already in top 10
  if (isInTopTen) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <div className="flex items-center gap-4 bg-primary/10 rounded-xl px-5 py-3 shadow-sm ring-2 ring-primary/20">
        <span className="font-cairo font-bold text-primary w-8 text-center tabular-nums">
          {currentUser.rank}
        </span>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-cairo font-bold text-primary">
          {userName.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="font-cairo font-bold text-foreground text-sm">
            {userName} (أنت)
          </p>
          <p className="text-muted-foreground text-xs">ترتيبك الحالي</p>
        </div>
        <span className="font-cairo font-extrabold text-primary tabular-nums">
          {currentUser.points}
        </span>
      </div>
    </div>
  );
};
