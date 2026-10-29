package com.iaip.ems.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "employee_transfer_history")
public class EmployeeTransferHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "old_department_id", nullable = false)
    private Department oldDepartment;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "new_department_id", nullable = false)
    private Department newDepartment;

    @Column(name = "old_employee_code", nullable = false, length = 20)
    private String oldEmployeeCode;

    @Column(name = "new_employee_code", nullable = false, length = 20)
    private String newEmployeeCode;

    @Column(name = "transfer_date", nullable = false)
    private LocalDate transferDate;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "transferred_by", length = 100)
    private String transferredBy;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    public EmployeeTransferHistory() {
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Department getOldDepartment() {
        return oldDepartment;
    }

    public void setOldDepartment(Department oldDepartment) {
        this.oldDepartment = oldDepartment;
    }

    public Department getNewDepartment() {
        return newDepartment;
    }

    public void setNewDepartment(Department newDepartment) {
        this.newDepartment = newDepartment;
    }

    public String getOldEmployeeCode() {
        return oldEmployeeCode;
    }

    public void setOldEmployeeCode(String oldEmployeeCode) {
        this.oldEmployeeCode = oldEmployeeCode;
    }

    public String getNewEmployeeCode() {
        return newEmployeeCode;
    }

    public void setNewEmployeeCode(String newEmployeeCode) {
        this.newEmployeeCode = newEmployeeCode;
    }

    public LocalDate getTransferDate() {
        return transferDate;
    }

    public void setTransferDate(LocalDate transferDate) {
        this.transferDate = transferDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getTransferredBy() {
        return transferredBy;
    }

    public void setTransferredBy(String transferredBy) {
        this.transferredBy = transferredBy;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
