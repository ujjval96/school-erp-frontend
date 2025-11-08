# Baseline Specification: School ERP Frontend Platform

**Feature Branch**: `baseline-foundation`  
**Created**: 2024-11-08  
**Status**: Active Baseline  
**Input**: Initial platform foundation for multi-tenant School ERP frontend system

---

## System Architecture Context

This frontend application integrates with existing backend services:

### Existing Services (DO NOT MODIFY)

#### 1. Central OIDC Service
- **Purpose**: Centralized authentication and authorization
- **Technology**: Node.js + OpenID Connect
- **Client ID**: `school-erp`
- **Endpoints**: 
  - Authorization: `/authorize`
  - Token: `/token`
  - UserInfo: `/me`
  - Logout: `/session/end`
- **Scopes**: `openid email profile tenant school.read school.write`
- **Multi-tenancy**: Subdomain-based (e.g., `school1.localhost:5173`)
- **Redirect Pattern**: `http://*.localhost:5173/auth/callback` (dev)
- **Status**: ✅ Production-ready, DO NOT CHANGE

#### 2. ERP Backend Service
- **Purpose**: School management business logic and data APIs
- **Technology**: NestJS + Prisma + PostgreSQL + Redis
- **Base URL**: `http://localhost:3000/api/v1`
- **Documentation**: Swagger at `/api/docs`
- **Multi-tenancy**: Header-based (`x-tenant-subdomain` or JWT `tenantId`)
- **Architecture**: 
  - Shared database with row-level isolation
  - Support for school → branch hierarchy
  - Comprehensive domain models (students, teachers, classes, attendance, fees, etc.)
- **Status**: ✅ Operational, may need enterprise enhancements

### Frontend Architecture (THIS PROJECT)

**Technology Stack**:
- React 19.1.1 + TypeScript (strict mode)
- Vite (build tool)
- Material UI v7.3.4 (primary UI library)
- TanStack Router (routing)
- TanStack Query (React Query for data fetching)
- Zustand or React Context (state management)
- Axios (HTTP client with OIDC interceptors)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - OIDC Authentication Flow (Priority: P1)

Users need to authenticate via the central OIDC service using the authorization code flow, with automatic token management and multi-tenant context.

**Why this priority**: Authentication is the absolute foundation. Without proper OIDC integration, no user can access the application. This establishes trust and security from the start.

**Independent Test**: Can be fully tested by navigating to the app, being redirected to OIDC login, authenticating with valid credentials, being redirected back with auth code, exchanging for tokens, and accessing the dashboard. Delivers immediate value by enabling secure access.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user visits the application, **When** they land on any protected route, **Then** they are redirected to the OIDC authorization endpoint with correct client_id, redirect_uri, scope, and state parameters
2. **Given** a user completes authentication at OIDC service, **When** they are redirected back with authorization code, **Then** the frontend exchanges the code for access_token and refresh_token, stores them securely, and redirects to the intended route
3. **Given** an authenticated user with valid tokens, **When** their access_token expires, **Then** the system automatically refreshes the token using refresh_token without requiring re-login
4. **Given** an authenticated user, **When** they click logout, **Then** tokens are cleared from storage, session is ended at OIDC service, and user is redirected to OIDC logout with post_logout_redirect_uri
5. **Given** a user from tenant "school1" logs in, **When** tokens are decoded, **Then** the tenant context (subdomain/tenantId) is extracted and stored for subsequent API calls

---

### User Story 2 - Multi-Tenant Context & Subdomain Routing (Priority: P1)

The application must support multiple school tenants via subdomain routing (e.g., school1.localhost, school2.localhost) with complete data isolation and branding.

**Why this priority**: Multi-tenancy is architectural and must be built from the start. Retrofitting is extremely difficult and error-prone. This ensures data security and scalability.

**Independent Test**: Can be tested by accessing the app via different subdomains, verifying that each loads tenant-specific branding, and that API calls include the correct tenant headers. Delivers value by enabling true multi-tenant SaaS operation.

**Acceptance Scenarios**:

1. **Given** a user accesses `school1.localhost:5173`, **When** the application initializes, **Then** it detects the subdomain "school1", stores it in app state, and uses it for OIDC redirect_uri and API headers
2. **Given** the application knows the tenant subdomain, **When** making any API call to erp-backend, **Then** it includes `x-tenant-subdomain: school1` header to ensure data isolation
3. **Given** a tenant configuration exists in the backend, **When** the dashboard loads, **Then** it displays tenant-specific branding (logo, name, colors) retrieved from the backend
4. **Given** a user is authenticated for tenant "school1", **When** they attempt to manually change the subdomain to "school2" in the URL, **Then** they are logged out and must re-authenticate for school2
5. **Given** a super admin user, **When** they access the application, **Then** they see a tenant switcher UI that allows switching between schools without re-authentication (if backend supports it)

---

### User Story 3 - Dashboard & Navigation Shell (Priority: P1)

Users need a responsive dashboard with navigation menu, school branding, user profile, and quick access to key metrics and modules.

**Why this priority**: The dashboard is the application shell that provides structure and navigation. All other features are accessed through this shell. It represents the user's home base.

**Independent Test**: Can be tested by logging in, viewing the dashboard with placeholder widgets, and navigating to different modules via the sidebar/menu. Delivers value by providing the complete application structure.

**Acceptance Scenarios**:

1. **Given** an authenticated school admin, **When** they land on the dashboard, **Then** they see school branding (logo, name), a navigation sidebar with modules (Students, Teachers, Attendance, Classes, Fees, Reports), and metric cards showing total students, teachers, classes, and today's attendance
2. **Given** a user on the dashboard, **When** they click on a navigation menu item (e.g., "Students"), **Then** they are routed to that module with smooth transition and the menu item is highlighted as active
3. **Given** a user on any page, **When** they click the school logo or home icon, **Then** they return to the dashboard
4. **Given** a teacher user, **When** they access the dashboard, **Then** they see only the modules they have permission for (My Classes, Mark Attendance, View Reports) without admin options
5. **Given** a user on the dashboard, **When** they click their profile icon, **Then** they see a dropdown menu with options: Profile, Settings, Switch Theme (light/dark), Logout
6. **Given** a mobile user, **When** they access the dashboard, **Then** the navigation collapses into a hamburger menu, and metric cards stack vertically

---

### User Story 4 - Student Management Module (Priority: P2)

School staff need to view, search, filter, create, edit, and manage student records with comprehensive information including personal details, academic info, and contact information.

**Why this priority**: Student data is the core entity of school management. Most other features (attendance, grades, fees) depend on student records existing. This is the primary business function.

**Independent Test**: Can be tested by navigating to Students module, viewing paginated list with search/filters, creating a new student with multi-step form, editing existing student, and viewing detailed student profile. Delivers immediate business value.

**Acceptance Scenarios**:

1. **Given** an authenticated staff member on the Students page, **When** the page loads, **Then** they see a data table with columns: Student ID, Photo, Full Name, Grade/Class, Section, Status (Active/Inactive), Admission Date, and Action buttons (View, Edit)
2. **Given** a staff member viewing the student list, **When** they type in the search box, **Then** the list filters in real-time by name, student ID, or parent phone (debounced, 300ms delay)
3. **Given** a staff member on the student list, **When** they apply filters (Grade, Section, Status, Gender, Admission Year), **Then** the API is called with filter parameters and results update accordingly
4. **Given** a staff member, **When** they click "Add New Student", **Then** they see a multi-step form wizard with steps: Personal Info (name, DOB, gender, blood group, photo), Academic Info (admission number, grade, section, academic year), Contact Info (parent names, phone, email, address), Documents (birth certificate, previous school TC)
5. **Given** a staff member filling the student form, **When** they submit with invalid/missing required fields, **Then** inline validation errors are displayed with clear messages, and submission is prevented
6. **Given** a staff member on a student profile page, **When** the page loads, **Then** they see tabs: Overview (personal info card, academic summary), Attendance (monthly calendar view), Academic Records (grades by subject), Fee Records (payment history), Documents (uploaded files)
7. **Given** a staff member viewing a student profile, **When** they click Edit, **Then** the same multi-step form opens pre-filled with current data, allowing updates
8. **Given** a staff member, **When** they attempt to deactivate a student with pending fees, **Then** they see a warning dialog requiring confirmation

---

### User Story 5 - Teacher/Staff Management Module (Priority: P2)

School administrators need to manage teacher and staff records, assign subjects and classes, view schedules, and track employment information.

**Why this priority**: Teachers are the second critical entity. They must be in the system before they can be assigned to classes, mark attendance, or enter grades. This enables the operational workflow.

**Independent Test**: Can be tested by navigating to Teachers module, creating teacher records with qualification info, assigning subjects/classes, and viewing teacher schedules. Delivers value by enabling staff management.

**Acceptance Scenarios**:

1. **Given** an administrator on the Teachers page, **When** the page loads, **Then** they see a table with: Employee ID, Photo, Full Name, Designation (Teacher/Principal/Admin), Subjects, Assigned Classes, Status, Join Date, and Actions
2. **Given** an administrator, **When** they click "Add New Teacher", **Then** they see a form with sections: Personal Info, Qualification (degree, specialization, experience), Employment (joining date, designation, employment type, salary), Subjects & Classes (multi-select for subjects, class assignments), Contact Info
3. **Given** an administrator viewing a teacher profile, **When** they navigate to the Schedule tab, **Then** they see a weekly timetable showing class, subject, and period for each slot
4. **Given** an administrator, **When** they assign a teacher to a class-subject combination, **Then** the system checks for timetable conflicts and warns if the teacher is already scheduled at that time
5. **Given** a teacher logged into the system, **When** they access their profile, **Then** they see their personal info (read-only), their class assignments, their schedule, and a list of students in their classes

---

### User Story 6 - Class & Section Management (Priority: P2)

Administrators need to create academic years, define classes (grades), create sections within classes, set capacity limits, and manage class-section assignments.

**Why this priority**: Classes and sections form the organizational structure that connects students and teachers. This must be established before attendance, timetables, or grades can function.

**Independent Test**: Can be tested by creating academic year, defining classes (Grade 1, Grade 2, etc.), creating sections (A, B, C), setting capacities, and assigning class teachers. Delivers value by establishing organizational hierarchy.

**Acceptance Scenarios**:

1. **Given** an administrator in the Academic Setup section, **When** they create a new academic year, **Then** they enter year name (e.g., "2024-2025"), start date, end date, term structure (semester/trimester/quarters with dates), and holiday calendar
2. **Given** an academic year exists, **When** the administrator creates a class, **Then** they define grade/standard (Grade 1-12 or equivalent), multiple sections with names (A, B, C), capacity per section, and select subjects offered
3. **Given** a class-section is created, **When** the administrator assigns students, **Then** they can search and add students individually or bulk import via CSV, and the system enforces capacity limits
4. **Given** a class-section is created, **When** the administrator assigns a class teacher (homeroom teacher), **Then** they select from the teacher list and the teacher gains permissions to manage that section
5. **Given** subjects are assigned to a class, **When** the administrator assigns subject teachers, **Then** they map each subject to a teacher who will teach that subject to the class
6. **Given** an academic year ends, **When** the administrator runs promotion workflow, **Then** they can bulk promote students from Grade 1 Section A to Grade 2 Section A (or reassign sections), maintaining historical records

---

### User Story 7 - Attendance Tracking Module (Priority: P3)

Teachers need to mark daily attendance for their assigned classes, view attendance history, and administrators need attendance reports and analytics.

**Why this priority**: Attendance is the first operational workflow after setup. It's used daily and provides immediate operational value. However, it depends on students, teachers, and classes being established first.

**Independent Test**: Can be tested by a teacher accessing their class roster for today, marking students as present/absent/late, submitting the attendance, and an administrator viewing attendance reports. Delivers immediate daily operational value.

**Acceptance Scenarios**:

1. **Given** a teacher on the Attendance page, **When** the page loads, **Then** they see a dropdown to select their assigned class-section, a date picker (defaulting to today), and once selected, a list of all enrolled students with quick-mark buttons (Present, Absent, Late, Excused)
2. **Given** a teacher marking attendance, **When** they toggle a student's status, **Then** the UI updates immediately with visual feedback (color coding: green=present, red=absent, yellow=late, blue=excused), and a "Submit Attendance" button becomes enabled
3. **Given** a teacher, **When** they submit attendance for a class, **Then** the data is posted to the backend with timestamp and teacher ID, a success message is shown, and the form locks to prevent accidental re-submission
4. **Given** a teacher, **When** they need to correct attendance for a previous date, **Then** they can select that date, view the existing attendance, modify it (with reason), and the system logs the correction in the audit trail
5. **Given** an administrator viewing attendance reports, **When** they select a date range and class/section, **Then** they see statistics (overall attendance percentage, daily trends line chart), a list of students with low attendance (<75%), and an option to export as CSV/PDF
6. **Given** a parent logged into the parent portal, **When** they view their child's attendance, **Then** they see a monthly calendar view with color-coded dates and the attendance percentage for the month

---

### User Story 8 - Timetable/Schedule Management (Priority: P3)

Administrators need to create weekly timetables defining period-wise subject and teacher assignments, with conflict detection and teacher workload management.

**Why this priority**: Timetables are important for operational efficiency but can be managed manually initially. This is a productivity enhancement that can be built after core features are operational.

**Independent Test**: Can be tested by creating a timetable for a class-section, assigning subjects and teachers to time slots, detecting conflicts, and viewing teacher schedules. Delivers value by automating schedule management.

**Acceptance Scenarios**:

1. **Given** an administrator in the Timetable section, **When** they select a class-section, **Then** they see a grid (rows=weekdays, columns=periods) with each cell showing subject, teacher, and duration
2. **Given** an administrator editing a timetable cell, **When** they click on a slot, **Then** they see a modal to select subject (from class subjects), teacher (from teachers assigned to that subject), period duration, and room number
3. **Given** an administrator assigning a teacher to a slot, **When** that teacher is already assigned to another class at the same time, **Then** the system shows a conflict warning with details of the clash and requires confirmation to override
4. **Given** a timetable is created, **When** a teacher logs in, **Then** their dashboard shows "Today's Schedule" widget with their next 3 classes and a link to full weekly schedule
5. **Given** a student/parent, **When** they view the student's class timetable, **Then** they see the weekly schedule with subjects, teachers, and room numbers

---

### User Story 9 - Fee Management Module (Priority: P3)

School administrators need to define fee structures, generate fee records for students, track payments, send reminders, and generate financial reports.

**Why this priority**: Fee management is critical for school operations but requires students and classes to be fully established. It can be developed independently once core academic features are working.

**Independent Test**: Can be tested by creating fee categories (tuition, bus, lab), assigning fees to students based on grade, recording payments (cash, online, cheque), and viewing payment reports. Delivers financial management value.

**Acceptance Scenarios**:

1. **Given** an administrator in Fee Setup, **When** they create a fee structure, **Then** they define fee categories (Tuition, Transport, Lab, Library), amounts, and assign to specific grades or individual students
2. **Given** a fee structure is defined, **When** the administrator generates fee records, **Then** the system creates fee records for all applicable students for the academic term with due dates
3. **Given** a student has pending fees, **When** the administrator records a payment, **Then** they enter amount, payment mode (cash/card/UPI/cheque), transaction reference, date, and the student's outstanding balance updates
4. **Given** fees are due, **When** the reminder job runs, **Then** automated email/SMS notifications are sent to parents with outstanding amount, due date, and payment instructions
5. **Given** an administrator viewing fee reports, **When** they select a date range, **Then** they see total collections by payment mode, pending amount, defaulters list, and category-wise breakdown with export options
6. **Given** a parent in the parent portal, **When** they view fee details, **Then** they see fee structure, payment history, pending amount, and an option to pay online (if integrated)

---

### User Story 10 - Parent Portal Access (Priority: P3)

Parents need secure access to view their children's information including attendance, academic records, fee status, announcements, and communicate with teachers.

**Why this priority**: Parent engagement is valuable but depends on all core features (students, attendance, grades, fees) being operational. It's a read-only interface that can be developed once data is flowing.

**Independent Test**: Can be tested by providing parent credentials, allowing them to view linked children, accessing attendance history, viewing fee status, and sending messages to teachers. Delivers stakeholder transparency value.

**Acceptance Scenarios**:

1. **Given** a parent logs in via OIDC, **When** the parent portal dashboard loads, **Then** they see cards for each linked child showing child's name, photo, class, section, and quick stats (attendance %, pending fees, upcoming events)
2. **Given** a parent selects a child, **When** they navigate to Attendance tab, **Then** they see a monthly calendar with color-coded attendance, overall percentage, and recent absences list
3. **Given** a parent viewing their child's profile, **When** they access Academic Records tab, **Then** they see current subjects, grades/marks for completed assessments, and teacher remarks
4. **Given** a parent on the Fee Status tab, **When** the page loads, **Then** they see total fee amount, paid amount, pending amount, payment due date, payment history table, and a "Pay Now" button (if online payment is enabled)
5. **Given** a parent, **When** they access the Communication section, **Then** they can view school announcements, upcoming events, and compose messages to teachers (which create tickets in the admin system)
6. **Given** a parent, **When** important events occur (absence, fee reminder, grade published), **Then** they receive email notifications with details and a link to view in the portal

---

### User Story 11 - Reports & Analytics Dashboard (Priority: P4)

Administrators need comprehensive reports and analytics including attendance trends, academic performance, fee collection, and student demographics.

**Why this priority**: Reporting is important for decision-making but is a secondary feature after all operational workflows are established. Can be built iteratively as data accumulates.

**Independent Test**: Can be tested by accessing the Reports section, generating various reports (attendance, fees, academic), viewing interactive charts, and exporting as PDF/Excel. Delivers analytical insights.

**Acceptance Scenarios**:

1. **Given** an administrator on the Reports dashboard, **When** the page loads, **Then** they see report categories (Attendance, Academic, Financial, Student Info) with quick access cards
2. **Given** an administrator generates an attendance report, **When** they select date range and filters (grade/section), **Then** they see class-wise attendance trends (line chart), section-wise comparison (bar chart), and defaulters list with export option
3. **Given** an administrator viewing financial reports, **When** they select a time period, **Then** they see total collections (with month-over-month comparison), pending amounts, payment mode breakdown (pie chart), and category-wise analysis
4. **Given** an administrator accessing student analytics, **When** the page loads, **Then** they see demographics (gender ratio, age distribution), enrollment trends over years, and retention rates

---

### Edge Cases & Error Scenarios

#### Authentication & Authorization
- What happens when OIDC service is unreachable during login? **→ Show user-friendly error with retry option, fallback to offline message**
- How does system handle expired refresh tokens? **→ Automatically logout user, clear storage, redirect to login with message "Session expired, please login again"**
- What happens when a user's role changes while they're logged in? **→ Implement token refresh that updates permissions, or force re-login on critical role changes**
- How does system handle invalid or tampered tokens? **→ Detect signature mismatch, clear tokens, redirect to login with security warning**

#### Multi-Tenancy
- What happens when a user tries to access a subdomain they don't belong to? **→ Check tenant association in token, show 403 Forbidden, redirect to their correct tenant subdomain**
- How does system handle a non-existent subdomain (school not found)? **→ Show 404 page with message "School not found" and contact support link**
- What happens when tenant data is being migrated or is temporarily unavailable? **→ Show maintenance message, prevent operations, show retry timer**

#### Data Operations
- What happens when a student transfer occurs mid-year? **→ Maintain historical records with date ranges, update current associations, preserve attendance/grades history**
- How does system handle bulk import failures (CSV with errors)? **→ Validate before processing, show validation errors with line numbers, allow correction and re-upload, partial success not allowed**
- What happens when concurrent users edit the same student record? **→ Implement optimistic locking with version field, show conflict message "Record modified by another user", offer to reload and merge**
- How does system handle deletion of a class with enrolled students? **→ Prevent hard delete, require students to be transferred first, offer soft delete that maintains records**

#### Performance & Network
- What happens when API requests timeout or fail? **→ Show error message with retry button, use React Query retry mechanism (3 retries with exponential backoff), show "Working Offline" indicator**
- How does system handle slow network for mobile users? **→ Show skeleton loaders, implement progressive loading, cache data with React Query, compress images**
- What happens when paginated data is modified while user is browsing? **→ Show stale data until refresh, offer "New data available, refresh?" notification, handle page boundary edge cases**

#### Business Logic
- What happens when attendance is marked after school hours/on holiday? **→ Allow with warning "Marking attendance for non-school day", require confirmation, log in audit trail**
- How does system handle fee payment posted to wrong student? **→ Implement payment reversal workflow requiring admin approval, maintain audit trail, send notifications**
- What happens when a teacher tries to access a class they're no longer assigned to? **→ Check current assignments in real-time, show "You don't have access to this class" message**
- How does system handle academic year transition? **→ Provide guided workflow for promotion, freeze previous year data, create new year with templates, allow rollback window**

---

## Requirements *(mandatory)*

### Functional Requirements

#### FR-AUTH: Authentication & Authorization

- **FR-AUTH-001**: System MUST integrate with central-oidc-service using OpenID Connect authorization code flow with PKCE
- **FR-AUTH-002**: System MUST store access_token and refresh_token securely (httpOnly cookies preferred, or secure localStorage with encryption)
- **FR-AUTH-003**: System MUST automatically refresh expired access tokens using refresh_token without user interaction
- **FR-AUTH-004**: System MUST handle token expiration gracefully, logging out user only when refresh token expires
- **FR-AUTH-005**: System MUST implement logout by clearing local tokens AND calling OIDC `/session/end` endpoint with post_logout_redirect_uri
- **FR-AUTH-006**: System MUST extract user profile (name, email, roles) from OIDC `/me` endpoint or JWT claims
- **FR-AUTH-007**: System MUST implement route guards that redirect unauthenticated users to OIDC login with state parameter for return URL
- **FR-AUTH-008**: System MUST implement role-based UI rendering showing/hiding features based on user permissions

#### FR-TENANT: Multi-Tenancy

- **FR-TENANT-001**: System MUST detect tenant subdomain from URL (e.g., school1.localhost:5173) on application load
- **FR-TENANT-002**: System MUST include `x-tenant-subdomain` header in ALL API calls to erp-backend
- **FR-TENANT-003**: System MUST validate tenant context from JWT token matches URL subdomain, logout if mismatch
- **FR-TENANT-004**: System MUST fetch and display tenant-specific branding (logo, name, primary color) from backend
- **FR-TENANT-005**: System MUST apply tenant branding to Material UI theme (primary color, logo in header)
- **FR-TENANT-006**: System MUST support tenant switcher for super admin users (if backend provides multi-tenant access)
- **FR-TENANT-007**: System MUST cache tenant information (logo, settings) using React Query with 1-hour stale time

#### FR-UI: User Interface & Experience

- **FR-UI-001**: System MUST use Material UI v7.3.4 components exclusively for all UI elements
- **FR-UI-002**: System MUST implement responsive design supporting desktop (1920px+), tablet (768px-1919px), and mobile (375px-767px)
- **FR-UI-003**: System MUST provide light and dark theme modes switchable via user preference
- **FR-UI-004**: System MUST persist theme preference in localStorage per user
- **FR-UI-005**: System MUST show loading skeletons (Material UI Skeleton) for all async data fetching
- **FR-UI-006**: System MUST show error messages using Material UI Alert with severity levels (error, warning, info, success)
- **FR-UI-007**: System MUST show success feedback using toast notifications (Material UI Snackbar) with 5-second auto-dismiss
- **FR-UI-008**: System MUST implement keyboard navigation for all interactive elements (tab order, focus visible)
- **FR-UI-009**: System MUST provide ARIA labels for screen reader accessibility on all inputs, buttons, and links
- **FR-UI-010**: System MUST implement form validation with inline error messages on blur and submit

#### FR-NAV: Navigation & Routing

- **FR-NAV-001**: System MUST use TanStack Router for client-side routing with lazy-loaded route components
- **FR-NAV-002**: System MUST implement nested routes with layout components (DashboardLayout, AuthLayout)
- **FR-NAV-003**: System MUST show persistent navigation sidebar (collapsible on mobile) with active route highlighting
- **FR-NAV-004**: System MUST implement breadcrumb navigation for nested pages (e.g., Students > Grade 5 > Section A)
- **FR-NAV-005**: System MUST show loading progress bar (Material UI LinearProgress) on route transitions
- **FR-NAV-006**: System MUST preserve scroll position when navigating back from detail pages
- **FR-NAV-007**: System MUST implement 404 error page for unmatched routes with navigation back to dashboard

#### FR-DATA: Data Fetching & State Management

- **FR-DATA-001**: System MUST use TanStack Query (React Query) for ALL server state management
- **FR-DATA-002**: System MUST configure React Query with appropriate stale times: 5min (list data), 1min (detail data), 1hour (settings/config)
- **FR-DATA-003**: System MUST implement optimistic updates for mutations (create/update) with rollback on error
- **FR-DATA-004**: System MUST show loading states during data fetching (skeleton loaders, not spinners)
- **FR-DATA-005**: System MUST implement error retry mechanism (3 retries with exponential backoff) for failed API calls
- **FR-DATA-006**: System MUST implement pagination for list views with configurable page size (default 20, options: 10, 20, 50, 100)
- **FR-DATA-007**: System MUST implement debounced search inputs (300ms delay) to reduce API calls
- **FR-DATA-008**: System MUST use Zustand for client-side UI state (drawer open/closed, selected items, filters)
- **FR-DATA-009**: System MUST invalidate React Query cache on relevant mutations (e.g., creating student invalidates student list)

#### FR-API: API Integration

- **FR-API-001**: System MUST use Axios as HTTP client with interceptors for auth tokens and error handling
- **FR-API-002**: System MUST include Authorization header with Bearer token in all authenticated API calls
- **FR-API-003**: System MUST include `x-tenant-subdomain` header in all API calls
- **FR-API-004**: System MUST implement request interceptor to add authentication and tenant headers automatically
- **FR-API-005**: System MUST implement response interceptor to handle 401 (refresh token), 403 (permission denied), 404, 500 errors globally
- **FR-API-006**: System MUST configure API base URL via environment variable (VITE_API_BASE_URL)
- **FR-API-007**: System MUST implement API client service layer with typed methods for each endpoint
- **FR-API-008**: System MUST log API errors (to console in dev, to monitoring service in production)

#### FR-STUDENT: Student Management

- **FR-STUDENT-001**: System MUST display paginated student list with columns: photo, ID, name, grade, section, status, admission date, actions
- **FR-STUDENT-002**: System MUST implement real-time search by name, student ID, parent phone with debouncing
- **FR-STUDENT-003**: System MUST implement filters: grade, section, gender, status (active/inactive), admission year
- **FR-STUDENT-004**: System MUST provide multi-step form wizard for creating students: Personal Info, Academic Info, Contact Info, Documents
- **FR-STUDENT-005**: System MUST validate required fields: name, DOB, gender, admission number, grade, section, at least one parent contact
- **FR-STUDENT-006**: System MUST support photo upload for students (max 2MB, formats: jpg, png) with client-side preview
- **FR-STUDENT-007**: System MUST display student detail page with tabs: Overview, Attendance, Academic Records, Fee Records, Documents
- **FR-STUDENT-008**: System MUST support editing student information with pre-filled form and optimistic updates
- **FR-STUDENT-009**: System MUST implement soft delete (deactivate) for students with confirmation dialog
- **FR-STUDENT-010**: System MUST support bulk import via CSV with validation and error reporting

#### FR-TEACHER: Teacher Management

- **FR-TEACHER-001**: System MUST display teacher list with: photo, employee ID, name, designation, subjects, classes, status, actions
- **FR-TEACHER-002**: System MUST provide form to create teacher with: personal info, qualification, employment details, subjects, class assignments
- **FR-TEACHER-003**: System MUST validate required fields: name, employee ID, designation, joining date, at least one subject
- **FR-TEACHER-004**: System MUST display teacher detail page with tabs: Profile, Schedule, Assigned Classes, Performance (if available)
- **FR-TEACHER-005**: System MUST show teacher's weekly timetable on schedule tab with color-coded subjects
- **FR-TEACHER-006**: System MUST allow assigning subjects and classes to teachers with conflict detection
- **FR-TEACHER-007**: System MUST show workload indicator (number of periods per week) when assigning classes

#### FR-CLASS: Class & Section Management

- **FR-CLASS-001**: System MUST allow creating academic years with name, start date, end date, term structure
- **FR-CLASS-002**: System MUST allow creating classes (grades) with multiple sections, capacity, and subject assignments
- **FR-CLASS-003**: System MUST display class-section hierarchy in tree view or cards
- **FR-CLASS-004**: System MUST allow assigning class teacher (homeroom teacher) to each section
- **FR-CLASS-005**: System MUST allow assigning students to sections with capacity enforcement
- **FR-CLASS-006**: System MUST show current enrollment count vs capacity for each section
- **FR-CLASS-007**: System MUST support bulk student promotion workflow at year-end

#### FR-ATTENDANCE: Attendance Management

- **FR-ATTENDANCE-001**: System MUST allow teachers to select class-section and date to mark attendance
- **FR-ATTENDANCE-002**: System MUST display all enrolled students with quick-mark buttons: Present (default), Absent, Late, Excused
- **FR-ATTENDANCE-003**: System MUST visually differentiate attendance statuses with color coding
- **FR-ATTENDANCE-004**: System MUST submit attendance with date, class, section, student-status pairs, teacher ID, timestamp
- **FR-ATTENDANCE-005**: System MUST lock attendance form after submission to prevent duplicate submissions
- **FR-ATTENDANCE-006**: System MUST allow editing past attendance (within configurable days limit) with reason field
- **FR-ATTENDANCE-007**: System MUST display attendance reports with filters: date range, class, section, student
- **FR-ATTENDANCE-008**: System MUST show attendance statistics: overall percentage, daily trends (line chart), low-attendance students
- **FR-ATTENDANCE-009**: System MUST support exporting attendance reports as CSV or PDF

#### FR-TIMETABLE: Timetable Management

- **FR-TIMETABLE-001**: System MUST display timetable as weekly grid (rows: weekdays, columns: periods)
- **FR-TIMETABLE-002**: System MUST allow admins to assign subject and teacher to each time slot
- **FR-TIMETABLE-003**: System MUST detect and warn about teacher scheduling conflicts
- **FR-TIMETABLE-004**: System MUST show teacher's personal schedule aggregated from all class assignments
- **FR-TIMETABLE-005**: System MUST allow students/parents to view their class timetable in read-only mode

#### FR-FEE: Fee Management

- **FR-FEE-001**: System MUST allow creating fee structures with categories (tuition, transport, lab, etc.) and amounts
- **FR-FEE-002**: System MUST support assigning fee structures to grades or individual students
- **FR-FEE-003**: System MUST display student fee details: total amount, paid amount, pending amount, due date
- **FR-FEE-004**: System MUST allow recording payments with amount, mode, transaction reference, date
- **FR-FEE-005**: System MUST update outstanding balance in real-time after payment recording
- **FR-FEE-006**: System MUST display payment history table for each student
- **FR-FEE-007**: System MUST generate fee reports: total collections, pending amounts, payment mode breakdown, defaulters list
- **FR-FEE-008**: System MUST support exporting fee reports as CSV or PDF

#### FR-PARENT: Parent Portal

- **FR-PARENT-001**: System MUST authenticate parents via OIDC with role "PARENT"
- **FR-PARENT-002**: System MUST display cards for all children linked to parent account
- **FR-PARENT-003**: System MUST allow parents to view child's attendance (calendar view with color coding)
- **FR-PARENT-004**: System MUST allow parents to view child's academic records (subjects, grades, remarks)
- **FR-PARENT-005**: System MUST allow parents to view fee status (total, paid, pending, due date)
- **FR-PARENT-006**: System MUST allow parents to view school announcements and upcoming events
- **FR-PARENT-007**: System MUST allow parents to send messages to teachers (creates support tickets)
- **FR-PARENT-008**: System MUST prevent parents from editing any data (read-only access)

#### FR-REPORT: Reports & Analytics

- **FR-REPORT-001**: System MUST provide attendance reports with date range filter and visualization (line/bar charts)
- **FR-REPORT-002**: System MUST provide financial reports showing collections, pending amounts, payment modes (pie chart)
- **FR-REPORT-003**: System MUST provide student analytics: demographics, enrollment trends, retention rates
- **FR-REPORT-004**: System MUST support exporting all reports as CSV or PDF
- **FR-REPORT-005**: System MUST cache report data for 5 minutes to reduce backend load

### Non-Functional Requirements

#### NFR-PERF: Performance

- **NFR-PERF-001**: System MUST achieve Lighthouse Performance score >= 90 on desktop, >= 80 on mobile
- **NFR-PERF-002**: System MUST load initial route (dashboard) in <= 2 seconds on broadband (10 Mbps)
- **NFR-PERF-003**: System MUST use lazy loading (React.lazy) for all route components
- **NFR-PERF-004**: System MUST implement code splitting for vendor libraries (React, Material UI, TanStack)
- **NFR-PERF-005**: System MUST compress images and use lazy loading for image assets
- **NFR-PERF-006**: System MUST implement virtual scrolling (react-window) for lists > 100 items
- **NFR-PERF-007**: System MUST achieve First Contentful Paint (FCP) <= 1.5s, Time to Interactive (TTI) <= 3.5s

#### NFR-SEC: Security

- **NFR-SEC-001**: System MUST store tokens securely (httpOnly cookies or encrypted localStorage)
- **NFR-SEC-002**: System MUST implement Content Security Policy (CSP) headers via server/CDN config
- **NFR-SEC-003**: System MUST sanitize all user inputs before displaying to prevent XSS
- **NFR-SEC-004**: System MUST implement HTTPS in production (enforced via deployment config)
- **NFR-SEC-005**: System MUST not log sensitive data (tokens, passwords) to console in production
- **NFR-SEC-006**: System MUST implement CSRF protection for state-changing operations (handled by OIDC flow)
- **NFR-SEC-007**: System MUST validate tenant context on every authenticated request to prevent cross-tenant access

#### NFR-A11Y: Accessibility

- **NFR-A11Y-001**: System MUST achieve WCAG 2.1 Level AA compliance
- **NFR-A11Y-002**: System MUST maintain minimum contrast ratio of 4.5:1 for normal text, 3:1 for large text
- **NFR-A11Y-003**: System MUST provide keyboard navigation for all interactive elements
- **NFR-A11Y-004**: System MUST provide ARIA labels for all form inputs and buttons
- **NFR-A11Y-005**: System MUST announce dynamic content changes to screen readers (ARIA live regions)
- **NFR-A11Y-006**: System MUST provide visible focus indicators for keyboard navigation
- **NFR-A11Y-007**: System MUST achieve Lighthouse Accessibility score >= 95

#### NFR-MAINT: Maintainability

- **NFR-MAINT-001**: System MUST follow feature-based folder structure as defined in constitution
- **NFR-MAINT-002**: System MUST use TypeScript strict mode with no `any` types (exceptions documented)
- **NFR-MAINT-003**: System MUST use absolute imports (@/components, @/hooks, @/services)
- **NFR-MAINT-004**: System MUST pass ESLint checks with zero errors before commits
- **NFR-MAINT-005**: System MUST have JSDoc comments for all public functions and complex logic
- **NFR-MAINT-006**: System MUST maintain bundle size <= 500KB (gzipped) for initial load

#### NFR-DEPLOY: Deployment

- **NFR-DEPLOY-001**: System MUST support environment-based configuration (dev, staging, production)
- **NFR-DEPLOY-002**: System MUST use environment variables for API URLs, OIDC config (prefixed with VITE_)
- **NFR-DEPLOY-003**: System MUST build optimized production bundle with minification and tree shaking
- **NFR-DEPLOY-004**: System MUST be deployable as static files to CDN/web server (Vercel, Netlify, S3+CloudFront)
- **NFR-DEPLOY-005**: System MUST support wildcard subdomain routing (*.school.com resolves to same frontend)

### Key Entities *(from Backend)*

These entities exist in the erp-backend and will be consumed by the frontend:

- **Tenant (School)**: School organization with subdomain, name, branding, settings. May have parent-child hierarchy for branches.
- **User**: System user with email, roles (SUPER_ADMIN, ADMIN, TEACHER, PARENT, STUDENT), tenant association, authentication via OIDC.
- **Student**: Student entity with admission number, name, DOB, gender, class/section, parent associations, medical info, photo, status.
- **Teacher**: Staff entity with employee ID, name, designation, subjects, qualification, employment details, assigned classes.
- **Class**: Grade/standard entity with name (Grade 1-12), academic year, sections, subjects offered.
- **Section**: Division within a class with name (A, B, C), class teacher, capacity, current enrollment.
- **Academic Year**: School year with name, start/end dates, terms/semesters, holiday calendar, status.
- **Subject**: Subject entity with name, code, grade levels, credit hours.
- **Attendance Record**: Daily attendance with date, student, class, section, status (Present/Absent/Late/Excused), marked by teacher.
- **Fee Structure**: Fee definition with categories (tuition, transport, lab), amounts, applicable grades.
- **Fee Record**: Fee instance for a student with total amount, paid amount, pending amount, due date, payment history.
- **Timetable Entry**: Schedule entry with day, period, class, section, subject, teacher, time slot.
- **Parent-Student Link**: Association between parent user and student(s).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

#### User Experience
- **SC-UX-001**: Users can complete login flow (click login → authenticate at OIDC → land on dashboard) in under 10 seconds
- **SC-UX-002**: 95% of users can navigate to any module (Students, Teachers, Attendance) without assistance in first session
- **SC-UX-003**: Dashboard loads with navigation and widgets in under 2 seconds on standard broadband (10 Mbps)
- **SC-UX-004**: Student search returns results within 500ms for databases with up to 10,000 students per tenant
- **SC-UX-005**: Forms provide inline validation feedback within 100ms of user input
- **SC-UX-006**: Mobile users can access all features with usable UI on devices >= 375px width (iPhone SE and above)

#### Performance
- **SC-PERF-001**: Lighthouse Performance score >= 90 (desktop), >= 80 (mobile)
- **SC-PERF-002**: Lighthouse Accessibility score >= 95
- **SC-PERF-003**: Initial bundle size (before lazy loading) <= 500KB gzipped
- **SC-PERF-004**: Route transitions complete within 300ms (excluding API data fetch)
- **SC-PERF-005**: Application handles 500 concurrent users per tenant without client-side performance issues

#### Functionality
- **SC-FUNC-001**: Teachers can mark attendance for a class of 40 students in under 2 minutes
- **SC-FUNC-002**: Administrators can create a new student record with complete information in under 5 minutes
- **SC-FUNC-003**: Parents can view their child's attendance and fee status within 3 clicks from login
- **SC-FUNC-004**: System handles token refresh seamlessly without interrupting user workflow (success rate >= 99%)
- **SC-FUNC-005**: API errors are caught and displayed with user-friendly messages in >= 95% of cases

#### Security
- **SC-SEC-001**: Zero XSS vulnerabilities detected in security audit
- **SC-SEC-002**: Zero successful cross-tenant data access attempts in security testing
- **SC-SEC-003**: Authentication tokens are never logged to browser console in production builds
- **SC-SEC-004**: Session timeout and forced logout works correctly after 1 hour of inactivity

#### Developer Experience
- **SC-DEV-001**: New developers can run the project locally within 15 minutes (after reading README)
- **SC-DEV-002**: Code passes ESLint with zero errors and zero warnings
- **SC-DEV-003**: TypeScript compilation succeeds with strict mode and zero `any` types (except documented exceptions)
- **SC-DEV-004**: All features follow constitution principles (verified in code review)

#### Business Value
- **SC-BIZ-001**: Parent portal reduces phone calls to school office for routine queries by >= 40%
- **SC-BIZ-002**: Digital attendance reduces daily attendance processing time by >= 60% compared to paper-based
- **SC-BIZ-003**: Fee management module improves payment collection rate by >= 20% through reminders and transparency
- **SC-BIZ-004**: System supports onboarding of 100 schools (tenants) without code changes

---

## Technical Architecture Alignment

This baseline specification is designed to align with:

### School ERP Project Constitution (v1.0.0)

All implementations MUST adhere to the 12 core principles:

1. **Material UI First**: All UI components use MUI v7.3.4, no Tailwind, styling via `sx` prop or theme
2. **TypeScript Strict Mode**: Complete type safety, no `any` types except documented exceptions
3. **Feature-Based Architecture**: Code organized in `/src/features/[feature]/` with components, hooks, services, types
4. **React Query for Data Fetching**: All API calls via TanStack Query hooks, no direct axios in components
5. **Security First**: Input sanitization, XSS protection, authentication on all API calls, CSP headers
6. **Performance Optimization**: Lazy loading, code splitting, virtual scrolling for large lists, debounced search
7. **Accessibility**: WCAG AA compliance, keyboard navigation, ARIA labels, screen reader support
8. **Environment Configuration**: API URLs and OIDC config via environment variables (VITE_*)
9. **Component Composition**: Small, reusable components, avoid monolithic components > 300 lines
10. **Error Handling & User Feedback**: Error boundaries, loading states, user-friendly messages, toast notifications
11. **Code Quality Standards**: ESLint, TypeScript strict, absolute imports, JSDoc for complex logic
12. **Testing & Documentation**: Unit tests for critical logic, component tests, JSDoc comments, feature READMEs

### Integration with Existing Services

#### Central OIDC Service Integration
- Use client ID: `school-erp`
- Implement authorization code flow with PKCE
- Redirect URI pattern: `http://*.localhost:5173/auth/callback` (dev), `https://*.school.com/auth/callback` (prod)
- Request scopes: `openid email profile tenant school.read school.write`
- Store tokens securely (httpOnly cookies preferred)
- Implement automatic token refresh
- Call `/session/end` on logout

#### ERP Backend Integration
- Base URL: Configured via `VITE_API_BASE_URL` environment variable
- All requests include headers:
  - `Authorization: Bearer ${accessToken}`
  - `x-tenant-subdomain: ${subdomain}`
- Use Axios with interceptors for automatic header injection
- Implement error handling for 401 (refresh token), 403, 404, 500
- Follow backend API contracts (documented in Swagger at /api/docs)

---

## Potential Backend Enhancements (For Future Discussion)

The following enhancements may be needed in erp-backend for enterprise-level features:

### High Priority
1. **Branch/Multi-campus Support**: Implement hierarchical tenant model (school → branches) as outlined in MULTI_TENANT_ARCHITECTURE.md
2. **Fine-grained Permissions**: Expand role-based access to permission-based (e.g., `student.read`, `attendance.write`) for granular control
3. **Bulk Operations APIs**: Add endpoints for bulk student import, bulk attendance marking, bulk promotion
4. **Export APIs**: Add endpoints to export reports as PDF/CSV server-side
5. **Real-time Notifications**: WebSocket or Server-Sent Events for real-time updates (new announcements, fee reminders)

### Medium Priority
6. **Online Payment Gateway Integration**: Integrate Razorpay/Stripe for parent online fee payment
7. **SMS/Email Notification Service**: Integration for automated reminders and alerts
8. **Academic Performance APIs**: Grades, assessments, report cards management
9. **Library Management**: Book catalog, issue/return tracking
10. **Transport Management**: Bus routes, student-bus mapping, driver management

### Low Priority
11. **Document Storage**: Integration with S3/cloud storage for student documents, report cards
12. **Exam Management**: Exam scheduling, hall tickets, result processing
13. **Hostel Management**: Room allocation, mess management
14. **Inventory Management**: School assets, stationery, uniforms

**Note**: These enhancements should be discussed with backend team and prioritized based on customer needs. Frontend will be designed to accommodate these features with minimal refactoring.

---

## Development Roadmap

### Phase 1: Foundation & Authentication (Weeks 1-2)
**Goal**: Establish project foundation, OIDC integration, and multi-tenant routing

#### Tasks:
1. Project setup: Vite + React + TypeScript + ESLint + Prettier
2. Install and configure Material UI v7.3.4 with custom theme
3. Install TanStack Router and TanStack Query
4. Implement OIDC authentication flow (login, callback, token management, logout)
5. Implement tenant subdomain detection and context management
6. Create layout components (AuthLayout, DashboardLayout)
7. Implement route guards and authentication HOC
8. Create basic navigation sidebar and header
9. Implement theme switcher (light/dark mode)
10. Configure Axios with interceptors for auth and tenant headers

**Deliverables**:
- User can log in via OIDC and be redirected to dashboard
- Multi-tenant context is detected and stored
- Navigation shell is functional with placeholder routes
- Theme switching works

**Success Criteria**:
- Login flow completes successfully with token storage
- API calls include correct authentication and tenant headers
- Navigation renders based on user role

---

### Phase 2: Dashboard & Core Entities (Weeks 3-4)
**Goal**: Build dashboard with widgets and implement student/teacher list views

#### Tasks:
1. Create dashboard page with metric cards (students, teachers, attendance)
2. Fetch dashboard statistics from backend API
3. Implement student list page with table, search, and filters
4. Implement student detail page with tabs (Overview, Attendance, etc.)
5. Implement create student form (multi-step wizard)
6. Implement edit student functionality
7. Implement teacher list page with table
8. Implement teacher detail page
9. Implement create/edit teacher forms
10. Set up React Query cache configuration and invalidation logic

**Deliverables**:
- Dashboard displays real data from backend
- Student management CRUD operations are fully functional
- Teacher management CRUD operations are fully functional
- Search and filtering work on list pages

**Success Criteria**:
- Administrators can create, view, edit students end-to-end
- Search returns results within 500ms
- Forms have proper validation and error handling

---

### Phase 3: Class Setup & Attendance (Weeks 5-6)
**Goal**: Implement organizational structure and attendance tracking

#### Tasks:
1. Implement academic year management (create, view, edit)
2. Implement class and section management
3. Implement student-section assignment interface
4. Implement teacher-subject-class assignment interface
5. Implement attendance marking page for teachers
6. Implement attendance calendar view
7. Implement attendance reports with charts
8. Implement attendance correction workflow
9. Add capacity enforcement for sections
10. Implement export functionality for attendance reports

**Deliverables**:
- Administrators can set up academic structure (years, classes, sections)
- Teachers can mark attendance daily
- Attendance reports are available with visualization
- Students can be assigned to sections with capacity limits

**Success Criteria**:
- Teachers can mark attendance for 40 students in under 2 minutes
- Attendance reports load in under 1 second for 1 month of data
- Low-attendance students are correctly identified

---

### Phase 4: Timetable & Fee Management (Weeks 7-8)
**Goal**: Add timetable management and fee tracking features

#### Tasks:
1. Implement timetable grid view
2. Implement timetable editor with drag-and-drop (optional) or modal-based
3. Implement teacher conflict detection
4. Implement teacher personal schedule view
5. Implement fee structure creation and assignment
6. Implement fee record display for students
7. Implement payment recording interface
8. Implement fee reports and analytics
9. Implement defaulters list with export
10. Add fee reminder functionality (if backend supports)

**Deliverables**:
- Administrators can create and manage timetables
- Teachers see their personal schedules
- Fee management is fully functional with payment tracking
- Fee reports are available with export

**Success Criteria**:
- Timetable conflicts are detected and warned
- Fee payment updates outstanding balance correctly
- Fee reports calculate totals accurately

---

### Phase 5: Parent Portal & Reports (Weeks 9-10)
**Goal**: Build parent-facing features and comprehensive reporting

#### Tasks:
1. Create parent portal layout with child selection
2. Implement parent dashboard with child cards
3. Implement attendance view for parents (calendar)
4. Implement academic records view for parents
5. Implement fee status view for parents
6. Implement announcements and events view
7. Implement messaging/communication feature
8. Create reports dashboard for administrators
9. Implement attendance analytics with charts
10. Implement financial reports with export

**Deliverables**:
- Parents can log in and view all children's information
- Parents receive read-only access to attendance, grades, fees
- Administrators have comprehensive reporting dashboard

**Success Criteria**:
- Parents can access child information within 3 clicks
- Reports load within 2 seconds for typical datasets
- Export functionality works for CSV and PDF

---

### Phase 6: Polish, Performance & Launch (Weeks 11-12)
**Goal**: Optimize, test, and prepare for production deployment

#### Tasks:
1. Performance optimization: code splitting review, bundle size analysis
2. Implement virtual scrolling for large lists
3. Accessibility audit and fixes (keyboard nav, ARIA labels, contrast)
4. Security audit: XSS prevention, token storage, CSP headers
5. Error handling review: ensure all APIs have error boundaries
6. Loading states review: ensure all async operations show feedback
7. Mobile responsiveness testing and fixes
8. Cross-browser testing (Chrome, Firefox, Safari, Edge)
9. Documentation: README, environment setup, deployment guide
10. Production deployment setup (Vercel/Netlify config)

**Deliverables**:
- Lighthouse scores meet targets (Performance >= 90, A11y >= 95)
- Bundle size is optimized (<= 500KB gzipped)
- Security audit passes with zero critical issues
- Application is deployed to production environment

**Success Criteria**:
- All acceptance criteria from user stories are met
- All success criteria are achieved
- Application is live and accessible to end users

---

## Project Structure

### Frontend Structure (THIS PROJECT)

```
school-erp-frontend/
├── .specify/                         # Specification and templates
│   ├── memory/
│   │   ├── constitution.md
│   │   └── baseline-spec.md          # This file
│   ├── templates/
│   └── scripts/
├── public/                           # Static assets
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/                          # App entry and providers
│   │   ├── App.tsx
│   │   ├── router.tsx                # TanStack Router setup
│   │   └── providers.tsx             # Theme, Query, Auth providers
│   ├── features/                     # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── CallbackPage.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useOIDC.ts
│   │   │   ├── services/
│   │   │   │   └── authService.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── MetricCard.tsx
│   │   │   │   └── QuickActions.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardStats.ts
│   │   │   └── services/
│   │   │       └── dashboardService.ts
│   │   ├── students/
│   │   │   ├── components/
│   │   │   │   ├── StudentList.tsx
│   │   │   │   ├── StudentDetail.tsx
│   │   │   │   ├── StudentForm.tsx
│   │   │   │   └── StudentFormSteps/
│   │   │   │       ├── PersonalInfoStep.tsx
│   │   │   │       ├── AcademicInfoStep.tsx
│   │   │   │       └── ContactInfoStep.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useStudents.ts
│   │   │   │   ├── useStudentDetail.ts
│   │   │   │   └── useCreateStudent.ts
│   │   │   ├── services/
│   │   │   │   └── studentService.ts
│   │   │   └── types/
│   │   │       └── student.types.ts
│   │   ├── teachers/
│   │   │   └── [similar structure]
│   │   ├── classes/
│   │   │   └── [similar structure]
│   │   ├── attendance/
│   │   │   └── [similar structure]
│   │   ├── timetable/
│   │   │   └── [similar structure]
│   │   ├── fees/
│   │   │   └── [similar structure]
│   │   ├── parent-portal/
│   │   │   └── [similar structure]
│   │   └── reports/
│   │       └── [similar structure]
│   ├── components/                   # Shared components
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── common/
│   │   │   ├── DataTable.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── EmptyState.tsx
│   │   └── feedback/
│   │       ├── LoadingSkeleton.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── Toast.tsx
│   ├── hooks/                        # Shared hooks
│   │   ├── useApi.ts
│   │   ├── useTenant.ts
│   │   ├── useDebounce.ts
│   │   └── usePermissions.ts
│   ├── services/                     # API services
│   │   ├── api/
│   │   │   ├── apiClient.ts          # Axios instance with interceptors
│   │   │   └── endpoints.ts          # API endpoint constants
│   │   └── oidc/
│   │       └── oidcClient.ts         # OIDC integration
│   ├── store/                        # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── tenantStore.ts
│   │   └── uiStore.ts
│   ├── theme/                        # Material UI theme
│   │   ├── theme.ts                  # Theme definition
│   │   ├── components.ts             # Component overrides
│   │   └── typography.ts             # Typography settings
│   ├── types/                        # Global TypeScript types
│   │   ├── api.types.ts
│   │   ├── user.types.ts
│   │   ├── tenant.types.ts
│   │   └── index.ts
│   ├── utils/                        # Utility functions
│   │   ├── dateUtils.ts
│   │   ├── formatUtils.ts
│   │   ├── validationUtils.ts
│   │   └── securityUtils.ts          # Input sanitization
│   ├── config/                       # App configuration
│   │   ├── constants.ts
│   │   ├── environment.ts            # Environment variables
│   │   └── oidc.config.ts            # OIDC configuration
│   ├── main.tsx                      # Entry point
│   └── vite-env.d.ts
├── .env.example                      # Example environment variables
├── .env.local                        # Local environment (gitignored)
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite configuration
├── package.json
└── README.md
```

---

## Environment Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1

# OIDC Configuration
VITE_OIDC_AUTHORITY=http://localhost:8080
VITE_OIDC_CLIENT_ID=school-erp
VITE_OIDC_CLIENT_SECRET=school-erp-secret-dev
VITE_OIDC_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/
VITE_OIDC_SCOPES=openid email profile tenant school.read school.write

# App Configuration
VITE_APP_NAME=School ERP
VITE_APP_VERSION=1.0.0
VITE_LOG_LEVEL=debug

# Feature Flags (optional)
VITE_FEATURE_ONLINE_PAYMENT=false
VITE_FEATURE_SMS_NOTIFICATIONS=false
```

### Staging Environment

```bash
VITE_API_BASE_URL=https://api.staging.school.com/api/v1
VITE_OIDC_AUTHORITY=https://auth.staging.school.com
VITE_OIDC_REDIRECT_URI=https://staging.school.com/auth/callback
# ... other staging-specific values
```

### Production Environment

```bash
VITE_API_BASE_URL=https://api.school.com/api/v1
VITE_OIDC_AUTHORITY=https://auth.school.com
VITE_OIDC_REDIRECT_URI=https://school.com/auth/callback
VITE_LOG_LEVEL=error
# ... other production values
```

---

## Acceptance Checklist

Before considering the baseline implementation complete, verify:

### Authentication & Multi-Tenancy
- [ ] User can log in via OIDC and land on dashboard
- [ ] Access token and refresh token are stored securely
- [ ] Token refresh happens automatically without user interaction
- [ ] Logout clears local tokens and calls OIDC `/session/end`
- [ ] Tenant subdomain is detected from URL correctly
- [ ] All API calls include `x-tenant-subdomain` header
- [ ] User from tenant A cannot access tenant B's data

### User Interface
- [ ] Application uses Material UI components exclusively
- [ ] Theme switcher (light/dark) works and persists preference
- [ ] Navigation sidebar renders with correct menu items based on role
- [ ] Breadcrumbs display correct path for nested pages
- [ ] Loading skeletons show during data fetching
- [ ] Error messages display user-friendly text with retry option
- [ ] Success toasts show and auto-dismiss after 5 seconds
- [ ] Mobile responsive design works on screens >= 375px

### Student Management
- [ ] Student list loads with pagination
- [ ] Search by name/ID returns results in < 500ms
- [ ] Filters (grade, section, status) work correctly
- [ ] Create student form validates required fields
- [ ] Student detail page loads with all tabs
- [ ] Edit student pre-fills form with existing data
- [ ] Soft delete (deactivate) requires confirmation

### Teacher Management
- [ ] Teacher list loads with assigned subjects and classes
- [ ] Create teacher form validates required fields
- [ ] Teacher schedule displays weekly timetable
- [ ] Assigning teacher to class checks for conflicts

### Class & Section Management
- [ ] Academic year can be created with terms
- [ ] Classes and sections can be created with capacity
- [ ] Students can be assigned to sections
- [ ] Capacity limits are enforced

### Attendance
- [ ] Teacher can select class-section and date
- [ ] Student list loads with quick-mark buttons
- [ ] Attendance can be submitted and locks form
- [ ] Attendance reports show statistics and charts
- [ ] Past attendance can be edited with reason

### Performance
- [ ] Dashboard loads in < 2 seconds
- [ ] Route transitions are smooth (< 300ms)
- [ ] Lighthouse Performance score >= 90 (desktop)
- [ ] Lighthouse Accessibility score >= 95
- [ ] Initial bundle size <= 500KB gzipped

### Code Quality
- [ ] ESLint passes with zero errors
- [ ] TypeScript compiles with strict mode, no `any` types
- [ ] All imports use absolute paths (@/components, @/hooks)
- [ ] Complex functions have JSDoc comments
- [ ] Code follows feature-based folder structure

---

## Risks & Mitigations

### Risk 1: OIDC Integration Complexity
**Impact**: High  
**Probability**: Medium  
**Mitigation**: 
- Use well-tested OIDC library (oidc-client-ts or similar)
- Create comprehensive OIDC service abstraction
- Test extensively with central-oidc-service in local environment
- Document OIDC flow with sequence diagrams

### Risk 2: Multi-Tenant Data Leakage
**Impact**: Critical  
**Probability**: Low  
**Mitigation**:
- Implement strict tenant context validation on every API call
- Add automated tests for cross-tenant access attempts
- Code review checklist includes tenant isolation verification
- Backend already has row-level isolation, frontend enforces via headers

### Risk 3: Performance Degradation with Large Datasets
**Impact**: Medium  
**Probability**: Medium  
**Mitigation**:
- Implement virtual scrolling from the start for all lists
- Use React Query caching aggressively
- Implement pagination with configurable page sizes
- Monitor bundle size and split code appropriately
- Use Lighthouse CI to catch performance regressions

### Risk 4: Mobile Responsiveness Challenges
**Impact**: Medium  
**Probability**: Medium  
**Mitigation**:
- Design mobile-first from the beginning
- Use Material UI's responsive breakpoints consistently
- Test on real devices early and often
- Consider progressive web app (PWA) features for mobile

### Risk 5: Backend API Changes
**Impact**: Medium  
**Probability**: High  
**Mitigation**:
- Create API client service layer that abstracts backend calls
- Use TypeScript interfaces for API contracts
- Maintain version compatibility or negotiate API versioning with backend team
- Document any backend changes needed in this specification

---

## Dependencies on Backend Enhancements

The following features require backend API enhancements:

### Phase 1 (Blocking for MVP)
- **None** - Current backend APIs support all MVP features

### Phase 2 (Needed for Full Feature Set)
1. **Branch Support**: Backend needs to implement hierarchical tenant model (school → branches)
2. **Bulk Import API**: Endpoint to handle CSV upload with validation for students, teachers
3. **Export APIs**: Server-side PDF/CSV generation for reports
4. **Dashboard Statistics API**: Aggregated metrics for dashboard widgets
5. **Announcement API**: CRUD for school-wide announcements

### Phase 3 (Nice to Have)
6. **Online Payment Webhook**: Integration with payment gateway to update fee status
7. **Real-time Notifications**: WebSocket or SSE for live updates
8. **Advanced Analytics API**: Trend analysis, predictive insights
9. **Document Storage**: Integration with S3/cloud storage for file uploads

**Communication Plan**: Frontend team will create detailed API requirement docs and share with backend team for each enhancement. Backend changes will be tracked in a shared document.

---

## Compliance & Governance

This baseline specification complies with:

### Constitution Compliance
- ✅ Material UI First (Principle 1)
- ✅ TypeScript Strict Mode (Principle 2)
- ✅ Feature-Based Architecture (Principle 3)
- ✅ React Query for Data Fetching (Principle 4)
- ✅ Security First (Principle 5)
- ✅ Performance Optimization (Principle 6)
- ✅ Accessibility (Principle 7)
- ✅ Environment Configuration (Principle 8)
- ✅ Component Composition (Principle 9)
- ✅ Error Handling & User Feedback (Principle 10)
- ✅ Code Quality Standards (Principle 11)
- ✅ Testing & Documentation (Principle 12)

### Amendment Procedure
Any changes to this baseline specification must:
1. Be proposed with clear rationale
2. Be reviewed by technical lead
3. Be assessed for impact on constitution compliance
4. Be documented with version bump in this file
5. Trigger updates to downstream feature specifications

### Review Schedule
- **Weekly**: Review progress against roadmap during sprints
- **Monthly**: Review success criteria achievement
- **Quarterly**: Review and update specification based on learnings

---

**Baseline Status**: Active  
**Version**: 1.0.0  
**Next Review Date**: 2025-02-08  
**Maintained By**: Frontend Technical Lead  
**Approved By**: [Pending]

---

*This baseline specification serves as the foundational contract for the School ERP Frontend. All feature development must align with and reference this baseline. Any deviations require documented justification and approval.*

