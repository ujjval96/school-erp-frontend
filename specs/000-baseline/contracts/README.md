# API Contracts

This directory contains API contract specifications for the School ERP Frontend integration with the erp-backend service.

---

## Base URL

- **Development**: `http://localhost:3000/api/v1`
- **Staging**: `https://api.staging.school.com/api/v1`
- **Production**: `https://api.school.com/api/v1`

---

## Authentication

All API requests (except login/callback) require authentication via JWT Bearer token:

```http
Authorization: Bearer {access_token}
```

Tokens are obtained via OIDC flow:
1. User logs in via central-oidc-service
2. Frontend receives authorization code
3. Exchange code for access_token and refresh_token
4. Include access_token in all API requests

---

## Multi-Tenancy Header

All API requests MUST include the tenant context:

```http
x-tenant-subdomain: school1
```

The backend uses this header for row-level data isolation.

---

## Standard Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field": "email",
      "constraints": {
        "isEmail": "email must be a valid email"
      }
    }
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalRecords": 98,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## API Endpoints Summary

### Authentication (via OIDC)

These are handled by central-oidc-service, not erp-backend:

- `GET /authorize` - OIDC authorization endpoint
- `POST /token` - Token exchange endpoint
- `GET /me` - Get current user profile
- `POST /session/end` - Logout endpoint

### User Management

- `GET /users/me` - Get current user details
- `PATCH /users/me` - Update current user profile

### Dashboard

- `GET /dashboard/stats` - Get dashboard statistics

### Students

- `GET /students` - List students (paginated, filterable)
- `GET /students/:id` - Get student details
- `POST /students` - Create new student
- `PATCH /students/:id` - Update student
- `DELETE /students/:id` - Delete student (soft delete)
- `POST /students/bulk-import` - Bulk import students via CSV
- `GET /students/:id/attendance` - Get student attendance history
- `GET /students/:id/fees` - Get student fee records

### Teachers

- `GET /teachers` - List teachers (paginated, filterable)
- `GET /teachers/:id` - Get teacher details
- `POST /teachers` - Create new teacher
- `PATCH /teachers/:id` - Update teacher
- `DELETE /teachers/:id` - Delete teacher
- `GET /teachers/:id/schedule` - Get teacher's timetable
- `GET /teachers/:id/classes` - Get assigned classes

### Classes & Sections

- `GET /academic-years` - List academic years
- `POST /academic-years` - Create academic year
- `GET /classes` - List classes
- `POST /classes` - Create class
- `GET /classes/:id/sections` - Get sections for a class
- `POST /sections` - Create section
- `POST /sections/:id/assign-students` - Assign students to section

### Subjects

- `GET /subjects` - List subjects
- `POST /subjects` - Create subject

### Attendance

- `POST /attendance/mark` - Mark attendance (bulk)
- `GET /attendance` - Get attendance records (filtered)
- `PATCH /attendance/:id` - Update attendance record
- `GET /attendance/reports` - Generate attendance reports
- `GET /attendance/stats` - Get attendance statistics

### Timetable

- `GET /timetable` - Get timetable for class/section
- `POST /timetable` - Create timetable entry
- `PATCH /timetable/:id` - Update timetable entry
- `DELETE /timetable/:id` - Delete timetable entry
- `GET /timetable/teacher/:id` - Get teacher's schedule
- `POST /timetable/detect-conflicts` - Check for scheduling conflicts

### Fee Management

- `GET /fee-structures` - List fee structures
- `POST /fee-structures` - Create fee structure
- `GET /fee-records` - List fee records
- `GET /fee-records/:id` - Get fee record details
- `POST /fee-payments` - Record a payment
- `GET /fee-reports` - Generate fee collection reports

### Parent Portal

- `GET /parents/me/children` - Get linked children for parent
- `GET /parents/children/:id/attendance` - Get child's attendance
- `GET /parents/children/:id/fees` - Get child's fee status

### Reports

- `GET /reports/attendance` - Attendance reports
- `GET /reports/financial` - Financial reports
- `GET /reports/student-analytics` - Student analytics

---

## Request/Response Examples

### List Students

**Request:**
```http
GET /api/v1/students?page=1&pageSize=20&search=john&classId=abc123
Authorization: Bearer {token}
x-tenant-subdomain: school1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "student-uuid-1",
      "admissionNumber": "2024001",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "dateOfBirth": "2010-05-15",
      "gender": "MALE",
      "photo": "https://storage.example.com/photos/student1.jpg",
      "classId": "class-uuid-1",
      "class": {
        "id": "class-uuid-1",
        "name": "Grade 5",
        "code": "G5"
      },
      "sectionId": "section-uuid-1",
      "section": {
        "id": "section-uuid-1",
        "name": "A"
      },
      "status": "ACTIVE",
      "admissionDate": "2024-04-01",
      "createdAt": "2024-04-01T10:00:00Z",
      "updatedAt": "2024-04-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 3,
    "totalRecords": 48,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### Create Student

**Request:**
```http
POST /api/v1/students
Authorization: Bearer {token}
x-tenant-subdomain: school1
Content-Type: application/json

{
  "admissionNumber": "2024050",
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "2011-08-20",
  "gender": "FEMALE",
  "bloodGroup": "O+",
  "classId": "class-uuid-1",
  "sectionId": "section-uuid-1",
  "admissionDate": "2024-11-01",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "emergencyContact": {
    "name": "John Smith",
    "relationship": "FATHER",
    "phone": "9876543210"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "student-uuid-new",
    "admissionNumber": "2024050",
    "firstName": "Jane",
    "lastName": "Smith",
    "fullName": "Jane Smith",
    // ... full student object
  },
  "message": "Student created successfully"
}
```

### Mark Attendance (Bulk)

**Request:**
```http
POST /api/v1/attendance/mark
Authorization: Bearer {token}
x-tenant-subdomain: school1
Content-Type: application/json

{
  "date": "2024-11-08",
  "classId": "class-uuid-1",
  "sectionId": "section-uuid-1",
  "records": [
    {
      "studentId": "student-uuid-1",
      "status": "PRESENT"
    },
    {
      "studentId": "student-uuid-2",
      "status": "ABSENT",
      "remarks": "Sick"
    },
    {
      "studentId": "student-uuid-3",
      "status": "LATE"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "markedCount": 3,
    "date": "2024-11-08",
    "classId": "class-uuid-1",
    "sectionId": "section-uuid-1"
  },
  "message": "Attendance marked successfully"
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | User lacks permission for resource |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate admission number) |
| `TENANT_MISMATCH` | 403 | Attempting to access another tenant's data |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

- **Development**: No rate limiting
- **Production**: 1000 requests per hour per user

Rate limit headers:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1699458000
```

---

## Backend API Documentation

Full API documentation is available in the backend Swagger UI:
- **Development**: `http://localhost:3000/api/docs`
- **Staging**: `https://api.staging.school.com/api/docs`

---

## Frontend Service Layer

API calls should go through service layer abstraction:

```typescript
// src/services/api/studentService.ts
import { apiClient } from './apiClient';
import type { Student, StudentFilters, PaginatedResponse } from '@/types';

export const studentService = {
  async getStudents(filters: StudentFilters): Promise<PaginatedResponse<Student>> {
    const { data } = await apiClient.get('/students', { params: filters });
    return data;
  },
  
  async getStudent(id: string): Promise<Student> {
    const { data } = await apiClient.get(`/students/${id}`);
    return data.data;
  },
  
  async createStudent(student: Partial<Student>): Promise<Student> {
    const { data } = await apiClient.post('/students', student);
    return data.data;
  },
  
  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    const { data } = await apiClient.patch(`/students/${id}`, student);
    return data.data;
  },
  
  async deleteStudent(id: string): Promise<void> {
    await apiClient.delete(`/students/${id}`);
  },
};
```

---

## React Query Integration

Services are consumed via React Query hooks:

```typescript
// src/features/students/hooks/useStudents.ts
import { useQuery } from '@tanstack/react-query';
import { studentService } from '@/services/api/studentService';
import type { StudentFilters } from '@/types';

export function useStudents(filters: StudentFilters) {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: () => studentService.getStudents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getStudent(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studentService.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}
```

---

**Status**: ✅ Contracts Documentation Complete  
**Updated**: 2024-11-08

