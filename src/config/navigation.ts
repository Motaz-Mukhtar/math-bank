import { Role } from '@/types';

export interface NavLink {
  label: string;
  href: string;
  isLeaderboard?: boolean;
  allowedRoles: Role[];
}

/**
 * Navigation configuration with role-based access control
 * Each link specifies which user roles can see it
 */
export const navigationLinks: NavLink[] = [
  {
    label: "الرئيسية",
    href: "/",
    isLeaderboard: false,
    allowedRoles: ['STUDENT', 'PARENT', 'ADMIN'],
  },
  {
    label: "الفيديوهات",
    href: "/videos",
    isLeaderboard: false,
    allowedRoles: ['STUDENT', 'PARENT', 'ADMIN'],
  },
  {
    label: "الاختبارات",
    href: "/quizzes",
    isLeaderboard: false,
    allowedRoles: ['STUDENT'], // Only students and admins
  },
  {
    label: "العجلة",
    href: "/wheel",
    isLeaderboard: false,
    allowedRoles: ['STUDENT'], // Only students and admins
  },
  {
    label: "الترتيب",
    href: "/#leaderboard",
    isLeaderboard: true,
    allowedRoles: ['STUDENT', 'PARENT', 'ADMIN'],
  },
  {
    label: "لوحة التحكم",
    href: "/parent-dashboard",
    isLeaderboard: false,
    allowedRoles: ['PARENT'],
  },
  {
    label: "إدارة النظام",
    href: "/admin",
    isLeaderboard: false,
    allowedRoles: ['ADMIN'],
  },
];

/**
 * Filter navigation links based on user role
 */
export const getNavigationForRole = (role: Role | undefined): NavLink[] => {
  if (!role) {
    // Return public links for non-authenticated users
    return navigationLinks.filter(link => 
      link.href === '/' || link.href === '/videos'
    );
  }

  return navigationLinks.filter(link => 
    link.allowedRoles.includes(role)
  );
};
