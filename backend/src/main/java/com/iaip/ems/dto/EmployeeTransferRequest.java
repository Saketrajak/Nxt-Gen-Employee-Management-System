package com.iaip.ems.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class EmployeeTransferRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "New Department ID is required")
    private Integer newDepartmentId;

    @NotNull(message = "Transfer Date is required")
    private LocalDate transferDate;

    @NotBlank(message = "Transfer reason is required")
    private String reason;

    public EmployeeTransferRequest() {
    }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Integer getNewDepartmentId() { return newDepartmentId; }
    public void setNewDepartmentId(Integer newDepartmentId) { this.newDepartmentId = newDepartmentId; }

    public LocalDate getTransferDate() { return transferDate; }
    public void setTransferDate(LocalDate transferDate) { this.transferDate = transferDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
