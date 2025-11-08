# Tasks: School ERP Frontend Baseline

**Input**: Design documents from `/specs/000-baseline/`  
**Prerequisites**: ✅ plan.md, ✅ baseline-spec.md, ✅ research.md, ✅ data-model.md, ✅ contracts/

**Branch**: `baseline-foundation`  
**Status**: Ready for implementation

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup & Project Initialization

**Purpose**: Initialize React + TypeScript + Vite project with core dependencies

### Project Structure

- [ ] T001 Initialize Vite project with React + TypeScript template in project root
- [ ] T002 Create folder structure following feature-based architecture (src/app, src/features, src/components, src/hooks, src/services, src/store, src/theme, src/types, src/utils, src/config)
- [ ] T003 [P] Configure TypeScript strict mode in tsconfig.json
- [ ] T004 [P] Configure ESLint with React + TypeScript rules in .eslintrc.json
- [ ] T005 [P] Configure Prettier in .prettierrc
- [ ] T006 [P] Create .env.example with all required environment variables
- [ ] T007 [P] Update .gitignore for React project (.env.local, node_modules, dist, .DS_Store)

### Dependencies Installation

- [ ] T008 Install Material UI packages (@mui/material @mui/icons-material @emotion/react @emotion/styled)
- [ ] T009 Install TanStack packages (@tanstack/react-router @tanstack/react-query @tanstack/router-devtools @tanstack/react-query-devtools)
- [ ] T010 Install state management (zustand)
- [ ] T011 Install form libraries (react-hook-form @hookform/resolvers yup)
- [ ] T012 Install HTTP client and OIDC (axios oidc-client-ts)
- [ ] T013 Install utility libraries (date-fns react-window)
- [ ] T014 Install dev dependencies (vitest @testing-library/react @testing-library/jest-dom jsdom)

### Configuration Files

- [ ] T015 [P] Create vite.config.ts with absolute imports (@/ alias), proxy config, and optimization settings
- [ ] T016 [P] Create vitest.config.ts for test configuration
- [ ] T017 [P] Update package.json scripts (dev, build, preview, lint, lint:fix, type-check, test, test:ui)
- [ ] T018 [P] Create src/vite-env.d.ts with environment variable types

**Checkpoint**: ✅ Project structure created, dependencies installed, configuration complete

---

## Phase 2: Foundational Infrastructure (BLOCKING)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Theme & Styling

- [ ] T019 [P] Create src/theme/theme.ts with Material UI theme factory function (light/dark modes)
- [ ] T020 [P] Create src/theme/lightTheme.ts with light mode palette
- [ ] T021 [P] Create src/theme/darkTheme.ts with dark mode palette
- [ ] T022 [P] Create src/theme/components.ts with MUI component style overrides
- [ ] T023 [P] Create src/theme/typography.ts with typography settings

### Configuration & Constants

- [ ] T024 [P] Create src/config/constants.ts with app constants
- [ ] T025 [P] Create src/config/environment.ts to read and validate environment variables
- [ ] T026 [P] Create src/config/routes.ts with route path constants

### Type Definitions

- [ ] T027 [P] Create src/types/common.types.ts (PaginationParams, PaginatedResponse, DateRange)
- [ ] T028 [P] Create src/types/api.types.ts (ApiResponse, ApiError, ValidationError)
- [ ] T029 [P] Create src/types/user.types.ts (User, UserRole, UserStatus, OIDCUser)
- [ ] T030 [P] Create src/types/tenant.types.ts (Tenant, TenantBranding, TenantSettings, TenantStatus)
- [ ] T031 [P] Create src/types/index.ts to export all types

### OIDC Authentication

- [ ] T032 Create src/services/oidc/oidcConfig.ts with OIDC configuration from environment
- [ ] T033 Create src/services/oidc/oidcClient.ts with UserManager initialization and event handlers
- [ ] T034 Create src/services/oidc/tokenStorage.ts with secure token storage utilities
- [ ] T035 Create src/store/authStore.ts (Zustand) with user state, login, logout, token refresh methods
- [ ] T036 Create src/hooks/useAuth.ts hook wrapping authStore with isAuthenticated computed value
- [ ] T037 [P] Create src/features/auth/types/auth.types.ts for auth-specific types

### Multi-Tenant Context

- [ ] T038 Create src/utils/tenantUtils.ts with subdomain extraction logic
- [ ] T039 Create src/store/tenantStore.ts (Zustand + persist) for tenant context (subdomain, tenantId, branding)
- [ ] T040 Create src/hooks/useTenant.ts hook for tenant initialization and context access

### API Client

- [ ] T041 Create src/services/api/endpoints.ts with API endpoint constants
- [ ] T042 Create src/services/api/apiClient.ts with Axios instance configuration
- [ ] T043 Create src/services/api/interceptors.ts with request interceptor (auth + tenant headers) and response interceptor (error handling, token refresh)

### Shared Utilities

- [ ] T044 [P] Create src/utils/dateUtils.ts (formatDate, parseDate, isDateInPast, etc.)
- [ ] T045 [P] Create src/utils/formatUtils.ts (formatCurrency, formatPercentage, formatPhone)
- [ ] T046 [P] Create src/utils/validationUtils.ts (email validation, phone validation)
- [ ] T047 [P] Create src/utils/securityUtils.ts (input sanitization, XSS prevention)
- [ ] T048 [P] Create src/hooks/useDebounce.ts for debouncing values
- [ ] T049 [P] Create src/hooks/useLocalStorage.ts for localStorage with TypeScript
- [ ] T050 [P] Create src/hooks/useMediaQuery.ts for responsive breakpoints

### React Query Setup

- [ ] T051 Create src/config/queryClient.ts with QueryClient configuration (stale times, cache times, retry logic)

### Routing & Layouts

- [ ] T052 Create src/app/router.tsx with TanStack Router setup and root route
- [ ] T053 Create src/components/layout/AuthLayout.tsx for authentication pages (login, callback)
- [ ] T054 Create src/components/layout/DashboardLayout.tsx with sidebar, header, and main content area
- [ ] T055 Create src/components/layout/Sidebar.tsx with navigation menu items based on user role
- [ ] T056 Create src/components/layout/Header.tsx with tenant branding, user profile menu, theme switcher
- [ ] T057 Create src/utils/routeGuards.ts with requireAuth and requireRole guard functions

### Shared Components (Foundation)

- [ ] T058 [P] Create src/components/feedback/LoadingSkeleton.tsx with various skeleton layouts
- [ ] T059 [P] Create src/components/feedback/ErrorBoundary.tsx for catching component errors
- [ ] T060 [P] Create src/components/feedback/Toast.tsx using MUI Snackbar for notifications
- [ ] T061 [P] Create src/components/feedback/ErrorMessage.tsx for displaying API errors
- [ ] T062 [P] Create src/components/common/EmptyState.tsx for empty list states
- [ ] T063 [P] Create src/components/common/ConfirmDialog.tsx for confirmation prompts

### App Initialization

- [ ] T064 Create src/app/providers.tsx with all context providers (Theme, QueryClient, Router, Auth)
- [ ] T065 Create src/app/App.tsx as root component with providers and router
- [ ] T066 Update src/main.tsx to render App component
- [ ] T067 Create public/index.html with proper meta tags and favicon

**Checkpoint**: ✅ Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - OIDC Authentication Flow (Priority: P1) 🎯 MVP

**Goal**: Enable users to authenticate via central OIDC service with automatic token management and multi-tenant context

**Independent Test**: Navigate to app → redirected to OIDC login → enter valid credentials → redirected back with auth code → tokens exchanged → land on dashboard with tenant context

### Implementation for User Story 1

- [ ] T068 [P] [US1] Create src/features/auth/components/LoginPage.tsx with login button triggering OIDC flow
- [ ] T069 [P] [US1] Create src/features/auth/components/CallbackPage.tsx to handle OIDC callback, exchange code for tokens, extract tenant from JWT
- [ ] T070 [P] [US1] Create src/features/auth/components/LogoutPage.tsx to handle logout confirmation
- [ ] T071 [US1] Add auth routes to src/app/router.tsx (/login, /auth/callback, /logout)
- [ ] T072 [US1] Implement automatic token refresh in src/services/oidc/oidcClient.ts using silent refresh
- [ ] T073 [US1] Add token expiration handling in API interceptor (src/services/api/interceptors.ts)
- [ ] T074 [P] [US1] Create loading state component for auth callback in src/features/auth/components/AuthLoading.tsx
- [ ] T075 [US1] Test OIDC flow end-to-end with local OIDC service

**Checkpoint**: ✅ User can log in, tokens stored, automatic refresh works, logout functional

---

## Phase 4: User Story 2 - Multi-Tenant Context & Subdomain Routing (Priority: P1)

**Goal**: Support multiple school tenants via subdomain routing with complete data isolation and branding

**Independent Test**: Access app via school1.localhost → verify subdomain detected → API calls include x-tenant-subdomain header → tenant branding loaded

### Implementation for User Story 2

- [ ] T076 [P] [US2] Create src/services/api/tenantService.ts with getTenantBySubdomain method
- [ ] T077 [US2] Implement subdomain detection on app initialization in src/app/App.tsx using tenantUtils
- [ ] T078 [US2] Create src/hooks/useTenantInit.ts to fetch and store tenant branding on mount
- [ ] T079 [US2] Apply tenant branding (logo, colors) to MUI theme in src/app/providers.tsx
- [ ] T080 [US2] Display tenant logo in Header component (src/components/layout/Header.tsx)
- [ ] T081 [US2] Verify x-tenant-subdomain header included in all API calls via interceptor
- [ ] T082 [US2] Add tenant context validation: logout if JWT tenantId mismatches URL subdomain
- [ ] T083 [P] [US2] Test with multiple subdomains (school1.localhost, school2.localhost)

**Checkpoint**: ✅ Multi-tenancy working, tenant branding applied, data isolation enforced

---

## Phase 5: User Story 3 - Dashboard & Navigation Shell (Priority: P1)

**Goal**: Provide responsive dashboard with navigation, school branding, user profile, and key metrics

**Independent Test**: Log in → land on dashboard → see navigation sidebar with modules → click menu items → route changes → profile menu works

### Data Models & Types

- [ ] T084 [P] [US3] Create src/features/dashboard/types/dashboard.types.ts (DashboardStats, ActivityLog)

### API Service

- [ ] T085 [P] [US3] Create src/features/dashboard/services/dashboardService.ts with getStats method

### React Query Hooks

- [ ] T086 [P] [US3] Create src/features/dashboard/hooks/useDashboardStats.ts with useQuery for stats

### Components

- [ ] T087 [P] [US3] Create src/features/dashboard/components/MetricCard.tsx for displaying stat cards
- [ ] T088 [P] [US3] Create src/features/dashboard/components/QuickActions.tsx with quick action buttons
- [ ] T089 [P] [US3] Create src/features/dashboard/components/AttendanceChart.tsx with simple chart (recharts)
- [ ] T090 [US3] Create src/features/dashboard/components/DashboardPage.tsx assembling all dashboard widgets
- [ ] T091 [US3] Add dashboard route to src/app/router.tsx (/, /dashboard) with auth guard
- [ ] T092 [US3] Update Sidebar navigation menu items with icons and routes
- [ ] T093 [US3] Implement active route highlighting in Sidebar
- [ ] T094 [US3] Implement breadcrumb navigation in src/components/layout/Breadcrumbs.tsx
- [ ] T095 [US3] Add user profile dropdown menu in Header with profile, settings, logout options
- [ ] T096 [US3] Implement theme switcher (light/dark toggle) in Header using src/store/uiStore.ts
- [ ] T097 [US3] Test responsive design on mobile (hamburger menu for sidebar)
- [ ] T098 [US3] Test role-based menu rendering (admin sees all, teacher sees limited)

**Checkpoint**: ✅ Dashboard functional, navigation works, metrics display, responsive on mobile

---

## Phase 6: User Story 4 - Student Management Module (Priority: P2)

**Goal**: Enable school staff to view, search, filter, create, edit, and manage student records

**Independent Test**: Navigate to Students → view paginated list → search by name → apply filters → create new student with form → view detail page → edit student

### Data Models & Types

- [ ] T099 [P] [US4] Create src/types/student.types.ts (Student, Gender, BloodGroup, StudentStatus, Address, EmergencyContact, MedicalInfo, ParentLink, ParentRelationship)
- [ ] T100 [P] [US4] Create src/types/academic.types.ts (AcademicYear, Term, Class, Section, Subject)
- [ ] T101 [P] [US4] Create src/utils/validationSchemas.ts with studentSchema using Yup

### API Service

- [ ] T102 [P] [US4] Create src/features/students/services/studentService.ts with CRUD methods (getStudents, getStudent, createStudent, updateStudent, deleteStudent)

### React Query Hooks

- [ ] T103 [P] [US4] Create src/features/students/hooks/useStudents.ts with pagination and filters
- [ ] T104 [P] [US4] Create src/features/students/hooks/useStudent.ts for single student
- [ ] T105 [P] [US4] Create src/features/students/hooks/useCreateStudent.ts mutation with optimistic updates
- [ ] T106 [P] [US4] Create src/features/students/hooks/useUpdateStudent.ts mutation
- [ ] T107 [P] [US4] Create src/features/students/hooks/useDeleteStudent.ts mutation

### Shared Components for Data Display

- [ ] T108 [P] [US4] Create src/components/common/DataTable.tsx reusable table with pagination, sorting
- [ ] T109 [P] [US4] Create src/components/common/SearchInput.tsx with debouncing (300ms)
- [ ] T110 [P] [US4] Create src/components/common/FilterPanel.tsx for filter UI
- [ ] T111 [P] [US4] Create src/components/common/PageHeader.tsx with title and action buttons

### Student List Components

- [ ] T112 [P] [US4] Create src/features/students/components/StudentTable.tsx using DataTable with student columns
- [ ] T113 [P] [US4] Create src/features/students/components/StudentSearch.tsx using SearchInput
- [ ] T114 [P] [US4] Create src/features/students/components/StudentFilters.tsx with grade, section, status, gender filters
- [ ] T115 [US4] Create src/features/students/components/StudentList.tsx page assembling table, search, filters
- [ ] T116 [US4] Implement pagination controls in StudentList
- [ ] T117 [US4] Implement virtual scrolling for large lists (>100 students) using react-window

### Student Form Components

- [ ] T118 [P] [US4] Create src/features/students/components/StudentForm/PersonalInfoStep.tsx with React Hook Form
- [ ] T119 [P] [US4] Create src/features/students/components/StudentForm/AcademicInfoStep.tsx
- [ ] T120 [P] [US4] Create src/features/students/components/StudentForm/ContactInfoStep.tsx
- [ ] T121 [P] [US4] Create src/features/students/components/StudentForm/DocumentsStep.tsx with file upload
- [ ] T122 [US4] Create src/features/students/components/StudentForm/StudentFormWizard.tsx with stepper and step navigation
- [ ] T123 [US4] Implement form validation with inline error messages
- [ ] T124 [US4] Implement photo upload preview in PersonalInfoStep

### Student Detail Components

- [ ] T125 [P] [US4] Create src/features/students/components/StudentDetail/OverviewTab.tsx with personal info card
- [ ] T126 [P] [US4] Create src/features/students/components/StudentDetail/AttendanceTab.tsx (placeholder for Phase 7)
- [ ] T127 [P] [US4] Create src/features/students/components/StudentDetail/AcademicTab.tsx (placeholder)
- [ ] T128 [P] [US4] Create src/features/students/components/StudentDetail/FeeTab.tsx (placeholder)
- [ ] T129 [P] [US4] Create src/features/students/components/StudentDetail/DocumentsTab.tsx (placeholder)
- [ ] T130 [US4] Create src/features/students/components/StudentDetail.tsx page with tabs
- [ ] T131 [US4] Add edit button to StudentDetail that opens StudentFormWizard in edit mode

### Routing

- [ ] T132 [US4] Add student routes to src/app/router.tsx (/students, /students/:id, /students/new) with auth guards

### Testing & Polish

- [ ] T133 [US4] Test student list with 1000+ records for performance
- [ ] T134 [US4] Test search returning results in <500ms
- [ ] T135 [US4] Test form validation showing inline errors
- [ ] T136 [US4] Test optimistic updates on create/edit
- [ ] T137 [US4] Test delete confirmation dialog

**Checkpoint**: ✅ Student module complete with full CRUD, search, filters, pagination working

---

## Phase 7: User Story 5 - Teacher/Staff Management (Priority: P2)

**Goal**: Enable administrators to manage teacher records, assign subjects/classes, and view schedules

**Independent Test**: Navigate to Teachers → view list → create teacher → assign subjects and classes → view teacher schedule

### Data Models & Types

- [ ] T138 [P] [US5] Create src/types/teacher.types.ts (Teacher, TeacherDesignation, EmploymentType, TeacherStatus, TeacherClassAssignment)
- [ ] T139 [P] [US5] Add teacherSchema to src/utils/validationSchemas.ts

### API Service

- [ ] T140 [P] [US5] Create src/features/teachers/services/teacherService.ts with CRUD methods and getSchedule

### React Query Hooks

- [ ] T141 [P] [US5] Create src/features/teachers/hooks/useTeachers.ts
- [ ] T142 [P] [US5] Create src/features/teachers/hooks/useTeacher.ts
- [ ] T143 [P] [US5] Create src/features/teachers/hooks/useCreateTeacher.ts
- [ ] T144 [P] [US5] Create src/features/teachers/hooks/useUpdateTeacher.ts
- [ ] T145 [P] [US5] Create src/features/teachers/hooks/useDeleteTeacher.ts
- [ ] T146 [P] [US5] Create src/features/teachers/hooks/useTeacherSchedule.ts

### Components (mirroring Student structure)

- [ ] T147 [P] [US5] Create src/features/teachers/components/TeacherTable.tsx
- [ ] T148 [P] [US5] Create src/features/teachers/components/TeacherFilters.tsx
- [ ] T149 [US5] Create src/features/teachers/components/TeacherList.tsx
- [ ] T150 [P] [US5] Create src/features/teachers/components/TeacherForm.tsx with sections (personal, professional, employment)
- [ ] T151 [P] [US5] Create src/features/teachers/components/TeacherDetail.tsx with tabs
- [ ] T152 [P] [US5] Create src/features/teachers/components/TeacherSchedule.tsx showing weekly timetable
- [ ] T153 [P] [US5] Create src/features/teachers/components/ClassAssignmentForm.tsx for assigning subjects/classes
- [ ] T154 [US5] Add conflict detection when assigning teacher to overlapping time slots

### Routing

- [ ] T155 [US5] Add teacher routes to src/app/router.tsx (/teachers, /teachers/:id, /teachers/new)

**Checkpoint**: ✅ Teacher module complete, mirrors student functionality, schedule view works

---

## Phase 8: User Story 6 - Class & Section Management (Priority: P2)

**Goal**: Enable administrators to create academic structure (years, classes, sections) and manage assignments

**Independent Test**: Create academic year → create classes with sections → set capacities → assign students to sections → assign teachers to subjects

### API Services

- [ ] T156 [P] [US6] Create src/features/classes/services/academicYearService.ts
- [ ] T157 [P] [US6] Create src/features/classes/services/classService.ts
- [ ] T158 [P] [US6] Create src/features/classes/services/sectionService.ts
- [ ] T159 [P] [US6] Create src/features/classes/services/subjectService.ts

### React Query Hooks

- [ ] T160 [P] [US6] Create src/features/classes/hooks/useAcademicYears.ts
- [ ] T161 [P] [US6] Create src/features/classes/hooks/useClasses.ts
- [ ] T162 [P] [US6] Create src/features/classes/hooks/useSections.ts
- [ ] T163 [P] [US6] Create src/features/classes/hooks/useSubjects.ts

### Components

- [ ] T164 [P] [US6] Create src/features/classes/components/AcademicYearForm.tsx
- [ ] T165 [P] [US6] Create src/features/classes/components/AcademicYearList.tsx
- [ ] T166 [P] [US6] Create src/features/classes/components/ClassForm.tsx with sections management
- [ ] T167 [P] [US6] Create src/features/classes/components/ClassHierarchy.tsx showing tree or card view
- [ ] T168 [P] [US6] Create src/features/classes/components/SectionDetail.tsx showing enrollment and capacity
- [ ] T169 [P] [US6] Create src/features/classes/components/StudentAssignment.tsx for bulk assigning students
- [ ] T170 [P] [US6] Create src/features/classes/components/SubjectManagement.tsx
- [ ] T171 [US6] Implement capacity enforcement when assigning students to sections
- [ ] T172 [US6] Show current enrollment vs capacity in section cards

### Routing

- [ ] T173 [US6] Add class/section routes to src/app/router.tsx

**Checkpoint**: ✅ Academic structure can be created, students assigned, capacity enforced

---

## Phase 9: User Story 7 - Attendance Tracking (Priority: P3)

**Goal**: Enable teachers to mark daily attendance and administrators to view reports

**Independent Test**: Teacher selects class → select date → mark students present/absent/late → submit → admin views attendance report with statistics

### Data Models & Types

- [ ] T174 [P] [US7] Create src/types/attendance.types.ts (AttendanceRecord, AttendanceStatus, BulkAttendanceInput, AttendanceStats)
- [ ] T175 [P] [US7] Add attendanceSchema to src/utils/validationSchemas.ts

### API Service

- [ ] T176 [P] [US7] Create src/features/attendance/services/attendanceService.ts (markAttendance, getAttendance, updateAttendance, getStats)

### React Query Hooks

- [ ] T177 [P] [US7] Create src/features/attendance/hooks/useAttendance.ts
- [ ] T178 [P] [US7] Create src/features/attendance/hooks/useMarkAttendance.ts mutation
- [ ] T179 [P] [US7] Create src/features/attendance/hooks/useAttendanceStats.ts

### Components

- [ ] T180 [P] [US7] Create src/features/attendance/components/AttendanceForm.tsx with class/section/date selectors
- [ ] T181 [P] [US7] Create src/features/attendance/components/StudentAttendanceRow.tsx with quick-mark buttons
- [ ] T182 [US7] Create src/features/attendance/components/AttendancePage.tsx for teachers
- [ ] T183 [US7] Implement color coding for attendance statuses (green=present, red=absent, yellow=late, blue=excused)
- [ ] T184 [US7] Add form lock after submission to prevent duplicate submissions
- [ ] T185 [P] [US7] Create src/features/attendance/components/AttendanceCalendar.tsx with monthly view
- [ ] T186 [P] [US7] Create src/features/attendance/components/AttendanceReport.tsx with statistics and charts
- [ ] T187 [US7] Implement attendance correction workflow with reason field
- [ ] T188 [US7] Add export functionality (CSV/PDF) to attendance reports

### Routing

- [ ] T189 [US7] Add attendance routes to src/app/router.tsx (/attendance, /attendance/reports)

### Testing

- [ ] T190 [US7] Test marking attendance for 40 students in under 2 minutes
- [ ] T191 [US7] Test report generation for 1 month data in under 1 second

**Checkpoint**: ✅ Attendance marking functional, reports working, export available

---

## Phase 10: User Story 8 - Timetable Management (Priority: P3)

**Goal**: Enable administrators to create weekly timetables with conflict detection

**Independent Test**: Create timetable for a class → assign subjects and teachers to periods → detect scheduling conflicts → view teacher's aggregated schedule

### Data Models & Types

- [ ] T192 [P] [US8] Create src/types/timetable.types.ts (TimetableEntry, DayOfWeek, WeeklyTimetable, TeacherSchedule)

### API Service

- [ ] T193 [P] [US8] Create src/features/timetable/services/timetableService.ts (getTimetable, createEntry, updateEntry, deleteEntry, detectConflicts)

### React Query Hooks

- [ ] T194 [P] [US8] Create src/features/timetable/hooks/useTimetable.ts
- [ ] T195 [P] [US8] Create src/features/timetable/hooks/useCreateTimetableEntry.ts
- [ ] T196 [P] [US8] Create src/features/timetable/hooks/useTeacherSchedule.ts

### Components

- [ ] T197 [P] [US8] Create src/features/timetable/components/TimetableGrid.tsx showing weekly grid (rows=days, cols=periods)
- [ ] T198 [P] [US8] Create src/features/timetable/components/TimetableEntryForm.tsx modal for editing slots
- [ ] T199 [US8] Create src/features/timetable/components/TimetablePage.tsx
- [ ] T200 [US8] Implement conflict detection and warning display
- [ ] T201 [P] [US8] Create src/features/timetable/components/TeacherScheduleView.tsx for teacher's personal schedule

### Routing

- [ ] T202 [US8] Add timetable routes to src/app/router.tsx

**Checkpoint**: ✅ Timetables can be created, conflicts detected, teacher schedules aggregated

---

## Phase 11: User Story 9 - Fee Management (Priority: P3)

**Goal**: Enable administrators to manage fee structures, record payments, and generate financial reports

**Independent Test**: Create fee structure → assign to grades → generate fee records for students → record payment → view updated balances → generate collection report

### Data Models & Types

- [ ] T203 [P] [US9] Create src/types/fee.types.ts (FeeStructure, FeeCategory, FeeRecord, FeePayment, PaymentMode, FeeStatus)
- [ ] T204 [P] [US9] Add feePaymentSchema to src/utils/validationSchemas.ts

### API Services

- [ ] T205 [P] [US9] Create src/features/fees/services/feeStructureService.ts
- [ ] T206 [P] [US9] Create src/features/fees/services/feeRecordService.ts
- [ ] T207 [P] [US9] Create src/features/fees/services/feePaymentService.ts

### React Query Hooks

- [ ] T208 [P] [US9] Create src/features/fees/hooks/useFeeStructures.ts
- [ ] T209 [P] [US9] Create src/features/fees/hooks/useFeeRecords.ts
- [ ] T210 [P] [US9] Create src/features/fees/hooks/useCreatePayment.ts

### Components

- [ ] T211 [P] [US9] Create src/features/fees/components/FeeStructureForm.tsx
- [ ] T212 [P] [US9] Create src/features/fees/components/FeeStructureList.tsx
- [ ] T213 [P] [US9] Create src/features/fees/components/StudentFeeDetail.tsx showing total/paid/pending
- [ ] T214 [P] [US9] Create src/features/fees/components/PaymentForm.tsx with amount, mode, transaction reference
- [ ] T215 [P] [US9] Create src/features/fees/components/FeeReports.tsx with collection statistics and charts
- [ ] T216 [US9] Implement payment recording with real-time balance update
- [ ] T217 [US9] Add payment history table in StudentFeeDetail
- [ ] T218 [US9] Implement export functionality for fee reports

### Routing

- [ ] T219 [US9] Add fee routes to src/app/router.tsx

**Checkpoint**: ✅ Fee management complete, payments recorded, reports generated

---

## Phase 12: User Story 10 - Parent Portal Access (Priority: P3)

**Goal**: Enable parents to view their children's information in read-only mode

**Independent Test**: Parent logs in → sees linked children → views child's attendance → views fee status → reads announcements

### Data Models & Types

- [ ] T220 [P] [US10] Create src/types/parent.types.ts (Parent)

### API Service

- [ ] T221 [P] [US10] Create src/features/parent-portal/services/parentService.ts (getChildren, getChildAttendance, getChildFees)

### React Query Hooks

- [ ] T222 [P] [US10] Create src/features/parent-portal/hooks/useParentChildren.ts
- [ ] T223 [P] [US10] Create src/features/parent-portal/hooks/useChildAttendance.ts
- [ ] T224 [P] [US10] Create src/features/parent-portal/hooks/useChildFees.ts

### Components

- [ ] T225 [P] [US10] Create src/features/parent-portal/components/ParentDashboard.tsx with child cards
- [ ] T226 [P] [US10] Create src/features/parent-portal/components/ChildCard.tsx showing quick stats
- [ ] T227 [P] [US10] Create src/features/parent-portal/components/ChildAttendanceView.tsx (read-only calendar)
- [ ] T228 [P] [US10] Create src/features/parent-portal/components/ChildFeeView.tsx (read-only fee status)
- [ ] T229 [P] [US10] Create src/features/parent-portal/components/AnnouncementsList.tsx
- [ ] T230 [US10] Enforce read-only access (no edit/delete buttons for parents)
- [ ] T231 [US10] Implement parent-specific routing and layout

### Routing

- [ ] T232 [US10] Add parent portal routes to src/app/router.tsx (/parent, /parent/children/:id)

**Checkpoint**: ✅ Parents can access all child information, read-only enforced

---

## Phase 13: User Story 11 - Reports & Analytics (Priority: P4)

**Goal**: Provide comprehensive reports and analytics for administrators

**Independent Test**: Access Reports → select report type → apply filters → view interactive charts → export as PDF/CSV

### Components

- [ ] T233 [P] [US11] Create src/features/reports/components/ReportsLanding.tsx with report categories
- [ ] T234 [P] [US11] Create src/features/reports/components/AttendanceAnalytics.tsx with trend charts
- [ ] T235 [P] [US11] Create src/features/reports/components/FinancialReports.tsx with collection breakdown
- [ ] T236 [P] [US11] Create src/features/reports/components/StudentAnalytics.tsx with demographics
- [ ] T237 [US11] Implement chart components using recharts library
- [ ] T238 [US11] Add date range filters to all reports
- [ ] T239 [US11] Implement export functionality for all reports

### Routing

- [ ] T240 [US11] Add report routes to src/app/router.tsx

**Checkpoint**: ✅ Reports dashboard complete with analytics and export

---

## Phase 14: Polish & Cross-Cutting Concerns

**Purpose**: Final optimizations, testing, and production readiness

### Performance Optimization

- [ ] T241 [P] Run Lighthouse audit on all major pages and optimize to achieve Performance >= 90
- [ ] T242 [P] Analyze bundle size with vite-bundle-visualizer and optimize chunks
- [ ] T243 [P] Implement virtual scrolling for all lists > 100 items
- [ ] T244 [P] Optimize images (compress, use lazy loading, add responsive images)
- [ ] T245 [P] Review and optimize React Query stale times per data type

### Accessibility Audit

- [ ] T246 [P] Run aXe DevTools accessibility audit and fix all critical issues
- [ ] T247 [P] Test keyboard navigation on all pages (tab order, focus visible)
- [ ] T248 [P] Add missing ARIA labels on all interactive elements
- [ ] T249 [P] Test with screen reader (VoiceOver/NVDA) and fix issues
- [ ] T250 [P] Verify color contrast ratios meet WCAG AA (4.5:1 for normal text)

### Security Hardening

- [ ] T251 [P] Review all user inputs for XSS vulnerabilities and apply sanitization
- [ ] T252 [P] Verify tokens never logged to console in production builds
- [ ] T253 [P] Test tenant isolation: attempt cross-tenant data access
- [ ] T254 [P] Configure Content Security Policy headers (via deployment platform)
- [ ] T255 [P] Add rate limiting awareness to API client error handling

### Cross-Browser Testing

- [ ] T256 [P] Test on Chrome (latest)
- [ ] T257 [P] Test on Firefox (latest)
- [ ] T258 [P] Test on Safari (latest)
- [ ] T259 [P] Test on Edge (latest)
- [ ] T260 [P] Test on mobile Chrome (Android)
- [ ] T261 [P] Test on mobile Safari (iOS)
- [ ] T262 Fix any browser-specific issues found

### Responsive Design Verification

- [ ] T263 [P] Test all pages on desktop (1920px+)
- [ ] T264 [P] Test all pages on tablet (768px-1919px)
- [ ] T265 [P] Test all pages on mobile (375px-767px)
- [ ] T266 Fix layout issues on small screens

### Error Handling Polish

- [ ] T267 [P] Verify all API errors show user-friendly messages
- [ ] T268 [P] Test offline behavior and show appropriate messages
- [ ] T269 [P] Verify error boundaries catch all component errors
- [ ] T270 [P] Add retry mechanisms for failed API calls

### Documentation

- [ ] T271 [P] Write comprehensive README.md with setup instructions
- [ ] T272 [P] Document environment variables in .env.example with descriptions
- [ ] T273 [P] Create deployment guide in docs/DEPLOYMENT.md
- [ ] T274 [P] Document common troubleshooting scenarios
- [ ] T275 [P] Add JSDoc comments to all public APIs and complex functions
- [ ] T276 [P] Create feature documentation for each module

### Testing

- [ ] T277 [P] Write unit tests for critical utility functions (dateUtils, validationUtils, securityUtils)
- [ ] T278 [P] Write unit tests for custom hooks (useDebounce, useLocalStorage)
- [ ] T279 [P] Write component tests for shared components (DataTable, SearchInput, FilterPanel)
- [ ] T280 [P] Write integration tests for auth flow (login → callback → dashboard)
- [ ] T281 [P] Write integration tests for student CRUD flow
- [ ] T282 Run all tests and achieve >= 70% coverage for utils/hooks

### Production Deployment

- [ ] T283 Create production environment configuration (.env.production)
- [ ] T284 Configure production build in vite.config.ts (minification, tree shaking)
- [ ] T285 Set up hosting on Vercel/Netlify with wildcard subdomain support
- [ ] T286 Configure wildcard DNS (*.school.com → hosting)
- [ ] T287 Set up SSL certificates for wildcard domain
- [ ] T288 Configure environment variables in hosting platform
- [ ] T289 Deploy to production and verify all features work
- [ ] T290 Set up monitoring and error tracking (Sentry)
- [ ] T291 Set up analytics (Vercel Analytics or Google Analytics)

### Final Validation

- [ ] T292 Run through all user stories and verify acceptance criteria met
- [ ] T293 Verify all success criteria from baseline spec achieved
- [ ] T294 Verify all constitutional principles followed
- [ ] T295 Run quickstart.md validation (new dev can set up in 15 minutes)
- [ ] T296 Performance metrics verified (Lighthouse >= 90, bundle <= 500KB)
- [ ] T297 Security audit passed (zero critical vulnerabilities)

**Checkpoint**: ✅ Application production-ready, all quality gates passed

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies - can start immediately
2. **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
3. **User Stories (Phases 3-13)**: All depend on Foundational phase completion
   - User stories can proceed in parallel (if staffed)
   - Or sequentially in priority order (P1 → P2 → P3 → P4)
4. **Polish (Phase 14)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Authentication)**: Can start after Foundational - No dependencies on other stories
- **US2 (Multi-Tenancy)**: Can start after Foundational - No dependencies, but integrates with US1
- **US3 (Dashboard)**: Can start after Foundational - Uses US1 auth, US2 tenant context
- **US4 (Students)**: Can start after Foundational - Independently testable
- **US5 (Teachers)**: Can start after Foundational - Mirrors US4, independently testable
- **US6 (Classes)**: Can start after Foundational - Used by US4/US5 but can work with mock data
- **US7 (Attendance)**: Depends on US4, US5, US6 for student/teacher/class data
- **US8 (Timetable)**: Depends on US5, US6 for teacher and class data
- **US9 (Fees)**: Depends on US4 for student data
- **US10 (Parent Portal)**: Depends on US4, US7, US9 for student, attendance, and fee data
- **US11 (Reports)**: Depends on US4, US5, US7, US9 for data to report on

### Critical Path (Sequential)

For single developer or minimum viable product:

```
Setup → Foundational → US1 (Auth) → US2 (Multi-Tenant) → US3 (Dashboard) → 
US4 (Students) → US5 (Teachers) → US6 (Classes) → US7 (Attendance) → Polish
```

### Parallel Opportunities

With multiple developers, these can run in parallel after Foundational:

**Wave 1** (After Foundational):
- US1 (Auth) - Developer A
- US2 (Multi-Tenancy) - Developer B
- US3 (Dashboard) - Developer C

**Wave 2** (After Wave 1):
- US4 (Students) - Developer A
- US5 (Teachers) - Developer B  
- US6 (Classes) - Developer C

**Wave 3** (After Wave 2):
- US7 (Attendance) - Developer A
- US8 (Timetable) - Developer B
- US9 (Fees) - Developer C

**Wave 4** (After Wave 3):
- US10 (Parent Portal) - Developer A
- US11 (Reports) - Developer B

---

## Implementation Strategy

### MVP First (Recommended)

**Goal**: Get minimal viable product working quickly

1. Complete Phase 1: Setup (T001-T018)
2. Complete Phase 2: Foundational (T019-T067) **← CRITICAL BLOCKER**
3. Complete Phase 3: US1 Authentication (T068-T075)
4. Complete Phase 4: US2 Multi-Tenancy (T076-T083)
5. Complete Phase 5: US3 Dashboard (T084-T098)
6. **STOP and VALIDATE**: Test authentication, multi-tenancy, and dashboard independently
7. Deploy/demo if ready

**MVP Deliverable**: Users can log in securely, tenant context is managed, dashboard displays with navigation

### Incremental Delivery

After MVP, add features incrementally:

1. **Increment 2**: Add US4 (Students) → Test independently → Deploy
2. **Increment 3**: Add US5 (Teachers) → Test independently → Deploy
3. **Increment 4**: Add US6 (Classes) + US7 (Attendance) → Test together → Deploy
4. **Increment 5**: Add US8 (Timetable) + US9 (Fees) → Deploy
5. **Increment 6**: Add US10 (Parent Portal) + US11 (Reports) → Deploy
6. **Final**: Phase 14 (Polish) → Production launch

---

## Task Statistics

- **Total Tasks**: 297
- **Phase 1 (Setup)**: 18 tasks
- **Phase 2 (Foundational)**: 49 tasks (BLOCKING)
- **Phase 3 (US1 - Auth)**: 8 tasks
- **Phase 4 (US2 - Multi-Tenant)**: 8 tasks
- **Phase 5 (US3 - Dashboard)**: 15 tasks
- **Phase 6 (US4 - Students)**: 39 tasks
- **Phase 7 (US5 - Teachers)**: 18 tasks
- **Phase 8 (US6 - Classes)**: 18 tasks
- **Phase 9 (US7 - Attendance)**: 18 tasks
- **Phase 10 (US8 - Timetable)**: 11 tasks
- **Phase 11 (US9 - Fees)**: 17 tasks
- **Phase 12 (US10 - Parent Portal)**: 13 tasks
- **Phase 13 (US11 - Reports)**: 8 tasks
- **Phase 14 (Polish)**: 57 tasks

**Parallelizable Tasks**: 156 tasks marked with [P]
**Sequential Tasks**: 141 tasks (dependencies on previous tasks)

---

## Notes

- All tasks include exact file paths for implementation
- [P] marker indicates tasks that can run in parallel (different files, no dependencies)
- [Story] label maps each task to its user story for traceability
- Each user story phase is independently completable and testable
- Constitution compliance verified throughout (Material UI, TypeScript strict, feature-based architecture, etc.)
- Tests are intentionally minimal - focus on critical paths and can be expanded later
- Commit after each logical group of tasks or at each checkpoint

---

**Tasks Status**: ✅ Ready for execution  
**Next Action**: Begin Phase 1 (Setup) with T001  
**Estimated Timeline**: 12 weeks (following implementation plan)

