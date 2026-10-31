package com.iaip.ems.service;

import com.iaip.ems.dto.EmployeeTransferRequest;
import com.iaip.ems.dto.TransferHistoryResponse;
import com.iaip.ems.entity.Department;
import com.iaip.ems.entity.Employee;
import com.iaip.ems.entity.EmployeeTransferHistory;
import com.iaip.ems.exception.InvalidTransferException;
import com.iaip.ems.exception.ResourceNotFoundException;
import com.iaip.ems.repository.DepartmentRepository;
import com.iaip.ems.repository.EmployeeRepository;
import com.iaip.ems.repository.EmployeeTransferHistoryRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransferService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeTransferHistoryRepository transferHistoryRepository;
    private final EmployeeCodeGeneratorService codeGeneratorService;

    public TransferService(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            EmployeeTransferHistoryRepository transferHistoryRepository,
            EmployeeCodeGeneratorService codeGeneratorService) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.transferHistoryRepository = transferHistoryRepository;
        this.codeGeneratorService = codeGeneratorService;
    }

    /**
     * Executes atomic department transfer:
     * 1. Validates that new department is different from current.
     * 2. Generates new department employee code atomically.
     * 3. Updates employee's department and code while preserving employee ID.
     * 4. Logs full audit record in employee_transfer_history.
     * 5. Entire operation is enclosed in an ACID transaction.
     */
    @Transactional(rollbackFor = Exception.class)
    public TransferHistoryResponse transferEmployee(EmployeeTransferRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + request.getEmployeeId()));

        Department oldDepartment = employee.getDepartment();

        if (oldDepartment.getId().equals(request.getNewDepartmentId())) {
            throw new InvalidTransferException("Employee is already assigned to the " + oldDepartment.getName() + " department.");
        }

        Department newDepartment = departmentRepository.findById(request.getNewDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Target department not found with ID: " + request.getNewDepartmentId()));

        String oldEmployeeCode = employee.getEmployeeCode();

        // Generate next code in target department atomically
        String newEmployeeCode = codeGeneratorService.generateNextEmployeeCode(newDepartment.getId());

        // Update employee state (internal ID stays unchanged)
        employee.setDepartment(newDepartment);
        employee.setEmployeeCode(newEmployeeCode);
        employeeRepository.save(employee);

        // Record transfer history
        String transferredBy = "SYSTEM";
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            transferredBy = SecurityContextHolder.getContext().getAuthentication().getName();
        }

        EmployeeTransferHistory history = new EmployeeTransferHistory();
        history.setEmployee(employee);
        history.setOldDepartment(oldDepartment);
        history.setNewDepartment(newDepartment);
        history.setOldEmployeeCode(oldEmployeeCode);
        history.setNewEmployeeCode(newEmployeeCode);
        history.setTransferDate(request.getTransferDate());
        history.setReason(request.getReason());
        history.setTransferredBy(transferredBy);

        EmployeeTransferHistory savedHistory = transferHistoryRepository.save(history);
        return mapToHistoryResponse(savedHistory);
    }

    @Transactional(readOnly = true)
    public List<TransferHistoryResponse> getTransferHistoryForEmployee(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee not found with ID: " + employeeId);
        }
        return transferHistoryRepository.findByEmployeeIdOrderByTransferDateDescCreatedAtDesc(employeeId)
                .stream()
                .map(this::mapToHistoryResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransferHistoryResponse> getAllTransferHistory() {
        return transferHistoryRepository.findAllByOrderByTransferDateDescCreatedAtDesc()
                .stream()
                .map(this::mapToHistoryResponse)
                .collect(Collectors.toList());
    }

    public TransferHistoryResponse mapToHistoryResponse(EmployeeTransferHistory h) {
        TransferHistoryResponse res = new TransferHistoryResponse();
        res.setId(h.getId());
        res.setEmployeeId(h.getEmployee().getId());
        if (h.getEmployee().getPersonalDetails() != null) {
            res.setEmployeeName(h.getEmployee().getPersonalDetails().getFullName());
        }
        res.setOldDepartmentId(h.getOldDepartment().getId());
        res.setOldDepartmentName(h.getOldDepartment().getName());
        res.setNewDepartmentId(h.getNewDepartment().getId());
        res.setNewDepartmentName(h.getNewDepartment().getName());
        res.setOldEmployeeCode(h.getOldEmployeeCode());
        res.setNewEmployeeCode(h.getNewEmployeeCode());
        res.setTransferDate(h.getTransferDate());
        res.setReason(h.getReason());
        res.setTransferredBy(h.getTransferredBy());
        res.setCreatedAt(h.getCreatedAt());
        return res;
    }
}
