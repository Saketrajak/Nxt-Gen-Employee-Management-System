package com.iaip.ems.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "employee_code_sequences")
public class EmployeeCodeSequence {

    @Id
    @Column(name = "department_id")
    private Integer departmentId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "current_sequence", nullable = false)
    private Integer currentSequence = 0;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public EmployeeCodeSequence() {
    }

    public EmployeeCodeSequence(Integer departmentId, Integer currentSequence) {
        this.departmentId = departmentId;
        this.currentSequence = currentSequence;
        this.updatedAt = OffsetDateTime.now();
    }

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public Integer getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Integer departmentId) {
        this.departmentId = departmentId;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Integer getCurrentSequence() {
        return currentSequence;
    }

    public void setCurrentSequence(Integer currentSequence) {
        this.currentSequence = currentSequence;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
