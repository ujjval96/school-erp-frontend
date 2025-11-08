# Implementation Plan: School ERP Frontend Baseline

**Branch**: `baseline-foundation` | **Date**: 2024-11-08 | **Spec**: [baseline-spec.md](../../.specify/memory/baseline-spec.md)  
**Input**: Baseline specification for multi-tenant School ERP frontend platform

## Summary

Build a production-ready React frontend application for a multi-tenant School ERP system that integrates with existing central-oidc-service (authentication) and erp-backend (business logic APIs). The application will support multiple school tenants via subdomain routing, implement comprehensive student/teacher/class/attendance management features, and provide role-based access for administrators, teachers, parents, and students.

**Technical Approach**: 
- React 19.1.1 + TypeScript (strict mode) with Vite as build tool
- Material UI v7.3.4 for component library (no Tailwind)
- TanStack Router for routing + TanStack Query for server state
- OpenID Connect integration with existing central-oidc-service
- Axios-based API client with automatic auth/tenant header injection
- Feature-based architecture with lazy-loaded modules
- Multi-tenant isolation via subdomain detection and tenant headers

---

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode), React 19.1.1  
**Primary Dependencies**: 
- Material UI v7.3.4 (`@mui/material`, `@mui/icons-material`)
- TanStack Router v1.x (client-side routing)
- TanStack Query v5.x (server state management)
- Axios 1.6+ (HTTP client)
- Zustand 4.x (client state management)
- Vite 5.x (build tool)
- oidc-client-ts 3.x (OIDC integration)

**Storage**: 
- Browser localStorage (tenant context, theme preference, cached data)
- httpOnly cookies or encrypted localStorage (auth tokens - TBD based on OIDC setup)
- React Query cache (in-memory with configurable stale times)

**Testing**: 
- Vitest (unit tests for utilities, hooks)
- React Testing Library (component tests)
- Playwright (E2E tests - Phase 2)
- MSW (Mock Service Worker for API mocking)

**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+), responsive design for desktop/tablet/mobile

**Project Type**: Web application (frontend SPA)

**Performance Goals**: 
- Lighthouse Performance >= 90 (desktop), >= 80 (mobile)
- Initial load (FCP) <= 1.5s on broadband
- Route transitions <= 300ms (excluding API calls)
- API responses with React Query caching <= 100ms (cached), <= 1s (network)
- Support 500 concurrent users per tenant without client-side degradation

**Constraints**: 
- MUST use Material UI exclusively (no Tailwind, no custom CSS frameworks)
- MUST integrate with existing OIDC service (DO NOT MODIFY)
- MUST integrate with existing erp-backend APIs (minimal changes allowed)
- MUST support subdomain-based multi-tenancy (e.g., school1.localhost:5173)
- MUST maintain strict TypeScript with no `any` types (except documented)
- Initial bundle size <= 500KB gzipped
- All features must be keyboard accessible (WCAG AA)

**Scale/Scope**: 
- 10,000+ schools (tenants) with 200-5000 students per school
- 11 major feature modules (Auth, Dashboard, Students, Teachers, Classes, Attendance, Timetable, Fees, Parent Portal, Reports, Settings)
- ~50-60 routes (lazy-loaded)
- ~150-200 components (shared + feature-specific)
- Support for 500 concurrent users per tenant
- 6-phase development over 12 weeks

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle Compliance

✅ **Principle 1: Material UI First**
- All UI components will use Material UI v7.3.4
- Theme customization via Material UI theme system
- No Tailwind, no custom CSS frameworks
- **Status**: COMPLIANT

✅ **Principle 2: TypeScript Strict Mode**
- TypeScript 5.3+ with strict mode enabled
- No `any` types without justification
- All interfaces defined in type files
- **Status**: COMPLIANT

✅ **Principle 3: Feature-Based Architecture**
- Code organized in `/src/features/[feature-name]/`
- Each feature has components/, hooks/, services/, types/
- Shared components in `/src/components/`
- **Status**: COMPLIANT

✅ **Principle 4: React Query for Data Fetching**
- TanStack Query v5.x for all server state
- No direct API calls from components
- Hooks pattern: `useStudents()`, `useCreateStudent()`
- **Status**: COMPLIANT

✅ **Principle 5: Security First**
- Input sanitization via utility functions
- XSS protection with proper escaping
- OIDC authentication for all routes
- Tenant validation on every API call
- **Status**: COMPLIANT

✅ **Principle 6: Performance Optimization**
- Lazy loading with React.lazy() for all routes
- Code splitting for vendor bundles
- Virtual scrolling for large lists (react-window)
- Debounced search inputs (300ms)
- **Status**: COMPLIANT

✅ **Principle 7: Accessibility (a11y)**
- WCAG 2.1 Level AA compliance
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management in modals
- **Status**: COMPLIANT

✅ **Principle 8: Environment Configuration**
- Environment variables with VITE_ prefix
- Separate configs for dev/staging/production
- API URLs and OIDC config via environment
- **Status**: COMPLIANT

✅ **Principle 9: Component Composition**
- Small, focused components (<300 lines)
- Composition over prop drilling
- Reusable component patterns
- **Status**: COMPLIANT

✅ **Principle 10: Error Handling & User Feedback**
- Error boundaries at route level
- Loading skeletons for async operations
- Toast notifications for feedback
- User-friendly error messages
- **Status**: COMPLIANT

✅ **Principle 11: Code Quality Standards**
- ESLint with strict rules
- Prettier for formatting
- Absolute imports (@/components, @/hooks)
- JSDoc comments for complex logic
- **Status**: COMPLIANT

✅ **Principle 12: Testing & Documentation**
- Unit tests for critical logic
- Component tests for reusable components
- JSDoc comments for public APIs
- Feature READMEs
- **Status**: COMPLIANT

### Gate Status: ✅ PASS

All constitutional principles are satisfied by the planned architecture. No violations or exceptions required.

---

## Project Structure

### Documentation (this feature)

```text
specs/000-baseline/
├── plan.md                    # This file
├── research.md                # Phase 0: Technology decisions and patterns
├── data-model.md              # Phase 1: Entity models and relationships
├── contracts/                 # Phase 1: API contracts
│   ├── auth-api.yaml          # Authentication endpoints
│   ├── student-api.yaml       # Student management endpoints
│   ├── teacher-api.yaml       # Teacher management endpoints
│   ├── class-api.yaml         # Class/Section management endpoints
│   ├── attendance-api.yaml    # Attendance endpoints
│   ├── fee-api.yaml           # Fee management endpoints
│   └── README.md              # API contract documentation
├── quickstart.md              # Phase 1: Getting started guide
└── tasks.md                   # Phase 2: Implementation tasks (from /speckit.tasks)
```

### Source Code (repository root)

```text
school-erp-frontend/
├── public/                           # Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   └── robots.txt
├── src/
│   ├── app/                          # App initialization
│   │   ├── App.tsx                   # Root component
│   │   ├── router.tsx                # TanStack Router configuration
│   │   └── providers.tsx             # Context providers (Theme, Query, Auth)
│   ├── features/                     # Feature modules
│   │   ├── auth/                     # Authentication feature
│   │   │   ├── components/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── CallbackPage.tsx
│   │   │   │   └── LogoutPage.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts        # Auth state hook
│   │   │   │   ├── useOIDC.ts        # OIDC integration hook
│   │   │   │   └── useTokenRefresh.ts
│   │   │   ├── services/
│   │   │   │   ├── authService.ts    # Auth business logic
│   │   │   │   └── oidcClient.ts     # OIDC client wrapper
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts
│   │   │   └── utils/
│   │   │       └── tokenStorage.ts   # Token storage utility
│   │   ├── dashboard/                # Dashboard feature
│   │   │   ├── components/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── MetricCard.tsx
│   │   │   │   ├── AttendanceChart.tsx
│   │   │   │   └── QuickActions.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardStats.ts
│   │   │   └── services/
│   │   │       └── dashboardService.ts
│   │   ├── students/                 # Student management
│   │   │   ├── components/
│   │   │   │   ├── StudentList.tsx
│   │   │   │   ├── StudentTable.tsx
│   │   │   │   ├── StudentDetail.tsx
│   │   │   │   ├── StudentForm/
│   │   │   │   │   ├── StudentFormWizard.tsx
│   │   │   │   │   ├── PersonalInfoStep.tsx
│   │   │   │   │   ├── AcademicInfoStep.tsx
│   │   │   │   │   ├── ContactInfoStep.tsx
│   │   │   │   │   └── DocumentsStep.tsx
│   │   │   │   ├── StudentFilters.tsx
│   │   │   │   └── StudentSearch.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useStudents.ts    # List with pagination
│   │   │   │   ├── useStudent.ts     # Single student
│   │   │   │   ├── useCreateStudent.ts
│   │   │   │   ├── useUpdateStudent.ts
│   │   │   │   └── useDeleteStudent.ts
│   │   │   ├── services/
│   │   │   │   └── studentService.ts
│   │   │   └── types/
│   │   │       └── student.types.ts
│   │   ├── teachers/                 # Teacher management
│   │   │   └── [similar structure to students]
│   │   ├── classes/                  # Class & Section management
│   │   │   └── [similar structure]
│   │   ├── attendance/               # Attendance tracking
│   │   │   ├── components/
│   │   │   │   ├── AttendancePage.tsx
│   │   │   │   ├── AttendanceForm.tsx
│   │   │   │   ├── AttendanceCalendar.tsx
│   │   │   │   └── AttendanceReport.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAttendance.ts
│   │   │   │   └── useMarkAttendance.ts
│   │   │   └── services/
│   │   │       └── attendanceService.ts
│   │   ├── timetable/                # Timetable management
│   │   │   └── [similar structure]
│   │   ├── fees/                     # Fee management
│   │   │   └── [similar structure]
│   │   ├── parent-portal/            # Parent portal
│   │   │   └── [similar structure]
│   │   └── reports/                  # Reports & Analytics
│   │       └── [similar structure]
│   ├── components/                   # Shared components
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx   # Main app layout
│   │   │   ├── AuthLayout.tsx        # Auth pages layout
│   │   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   │   ├── Header.tsx            # App header
│   │   │   ├── Breadcrumbs.tsx       # Navigation breadcrumbs
│   │   │   └── Footer.tsx            # App footer
│   │   ├── common/
│   │   │   ├── DataTable.tsx         # Reusable data table
│   │   │   ├── SearchInput.tsx       # Debounced search
│   │   │   ├── FilterPanel.tsx       # Filter UI
│   │   │   ├── ConfirmDialog.tsx     # Confirmation dialogs
│   │   │   ├── EmptyState.tsx        # Empty state UI
│   │   │   └── PageHeader.tsx        # Page title header
│   │   └── feedback/
│   │       ├── LoadingSkeleton.tsx   # Loading states
│   │       ├── ErrorBoundary.tsx     # Error boundaries
│   │       ├── Toast.tsx             # Toast notifications
│   │       └── ErrorMessage.tsx      # Error display
│   ├── hooks/                        # Shared hooks
│   │   ├── useApi.ts                 # API request hook
│   │   ├── useTenant.ts              # Tenant context hook
│   │   ├── useDebounce.ts            # Debounce hook
│   │   ├── usePermissions.ts         # Permission check hook
│   │   ├── useLocalStorage.ts        # LocalStorage hook
│   │   └── useMediaQuery.ts          # Responsive hook
│   ├── services/                     # API services
│   │   ├── api/
│   │   │   ├── apiClient.ts          # Axios instance
│   │   │   ├── interceptors.ts       # Request/Response interceptors
│   │   │   └── endpoints.ts          # API endpoint constants
│   │   └── oidc/
│   │       └── oidcConfig.ts         # OIDC configuration
│   ├── store/                        # State management (Zustand)
│   │   ├── authStore.ts              # Auth state
│   │   ├── tenantStore.ts            # Tenant context
│   │   └── uiStore.ts                # UI state (drawer, theme)
│   ├── theme/                        # Material UI theme
│   │   ├── theme.ts                  # Theme definition
│   │   ├── lightTheme.ts             # Light mode theme
│   │   ├── darkTheme.ts              # Dark mode theme
│   │   ├── components.ts             # Component style overrides
│   │   └── typography.ts             # Typography settings
│   ├── types/                        # Global TypeScript types
│   │   ├── api.types.ts              # API response types
│   │   ├── user.types.ts             # User entity types
│   │   ├── tenant.types.ts           # Tenant types
│   │   ├── common.types.ts           # Common types
│   │   └── index.ts                  # Type exports
│   ├── utils/                        # Utility functions
│   │   ├── dateUtils.ts              # Date formatting
│   │   ├── formatUtils.ts            # Number/string formatting
│   │   ├── validationUtils.ts        # Validation helpers
│   │   ├── securityUtils.ts          # XSS prevention
│   │   └── testUtils.ts              # Testing utilities
│   ├── config/                       # App configuration
│   │   ├── constants.ts              # App constants
│   │   ├── environment.ts            # Environment variables
│   │   └── routes.ts                 # Route definitions
│   ├── main.tsx                      # Entry point
│   └── vite-env.d.ts                 # Vite type definitions
├── tests/                            # Test files
│   ├── unit/                         # Unit tests
│   ├── integration/                  # Integration tests
│   ├── e2e/                          # E2E tests (Playwright)
│   └── mocks/                        # MSW mock handlers
├── .env.example                      # Example environment file
├── .env.local                        # Local environment (gitignored)
├── .eslintrc.json                    # ESLint config
├── .prettierrc                       # Prettier config
├── tsconfig.json                     # TypeScript config
├── vite.config.ts                    # Vite config
├── vitest.config.ts                  # Vitest config
├── playwright.config.ts              # Playwright config
├── package.json                      # Dependencies
└── README.md                         # Project documentation
```

**Structure Decision**: Using **Web Application** structure (frontend SPA). The feature-based architecture aligns with Constitution Principle 3, organizing code by domain features rather than technical layers. Each feature is self-contained, making it easier to develop, test, and maintain. Shared components, hooks, and utilities are organized separately to promote reuse across features.

---

## Complexity Tracking

> **No violations detected.** This section is intentionally left empty as all constitutional principles are satisfied without exceptions.

---

## Implementation Phases

### Phase 0: Research & Technology Validation (Week 1)

**Objective**: Validate technology choices, resolve unknowns, and establish patterns

**Research Tasks**:

1. **OIDC Integration Pattern**
   - Research oidc-client-ts integration with React
   - Validate token storage strategy (httpOnly cookies vs encrypted localStorage)
   - Test OIDC flow with central-oidc-service in local environment
   - Document PKCE implementation for security

2. **TanStack Router + Query Integration**
   - Research route-based data loading patterns
   - Validate loader functions with React Query
   - Test authentication guards and redirects
   - Document best practices for prefetching

3. **Multi-Tenant Subdomain Handling**
   - Research subdomain detection in browser (window.location.hostname)
   - Validate Vite dev server configuration for wildcard subdomains
   - Test tenant context propagation through app
   - Document deployment requirements for wildcard DNS

4. **Material UI Theme Customization**
   - Research tenant-specific theme overrides (dynamic colors)
   - Validate theme switching (light/dark) with TypeScript
   - Test component style overrides
   - Document theming best practices

5. **Performance Optimization Patterns**
   - Research react-window for virtual scrolling
   - Validate lazy loading with Suspense boundaries
   - Test code splitting strategies
   - Document bundle optimization techniques

**Deliverable**: `research.md` with decisions, rationale, and implementation examples

---

### Phase 1: Design & Contracts (Week 1-2)

**Objective**: Define data models, API contracts, and component interfaces

**Tasks**:

1. **Data Model Definition**
   - Extract entities from backend Prisma schema
   - Define frontend TypeScript interfaces for all entities
   - Document entity relationships and cardinality
   - Create validation schemas (Yup/Zod)

2. **API Contract Documentation**
   - Document existing erp-backend API endpoints (from Swagger)
   - Create OpenAPI specs for each module (students, teachers, etc.)
   - Define request/response types in TypeScript
   - Document error response formats

3. **Component Interface Design**
   - Define props interfaces for major components
   - Document component composition patterns
   - Create component hierarchy diagrams
   - Define shared component APIs

4. **Routing Structure**
   - Define all application routes
   - Document route guards and permissions
   - Define route parameters and query strings
   - Create route hierarchy diagram

5. **State Management Design**
   - Define Zustand store structure
   - Document React Query cache keys and invalidation
   - Define state update patterns
   - Create state flow diagrams

**Deliverables**: 
- `data-model.md`
- `contracts/*.yaml`
- `quickstart.md`
- Updated agent context

---

### Phase 2: Foundation & Authentication (Week 2-3)

**Objective**: Set up project, implement OIDC authentication, and create app shell

**Implementation Tasks**:

1. **Project Setup**
   - Initialize Vite project with React + TypeScript template
   - Configure ESLint, Prettier, TypeScript (strict mode)
   - Install core dependencies (MUI, TanStack, Axios, Zustand)
   - Set up folder structure per constitution

2. **Material UI Configuration**
   - Create custom theme with light/dark modes
   - Configure theme provider
   - Set up component style overrides
   - Test theme switching

3. **OIDC Authentication**
   - Implement OIDC client wrapper (oidc-client-ts)
   - Create auth service with login/logout/refresh logic
   - Implement token storage (secure)
   - Create auth hooks (useAuth, useOIDC)
   - Implement callback handler

4. **Multi-Tenant Context**
   - Implement subdomain detection
   - Create tenant store (Zustand)
   - Implement tenant context provider
   - Test tenant isolation

5. **Routing & Guards**
   - Configure TanStack Router
   - Implement route guards for authentication
   - Implement role-based route access
   - Create layout components (DashboardLayout, AuthLayout)
   - Test protected routes

6. **API Client Setup**
   - Configure Axios instance
   - Implement request interceptor (auth + tenant headers)
   - Implement response interceptor (error handling, token refresh)
   - Create API service base class
   - Test API integration with backend

7. **Navigation Shell**
   - Create Sidebar component with menu items
   - Create Header component with user menu
   - Implement breadcrumbs
   - Test navigation and routing

**Success Criteria**:
- User can log in via OIDC successfully
- Tokens are stored and refreshed automatically
- Tenant context is detected and used in API calls
- Navigation renders based on user role
- Protected routes redirect to login

---

### Phase 3: Core Features - Students & Teachers (Week 4-6)

**Objective**: Implement student and teacher management modules

**Implementation Tasks**:

1. **Dashboard Implementation**
   - Create dashboard page with metric cards
   - Implement dashboard stats API integration
   - Create quick action widgets
   - Add attendance chart visualization
   - Test dashboard loading and performance

2. **Student List View**
   - Create DataTable component (reusable)
   - Implement student list with pagination
   - Add search functionality (debounced)
   - Add filter panel (grade, section, status)
   - Implement sorting
   - Add loading skeletons
   - Test with 1000+ records

3. **Student Detail View**
   - Create detail page with tabs
   - Implement Overview tab (personal info card)
   - Implement Attendance tab (placeholder)
   - Implement Academic Records tab (placeholder)
   - Implement Fee Records tab (placeholder)
   - Implement Documents tab (placeholder)
   - Add edit button

4. **Student Create/Edit Form**
   - Create multi-step wizard component
   - Implement Personal Info step with validation
   - Implement Academic Info step
   - Implement Contact Info step
   - Implement Documents step (file upload)
   - Add form state management
   - Implement optimistic updates
   - Test form validation and submission

5. **Teacher Module**
   - Replicate student structure for teachers
   - Create teacher list with filters
   - Create teacher detail page
   - Create teacher form
   - Implement teacher-class assignments UI
   - Test CRUD operations

6. **React Query Integration**
   - Create query hooks for students (useStudents, useStudent)
   - Create mutation hooks (useCreateStudent, useUpdateStudent, useDeleteStudent)
   - Configure cache invalidation
   - Implement optimistic updates
   - Test caching behavior

**Success Criteria**:
- Administrators can create, view, edit, delete students
- Search returns results in <500ms
- List handles 1000+ records with virtual scrolling
- Forms validate and show inline errors
- Optimistic updates work correctly
- Teacher module mirrors student functionality

---

### Phase 4: Academic Structure & Attendance (Week 7-8)

**Objective**: Implement class/section management and attendance tracking

**Implementation Tasks**:

1. **Academic Year Management**
   - Create academic year list view
   - Create academic year form
   - Implement term/semester configuration
   - Test academic year CRUD

2. **Class & Section Management**
   - Create class hierarchy view (tree or cards)
   - Implement class creation form
   - Implement section management within class
   - Add capacity tracking
   - Implement student-section assignment UI
   - Implement teacher-subject-class assignment
   - Test assignment workflows

3. **Attendance Marking UI**
   - Create attendance page for teachers
   - Implement class-section selector
   - Implement date picker (default today)
   - Create student list with quick-mark buttons
   - Implement color coding for statuses
   - Add "Submit" button with confirmation
   - Test attendance marking flow

4. **Attendance Calendar View**
   - Create monthly calendar component
   - Implement date cell color coding
   - Add tooltips for attendance details
   - Test calendar rendering

5. **Attendance Reports**
   - Create attendance report page
   - Implement date range selector
   - Implement class/section filter
   - Create statistics cards (percentage, trends)
   - Implement attendance chart (line chart)
   - Create low-attendance students list
   - Add export functionality (CSV/PDF)
   - Test report generation

6. **Attendance Correction**
   - Implement past attendance editing
   - Add reason field for corrections
   - Log corrections in audit trail
   - Test correction workflow

**Success Criteria**:
- Teachers can mark attendance in <2 minutes for 40 students
- Attendance submits successfully and locks form
- Reports generate in <1 second for 1 month data
- Export functionality works
- Corrections are logged and auditable

---

### Phase 5: Advanced Features - Timetable, Fees, Reports (Week 9-10)

**Objective**: Implement timetable management, fee tracking, and reporting

**Implementation Tasks**:

1. **Timetable Grid**
   - Create weekly timetable grid component
   - Implement cell editing (modal or inline)
   - Add subject and teacher selection
   - Implement conflict detection
   - Test timetable creation

2. **Teacher Schedule View**
   - Create teacher personal schedule page
   - Aggregate schedule from all class assignments
   - Add day/week toggle view
   - Test schedule aggregation

3. **Fee Structure Management**
   - Create fee structure form
   - Implement category management
   - Add grade-wise fee assignment
   - Test fee structure creation

4. **Student Fee Management**
   - Display student fee details
   - Show breakdown by category
   - Display payment history table
   - Show outstanding balance
   - Implement payment recording form
   - Test balance calculations

5. **Fee Reports**
   - Create fee reports dashboard
   - Implement collection statistics
   - Create payment mode breakdown (pie chart)
   - Create defaulters list
   - Add export functionality
   - Test report accuracy

6. **General Reports Dashboard**
   - Create reports landing page
   - Implement report categories
   - Add attendance analytics
   - Add student demographics
   - Create enrollment trends chart
   - Test report loading performance

**Success Criteria**:
- Timetables can be created with conflict detection
- Fee payments update balances correctly
- Reports load in <2 seconds
- Export functions work for all reports
- Charts render correctly with real data

---

### Phase 6: Parent Portal & Polish (Week 11-12)

**Objective**: Build parent-facing features and optimize for production

**Implementation Tasks**:

1. **Parent Portal Layout**
   - Create parent-specific layout
   - Implement child selector
   - Create parent dashboard
   - Test parent authentication

2. **Child Information Views**
   - Create child overview cards
   - Implement attendance view for parents (read-only calendar)
   - Implement academic records view
   - Implement fee status view
   - Test data visibility restrictions

3. **Communication Features**
   - Create announcements list view
   - Create events calendar view
   - Implement messaging UI (to teachers)
   - Test messaging workflow

4. **Performance Optimization**
   - Run Lighthouse audit
   - Optimize bundle size (code splitting review)
   - Implement virtual scrolling where needed
   - Optimize images
   - Test performance metrics

5. **Accessibility Audit**
   - Run aXe DevTools audit
   - Fix keyboard navigation issues
   - Add missing ARIA labels
   - Test with screen reader
   - Verify contrast ratios

6. **Security Hardening**
   - Review XSS prevention
   - Audit token storage
   - Test tenant isolation
   - Configure CSP headers
   - Test error handling

7. **Cross-Browser Testing**
   - Test on Chrome, Firefox, Safari, Edge
   - Fix browser-specific issues
   - Test on mobile devices
   - Verify responsive design

8. **Documentation**
   - Write comprehensive README
   - Document environment setup
   - Create deployment guide
   - Write API integration guide
   - Document troubleshooting

9. **Production Deployment**
   - Configure production build
   - Set up environment variables
   - Deploy to hosting (Vercel/Netlify)
   - Configure wildcard subdomain routing
   - Test production environment

**Success Criteria**:
- Parents can access all child information securely
- Lighthouse Performance >= 90, Accessibility >= 95
- Bundle size <= 500KB gzipped
- All browsers render correctly
- Production deployment successful
- Zero critical security issues

---

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)
- **Utils**: Date formatting, validation, security functions
- **Hooks**: useDebounce, useLocalStorage, custom hooks
- **Services**: API client, auth service (mocked)
- **Coverage Target**: >= 70% for utilities and hooks

### Component Tests (React Testing Library)
- **Shared Components**: DataTable, SearchInput, FilterPanel, ConfirmDialog
- **Forms**: Student form steps, validation logic
- **Layout**: Sidebar navigation, Header user menu
- **Coverage Target**: >= 60% for components

### Integration Tests (React Testing Library + MSW)
- **Feature Flows**: Login → Dashboard → Student List → Create Student → Detail View
- **API Integration**: Mock API responses with MSW, test React Query caching
- **Coverage Target**: All critical user flows

### E2E Tests (Playwright)
- **Authentication**: Login flow, token refresh, logout
- **Student Management**: Full CRUD workflow
- **Attendance**: Mark attendance end-to-end
- **Multi-Tenant**: Test with different subdomains
- **Coverage Target**: 10-15 critical paths

### Manual Testing
- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Responsive**: Desktop, tablet, mobile viewports
- **Accessibility**: Keyboard nav, screen reader
- **Performance**: Lighthouse audits

---

## Deployment Strategy

### Development Environment
- **URL**: `http://*.localhost:5173` (subdomain routing)
- **Backend**: `http://localhost:3000`
- **OIDC**: `http://localhost:8080`
- **Build**: `npm run dev`

### Staging Environment
- **URL**: `https://*.staging.school.com`
- **Backend**: `https://api.staging.school.com`
- **OIDC**: `https://auth.staging.school.com`
- **Deployment**: Vercel/Netlify with environment variables
- **DNS**: Wildcard CNAME record

### Production Environment
- **URL**: `https://*.school.com`
- **Backend**: `https://api.school.com`
- **OIDC**: `https://auth.school.com`
- **Deployment**: Vercel/Netlify with production config
- **CDN**: CloudFront or Vercel Edge Network
- **Monitoring**: Sentry for error tracking, Vercel Analytics

### CI/CD Pipeline
1. **Lint & Type Check**: ESLint, TypeScript
2. **Unit Tests**: Vitest
3. **Build**: Production build
4. **Bundle Analysis**: Check bundle size
5. **Lighthouse CI**: Performance audit
6. **Deploy**: Automatic on main branch

---

## Risk Mitigation

### High-Priority Risks

1. **OIDC Integration Complexity**
   - **Mitigation**: Use proven library (oidc-client-ts), test early with real OIDC service
   - **Fallback**: Detailed documentation from backend team, fallback to JWT-only if needed

2. **Multi-Tenant Data Leakage**
   - **Mitigation**: Automated tests for cross-tenant access, strict header validation
   - **Fallback**: Backend already has row-level isolation as safety net

3. **Performance with Large Datasets**
   - **Mitigation**: Virtual scrolling, pagination, React Query caching, early performance testing
   - **Fallback**: Server-side optimization if client-side insufficient

4. **Bundle Size Bloat**
   - **Mitigation**: Code splitting, tree shaking, bundle analysis in CI, lazy loading
   - **Fallback**: Progressive feature loading, defer non-critical features

### Medium-Priority Risks

5. **Material UI Learning Curve**
   - **Mitigation**: Team training, component library documentation, reusable patterns
   - **Fallback**: Extensive documentation and code examples

6. **Backend API Changes**
   - **Mitigation**: Service layer abstraction, TypeScript contracts, versioning discussion
   - **Fallback**: Adapter pattern for API compatibility

---

## Success Metrics

### Week 4 Checkpoint
- [ ] OIDC authentication working end-to-end
- [ ] Multi-tenant context functional
- [ ] Dashboard renders with navigation
- [ ] First API integration successful

### Week 8 Checkpoint
- [ ] Student and teacher modules complete
- [ ] Attendance marking functional
- [ ] Reports generating correctly
- [ ] Performance targets met (Lighthouse >= 80)

### Week 12 Completion
- [ ] All 11 feature modules complete
- [ ] Parent portal functional
- [ ] Lighthouse Performance >= 90, Accessibility >= 95
- [ ] Bundle size <= 500KB gzipped
- [ ] Zero critical security issues
- [ ] Production deployment successful
- [ ] All acceptance criteria met

---

## Next Steps

1. **Execute Phase 0**: Create `research.md` with technology decisions
2. **Execute Phase 1**: Create `data-model.md` and `contracts/`
3. **Generate Tasks**: Run `/speckit.tasks` to create implementation task breakdown
4. **Begin Implementation**: Start Phase 2 (Foundation & Authentication)

---

**Plan Status**: ✅ Complete  
**Last Updated**: 2024-11-08  
**Next Action**: Create research.md (Phase 0)

