# Navigation Configuration

## Overview
The navigation system uses role-based access control to show/hide menu items based on user roles.

## Configuration File
Location: `src/config/navigation.ts`

## How It Works

### Navigation Links Structure
Each navigation link has:
- `label`: Display text in Arabic
- `href`: Route path
- `isLeaderboard`: Special flag for leaderboard scroll behavior
- `allowedRoles`: Array of roles that can see this link

### User Roles
- `STUDENT`: Regular student users
- `PARENT`: Parent users monitoring their children
- `ADMIN`: System administrators

### Current Access Control

| Page | Student | Parent | Admin |
|------|---------|--------|-------|
| الرئيسية (Home) | ✓ | ✓ | ✓ |
| الفيديوهات (Videos) | ✓ | ✓ | ✓ |
| الاختبارات (Quizzes) | ✓ | ✗ | ✓ |
| العجلة (Wheel) | ✓ | ✗ | ✓ |
| الترتيب (Leaderboard) | ✓ | ✓ | ✓ |
| لوحة التحكم (Parent Dashboard) | ✗ | ✓ | ✗ |
| إدارة النظام (Admin) | ✗ | ✗ | ✓ |

## Modifying Access Control

To change which roles can access a page, edit the `allowedRoles` array in `src/config/navigation.ts`:

```typescript
{
  label: "الاختبارات",
  href: "/quizzes",
  isLeaderboard: false,
  allowedRoles: ['STUDENT', 'ADMIN'], // Add or remove roles here
}
```

## Adding New Pages

1. Add a new entry to the `navigationLinks` array in `src/config/navigation.ts`
2. Specify the allowed roles
3. The Navbar component will automatically include it

Example:
```typescript
{
  label: "صفحة جديدة",
  href: "/new-page",
  isLeaderboard: false,
  allowedRoles: ['STUDENT', 'PARENT', 'ADMIN'],
}
```

## Notes
- Non-authenticated users only see Home and Videos pages
- The navigation automatically filters based on the current user's role
- Changes to the configuration file require no changes to the Navbar component
