-- =============================================================================
-- INDIAN ARMY INTERNSHIP PROGRAMME (IAIP) 2026
-- Technical Assessment: Employee Management System
-- Schema Definition (PostgreSQL 15+ / Supabase / Cloud Compatible)
-- =============================================================================

-- Clean up existing tables if recreating
DROP TABLE IF EXISTS employee_transfer_history CASCADE;
DROP TABLE IF EXISTS employee_personal_details CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS employee_code_sequences CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- 1. DEPARTMENTS TABLE
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code_prefix VARCHAR(5) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ROLES TABLE
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. EMPLOYEE CODE SEQUENCES (Maintains atomic sequence per department)
CREATE TABLE employee_code_sequences (
    department_id INT PRIMARY KEY REFERENCES departments(id) ON DELETE CASCADE,
    current_sequence INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. EMPLOYEES TABLE (Core Employment Record)
CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    employee_code VARCHAR(20) NOT NULL UNIQUE,
    department_id INT NOT NULL REFERENCES departments(id),
    role_id INT NOT NULL REFERENCES roles(id),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' 
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'PROBATION', 'TERMINATED')),
    joining_date DATE NOT NULL,
    annual_salary NUMERIC(12, 2) NOT NULL CHECK (annual_salary > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. EMPLOYEE PERSONAL DETAILS (1-to-1 with employees)
CREATE TABLE employee_personal_details (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL UNIQUE REFERENCES employees(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    aadhaar_number VARCHAR(20) NOT NULL UNIQUE,
    pan_number VARCHAR(10) NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. EMPLOYEE TRANSFER HISTORY (Audit trail of all department transfers)
CREATE TABLE employee_transfer_history (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    old_department_id INT NOT NULL REFERENCES departments(id),
    new_department_id INT NOT NULL REFERENCES departments(id),
    old_employee_code VARCHAR(20) NOT NULL,
    new_employee_code VARCHAR(20) NOT NULL,
    transfer_date DATE NOT NULL,
    reason TEXT NOT NULL,
    transferred_by VARCHAR(100) DEFAULT 'SYSTEM_ADMIN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (old_department_id <> new_department_id)
);

-- 7. USERS TABLE (Authentication & Role-Based Access Control)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE' CHECK (role IN ('ADMIN', 'MANAGER', 'EMPLOYEE')),
    employee_id BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR OPTIMAL SEARCH, FILTER & SORT PERFORMANCE
CREATE INDEX idx_employees_dept ON employees(department_id);
CREATE INDEX idx_employees_role ON employees(role_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_salary ON employees(annual_salary);
CREATE INDEX idx_employees_joining ON employees(joining_date);
CREATE INDEX idx_personal_details_name ON employee_personal_details(full_name);
CREATE INDEX idx_personal_details_email ON employee_personal_details(email);
CREATE INDEX idx_personal_details_mobile ON employee_personal_details(mobile);
CREATE INDEX idx_personal_details_aadhaar ON employee_personal_details(aadhaar_number);
CREATE INDEX idx_personal_details_pan ON employee_personal_details(pan_number);
CREATE INDEX idx_transfer_history_emp ON employee_transfer_history(employee_id);

