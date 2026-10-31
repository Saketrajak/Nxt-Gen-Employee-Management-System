package com.iaip.ems.controller;

import com.iaip.ems.dto.DepartmentCreateRequest;
import com.iaip.ems.dto.DepartmentDeleteRequest;
import com.iaip.ems.dto.DepartmentResponse;
import com.iaip.ems.dto.DepartmentUpdateRequest;
import com.iaip.ems.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@Tag(name = "Department Management", description = "Admin APIs for adding, editing, and deleting organizational departments")
@SecurityRequirement(name = "BearerAuth")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    @Operation(summary = "Get all configured departments")
    public ResponseEntity<List<DepartmentResponse>> getDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get department by ID")
    public ResponseEntity<DepartmentResponse> getDepartmentById(@PathVariable Integer id) {
        return ResponseEntity.ok(departmentService.getDepartmentById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new department and initialize its code sequence")
    public ResponseEntity<DepartmentResponse> createDepartment(@Valid @RequestBody DepartmentCreateRequest request) {
        DepartmentResponse created = departmentService.createDepartment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing department")
    public ResponseEntity<DepartmentResponse> updateDepartment(
            @PathVariable Integer id,
            @Valid @RequestBody DepartmentUpdateRequest request) {
        DepartmentResponse updated = departmentService.updateDepartment(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete department (safely handles empty departments or cascade deletes with admin password)")
    public ResponseEntity<Void> deleteDepartment(
            @PathVariable Integer id,
            @RequestBody(required = false) DepartmentDeleteRequest request,
            Authentication auth) {
        String username = auth != null ? auth.getName() : null;
        departmentService.deleteDepartment(id, request, username);
        return ResponseEntity.noContent().build();
    }
}

