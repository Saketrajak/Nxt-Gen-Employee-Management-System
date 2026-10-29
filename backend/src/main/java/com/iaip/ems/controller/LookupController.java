package com.iaip.ems.controller;

import com.iaip.ems.dto.DepartmentResponse;
import com.iaip.ems.dto.RoleResponse;
import com.iaip.ems.service.LookupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lookup")
@Tag(name = "Lookup Data", description = "Endpoints for retrieving static reference data (Departments, Roles, Code Previews)")
public class LookupController {

    private final LookupService lookupService;

    public LookupController(LookupService lookupService) {
        this.lookupService = lookupService;
    }

    @GetMapping("/departments")
    @Operation(summary = "Get all configured departments")
    public ResponseEntity<List<DepartmentResponse>> getDepartments() {
        return ResponseEntity.ok(lookupService.getAllDepartments());
    }

    @GetMapping("/roles")
    @Operation(summary = "Get all configured roles")
    public ResponseEntity<List<RoleResponse>> getRoles() {
        return ResponseEntity.ok(lookupService.getAllRoles());
    }

    @GetMapping("/preview-code/{departmentId}")
    @Operation(summary = "Preview the next available employee code for a given department")
    public ResponseEntity<Map<String, String>> previewNextCode(@PathVariable Integer departmentId) {
        String nextCode = lookupService.previewNextCode(departmentId);
        return ResponseEntity.ok(Map.of("nextEmployeeCode", nextCode));
    }
}
