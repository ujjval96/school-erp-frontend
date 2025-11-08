import { QueryClient } from '@tanstack/react-query';
import { STALE_TIME_LIST, STALE_TIME_DETAIL, STALE_TIME_CONFIG } from './constants';

/**
 * React Query Client Configuration
 * Centralized configuration for TanStack Query
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time (5 minutes for list data)
      staleTime: STALE_TIME_LIST,

      // Cache time (10 minutes)
      gcTime: 10 * 60 * 1000,

      // Retry failed requests
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,

      // Refetch on reconnect
      refetchOnReconnect: true,

      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

/**
 * Query Keys Factory
 * Centralized query key management
 */
export const queryKeys = {
  // Auth & User
  me: ['me'] as const,
  user: (id: string) => ['user', id] as const,

  // Tenant
  tenant: (subdomain: string) => ['tenant', subdomain] as const,

  // Dashboard
  dashboardStats: ['dashboard', 'stats'] as const,

  // Students
  students: (filters?: Record<string, unknown>) => ['students', filters] as const,
  student: (id: string) => ['student', id] as const,
  studentAttendance: (id: string, filters?: Record<string, unknown>) =>
    ['student', id, 'attendance', filters] as const,
  studentFees: (id: string) => ['student', id, 'fees'] as const,

  // Teachers
  teachers: (filters?: Record<string, unknown>) => ['teachers', filters] as const,
  teacher: (id: string) => ['teacher', id] as const,
  teacherSchedule: (id: string) => ['teacher', id, 'schedule'] as const,
  teacherClasses: (id: string) => ['teacher', id, 'classes'] as const,

  // Classes & Sections
  academicYears: ['academic-years'] as const,
  academicYear: (id: string) => ['academic-year', id] as const,
  classes: (filters?: Record<string, unknown>) => ['classes', filters] as const,
  class: (id: string) => ['class', id] as const,
  classSections: (classId: string) => ['class', classId, 'sections'] as const,
  sections: ['sections'] as const,
  section: (id: string) => ['section', id] as const,

  // Subjects
  subjects: ['subjects'] as const,
  subject: (id: string) => ['subject', id] as const,

  // Attendance
  attendance: (filters?: Record<string, unknown>) => ['attendance', filters] as const,
  attendanceStats: (filters?: Record<string, unknown>) =>
    ['attendance', 'stats', filters] as const,
  attendanceReports: (filters?: Record<string, unknown>) =>
    ['attendance', 'reports', filters] as const,

  // Timetable
  timetable: (filters?: Record<string, unknown>) => ['timetable', filters] as const,
  timetableTeacher: (teacherId: string) => ['timetable', 'teacher', teacherId] as const,

  // Fees
  feeStructures: ['fee-structures'] as const,
  feeStructure: (id: string) => ['fee-structure', id] as const,
  feeRecords: (filters?: Record<string, unknown>) => ['fee-records', filters] as const,
  feeRecord: (id: string) => ['fee-record', id] as const,
  feeReports: (filters?: Record<string, unknown>) => ['fee-reports', filters] as const,

  // Parent Portal
  parentChildren: ['parent', 'children'] as const,
  parentChildAttendance: (childId: string, filters?: Record<string, unknown>) =>
    ['parent', 'child', childId, 'attendance', filters] as const,
  parentChildFees: (childId: string) => ['parent', 'child', childId, 'fees'] as const,

  // Reports
  reports: (type: string, filters?: Record<string, unknown>) =>
    ['reports', type, filters] as const,
} as const;

export { STALE_TIME_LIST, STALE_TIME_DETAIL, STALE_TIME_CONFIG };

