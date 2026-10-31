package com.iaip.ems.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class DepartmentCreateRequest {

    @NotBlank(message = "Department name is required")
    @Size(max = 100, message = "Department name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Department code prefix is required")
    @Pattern(regexp = "^[A-Za-z]{1,5}$", message = "Code prefix must be 1 to 5 alphabetical letters (e.g. IT, OPS, L)")
    private String codePrefix;

    private String description;

    public DepartmentCreateRequest() {
    }

    public DepartmentCreateRequest(String name, String codePrefix, String description) {
        this.name = name;
        this.codePrefix = codePrefix;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCodePrefix() {
        return codePrefix;
    }

    public void setCodePrefix(String codePrefix) {
        this.codePrefix = codePrefix;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
