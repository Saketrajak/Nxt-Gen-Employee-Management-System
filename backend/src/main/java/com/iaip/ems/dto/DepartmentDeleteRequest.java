package com.iaip.ems.dto;

public class DepartmentDeleteRequest {

    private String adminPassword;

    public DepartmentDeleteRequest() {
    }

    public DepartmentDeleteRequest(String adminPassword) {
        this.adminPassword = adminPassword;
    }

    public String getAdminPassword() {
        return adminPassword;
    }

    public void setAdminPassword(String adminPassword) {
        this.adminPassword = adminPassword;
    }
}
