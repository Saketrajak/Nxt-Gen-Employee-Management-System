package com.iaip.ems.controller;

import com.iaip.ems.dto.*;
import com.iaip.ems.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employee Management", description = "APIs for employee CRUD, global search, filtering, and pagination")
@SecurityRequirement(name = "BearerAuth")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    @Operation(summary = "Search, filter, sort, and paginate employee records")
    public ResponseEntity<PagedResponse<EmployeeSummaryResponse>> getEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) Integer roleId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate joiningDate,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(required = false) BigDecimal maxSalary,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {

        PagedResponse<EmployeeSummaryResponse> response = employeeService.getEmployees(
                search, departmentId, roleId, status, gender, joiningDate,
                minSalary, maxSalary, sortBy, sortDir, pageNumber, pageSize
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get complete employee profile and personal details by internal ID")
    public ResponseEntity<EmployeeDetailResponse> getEmployeeById(@PathVariable Long id) {
        EmployeeDetailResponse response = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get employee details by Employee Code (e.g. I0001, H0002)")
    public ResponseEntity<EmployeeDetailResponse> getEmployeeByCode(@PathVariable String code) {
        EmployeeDetailResponse response = employeeService.getEmployeeByCode(code);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Register a new employee with auto-generated department code")
    public ResponseEntity<EmployeeDetailResponse> createEmployee(@Valid @RequestBody EmployeeCreateRequest request) {
        EmployeeDetailResponse response = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Update employee personal and employment information")
    public ResponseEntity<EmployeeDetailResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeUpdateRequest request) {
        EmployeeDetailResponse response = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate an employee account (set status to INACTIVE)")
    public ResponseEntity<Map<String, String>> deactivateEmployee(@PathVariable Long id) {
        employeeService.deactivateEmployee(id);
        return ResponseEntity.ok(Map.of("message", "Employee successfully deactivated."));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Permanently delete an employee record (Admin only)")
    public ResponseEntity<Map<String, String>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(Map.of("message", "Employee permanently deleted."));
    }
}
