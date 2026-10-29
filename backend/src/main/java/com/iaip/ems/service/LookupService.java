package com.iaip.ems.service;

import com.iaip.ems.dto.DepartmentResponse;
import com.iaip.ems.dto.RoleResponse;
import com.iaip.ems.repository.DepartmentRepository;
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

    public LookupService(
            DepartmentRepository departmentRepository,
            RoleRepository roleRepository,
            EmployeeCodeGeneratorService codeGeneratorService) {
        this.departmentRepository = departmentRepository;
        this.roleRepository = roleRepository;
        this.codeGeneratorService = codeGeneratorService;
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
}
