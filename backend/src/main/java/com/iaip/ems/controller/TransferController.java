package com.iaip.ems.controller;

import com.iaip.ems.dto.EmployeeTransferRequest;
import com.iaip.ems.dto.TransferHistoryResponse;
import com.iaip.ems.service.TransferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfers")
@Tag(name = "Department Transfer", description = "APIs for initiating employee department transfers and tracking transfer history")
@SecurityRequirement(name = "BearerAuth")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Transfer employee to a new department, generating new code and logging history")
    public ResponseEntity<TransferHistoryResponse> transferEmployee(@Valid @RequestBody EmployeeTransferRequest request) {
        TransferHistoryResponse response = transferService.transferEmployee(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get historical transfer records for a specific employee")
    public ResponseEntity<List<TransferHistoryResponse>> getTransferHistory(@PathVariable Long employeeId) {
        List<TransferHistoryResponse> history = transferService.getTransferHistoryForEmployee(employeeId);
        return ResponseEntity.ok(history);
    }

    @GetMapping
    @Operation(summary = "Get all department transfer audit records across the organization")
    public ResponseEntity<List<TransferHistoryResponse>> getAllTransfers() {
        List<TransferHistoryResponse> history = transferService.getAllTransferHistory();
        return ResponseEntity.ok(history);
    }
}
