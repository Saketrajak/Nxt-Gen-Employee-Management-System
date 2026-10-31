package com.iaip.ems.service;

import com.iaip.ems.dto.*;
import com.iaip.ems.entity.Department;
import com.iaip.ems.entity.Employee;
import com.iaip.ems.entity.EmployeeCodeSequence;
import com.iaip.ems.entity.User;
import com.iaip.ems.exception.DuplicateResourceException;
import com.iaip.ems.exception.ResourceNotFoundException;
import com.iaip.ems.repository.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeCodeSequenceRepository codeSequenceRepository;
    private final EmployeeTransferHistoryRepository transferHistoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DepartmentService(
            DepartmentRepository departmentRepository,
            EmployeeRepository employeeRepository,
            EmployeeCodeSequenceRepository codeSequenceRepository,
            EmployeeTransferHistoryRepository transferHistoryRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
        this.codeSequenceRepository = codeSequenceRepository;
        this.transferHistoryRepository = transferHistoryRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(d -> new DepartmentResponse(d.getId(), d.getName(), d.getCodePrefix(), d.getDescription()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentById(Integer id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return new DepartmentResponse(dept.getId(), dept.getName(), dept.getCodePrefix(), dept.getDescription());
    }

    @Transactional(rollbackFor = Exception.class)
    public DepartmentResponse createDepartment(DepartmentCreateRequest request) {
        String trimmedName = request.getName().trim();
        String upperPrefix = request.getCodePrefix().trim().toUpperCase();

        if (departmentRepository.existsByNameIgnoreCase(trimmedName)) {
            throw new DuplicateResourceException("name", "Department name '" + trimmedName + "' already exists.");
        }
        if (departmentRepository.existsByCodePrefixIgnoreCase(upperPrefix)) {
            throw new DuplicateResourceException("codePrefix", "Department code prefix '" + upperPrefix + "' is already in use.");
        }

        Department department = new Department();
        department.setName(trimmedName);
        department.setCodePrefix(upperPrefix);
        department.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        Department saved = departmentRepository.save(department);

        // Initialize atomic sequence record
        EmployeeCodeSequence seq = new EmployeeCodeSequence(saved.getId(), 0);
        seq.setDepartment(saved);
        codeSequenceRepository.save(seq);

        return new DepartmentResponse(saved.getId(), saved.getName(), saved.getCodePrefix(), saved.getDescription());
    }

    @Transactional(rollbackFor = Exception.class)
    public DepartmentResponse updateDepartment(Integer id, DepartmentUpdateRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        String trimmedName = request.getName().trim();
        String upperPrefix = request.getCodePrefix().trim().toUpperCase();

        if (departmentRepository.existsByNameIgnoreCaseAndDifferentId(trimmedName, id)) {
            throw new DuplicateResourceException("name", "Another department already uses the name '" + trimmedName + "'.");
        }
        if (departmentRepository.existsByCodePrefixIgnoreCaseAndDifferentId(upperPrefix, id)) {
            throw new DuplicateResourceException("codePrefix", "Another department already uses the code prefix '" + upperPrefix + "'.");
        }

        department.setName(trimmedName);
        department.setCodePrefix(upperPrefix);
        department.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        Department saved = departmentRepository.save(department);
        return new DepartmentResponse(saved.getId(), saved.getName(), saved.getCodePrefix(), saved.getDescription());
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteDepartment(Integer id, DepartmentDeleteRequest request, String currentUsername) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        long assignedEmployees = employeeRepository.countByDepartmentId(id);

        if (assignedEmployees > 0) {
            // Require Admin Password Verification
            if (request == null || request.getAdminPassword() == null || request.getAdminPassword().isBlank()) {
                throw new IllegalArgumentException(
                        "Department '" + department.getName() + "' currently contains " + assignedEmployees +
                        " personnel. Cascading deletion requires admin password confirmation."
                );
            }

            // Verify with current user or fallback to system admin
            User adminUser = null;
            if (currentUsername != null) {
                adminUser = userRepository.findByUsername(currentUsername).orElse(null);
            }
            if (adminUser == null) {
                adminUser = userRepository.findByUsername("admin").orElse(null);
            }

            if (adminUser == null || !passwordEncoder.matches(request.getAdminPassword(), adminUser.getPasswordHash())) {
                throw new BadCredentialsException("Invalid Admin password. Department deletion unauthorized.");
            }

            // 1. Delete associated transfer history
            transferHistoryRepository.deleteByDepartmentInvolvement(id);
            transferHistoryRepository.deleteByEmployeeDepartment(id);

            // 2. Clear user employee references
            List<Employee> emps = employeeRepository.findByDepartmentId(id);
            for (Employee emp : emps) {
                userRepository.findAll().stream()
                        .filter(u -> u.getEmployee() != null && u.getEmployee().getId().equals(emp.getId()))
                        .forEach(u -> {
                            u.setEmployee(null);
                            userRepository.save(u);
                        });
            }

            // 3. Delete employees (cascades to personal details)
            employeeRepository.deleteByDepartmentId(id);
        } else {
            // Delete any legacy transfer history involving this empty department
            transferHistoryRepository.deleteByDepartmentInvolvement(id);
        }

        // Delete sequence
        codeSequenceRepository.deleteById(id);

        // Delete department
        departmentRepository.delete(department);
    }
}
