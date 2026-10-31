package com.iaip.ems.service;

import com.iaip.ems.dto.DashboardStatsResponse;
import com.iaip.ems.dto.DepartmentHeadcountResponse;
import com.iaip.ems.dto.DepartmentResponse;
import com.iaip.ems.dto.RoleResponse;
import com.iaip.ems.repository.DepartmentRepository;
import com.iaip.ems.repository.EmployeeRepository;
import com.iaip.ems.repository.EmployeeTransferHistoryRepository;
import com.iaip.ems.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LookupService {

    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;
    private final EmployeeCodeGeneratorService codeGeneratorService;
    private final EmployeeRepository employeeRepository;
    private final EmployeeTransferHistoryRepository transferHistoryRepository;

    public LookupService(
            DepartmentRepository departmentRepository,
            RoleRepository roleRepository,
            EmployeeCodeGeneratorService codeGeneratorService,
            EmployeeRepository employeeRepository,
            EmployeeTransferHistoryRepository transferHistoryRepository) {
        this.departmentRepository = departmentRepository;
        this.roleRepository = roleRepository;
        this.codeGeneratorService = codeGeneratorService;
        this.employeeRepository = employeeRepository;
        this.transferHistoryRepository = transferHistoryRepository;
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(d -> new DepartmentResponse(d.getId(), d.getName(), d.getCodePrefix(), d.getDescription()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(r -> new RoleResponse(r.getId(), r.getName(), r.getDescription()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public String previewNextCode(Integer departmentId) {
        return codeGeneratorService.previewNextEmployeeCode(departmentId);
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalEmployees = employeeRepository.count();
        long activeEmployees = employeeRepository.countByStatus("ACTIVE");
        long departmentCount = departmentRepository.count();
        long transferCount = transferHistoryRepository.count();

        List<DepartmentHeadcountResponse> summaries = departmentRepository.findAll().stream()
                .map(dept -> {
                    long empCount = employeeRepository.countByDepartmentId(dept.getId());
                    long actCount = employeeRepository.countByDepartmentIdAndStatus(dept.getId(), "ACTIVE");
                    return new DepartmentHeadcountResponse(
                            dept.getId(),
                            dept.getName(),
                            dept.getCodePrefix(),
                            empCount,
                            actCount
                    );
                })
                .collect(Collectors.toList());

        return new DashboardStatsResponse(totalEmployees, activeEmployees, departmentCount, transferCount, summaries);
    }
}
