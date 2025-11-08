/**
 * API Endpoint Constants
 * Centralized API endpoint definitions
 */

// Base endpoint from environment is handled in apiClient.ts

export const ENDPOINTS = {
  // Auth & User
  AUTH_ME: '/users/me',

  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',

  // Tenant
  TENANT_BY_SUBDOMAIN: (subdomain: string) => `/tenants/subdomain/${subdomain}`,

  // Students
  STUDENTS: '/students',
  STUDENT_DETAIL: (id: string) => `/students/${id}`,
  STUDENT_ATTENDANCE: (id: string) => `/students/${id}/attendance`,
  STUDENT_FEES: (id: string) => `/students/${id}/fees`,
  STUDENTS_BULK_IMPORT: '/students/bulk-import',

  // Teachers
  TEACHERS: '/teachers',
  TEACHER_DETAIL: (id: string) => `/teachers/${id}`,
  TEACHER_SCHEDULE: (id: string) => `/teachers/${id}/schedule`,
  TEACHER_CLASSES: (id: string) => `/teachers/${id}/classes`,

  // Classes & Sections
  ACADEMIC_YEARS: '/academic-years',
  ACADEMIC_YEAR_DETAIL: (id: string) => `/academic-years/${id}`,
  CLASSES: '/classes',
  CLASS_DETAIL: (id: string) => `/classes/${id}`,
  CLASS_SECTIONS: (id: string) => `/classes/${id}/sections`,
  SECTIONS: '/sections',
  SECTION_DETAIL: (id: string) => `/sections/${id}`,
  SECTION_ASSIGN_STUDENTS: (id: string) => `/sections/${id}/assign-students`,

  // Subjects
  SUBJECTS: '/subjects',
  SUBJECT_DETAIL: (id: string) => `/subjects/${id}`,

  // Attendance
  ATTENDANCE_MARK: '/attendance/mark',
  ATTENDANCE: '/attendance',
  ATTENDANCE_DETAIL: (id: string) => `/attendance/${id}`,
  ATTENDANCE_REPORTS: '/attendance/reports',
  ATTENDANCE_STATS: '/attendance/stats',

  // Timetable
  TIMETABLE: '/timetable',
  TIMETABLE_DETAIL: (id: string) => `/timetable/${id}`,
  TIMETABLE_TEACHER: (id: string) => `/timetable/teacher/${id}`,
  TIMETABLE_DETECT_CONFLICTS: '/timetable/detect-conflicts',

  // Fee Management
  FEE_STRUCTURES: '/fee-structures',
  FEE_STRUCTURE_DETAIL: (id: string) => `/fee-structures/${id}`,
  FEE_RECORDS: '/fee-records',
  FEE_RECORD_DETAIL: (id: string) => `/fee-records/${id}`,
  FEE_PAYMENTS: '/fee-payments',
  FEE_REPORTS: '/fee-reports',

  // Parent Portal
  PARENT_CHILDREN: '/parents/me/children',
  PARENT_CHILD_ATTENDANCE: (id: string) => `/parents/children/${id}/attendance`,
  PARENT_CHILD_FEES: (id: string) => `/parents/children/${id}/fees`,

  // Reports
  REPORTS_ATTENDANCE: '/reports/attendance',
  REPORTS_FINANCIAL: '/reports/financial',
  REPORTS_STUDENT_ANALYTICS: '/reports/student-analytics',
} as const;

