package com.iaip.ems.dto;

public class DepartmentResponse {
    private Integer id;
    private String name;
    private String codePrefix;
    private String description;

    public DepartmentResponse() {
    }

    public DepartmentResponse(Integer id, String name, String codePrefix, String description) {
        this.id = id;
        this.name = name;
        this.codePrefix = codePrefix;
        this.description = description;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCodePrefix() { return codePrefix; }
    public void setCodePrefix(String codePrefix) { this.codePrefix = codePrefix; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
