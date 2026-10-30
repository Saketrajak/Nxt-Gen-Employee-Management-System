# Indian Army Internship Programme (IAIP) : 2026
## HQ Southern Command – Technical Assessment
### Project: Next-Gen Employee Management System (EMS)

---

## 1. Project Overview & Architecture
This project is an enterprise-grade **Employee Management System (EMS)** designed for process automation, personnel tracking, and dynamic department transfers. It satisfies all technical specifications for the Indian Army Internship Programme (IAIP) 2026 Round-2 Assessment.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM ARCHITECTURE                           │
├────────────────────────────────────────────────────────────────────────┤
│  Client Tier:   React 19 (Vite, Tailwind CSS, Lucide Icons)            │
│                 - Reactive Form Validations (Aadhaar Auto-Hyphenation) │
│                 - Multi-faceted Filter Bar & Debounced Search          │
│                 - Server-side Pagination (5 / 10 / 20) & Column Sort   │
│                 - Department Transfer Workflow & 360° Employee Dossier │
│                                                                        │
│  API Tier:      Java 21 • Spring Boot 3.4.1 REST API                   │
│                 - Stateless JWT Authentication & Role-Based RBAC       │
│                 - Concurrency-safe Code Generator (Pessimistic Lock)   │
│                 - Transactional Department Transfer (ACID Rollback)    │
│                 - Data Privacy Filter (Aadhaar & PAN Search Exclusion) │
│                 - Springdoc OpenAPI 3.0 (Interactive Swagger UI)       │
│                                                                        │
│  Data Tier:     PostgreSQL 16 / Supabase Cloud Database                │
│                 - 7 Relational Tables with Foreign Key Constraints     │
│                 - Department Sequence Tracking Table                   │
│                 - Complete Historical Transfer Audit Trail             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack & Exact Dependency Manifest

### A. Backend (Java Spring Boot 3.4.1 on Java 21 LTS)
As mandated by the submission guidelines, only the exact libraries required for runtime functionality are utilized:

| Dependency Artifact | Version | Purpose |
| :--- | :--- | :--- |
| `spring-boot-starter-web` | `3.4.1` | REST API, DispatcherServlet, Jackson JSON serialization |
| `spring-boot-starter-data-jpa` | `3.4.1` | Spring Data JPA, Hibernate ORM, Transaction Management |
| `spring-boot-starter-validation` | `3.4.1` | Jakarta Bean Validation 3.0 (`@Pattern`, `@DecimalMin`, `@Past`) |
| `spring-boot-starter-security` | `3.4.1` | AuthenticationFilter, BCryptPasswordEncoder, SecurityFilterChain |
| `postgresql` (`org.postgresql`) | `42.7.4` | Production PostgreSQL JDBC Driver |
| `springdoc-openapi-starter-webmvc-ui` | `2.8.3` | OpenAPI 3.0 Specification & Swagger UI (`/swagger-ui.html`) |
| `jjwt-api`, `jjwt-impl`, `jjwt-jackson` | `0.12.6` | Stateless JSON Web Token (JWT) HS256 signing and verification |
| `spring-boot-starter-test` | `3.4.1` | JUnit 5 & MockMvc unit/integration testing framework |

### B. Frontend (React 19 + Vite + Tailwind CSS)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react` / `react-dom` | `^19.3.1` | Core UI library & Virtual DOM rendering |
| `vite` | `^8.3.5` | Next-generation frontend build tool and dev server |
| `tailwindcss` | `^3.4.17` | Utility-first styling framework with custom defense palette |
| `lucide-react` | `^1.16.0` | Accessible, clean UI iconography |
| `axios` | `^1.8.2` | Promise-based HTTP client with Bearer token interceptor |

### C. Database (PostgreSQL / Supabase)
- **Primary Schema**: 7 Tables (`departments`, `roles`, `employees`, `employee_personal_details`, `employee_code_sequences`, `employee_transfer_history`, `users`).
- **Data Integrity**: Foreign keys with `ON DELETE CASCADE` / `ON DELETE SET NULL`, and unique constraints on `employee_code` and `email`.

---

## 3. Key Technical Implementations

### 1. Department-Specific Atomic Employee Code Generation
Each department maintains a dedicated sequence counter in `employee_code_sequences`:
- **Information Technology (IT)**: `I0001`, `I0002`...
- **Human Resources (HR)**: `H0001`, `H0002`...
- **Finance**: `F0001`, `F0002`...
- **Sales**: `S0001`, `S0002`...
- **Administration**: `A0001`, `A0002`...

> **Concurrency Handling**: Code generation uses **Pessimistic Row-Level Locking** (`SELECT ... FOR UPDATE` via `@Lock(LockModeType.PESSIMISTIC_WRITE)`). This guarantees that concurrent employee registrations or transfers never produce duplicate codes under high traffic.

### 2. Transactional Department Transfer Workflow
When an employee transfers (e.g. Rahul Sharma from IT `I0001` to HR):
1. Verifies the employee is not transferring to the same department.
2. Atomically increments the HR sequence counter to generate the next code (e.g. `H0002`).
3. Updates `department_id` and `employee_code` while keeping the underlying database primary key `id` unchanged.
4. Records an immutable audit entry in `employee_transfer_history` with old/new departments, old/new codes, date, reason, and authorizer.
5. The entire workflow is executed inside a single `@Transactional(rollbackFor = Exception.class)` boundary.

### 3. Privacy-Preserving Global Search & Advanced Filtering
- Global search executes server-side across: Name, Email, Mobile, Department, Role, Status, and Address.
- **Sensitive Data Protection**: As specified in requirement Task B.5, **Aadhaar Number and PAN are deliberately excluded from unrestricted global text search** to protect sensitive identity data.
- **Salary Filters**:
  - `₹1–3 LPA`: ₹1,00,000 to below ₹3,00,000
  - `₹3–5 LPA`: ₹3,00,000 to below ₹5,00,000
  - `₹5–10 LPA`: ₹5,00,000 to below ₹10,00,000
  - `₹10+ LPA`: ₹10,00,000 and above
  - `Custom`: User-defined Min/Max salary inputs.
- All filters operate simultaneously with server-side sorting (asc/desc) and pagination (5, 10, 20 per page).

### 4. Input Validations
- **Aadhaar**: Formatted as `XXXX-XXXX-XXXX` with real-time keystroke auto-hyphenation; verified for 12 numeric digits.
- **PAN**: Validated against statutory regex pattern `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`.
- **Mobile**: Validated for 10-digit Indian telecom standard (`^[6-9]\d{9}$`).
- **Date of Birth**: Restricted from future dates (`@Past`).
- **Annual Salary**: Strictly positive (`> 0`).

---

## 4. Local Setup & Execution Guide

### Prerequisites
- **Java**: OpenJDK 21 LTS (`java -version`)
- **Maven**: Version 3.8+ (`mvn -v`)
- **Node.js**: v18+ or v24 LTS (`node -v`, `npm -v`)
- **Database**: PostgreSQL 16+ or Supabase Cloud connection

---

### Step 1: Database Setup
1. Open PostgreSQL (via `psql` or pgAdmin) or your Supabase SQL Editor.
2. Create database:
   ```sql
   CREATE DATABASE iaip_ems;
   ```
3. Execute the schema DDL:
   ```bash
   psql -U postgres -d iaip_ems -f database/schema.sql
   ```
4. Execute the seed data (loads 5 depts, 3 roles, 22 diverse employees, sample transfers, and users):
   ```bash
   psql -U postgres -d iaip_ems -f database/seed.sql
   ```

---

### Step 2: Backend Setup & Execution
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure database connection in `src/main/resources/application.properties` (or pass via environment variables):
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/iaip_ems
   spring.datasource.username=postgres
   spring.datasource.password=YOUR_PASSWORD
   ```
3. Restore dependencies and compile:
   ```bash
   mvn clean compile
   ```
4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will start on `http://localhost:8080`.*

5. Open Interactive API Documentation:
   - **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   - **OpenAPI JSON**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

---

### Step 3: Frontend Setup & Execution
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Restore frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend dashboard will be available at `http://localhost:5173`.*

---

## 5. Pre-Seeded Test Credentials

| Role | Username | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `Admin@123` | Full CRUD, Department Transfer, Deactivation, User Management |
| **Manager** | `manager` | `Manager@123` | View All, Edit Employee Details, Initiate Department Transfer |
| **Employee** | `employee` | `Employee@123` | Read-only Directory & Personal Dossier View |

---

## 6. Assumptions Mentioned as Permitted by HQ Southern Command
1. **Employee Code Immutability Outside Transfers**: An employee's code is strictly tied to their department sequence and only changes when an official Department Transfer is authorized and executed.
2. **Internal Primary Key Retention**: In accordance with enterprise database normalization, the internal surrogate key `id` (BIGINT) never changes, ensuring referential integrity across past audit records and linked systems.
3. **Data Privacy Default**: Aadhaar numbers are masked in standard UI representations (`XXXX-XXXX-1234`) with a secure toggle for authorized personnel.
4. **Statutory Salary Currency**: All compensation values are calculated in Indian Rupees (INR ₹) in Lakhs Per Annum (LPA).
