package com.iaip.ems.service;

import com.iaip.ems.dto.*;
import com.iaip.ems.entity.*;
import com.iaip.ems.exception.DuplicateResourceException;
import com.iaip.ems.exception.ResourceNotFoundException;
import com.iaip.ems.repository.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeePersonalDetailsRepository personalDetailsRepository;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;
    private final EmployeeCodeGeneratorService codeGeneratorService;
    private final TransferService transferService;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            EmployeePersonalDetailsRepository personalDetailsRepository,
            DepartmentRepository departmentRepository,
            RoleRepository roleRepository,
            EmployeeCodeGeneratorService codeGeneratorService,
            TransferService transferService) {
        this.employeeRepository = employeeRepository;
        this.personalDetailsRepository = personalDetailsRepository;
        this.departmentRepository = departmentRepository;
        this.roleRepository = roleRepository;
        this.codeGeneratorService = codeGeneratorService;
        this.transferService = transferService;
    }

    /**
     * Create employee with auto-generated department code and personal details.
     */
    @Transactional(rollbackFor = Exception.class)
    public EmployeeDetailResponse createEmployee(EmployeeCreateRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String normalizedAadhaar = normalizeAadhaar(request.getAadhaarNumber());
        String normalizedPan = normalizePan(request.getPanNumber());

        if (personalDetailsRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("email", "An employee with email " + normalizedEmail + " already exists.");
        }
        if (personalDetailsRepository.existsByAadhaarNumber(normalizedAadhaar)) {
            throw new DuplicateResourceException("aadhaarNumber", "An employee with Aadhaar number " + normalizedAadhaar + " already exists.");
        }
        if (personalDetailsRepository.existsByPanNumberIgnoreCase(normalizedPan)) {
            throw new DuplicateResourceException("panNumber", "An employee with PAN number " + normalizedPan + " already exists.");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + request.getRoleId()));

        // Generate department code atomically
        String employeeCode = codeGeneratorService.generateNextEmployeeCode(department.getId());

        Employee employee = new Employee();
        employee.setEmployeeCode(employeeCode);
        employee.setDepartment(department);
        employee.setRole(role);
        employee.setStatus(request.getStatus() != null ? request.getStatus().toUpperCase() : "ACTIVE");
        employee.setJoiningDate(request.getJoiningDate());
        employee.setAnnualSalary(request.getAnnualSalary());

        EmployeePersonalDetails personal = new EmployeePersonalDetails();
        personal.setFullName(request.getFullName().trim());
        personal.setEmail(normalizedEmail);
        personal.setMobile(request.getMobile().trim());
        personal.setAadhaarNumber(normalizedAadhaar);
        personal.setPanNumber(normalizedPan);
        personal.setDateOfBirth(request.getDateOfBirth());
        personal.setGender(request.getGender().trim());
        personal.setAddress(request.getAddress().trim());

        employee.setPersonalDetails(personal);
        Employee saved = employeeRepository.save(employee);

        return mapToDetailResponse(saved);
    }

    /**
     * Dynamic Server-side Search, Multi-Filter, Sort, and Pagination API.
     */
    @Transactional(readOnly = true)
    public PagedResponse<EmployeeSummaryResponse> getEmployees(
            String search,
            Integer departmentId,
            Integer roleId,
            String status,
            String gender,
            LocalDate joiningDate,
            BigDecimal minSalary,
            BigDecimal maxSalary,
            String sortBy,
            String sortDir,
            int pageNumber,
            int pageSize) {

        int pageIndex = Math.max(0, pageNumber - 1);
        int validPageSize = (pageSize == 5 || pageSize == 10 || pageSize == 20) ? pageSize : 10;

        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = resolveSort(sortBy, direction);

        Pageable pageable = PageRequest.of(pageIndex, validPageSize, sort);

        Specification<Employee> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<Employee, EmployeePersonalDetails> personalJoin = root.join("personalDetails", JoinType.LEFT);
            Join<Employee, Department> deptJoin = root.join("department", JoinType.LEFT);
            Join<Employee, Role> roleJoin = root.join("role", JoinType.LEFT);

            // 1. Global Search (Permitted fields only; Aadhaar & PAN deliberately excluded for data privacy)
            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate codeMatch = cb.like(cb.lower(root.get("employeeCode")), searchPattern);
                Predicate nameMatch = cb.like(cb.lower(personalJoin.get("fullName")), searchPattern);
                Predicate emailMatch = cb.like(cb.lower(personalJoin.get("email")), searchPattern);
                Predicate mobileMatch = cb.like(cb.lower(personalJoin.get("mobile")), searchPattern);
                Predicate addressMatch = cb.like(cb.lower(personalJoin.get("address")), searchPattern);
                Predicate deptMatch = cb.like(cb.lower(deptJoin.get("name")), searchPattern);
                Predicate roleMatch = cb.like(cb.lower(roleJoin.get("name")), searchPattern);
                Predicate statusMatch = cb.like(cb.lower(root.get("status")), searchPattern);

                predicates.add(cb.or(codeMatch, nameMatch, emailMatch, mobileMatch, addressMatch, deptMatch, roleMatch, statusMatch));
            }

            // 2. Department Filter
            if (departmentId != null) {
                predicates.add(cb.equal(deptJoin.get("id"), departmentId));
            }

            // 3. Role Filter
            if (roleId != null) {
                predicates.add(cb.equal(roleJoin.get("id"), roleId));
            }

            // 4. Status Filter
            if (StringUtils.hasText(status)) {
                predicates.add(cb.equal(cb.upper(root.get("status")), status.trim().toUpperCase()));
            }

            // 5. Gender Filter
            if (StringUtils.hasText(gender)) {
                predicates.add(cb.equal(cb.lower(personalJoin.get("gender")), gender.trim().toLowerCase()));
            }

            // 6. Joining Date Filter
            if (joiningDate != null) {
                predicates.add(cb.equal(root.get("joiningDate"), joiningDate));
            }

            // 7. Salary Range Filter
            if (minSalary != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("annualSalary"), minSalary));
            }
            if (maxSalary != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("annualSalary"), maxSalary));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Employee> page = employeeRepository.findAll(spec, pageable);

        List<EmployeeSummaryResponse> content = page.getContent().stream()
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional(readOnly = true)
    public EmployeeDetailResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));
        return mapToDetailResponse(employee);
    }

    @Transactional(readOnly = true)
    public EmployeeDetailResponse getEmployeeByCode(String code) {
        Employee employee = employeeRepository.findByEmployeeCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with code: " + code));
        return mapToDetailResponse(employee);
    }

    @Transactional(rollbackFor = Exception.class)
    public EmployeeDetailResponse updateEmployee(Long id, EmployeeUpdateRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String normalizedAadhaar = normalizeAadhaar(request.getAadhaarNumber());
        String normalizedPan = normalizePan(request.getPanNumber());

        if (personalDetailsRepository.existsByEmailAndDifferentEmployee(normalizedEmail, id)) {
            throw new DuplicateResourceException("email", "Another employee already uses email " + normalizedEmail);
        }
        if (personalDetailsRepository.existsByAadhaarNumberAndDifferentEmployee(normalizedAadhaar, id)) {
            throw new DuplicateResourceException("aadhaarNumber", "Another employee already uses Aadhaar number " + normalizedAadhaar);
        }
        if (personalDetailsRepository.existsByPanNumberAndDifferentEmployee(normalizedPan, id)) {
            throw new DuplicateResourceException("panNumber", "Another employee already uses PAN number " + normalizedPan);
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + request.getRoleId()));

        employee.setRole(role);
        employee.setStatus(request.getStatus().toUpperCase());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setAnnualSalary(request.getAnnualSalary());

        EmployeePersonalDetails personal = employee.getPersonalDetails();
        if (personal == null) {
            personal = new EmployeePersonalDetails();
            employee.setPersonalDetails(personal);
        }

        personal.setFullName(request.getFullName().trim());
        personal.setEmail(normalizedEmail);
        personal.setMobile(request.getMobile().trim());
        personal.setAadhaarNumber(normalizedAadhaar);
        personal.setPanNumber(normalizedPan);
        personal.setDateOfBirth(request.getDateOfBirth());
        personal.setGender(request.getGender().trim());
        personal.setAddress(request.getAddress().trim());

        Employee updated = employeeRepository.save(employee);
        return mapToDetailResponse(updated);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deactivateEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));
        employee.setStatus("INACTIVE");
        employeeRepository.save(employee);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with ID: " + id);
        }
        employeeRepository.deleteById(id);
    }

    public String normalizeAadhaar(String raw) {
        if (raw == null) return null;
        String digits = raw.replaceAll("\\D", "");
        if (digits.length() == 12) {
            return digits.substring(0, 4) + "-" + digits.substring(4, 8) + "-" + digits.substring(8, 12);
        }
        return raw.trim();
    }

    public String normalizePan(String raw) {
        if (raw == null) return null;
        return raw.trim().toUpperCase();
    }

    private Sort resolveSort(String sortBy, Sort.Direction direction) {
        if (!StringUtils.hasText(sortBy)) {
            return Sort.by(direction, "id");
        }
        return switch (sortBy.toLowerCase()) {
            case "employeecode", "code" -> Sort.by(direction, "employeeCode");
            case "fullname", "name" -> Sort.by(direction, "personalDetails.fullName");
            case "email" -> Sort.by(direction, "personalDetails.email");
            case "mobile" -> Sort.by(direction, "personalDetails.mobile");
            case "department", "departmentname" -> Sort.by(direction, "department.name");
            case "role", "rolename" -> Sort.by(direction, "role.name");
            case "salary", "annualsalary" -> Sort.by(direction, "annualSalary");
            case "joiningdate" -> Sort.by(direction, "joiningDate");
            case "status" -> Sort.by(direction, "status");
            default -> Sort.by(direction, "id");
        };
    }

    public EmployeeSummaryResponse mapToSummaryResponse(Employee emp) {
        EmployeeSummaryResponse res = new EmployeeSummaryResponse();
        res.setId(emp.getId());
        res.setEmployeeCode(emp.getEmployeeCode());
        res.setDepartmentId(emp.getDepartment().getId());
        res.setDepartmentName(emp.getDepartment().getName());
        res.setRoleId(emp.getRole().getId());
        res.setRoleName(emp.getRole().getName());
        res.setStatus(emp.getStatus());
        res.setJoiningDate(emp.getJoiningDate());
        res.setAnnualSalary(emp.getAnnualSalary());
        res.setCreatedAt(emp.getCreatedAt());

        if (emp.getPersonalDetails() != null) {
            res.setFullName(emp.getPersonalDetails().getFullName());
            res.setEmail(emp.getPersonalDetails().getEmail());
            res.setMobile(emp.getPersonalDetails().getMobile());
        }
        return res;
    }

    public EmployeeDetailResponse mapToDetailResponse(Employee emp) {
        EmployeeDetailResponse res = new EmployeeDetailResponse();
        res.setId(emp.getId());
        res.setEmployeeCode(emp.getEmployeeCode());
        res.setDepartmentId(emp.getDepartment().getId());
        res.setDepartmentName(emp.getDepartment().getName());
        res.setRoleId(emp.getRole().getId());
        res.setRoleName(emp.getRole().getName());
        res.setStatus(emp.getStatus());
        res.setJoiningDate(emp.getJoiningDate());
        res.setAnnualSalary(emp.getAnnualSalary());
        res.setCreatedAt(emp.getCreatedAt());
        res.setUpdatedAt(emp.getUpdatedAt());

        if (emp.getPersonalDetails() != null) {
            res.setFullName(emp.getPersonalDetails().getFullName());
            res.setEmail(emp.getPersonalDetails().getEmail());
            res.setMobile(emp.getPersonalDetails().getMobile());
            res.setAadhaarNumber(emp.getPersonalDetails().getAadhaarNumber());
            res.setPanNumber(emp.getPersonalDetails().getPanNumber());
            res.setDateOfBirth(emp.getPersonalDetails().getDateOfBirth());
            res.setGender(emp.getPersonalDetails().getGender());
            res.setAddress(emp.getPersonalDetails().getAddress());
        }

        // Include transfer history for this employee
        List<TransferHistoryResponse> history = transferService.getTransferHistoryForEmployee(emp.getId());
        res.setTransferHistory(history);

        return res;
    }
}
