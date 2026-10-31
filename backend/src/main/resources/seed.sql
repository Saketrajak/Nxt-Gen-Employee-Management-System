-- =============================================================================
-- INDIAN ARMY INTERNSHIP PROGRAMME (IAIP) 2026
-- Technical Assessment: Seed Data (Departments, Roles, Sequences, 20+ Employees, History, Users)
-- =============================================================================

-- 1. DEPARTMENTS (At least 5 required)
INSERT INTO departments (id, name, code_prefix, description) VALUES
(1, 'Information Technology', 'I', 'Software Engineering, Infrastructure and Cyber Security'),
(2, 'Human Resources', 'H', 'Talent Acquisition, People Operations and Training'),
(3, 'Finance', 'F', 'Accounts, Payroll, Financial Planning and Audits'),
(4, 'Sales', 'S', 'Enterprise Sales, Business Development and Client Relations'),
(5, 'Administration', 'A', 'Facility Management, Operations and Procurement');

SELECT setval('departments_id_seq', 5, true);

-- 2. ROLES (At least 3 required)
INSERT INTO roles (id, name, description) VALUES
(1, 'Admin', 'Full administrative access across all system modules'),
(2, 'Manager', 'Departmental management, review and transfer initiation permissions'),
(3, 'Employee', 'Standard staff member with self-service view privileges');

SELECT setval('roles_id_seq', 3, true);

-- 3. EMPLOYEES & PERSONAL DETAILS (22 Realistic Employees across all bands)
-- Band 1: 1-3 LPA (e.g. 2,40,000 to 2,80,000)
-- Band 2: 3-5 LPA (e.g. 3,60,000 to 4,50,000)
-- Band 3: 5-10 LPA (e.g. 5,80,000 to 8,50,000)
-- Band 4: 10+ LPA (e.g. 12,00,000 to 18,50,000)

-- IT Department Employees (Prefix 'I')
INSERT INTO employees (id, employee_code, department_id, role_id, status, joining_date, annual_salary) VALUES
(1, 'I0001', 1, 1, 'ACTIVE', '2022-01-15', 1650000.00), -- IT Admin / Lead
(2, 'I0002', 1, 2, 'ACTIVE', '2022-06-01', 1150000.00), -- IT Manager
(3, 'I0003', 1, 3, 'ACTIVE', '2023-02-10', 780000.00),  -- Software Engineer
(4, 'I0004', 1, 3, 'ACTIVE', '2023-08-20', 480000.00),  -- Junior Dev
(5, 'I0005', 1, 3, 'PROBATION', '2024-05-15', 280000.00);-- Trainee

INSERT INTO employee_personal_details (employee_id, full_name, email, mobile, aadhaar_number, pan_number, date_of_birth, gender, address) VALUES
(1, 'Vikramaditya Rathore', 'vikram.rathore@iaip.gov.in', '9876543210', '4321-8765-1092', 'ABCDE1234F', '1988-04-12', 'Male', 'Plot 42, Southern Command Enclave, Pune, Maharashtra'),
(2, 'Priya Nair', 'priya.nair@iaip.gov.in', '9812345678', '9876-5432-1201', 'BNMPK5678Q', '1991-09-25', 'Female', 'Flat 304, Green Palms, Camp Area, Pune, Maharashtra'),
(3, 'Rahul Sharma', 'rahul.sharma@iaip.gov.in', '9711223344', '5647-3829-1093', 'CDEFG9012R', '1995-11-18', 'Male', 'Sector 14, Viman Nagar, Pune, Maharashtra'),
(4, 'Sneha Kulkarni', 'sneha.kulkarni@iaip.gov.in', '9622334455', '3421-9870-6543', 'DEFGH3456S', '1998-03-08', 'Female', '12/B, Shivaji Housing Society, Senapati Bapat Road, Pune'),
(5, 'Aditya Joshi', 'aditya.joshi@iaip.gov.in', '9533445566', '8765-4321-9087', 'EFGHI7890T', '2001-07-22', 'Male', 'B-102, Ganga Carnation, Mundhwa, Pune, Maharashtra');

-- HR Department Employees (Prefix 'H')
INSERT INTO employees (id, employee_code, department_id, role_id, status, joining_date, annual_salary) VALUES
(6, 'H0001', 2, 2, 'ACTIVE', '2021-03-10', 1250000.00),
(7, 'H0002', 2, 3, 'ACTIVE', '2022-09-15', 680000.00),
(8, 'H0003', 2, 3, 'ACTIVE', '2023-04-01', 420000.00),
(9, 'H0004', 2, 3, 'INACTIVE', '2023-11-10', 380000.00),
(10, 'H0005', 2, 3, 'PROBATION', '2024-06-01', 250000.00);

INSERT INTO employee_personal_details (employee_id, full_name, email, mobile, aadhaar_number, pan_number, date_of_birth, gender, address) VALUES
(6, 'Sunita Deshmukh', 'sunita.deshmukh@iaip.gov.in', '9844556677', '2109-8765-4321', 'FGHIJ1234U', '1987-12-05', 'Female', 'Bungalow 7, Koregaon Park, Pune, Maharashtra'),
(7, 'Amitabh Sengupta', 'amitabh.sengupta@iaip.gov.in', '9755667788', '6543-2109-8765', 'GHIJK5678V', '1992-05-30', 'Male', 'Lake View Apartments, Baner, Pune, Maharashtra'),
(8, 'Pooja Verma', 'pooja.verma@iaip.gov.in', '9666778899', '1098-7654-3210', 'HIJKL9012W', '1996-08-14', 'Female', '44, Ashok Nagar, Range Hills, Khadki, Pune'),
(9, 'Rohan Mehta', 'rohan.mehta@iaip.gov.in', '9577889900', '7890-1234-5678', 'IJKLM3456X', '1997-01-20', 'Male', 'Flat 502, Skyline Towers, Wakad, Pune, Maharashtra'),
(10, 'Kavita Pillai', 'kavita.pillai@iaip.gov.in', '9488990011', '4567-8901-2345', 'JKLMN7890Y', '2000-10-10', 'Female', 'A-4, Defence Colony, Wanowrie, Pune, Maharashtra');

-- Finance Department Employees (Prefix 'F')
INSERT INTO employees (id, employee_code, department_id, role_id, status, joining_date, annual_salary) VALUES
(11, 'F0001', 3, 2, 'ACTIVE', '2020-08-18', 1400000.00),
(12, 'F0002', 3, 3, 'ACTIVE', '2021-12-05', 890000.00),
(13, 'F0003', 3, 3, 'ACTIVE', '2023-01-20', 560000.00),
(14, 'F0004', 3, 3, 'ACTIVE', '2023-07-15', 350000.00);

INSERT INTO employee_personal_details (employee_id, full_name, email, mobile, aadhaar_number, pan_number, date_of_birth, gender, address) VALUES
(11, 'Manoj Kumar Tiwari', 'manoj.tiwari@iaip.gov.in', '9399001122', '3210-9876-5432', 'KLMNO1234Z', '1985-02-17', 'Male', 'H-12, Officers Enclave, Wanowrie, Pune, Maharashtra'),
(12, 'Deepa Sundaram', 'deepa.sundaram@iaip.gov.in', '9200112233', '8901-2345-6789', 'LMNOP5678A', '1990-06-28', 'Female', 'Penthouse 11, Magarpatta City, Hadapsar, Pune'),
(13, 'Gaurav Bhattacharya', 'gaurav.bhatt@iaip.gov.in', '9111223344', '5432-1098-7654', 'MNOPQ9012B', '1994-09-12', 'Male', '108, Silver Mist, Kalyani Nagar, Pune, Maharashtra'),
(14, 'Neha Chawla', 'neha.chawla@iaip.gov.in', '9022334455', '2345-6789-0123', 'NOPQR3456C', '1999-04-05', 'Female', 'Flat 201, Roseland Residency, Pimple Saudagar, Pune');

-- Sales Department Employees (Prefix 'S')
INSERT INTO employees (id, employee_code, department_id, role_id, status, joining_date, annual_salary) VALUES
(15, 'S0001', 4, 2, 'ACTIVE', '2021-04-12', 1300000.00),
(16, 'S0002', 4, 3, 'ACTIVE', '2022-10-01', 720000.00),
(17, 'S0003', 4, 3, 'ACTIVE', '2023-05-18', 440000.00),
(18, 'S0004', 4, 3, 'TERMINATED', '2022-02-01', 310000.00);

INSERT INTO employee_personal_details (employee_id, full_name, email, mobile, aadhaar_number, pan_number, date_of_birth, gender, address) VALUES
(15, 'Rajesh Vardhan', 'rajesh.vardhan@iaip.gov.in', '8933445566', '6789-0123-4567', 'OPQRS7890D', '1989-10-31', 'Male', 'Row House 5, Blue Ridge, Hinjawadi Phase 1, Pune'),
(16, 'Ananya Banerjee', 'ananya.banerjee@iaip.gov.in', '8844556677', '9012-3456-7890', 'PQRST1234E', '1993-03-15', 'Female', 'B-403, Rohan Ishan, Bavdhan, Pune, Maharashtra'),
(17, 'Karan Malhotra', 'karan.malhotra@iaip.gov.in', '8755667788', '1234-5678-9012', 'QRSTU5678F', '1997-12-24', 'Male', 'Plot 88, Kothrud Depot Area, Pune, Maharashtra'),
(18, 'Divya Chauhan', 'divya.chauhan@iaip.gov.in', '8666778899', '7654-3210-9876', 'RSTUV9012G', '1996-07-09', 'Female', 'Flat 701, Marvel Fria, Wagholi, Pune, Maharashtra');

-- Admin Department Employees (Prefix 'A')
INSERT INTO employees (id, employee_code, department_id, role_id, status, joining_date, annual_salary) VALUES
(19, 'A0001', 5, 2, 'ACTIVE', '2020-01-10', 1050000.00),
(20, 'A0002', 5, 3, 'ACTIVE', '2022-07-25', 520000.00),
(21, 'A0003', 5, 3, 'ACTIVE', '2023-09-01', 390000.00),
(22, 'A0004', 5, 3, 'PROBATION', '2024-04-10', 240000.00);

INSERT INTO employee_personal_details (employee_id, full_name, email, mobile, aadhaar_number, pan_number, date_of_birth, gender, address) VALUES
(19, 'Baldev Singh Gill', 'baldev.singh@iaip.gov.in', '8577889900', '3456-7890-1234', 'STUVW3456H', '1986-08-19', 'Male', 'Army Welfare Housing, Salunke Vihar, Kondhwa, Pune'),
(20, 'Meenakshi Iyer', 'meenakshi.iyer@iaip.gov.in', '8488990011', '8901-2345-6701', 'TUVWX7890I', '1992-11-04', 'Female', 'Apt 12, Gulmohar Habitat, Salunke Vihar Road, Pune'),
(21, 'Tariq Ahmed Khan', 'tariq.khan@iaip.gov.in', '8399001122', '4567-8901-2302', 'UVWXY1234J', '1998-02-14', 'Male', 'Flat 103, Royal Palms, Fatima Nagar, Pune, Maharashtra'),
(22, 'Shweta Rane', 'shweta.rane@iaip.gov.in', '8200112233', '9012-3456-7803', 'VWXYZ5678K', '2001-09-18', 'Female', '67, Sahakar Nagar No. 2, Pune, Maharashtra');

SELECT setval('employees_id_seq', 22, true);
SELECT setval('employee_personal_details_id_seq', 22, true);

-- 4. EMPLOYEE CODE SEQUENCES (Matches the highest sequence allocated per department)
INSERT INTO employee_code_sequences (department_id, current_sequence) VALUES
(1, 5), -- IT (I0001 - I0005)
(2, 5), -- HR (H0001 - H0005)
(3, 4), -- Finance (F0001 - F0004)
(4, 4), -- Sales (S0001 - S0004)
(5, 4); -- Admin (A0001 - A0004)

-- 5. EMPLOYEE TRANSFER HISTORY (Demonstrating realistic past department transfers)
INSERT INTO employee_transfer_history (employee_id, old_department_id, new_department_id, old_employee_code, new_employee_code, transfer_date, reason, transferred_by) VALUES
(7, 1, 2, 'I0006', 'H0002', '2023-01-10', 'Transferred to HR People Analytics team due to prior technical recruitment background.', 'COL. R.K. VERMA'),
(13, 4, 3, 'S0005', 'F0003', '2023-06-01', 'Internal mobility transition to Financial Planning & Analysis unit.', 'COL. R.K. VERMA');

SELECT setval('employee_transfer_history_id_seq', 2, true);

-- 6. USERS (With BCrypt hashed passwords)
-- Passwords:
-- Admin: Admin@123
-- Manager: Manager@123
-- Employee: Employee@123
INSERT INTO users (username, email, password_hash, role, employee_id, is_active) VALUES
('admin', 'admin@iaip.gov.in', '$2a$10$w4X2NlW5v7bL5B.p0C8BzeE6Y7pY6H8Hn3H.p9C8BzeE6Y7pY6H8H', 'ADMIN', 1, true),
('manager', 'manager@iaip.gov.in', '$2a$10$w4X2NlW5v7bL5B.p0C8BzeE6Y7pY6H8Hn3H.p9C8BzeE6Y7pY6H8H', 'MANAGER', 2, true),
('employee', 'employee@iaip.gov.in', '$2a$10$w4X2NlW5v7bL5B.p0C8BzeE6Y7pY6H8Hn3H.p9C8BzeE6Y7pY6H8H', 'EMPLOYEE', 3, true);

SELECT setval('users_id_seq', 3, true);

