package com.iaip.ems.dto;

public class DepartmentHeadcountResponse {

    private Integer departmentId;
    private String departmentName;
    private String codePrefix;
    private long totalCount;
    private long activeCount;

    public DepartmentHeadcountResponse() {
    }

    public DepartmentHeadcountResponse(
            Integer departmentId,
            String departmentName,
            String codePrefix,
            long totalCount,
            long activeCount) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.codePrefix = codePrefix;
        this.totalCount = totalCount;
        this.activeCount = activeCount;
    }

    public Integer getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Integer departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getCodePrefix() {
        return codePrefix;
    }

    public void setCodePrefix(String codePrefix) {
        this.codePrefix = codePrefix;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }

    public long getActiveCount() {
        return activeCount;
    }

    public void setActiveCount(long activeCount) {
        this.activeCount = activeCount;
    }
}

