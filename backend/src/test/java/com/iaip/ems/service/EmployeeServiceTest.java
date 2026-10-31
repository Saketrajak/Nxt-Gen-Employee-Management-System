package com.iaip.ems.service;

import com.iaip.ems.dto.EmployeeCreateRequest;
import com.iaip.ems.dto.EmployeeUpdateRequest;
import com.iaip.ems.exception.DuplicateResourceException;
import com.iaip.ems.repository.DepartmentRepository;
import com.iaip.ems.repository.EmployeePersonalDetailsRepository;
import com.iaip.ems.repository.EmployeeRepository;
import com.iaip.ems.repository.RoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private EmployeePersonalDetailsRepository personalDetailsRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private EmployeeCodeGeneratorService codeGeneratorService;

    @Mock
    private TransferService transferService;

    private EmployeeService employeeService;

    @BeforeEach
    void setUp() {
        employeeService = new EmployeeService(
                employeeRepository,
                personalDetailsRepository,
                departmentRepository,
                roleRepository,
                codeGeneratorService,
                transferService
        );
    }

    @Test
    @DisplayName("Should normalize Aadhaar with hyphens and PAN to uppercase")
    void testNormalization() {
        assertEquals("1234-5678-9012", employeeService.normalizeAadhaar("123456789012"));
        assertEquals("1234-5678-9012", employeeService.normalizeAadhaar("1234-5678-9012"));
        assertEquals("ABCDE1234F", employeeService.normalizePan("abcde1234f"));
        assertEquals("ABCDE1234F", employeeService.normalizePan("  ABCDE1234F  "));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException with field 'aadhaarNumber' when Aadhaar is duplicate on create")
    void testDuplicateAadhaarOnCreate() {
        EmployeeCreateRequest request = new EmployeeCreateRequest();
        request.setFullName("Test Candidate");
        request.setEmail("unique.test@iaip.gov.in");
        request.setMobile("9876543210");
        request.setAadhaarNumber("1234-5678-9012");
        request.setPanNumber("ABCDE1234F");
        request.setDepartmentId(1);
        request.setRoleId(3);
        request.setJoiningDate(LocalDate.now());
        request.setAnnualSalary(new BigDecimal("500000.00"));

        when(personalDetailsRepository.existsByEmail("unique.test@iaip.gov.in")).thenReturn(false);
        when(personalDetailsRepository.existsByAadhaarNumber("1234-5678-9012")).thenReturn(true);

        DuplicateResourceException ex = assertThrows(DuplicateResourceException.class, () -> {
            employeeService.createEmployee(request);
        });

        assertEquals("aadhaarNumber", ex.getField());
        assertTrue(ex.getMessage().contains("Aadhaar"));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException with field 'panNumber' when PAN is duplicate on create")
    void testDuplicatePanOnCreate() {
        EmployeeCreateRequest request = new EmployeeCreateRequest();
        request.setFullName("Test Candidate");
        request.setEmail("unique.test2@iaip.gov.in");
        request.setMobile("9876543210");
        request.setAadhaarNumber("9999-8888-7777");
        request.setPanNumber("ABCDE1234F");
        request.setDepartmentId(1);
        request.setRoleId(3);
        request.setJoiningDate(LocalDate.now());
        request.setAnnualSalary(new BigDecimal("500000.00"));

        when(personalDetailsRepository.existsByEmail("unique.test2@iaip.gov.in")).thenReturn(false);
        when(personalDetailsRepository.existsByAadhaarNumber("9999-8888-7777")).thenReturn(false);
        when(personalDetailsRepository.existsByPanNumberIgnoreCase("ABCDE1234F")).thenReturn(true);

        DuplicateResourceException ex = assertThrows(DuplicateResourceException.class, () -> {
            employeeService.createEmployee(request);
        });

        assertEquals("panNumber", ex.getField());
        assertTrue(ex.getMessage().contains("PAN"));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException with field 'email' when Email is duplicate on create")
    void testDuplicateEmailOnCreate() {
        EmployeeCreateRequest request = new EmployeeCreateRequest();
        request.setFullName("Test Candidate");
        request.setEmail("duplicate@iaip.gov.in");
        request.setAadhaarNumber("9999-8888-7777");
        request.setPanNumber("ABCDE1234F");

        when(personalDetailsRepository.existsByEmail("duplicate@iaip.gov.in")).thenReturn(true);

        DuplicateResourceException ex = assertThrows(DuplicateResourceException.class, () -> {
            employeeService.createEmployee(request);
        });

        assertEquals("email", ex.getField());
        assertTrue(ex.getMessage().contains("email"));
    }
}

