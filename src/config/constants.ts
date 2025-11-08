// App Constants
export const APP_NAME = 'School ERP';
export const APP_VERSION = '1.0.0';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Debounce
export const SEARCH_DEBOUNCE_MS = 300;

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATE_TIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// File Upload
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Toast/Snackbar
export const TOAST_AUTO_HIDE_DURATION = 5000;

// React Query
export const STALE_TIME_LIST = 5 * 60 * 1000; // 5 minutes for list data
export const STALE_TIME_DETAIL = 1 * 60 * 1000; // 1 minute for detail data
export const STALE_TIME_CONFIG = 60 * 60 * 1000; // 1 hour for config data

// Attendance Status Colors
export const ATTENDANCE_COLORS = {
  PRESENT: '#4caf50',
  ABSENT: '#f44336',
  LATE: '#ff9800',
  EXCUSED: '#2196f3',
};

// User Roles
export const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Administrator',
  TEACHER: 'Teacher',
  PARENT: 'Parent',
  STUDENT: 'Student',
};

// Fee Status Colors
export const FEE_STATUS_COLORS = {
  PAID: '#4caf50',
  PARTIAL: '#ff9800',
  PENDING: '#757575',
  OVERDUE: '#f44336',
  WAIVED: '#2196f3',
};

