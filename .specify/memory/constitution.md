<!--
Sync Impact Report
Version: 1.0.0 (Initial)
Date: 2024-12-19
Status: Created from project context

Changes:
- Initial constitution creation
- Principles derived from project architecture and documentation
- Material UI as primary UI library
- TypeScript-first development
- Feature-based architecture
- Security-first approach
- Performance optimizations

Templates requiring updates:
- ⚠ pending: plan-template.md (if exists)
- ⚠ pending: spec-template.md (if exists)
- ⚠ pending: tasks-template.md (if exists)
-->

# School ERP Project Constitution

**Version:** 1.0.0  
**Ratified:** 2024-12-19  
**Last Amended:** 2024-12-19

---

## Project Identity

**Project Name:** School ERP System  
**Type:** Multi-tenant SaaS School Management Platform  
**Primary Technology:** React 19.1.1 + TypeScript + Material UI v7.3.4

---

## Core Principles

### Principle 1: Material UI First

**MUST** use Material UI (MUI) components as the primary UI library. All new components MUST be built with Material UI components (`@mui/material`, `@mui/icons-material`). Custom styling MUST use Material UI's `sx` prop or theme system, not Tailwind classes or inline styles.

**Rationale:** Material UI provides a consistent, accessible, and well-tested component library that aligns with modern design standards. It ensures consistency across the application and reduces maintenance overhead.

**Exceptions:**
- Legacy components may exist temporarily but MUST be migrated
- Chart libraries (Recharts) may use custom styling for visual elements
- Global CSS for essential styles (fonts, scrollbar) is acceptable

---

### Principle 2: TypeScript Strict Mode

**MUST** use TypeScript for all source code. All components, functions, services, and utilities MUST have proper type definitions. TypeScript strict mode MUST be enabled.

**Rationale:** Type safety prevents runtime errors, improves developer experience, and makes code more maintainable. Strict mode catches potential bugs early.

**Enforcement:**
- No `any` types without explicit justification
- All interfaces MUST be defined in `/src/types/` or feature-specific type files
- Props interfaces MUST be exported for component documentation

---

### Principle 3: Feature-Based Architecture

**MUST** organize code by feature modules, not by file type. Each feature MUST be self-contained with its own components, hooks, services, and types.

**Structure:**
```
src/features/[feature-name]/
  ├── components/     # Feature-specific components
  ├── hooks/         # Feature-specific hooks
  ├── services/      # Feature-specific API services
  ├── pages/         # Feature pages
  └── types/         # Feature-specific types (optional, prefer /src/types/)
```

**Rationale:** Feature-based organization improves maintainability, makes code easier to find, and allows teams to work independently on features.

**Shared Components:**
- Common UI components go in `/src/components/`
- Layout components go in `/src/components/layout/`
- Domain-specific shared components go in `/src/components/[domain]/`

---

### Principle 4: React Query for Data Fetching

**MUST** use TanStack Query (React Query) for all API data fetching. Direct API calls from components are FORBIDDEN. All data fetching MUST go through React Query hooks.

**Rationale:** React Query provides caching, automatic refetching, loading states, and error handling out of the box, reducing boilerplate and improving user experience.

**Pattern:**
```typescript
// ✅ Correct
const { data, isLoading, error } = useStudents({ filters, pagination });

// ❌ Forbidden
const [students, setStudents] = useState([]);
useEffect(() => {
  fetch('/api/students').then(res => setStudents(res.data));
}, []);
```

---

### Principle 5: Security First

**MUST** implement security best practices:

1. **Input Sanitization:** All user inputs MUST be sanitized before processing or storage
2. **XSS Protection:** HTML content MUST be escaped or sanitized
3. **CSP Headers:** Content Security Policy MUST be configured
4. **Authentication:** All API calls MUST include authentication tokens
5. **Validation:** Both client-side and server-side validation REQUIRED
6. **Error Handling:** Sensitive error messages MUST NOT be exposed to users

**Rationale:** School ERP systems handle sensitive student and financial data. Security is non-negotiable.

**Implementation:**
- Use `/src/core/utils/security.ts` for sanitization
- Validate all form inputs with Yup schemas
- Use React Query error handling for API errors
- Implement error boundaries for component-level errors

---

### Principle 6: Performance Optimization

**MUST** implement performance best practices:

1. **Code Splitting:** All routes MUST be lazy-loaded with `React.lazy()`
2. **Memoization:** Expensive components MUST use `React.memo()`
3. **Bundle Optimization:** Vendor chunks MUST be separated
4. **Image Optimization:** Images MUST be optimized and lazy-loaded
5. **Debouncing:** Search and filter inputs MUST be debounced
6. **Virtual Scrolling:** Large lists MUST use virtual scrolling

**Rationale:** Performance directly impacts user experience, especially in educational environments with varying network conditions.

**Enforcement:**
- Bundle size MUST be monitored
- Lighthouse scores MUST meet minimum thresholds (90+ Performance)
- Large components MUST be split into smaller, focused components

---

### Principle 7: Accessibility (a11y)

**MUST** ensure accessibility compliance:

1. **ARIA Labels:** All interactive elements MUST have proper ARIA labels
2. **Keyboard Navigation:** All features MUST be keyboard accessible
3. **Color Contrast:** WCAG AA contrast ratios MUST be met
4. **Screen Reader Support:** Critical information MUST be announced
5. **Focus Management:** Focus MUST be managed in modals and dynamic content

**Rationale:** School systems serve diverse users including students, parents, and staff with varying accessibility needs.

**Implementation:**
- Material UI components provide built-in accessibility
- Custom components MUST follow WAI-ARIA guidelines
- Test with keyboard navigation and screen readers

---

### Principle 8: Environment Configuration

**MUST** use environment-based configuration. All environment-specific values (API URLs, feature flags) MUST be defined in environment variables, not hardcoded.

**Environments:**
- **Local:** `.env.local` - Development with mock data support
- **Staging:** `.env.staging` - Staging environment
- **Production:** `.env.production` - Production environment

**Rationale:** Environment-based configuration enables easy deployment across environments and prevents configuration errors.

**Implementation:**
- Use `/src/config/apiConfig.ts` for API configuration
- Environment variables MUST be prefixed with `VITE_`
- Sensitive values MUST NOT be committed to version control

---

### Principle 9: Component Composition

**MUST** prefer component composition over prop drilling or complex state management. Large components MUST be broken down into smaller, reusable components.

**Rationale:** Composable components are easier to test, maintain, and reuse. They reduce complexity and improve code readability.

**Pattern:**
```typescript
// ✅ Correct - Composed components
<StudentForm>
  <PersonalInfoSection />
  <AcademicSection />
  <ContactSection />
</StudentForm>

// ❌ Avoid - Monolithic component
<StudentForm /> // 1000+ lines of code
```

---

### Principle 10: Error Handling & User Feedback

**MUST** provide clear error handling and user feedback:

1. **Error Boundaries:** Top-level error boundaries MUST catch component errors
2. **Loading States:** All async operations MUST show loading indicators
3. **Error Messages:** User-friendly error messages MUST be displayed
4. **Success Feedback:** Successful operations MUST show confirmation messages
5. **Validation Feedback:** Form validation errors MUST be displayed inline

**Rationale:** Good error handling prevents user frustration and improves trust in the system.

**Implementation:**
- Use Material UI `Alert` components for error messages
- Use Material UI `CircularProgress` or `Skeleton` for loading states
- Use Toast notifications for success/error feedback
- Implement error boundaries at route level

---

### Principle 11: Code Quality Standards

**MUST** maintain code quality:

1. **ESLint:** Code MUST pass ESLint checks (no errors, warnings should be addressed)
2. **TypeScript:** Code MUST compile without errors
3. **Formatting:** Code MUST be formatted with Prettier (if configured)
4. **Naming:** Files and components MUST use PascalCase, functions and variables use camelCase
5. **Comments:** Complex logic MUST have JSDoc comments
6. **Imports:** Absolute imports MUST be used (`@/components/...` not `../../../components/...`)

**Rationale:** Consistent code quality makes the codebase maintainable and reduces onboarding time for new developers.

**Enforcement:**
- Pre-commit hooks SHOULD run linting and type checking
- CI/CD pipelines MUST fail on linting/type errors
- Code reviews MUST check for adherence to these standards

---

### Principle 12: Testing & Documentation

**SHOULD** include tests and documentation:

1. **Unit Tests:** Critical business logic SHOULD have unit tests
2. **Component Tests:** Reusable components SHOULD have component tests
3. **Documentation:** Public APIs and complex functions MUST have JSDoc comments
4. **README:** Each feature module SHOULD have a README explaining its purpose

**Rationale:** Tests prevent regressions and documentation helps maintain the codebase long-term.

**Note:** Testing infrastructure is not yet fully implemented but SHOULD be added as the project matures.

---

## Governance

### Amendment Procedure

1. **Proposal:** Any team member MAY propose an amendment to the constitution
2. **Review:** Proposed amendments MUST be reviewed by the technical lead or project maintainer
3. **Approval:** Amendments MUST be approved before implementation
4. **Documentation:** All amendments MUST be documented in this file with:
   - Version bump (following semantic versioning)
   - Amendment date
   - Rationale for change
   - Impact assessment

### Versioning Policy

- **MAJOR:** Backward incompatible governance/principle removals or redefinitions
- **MINOR:** New principle/section added or materially expanded guidance
- **PATCH:** Clarifications, wording, typo fixes, non-semantic refinements

### Compliance Review

- **Regular Reviews:** Constitution SHOULD be reviewed quarterly
- **Onboarding:** New team members MUST read and acknowledge the constitution
- **Enforcement:** Code reviews MUST verify adherence to principles

### Review Expectations

- All code MUST adhere to these principles
- Exceptions MUST be documented and justified
- Violations MUST be addressed in code reviews
- Principles MAY be amended based on project evolution

---

## Project-Specific Standards

### Material UI Theme

**Location:** `/src/shared-theme/theme.ts`

**MUST** use the centralized Material UI theme for all styling. Custom theme overrides MUST be defined in the theme file, not inline.

### API Configuration

**Location:** `/src/config/apiConfig.ts` and `/src/config/apiClient.ts`

**MUST** use the centralized API client for all API calls. Direct axios/fetch calls are FORBIDDEN.

### Type Definitions

**Location:** `/src/types/` (global) and feature-specific type files

**MUST** define all TypeScript interfaces in type definition files (`.d.ts`). Types SHOULD be exported and reused across features.

### Component Structure

**MUST** follow this component structure:

```typescript
/**
 * Component Description
 * Additional context if needed
 */

import React from 'react';
import { ... } from '@mui/material';
import { ... } from '@mui/icons-material';

interface ComponentProps {
  // Props with JSDoc if needed
}

export default function Component({ ... }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

---

## Exceptions & Legacy Code

### Legacy Components

Some components may still use:
- Tailwind CSS classes (MUST be migrated to Material UI)
- Old UI library components (`/components/ui/`, `/components/common/`) (MUST be migrated)
- Framer Motion animations (MAY be replaced with Material UI transitions)

**Migration Priority:**
1. High: Components actively used in production
2. Medium: Components used but not critical
3. Low: Unused components (MAY be deleted)

---

## Compliance Checklist

Before submitting code, verify:

- [ ] Uses Material UI components (not Tailwind/custom)
- [ ] TypeScript types defined and no `any` types
- [ ] Follows feature-based folder structure
- [ ] Uses React Query for data fetching
- [ ] Inputs are sanitized
- [ ] Error handling implemented
- [ ] Loading states shown
- [ ] Accessibility considerations met
- [ ] ESLint passes
- [ ] TypeScript compiles without errors
- [ ] Uses absolute imports
- [ ] JSDoc comments for complex logic

---

**Constitution Status:** Active  
**Next Review Date:** 2025-03-19  
**Maintainer:** Technical Lead
