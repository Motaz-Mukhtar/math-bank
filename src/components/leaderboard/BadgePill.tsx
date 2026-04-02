import { Badge } from '@/types';

const ICON_MAP: Record<string, string> = {
  star: '⭐',
  fire: '🔥',
  rocket: '🚀',
  trophy: '🏆',
  sparkle: '✨',
};

const COLOR_CLASSES: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  coral: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
};

interface BadgePillProps {
  badge: Badge;
  size?: 'sm' | 'md';
}

const BadgePill = ({ badge, size = 'sm' }: BadgePillProps) => (
  <span
    title={badge.labelAr}
    className={`inline-flex items-center gap-1 rounded-full font-cairo font-bold whitespace-nowrap
      ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}
      ${COLOR_CLASSES[badge.color] || COLOR_CLASSES.teal}`}
  >
    <span style={{ fontSize: 11 }}>{ICON_MAP[badge.icon] || '🏅'}</span>
    {badge.labelAr}
  </span>
);

export default BadgePill;
