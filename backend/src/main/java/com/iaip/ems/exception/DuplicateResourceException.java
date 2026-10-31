package com.iaip.ems.exception;

public class DuplicateResourceException extends RuntimeException {

    private String field;

    public DuplicateResourceException(String message) {
        super(message);
    }

    public DuplicateResourceException(String field, String message) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
