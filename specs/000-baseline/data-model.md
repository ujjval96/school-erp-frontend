# Data Model

**Phase**: 1 - Design  
**Date**: 2024-11-08  
**Status**: Complete

This document defines the frontend data models (TypeScript interfaces) that map to backend entities and API responses.

---

## Table of Contents

1. [Core Entities](#core-entities)
2. [Authentication & User Management](#authentication--user-management)
3. [Academic Structure](#academic-structure)
4. [Student Management](#student-management)
5. [Teacher Management](#teacher-management)
6. [Attendance](#attendance)
7. [Fee Management](#fee-management)
8. [Timetable](#timetable)
9. [Common Types](#common-types)
10. [API Response Types](#api-response-types)

---

## Core Entities

### Tenant (School)

```typescript
// src/types/tenant.types.ts

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  type: 'SCHOOL' | 'BRANCH';
  parentId?: string | null;
  code?: string; // Branch code if type is BRANCH
  status: TenantStatus;
  branding: TenantBranding;
  settings: TenantSettings;
  createdAt: string;
  updatedAt: string;
}

export interface TenantBranding {
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  favicon?: string;
}

export interface TenantSettings {
  academicYearStart: string; // Month-Day format: "04-01"
  attendanceGracePeriod: number; // minutes
  lowAttendanceThreshold: number; // percentage
  timezone: string;
  dateFormat: string;
  currency: string;
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}
```

---

## Authentication & User Management

### User

```typescript
// src/types/user.types.ts

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string; // Computed: firstName + lastName
  roles: UserRole[];
  tenantId: string;
  profilePhoto?: string;
  phone?: string;
  status: UserStatus;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

// OIDC User (from oidc-client-ts)
export interface OIDCUser {
  access_token: string;
  refresh_token: string;
  id_token: string;
  profile: {
    sub: string;
    email: string;
    name: string;
    roles: string[];
    tenant_id: string;
  };
  expires_at: number;
  expired: boolean;
}
```

---

## Academic Structure

### Academic Year

```typescript
// src/types/academic.types.ts

export interface AcademicYear {
  id: string;
  name: string; // e.g., "2024-2025"
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: AcademicYearStatus;
  terms: Term[];
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export enum AcademicYearStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export interface Term {
  id: string;
  name: string; // "First Term", "Semester 1", etc.
  startDate: string;
  endDate: string;
  academicYearId: string;
}
```

### Class (Grade)

```typescript
export interface Class {
  id: string;
  name: string; // "Grade 1", "Class 10", etc.
  code: string; // "G1", "C10"
  academicYearId: string;
  tenantId: string;
  subjects: Subject[];
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}
```

### Section

```typescript
export interface Section {
  id: string;
  name: string; // "A", "B", "C"
  classId: string;
  class: Class; // Populated
  capacity: number;
  currentEnrollment: number;
  classTeacherId?: string;
  classTeacher?: Teacher;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Subject

```typescript
export interface Subject {
  id: string;
  name: string; // "Mathematics", "English"
  code: string; // "MATH", "ENG"
  description?: string;
  creditHours?: number;
  subjectType: SubjectType;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export enum SubjectType {
  CORE = 'CORE',
  ELECTIVE = 'ELECTIVE',
  EXTRA_CURRICULAR = 'EXTRA_CURRICULAR',
}
```

---

## Student Management

### Student

```typescript
// src/types/student.types.ts

export interface Student {
  id: string;
  admissionNumber: string; // Unique per tenant
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string; // Computed
  dateOfBirth: string; // ISO date
  gender: Gender;
  bloodGroup?: BloodGroup;
  photo?: string; // URL
  
  // Academic Info
  classId: string;
  class: Class; // Populated
  sectionId: string;
  section: Section; // Populated
  academicYearId: string;
  admissionDate: string;
  rollNumber?: string;
  
  // Contact Info
  address: Address;
  emergencyContact: EmergencyContact;
  
  // Medical Info
  medicalInfo?: MedicalInfo;
  
  // Parent Links
  parents: ParentLink[];
  
  // Status
  status: StudentStatus;
  
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
}

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
  TRANSFERRED = 'TRANSFERRED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
}

export interface MedicalInfo {
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
  doctorName?: string;
  doctorPhone?: string;
}

export interface ParentLink {
  parentId: string;
  parent: Parent; // Populated
  relationship: ParentRelationship;
  isPrimary: boolean;
}

export enum ParentRelationship {
  FATHER = 'FATHER',
  MOTHER = 'MOTHER',
  GUARDIAN = 'GUARDIAN',
  OTHER = 'OTHER',
}
```

### Parent

```typescript
export interface Parent {
  id: string;
  userId: string;
  user: User; // Populated
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  occupation?: string;
  workAddress?: string;
  tenantId: string;
  children: ParentLink[]; // Reverse relation
  createdAt: string;
  updatedAt: string;
}
```

---

## Teacher Management

### Teacher

```typescript
// src/types/teacher.types.ts

export interface Teacher {
  id: string;
  employeeId: string; // Unique per tenant
  userId: string;
  user: User; // Populated (for name, email, phone)
  
  // Personal Info
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  photo?: string;
  
  // Professional Info
  designation: TeacherDesignation;
  qualification: string; // "M.Ed", "B.Sc, B.Ed"
  specialization?: string;
  experience: number; // years
  
  // Employment Info
  employmentType: EmploymentType;
  joiningDate: string;
  salary?: number; // Optional, sensitive
  
  // Teaching Info
  subjects: Subject[]; // Subjects the teacher can teach
  classAssignments: TeacherClassAssignment[]; // Current class-subject assignments
  
  // Contact
  phone: string;
  alternatePhone?: string;
  email: string;
  address: Address;
  
  status: TeacherStatus;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export enum TeacherDesignation {
  PRINCIPAL = 'PRINCIPAL',
  VICE_PRINCIPAL = 'VICE_PRINCIPAL',
  HEAD_OF_DEPARTMENT = 'HEAD_OF_DEPARTMENT',
  SENIOR_TEACHER = 'SENIOR_TEACHER',
  TEACHER = 'TEACHER',
  ASSISTANT_TEACHER = 'ASSISTANT_TEACHER',
  TRAINEE = 'TRAINEE',
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  TEMPORARY = 'TEMPORARY',
}

export enum TeacherStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  RESIGNED = 'RESIGNED',
  TERMINATED = 'TERMINATED',
}

export interface TeacherClassAssignment {
  id: string;
  teacherId: string;
  classId: string;
  class: Class;
  sectionId: string;
  section: Section;
  subjectId: string;
  subject: Subject;
  academicYearId: string;
  isPrimary: boolean; // Is this their primary assignment?
  createdAt: string;
}
```

---

## Attendance

### Attendance Record

```typescript
// src/types/attendance.types.ts

export interface AttendanceRecord {
  id: string;
  date: string; // ISO date
  studentId: string;
  student: Student; // Populated
  classId: string;
  sectionId: string;
  status: AttendanceStatus;
  remarks?: string;
  markedById: string; // Teacher ID
  markedBy: Teacher; // Populated
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

// For bulk marking
export interface BulkAttendanceInput {
  date: string;
  classId: string;
  sectionId: string;
  records: StudentAttendanceInput[];
}

export interface StudentAttendanceInput {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

// For display/reporting
export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendancePercentage: number;
}

export interface AttendanceSummary {
  studentId: string;
  student: Student;
  stats: AttendanceStats;
  recentRecords: AttendanceRecord[]; // Last 7 days
}
```

---

## Fee Management

### Fee Structure

```typescript
// src/types/fee.types.ts

export interface FeeStructure {
  id: string;
  name: string; // "Grade 1 Annual Fees"
  description?: string;
  academicYearId: string;
  categories: FeeCategory[];
  applicableClasses: string[]; // Class IDs
  totalAmount: number; // Computed
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeeCategory {
  id: string;
  name: string; // "Tuition", "Transport", "Lab"
  amount: number;
  isMandatory: boolean;
  dueDate?: string; // ISO date
}
```

### Fee Record

```typescript
export interface FeeRecord {
  id: string;
  studentId: string;
  student: Student; // Populated
  feeStructureId: string;
  feeStructure: FeeStructure; // Populated
  academicYearId: string;
  
  // Amounts
  totalAmount: number;
  paidAmount: number;
  discountAmount: number;
  pendingAmount: number; // Computed: total - paid - discount
  
  // Due
  dueDate: string;
  isOverdue: boolean; // Computed
  
  // Payments
  payments: FeePayment[];
  
  status: FeeStatus;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export enum FeeStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  WAIVED = 'WAIVED',
}

export interface FeePayment {
  id: string;
  feeRecordId: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionReference?: string;
  paymentDate: string;
  remarks?: string;
  receivedById: string; // User ID
  receivedBy: User; // Populated
  tenantId: string;
  createdAt: string;
}

export enum PaymentMode {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  NET_BANKING = 'NET_BANKING',
  CHEQUE = 'CHEQUE',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

// For reporting
export interface FeeCollectionSummary {
  totalAmount: number;
  collectedAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  collectionPercentage: number;
  paymentsByMode: Record<PaymentMode, number>;
}
```

---

## Timetable

### Timetable Entry

```typescript
// src/types/timetable.types.ts

export interface TimetableEntry {
  id: string;
  classId: string;
  class: Class;
  sectionId: string;
  section: Section;
  subjectId: string;
  subject: Subject;
  teacherId: string;
  teacher: Teacher;
  academicYearId: string;
  
  // Schedule
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string; // "09:00"
  endTime: string; // "09:45"
  
  roomNumber?: string;
  
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

// For display
export interface WeeklyTimetable {
  classId: string;
  sectionId: string;
  entries: TimetableEntry[];
  grid: TimetableGrid; // Pre-formatted for UI
}

export type TimetableGrid = Record<DayOfWeek, TimetableEntry[]>;

// For teacher view
export interface TeacherSchedule {
  teacherId: string;
  entries: TimetableEntry[];
  workload: {
    periodsPerWeek: number;
    classesCount: number;
    subjectsCount: number;
  };
}
```

---

## Common Types

### Pagination

```typescript
// src/types/common.types.ts

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
```

### Filters

```typescript
export interface StudentFilters extends PaginationParams {
  search?: string;
  classId?: string;
  sectionId?: string;
  status?: StudentStatus;
  gender?: Gender;
  admissionYearFrom?: string;
  admissionYearTo?: string;
}

export interface TeacherFilters extends PaginationParams {
  search?: string;
  designation?: TeacherDesignation;
  subjectId?: string;
  status?: TeacherStatus;
}

export interface AttendanceFilters {
  studentId?: string;
  classId?: string;
  sectionId?: string;
  dateFrom: string;
  dateTo: string;
  status?: AttendanceStatus;
}
```

### Date Range

```typescript
export interface DateRange {
  from: string; // ISO date
  to: string; // ISO date
}
```

---

## API Response Types

### Standard API Response

```typescript
// src/types/api.types.ts

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string; // For validation errors
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

// Validation error
export interface ValidationError extends ApiError {
  field: string;
  constraints: Record<string, string>;
}
```

### Dashboard Stats

```typescript
export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  activeTeachers: number;
  totalClasses: number;
  todayAttendance: {
    present: number;
    absent: number;
    late: number;
    percentage: number;
  };
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  type: ActivityType;
  message: string;
  actorId: string;
  actor: User;
  timestamp: string;
}

export enum ActivityType {
  STUDENT_ADDED = 'STUDENT_ADDED',
  ATTENDANCE_MARKED = 'ATTENDANCE_MARKED',
  FEE_PAYMENT = 'FEE_PAYMENT',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
}
```

---

## Type Guards & Utilities

```typescript
// src/types/guards.ts

export function isStudent(entity: any): entity is Student {
  return entity && 'admissionNumber' in entity;
}

export function isTeacher(entity: any): entity is Teacher {
  return entity && 'employeeId' in entity;
}

export function isParent(entity: any): entity is Parent {
  return entity && 'children' in entity;
}

// Date utilities
export function isDateInPast(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

export function isOverdue(dueDate: string): boolean {
  return isDateInPast(dueDate);
}
```

---

## Validation Schemas (Yup)

```typescript
// src/utils/validationSchemas.ts
import * as yup from 'yup';

export const studentSchema = yup.object({
  firstName: yup.string().required('First name is required').min(2, 'Minimum 2 characters'),
  middleName: yup.string().optional(),
  lastName: yup.string().required('Last name is required').min(2, 'Minimum 2 characters'),
  dateOfBirth: yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('age', 'Student must be at least 3 years old', (value) => {
      if (!value) return false;
      const age = new Date().getFullYear() - value.getFullYear();
      return age >= 3;
    }),
  gender: yup.mixed<Gender>().oneOf(Object.values(Gender)).required('Gender is required'),
  bloodGroup: yup.mixed<BloodGroup>().oneOf(Object.values(BloodGroup)).optional(),
  admissionNumber: yup.string().required('Admission number is required'),
  classId: yup.string().required('Class is required'),
  sectionId: yup.string().required('Section is required'),
  admissionDate: yup.date().required('Admission date is required'),
  address: yup.object({
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    postalCode: yup.string().required('Postal code is required').matches(/^\d{6}$/, 'Invalid postal code'),
    country: yup.string().required('Country is required'),
  }).required(),
  emergencyContact: yup.object({
    name: yup.string().required('Emergency contact name is required'),
    relationship: yup.string().required('Relationship is required'),
    phone: yup.string().required('Phone is required').matches(/^[0-9]{10}$/, 'Must be 10 digits'),
  }).required(),
});

export const teacherSchema = yup.object({
  firstName: yup.string().required().min(2),
  lastName: yup.string().required().min(2),
  dateOfBirth: yup.date().required().max(new Date()),
  gender: yup.mixed<Gender>().oneOf(Object.values(Gender)).required(),
  employeeId: yup.string().required('Employee ID is required'),
  designation: yup.mixed<TeacherDesignation>().oneOf(Object.values(TeacherDesignation)).required(),
  qualification: yup.string().required('Qualification is required'),
  employmentType: yup.mixed<EmploymentType>().oneOf(Object.values(EmploymentType)).required(),
  joiningDate: yup.date().required('Joining date is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required().matches(/^[0-9]{10}$/, 'Must be 10 digits'),
});

export const attendanceSchema = yup.object({
  date: yup.date().required().max(new Date(), 'Cannot mark future attendance'),
  classId: yup.string().required('Class is required'),
  sectionId: yup.string().required('Section is required'),
  records: yup.array().of(
    yup.object({
      studentId: yup.string().required(),
      status: yup.mixed<AttendanceStatus>().oneOf(Object.values(AttendanceStatus)).required(),
      remarks: yup.string().optional(),
    })
  ).min(1, 'At least one student must be marked'),
});

export const feePaymentSchema = yup.object({
  feeRecordId: yup.string().required('Fee record is required'),
  amount: yup.number().required('Amount is required').positive('Amount must be positive'),
  paymentMode: yup.mixed<PaymentMode>().oneOf(Object.values(PaymentMode)).required('Payment mode is required'),
  transactionReference: yup.string().when('paymentMode', {
    is: (mode: PaymentMode) => [PaymentMode.CARD, PaymentMode.UPI, PaymentMode.NET_BANKING, PaymentMode.CHEQUE].includes(mode),
    then: (schema) => schema.required('Transaction reference is required'),
    otherwise: (schema) => schema.optional(),
  }),
  paymentDate: yup.date().required('Payment date is required').max(new Date(), 'Payment date cannot be in future'),
});
```

---

## Entity Relationships Diagram

```
Tenant (School)
  ├─ has many → User (staff, parents, students)
  ├─ has many → Student
  ├─ has many → Teacher
  ├─ has many → Class
  ├─ has many → AcademicYear
  └─ has many → FeeStructure

AcademicYear
  ├─ has many → Term
  ├─ has many → Class
  └─ belongs to → Tenant

Class (Grade)
  ├─ has many → Section
  ├─ has many → Subject
  ├─ belongs to → AcademicYear
  └─ belongs to → Tenant

Section
  ├─ has many → Student
  ├─ has one → Teacher (class teacher)
  └─ belongs to → Class

Student
  ├─ belongs to → Section
  ├─ belongs to → Class
  ├─ has many → ParentLink
  ├─ has many → AttendanceRecord
  ├─ has many → FeeRecord
  └─ belongs to → Tenant

Teacher
  ├─ belongs to → User
  ├─ has many → TeacherClassAssignment
  ├─ has many → TimetableEntry
  ├─ has many → Section (as class teacher)
  └─ belongs to → Tenant

Parent
  ├─ belongs to → User
  └─ has many → ParentLink (children)

AttendanceRecord
  ├─ belongs to → Student
  ├─ belongs to → Teacher (marked by)
  ├─ belongs to → Section
  └─ belongs to → Tenant

FeeRecord
  ├─ belongs to → Student
  ├─ belongs to → FeeStructure
  ├─ has many → FeePayment
  └─ belongs to → Tenant

TimetableEntry
  ├─ belongs to → Section
  ├─ belongs to → Subject
  ├─ belongs to → Teacher
  └─ belongs to → Tenant
```

---

## Next Steps

1. Create API contract specifications in `contracts/` directory
2. Generate TypeScript types from these definitions
3. Create service layer methods for each entity

**Status**: ✅ Data Model Complete  
**Updated**: 2024-11-08

