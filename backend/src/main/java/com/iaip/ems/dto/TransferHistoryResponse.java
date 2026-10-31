package com.iaip.ems.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public class TransferHistoryResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private Integer oldDepartmentId;
    private String oldDepartmentName;
    private Integer newDepartmentId;
    private String newDepartmentName;
    private String oldEmployeeCode;
    private String newEmployeeCode;
    private LocalDate transferDate;
    private String reason;
    private String transferredBy;
    private OffsetDateTime createdAt;

    public TransferHistoryResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public Integer getOldDepartmentId() { return oldDepartmentId; }
    public void setOldDepartmentId(Integer oldDepartmentId) { this.oldDepartmentId = oldDepartmentId; }

    public String getOldDepartmentName() { return oldDepartmentName; }
    public void setOldDepartmentName(String oldDepartmentName) { this.oldDepartmentName = oldDepartmentName; }

    public Integer getNewDepartmentId() { return newDepartmentId; }
    public void setNewDepartmentId(Integer newDepartmentId) { this.newDepartmentId = newDepartmentId; }

    public String getNewDepartmentName() { return newDepartmentName; }
    public void setNewDepartmentName(String newDepartmentName) { this.newDepartmentName = newDepartmentName; }

    public String getOldEmployeeCode() { return oldEmployeeCode; }
    public void setOldEmployeeCode(String oldEmployeeCode) { this.oldEmployeeCode = oldEmployeeCode; }

    public String getNewEmployeeCode() { return newEmployeeCode; }
    public void setNewEmployeeCode(String newEmployeeCode) { this.newEmployeeCode = newEmployeeCode; }

    public LocalDate getTransferDate() { return transferDate; }
    public void setTransferDate(LocalDate transferDate) { this.transferDate = transferDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getTransferredBy() { return transferredBy; }
    public void setTransferredBy(String transferredBy) { this.transferredBy = transferredBy; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
