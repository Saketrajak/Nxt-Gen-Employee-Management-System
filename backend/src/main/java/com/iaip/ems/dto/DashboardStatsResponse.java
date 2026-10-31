package com.iaip.ems.dto;

import java.util.List;

public class DashboardStatsResponse {

    private long totalEmployees;
    private long activeEmployees;
    private long departmentCount;
    private long transferCount;
    private List<DepartmentHeadcountResponse> departmentSummaries;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(
            long totalEmployees,
            long activeEmployees,
            long departmentCount,
            long transferCount,
            List<DepartmentHeadcountResponse> departmentSummaries) {
        this.totalEmployees = totalEmployees;
        this.activeEmployees = activeEmployees;
        this.departmentCount = departmentCount;
        this.transferCount = transferCount;
        this.departmentSummaries = departmentSummaries;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getActiveEmployees() {
        return activeEmployees;
    }

    public void setActiveEmployees(long activeEmployees) {
        this.activeEmployees = activeEmployees;
    }

    public long getDepartmentCount() {
        return departmentCount;
    }

    public void setDepartmentCount(long departmentCount) {
        this.departmentCount = departmentCount;
    }

    public long getTransferCount() {
        return transferCount;
    }

    public void setTransferCount(long transferCount) {
        this.transferCount = transferCount;
    }

    public List<DepartmentHeadcountResponse> getDepartmentSummaries() {
        return departmentSummaries;
    }

    public void setDepartmentSummaries(List<DepartmentHeadcountResponse> departmentSummaries) {
        this.departmentSummaries = departmentSummaries;
    }
}

