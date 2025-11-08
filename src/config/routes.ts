/**
 * Route Path Constants
 * Centralized route definitions for the application
 */

export const ROUTES = {
  // Auth
  LOGIN: '/login',
  LOGOUT: '/logout',
  AUTH_CALLBACK: '/auth/callback',

  // Main
  HOME: '/',
  DASHBOARD: '/dashboard',

  // Students
  STUDENTS: '/students',
  STUDENTS_NEW: '/students/new',
  STUDENTS_DETAIL: '/students/:id',
  STUDENTS_EDIT: '/students/:id/edit',

  // Teachers
  TEACHERS: '/teachers',
  TEACHERS_NEW: '/teachers/new',
  TEACHERS_DETAIL: '/teachers/:id',
  TEACHERS_EDIT: '/teachers/:id/edit',
  TEACHERS_SCHEDULE: '/teachers/:id/schedule',

  // Classes & Sections
  CLASSES: '/classes',
  CLASSES_NEW: '/classes/new',
  CLASSES_DETAIL: '/classes/:id',
  SECTIONS: '/sections',
  SECTIONS_DETAIL: '/sections/:id',

  // Academic Years
  ACADEMIC_YEARS: '/academic-years',
  ACADEMIC_YEARS_NEW: '/academic-years/new',

  // Subjects
  SUBJECTS: '/subjects',
  SUBJECTS_NEW: '/subjects/new',

  // Attendance
  ATTENDANCE: '/attendance',
  ATTENDANCE_MARK: '/attendance/mark',
  ATTENDANCE_REPORTS: '/attendance/reports',

  // Timetable
  TIMETABLE: '/timetable',
  TIMETABLE_CLASS: '/timetable/class/:id',
  TIMETABLE_TEACHER: '/timetable/teacher/:id',

  // Fees
  FEES: '/fees',
  FEE_STRUCTURES: '/fees/structures',
  FEE_STRUCTURES_NEW: '/fees/structures/new',
  FEE_RECORDS: '/fees/records',
  FEE_PAYMENTS: '/fees/payments',
  FEE_REPORTS: '/fees/reports',

  // Parent Portal
  PARENT_DASHBOARD: '/parent',
  PARENT_CHILDREN: '/parent/children',
  PARENT_CHILD_DETAIL: '/parent/children/:id',

  // Reports
  REPORTS: '/reports',
  REPORTS_ATTENDANCE: '/reports/attendance',
  REPORTS_FINANCIAL: '/reports/financial',
  REPORTS_STUDENT_ANALYTICS: '/reports/student-analytics',

  // Settings
  SETTINGS: '/settings',
  PROFILE: '/profile',

  // Error Pages
  NOT_FOUND: '/404',
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',
} as const;

/**
 * Generate route path with parameters
 */
export function getRoute(
  route: string,
  params?: Record<string, string | number>
): string {
  if (!params) return route;

  return Object.entries(params).reduce((path, [key, value]) => {
    return path.replace(`:${key}`, String(value));
  }, route);
}

/**
 * Helper functions for common routes
 */
export const RouteHelpers = {
  studentDetail: (id: string) => getRoute(ROUTES.STUDENTS_DETAIL, { id }),
  studentEdit: (id: string) => getRoute(ROUTES.STUDENTS_EDIT, { id }),
  teacherDetail: (id: string) => getRoute(ROUTES.TEACHERS_DETAIL, { id }),
  teacherSchedule: (id: string) => getRoute(ROUTES.TEACHERS_SCHEDULE, { id }),
  classDetail: (id: string) => getRoute(ROUTES.CLASSES_DETAIL, { id }),
  sectionDetail: (id: string) => getRoute(ROUTES.SECTIONS_DETAIL, { id }),
  timetableClass: (id: string) => getRoute(ROUTES.TIMETABLE_CLASS, { id }),
  timetableTeacher: (id: string) => getRoute(ROUTES.TIMETABLE_TEACHER, { id }),
  parentChildDetail: (id: string) => getRoute(ROUTES.PARENT_CHILD_DETAIL, { id }),
};

