package com.iaip.ems.service;

import com.iaip.ems.entity.Department;
import com.iaip.ems.entity.EmployeeCodeSequence;
import com.iaip.ems.exception.ResourceNotFoundException;
import com.iaip.ems.repository.DepartmentRepository;
import com.iaip.ems.repository.EmployeeCodeSequenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeCodeGeneratorService {

    private final EmployeeCodeSequenceRepository sequenceRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeCodeGeneratorService(
            EmployeeCodeSequenceRepository sequenceRepository,
            DepartmentRepository departmentRepository) {
        this.sequenceRepository = sequenceRepository;
        this.departmentRepository = departmentRepository;
    }

    /**
     * Atomically generates the next unique employee code for a department
     * using pessimistic row-level locking (SELECT ... FOR UPDATE).
     * Format: Prefix + 4-digit sequence (e.g. I0001, H0002)
     */
    @Transactional(propagation = Propagation.MANDATORY)
    public String generateNextEmployeeCode(Integer departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + departmentId));

        EmployeeCodeSequence sequence = sequenceRepository.findByDepartmentIdForUpdate(departmentId)
                .orElseGet(() -> {
                    EmployeeCodeSequence newSeq = new EmployeeCodeSequence(departmentId, 0);
                    newSeq.setDepartment(department);
                    return sequenceRepository.saveAndFlush(newSeq);
                });

        int nextSeq = sequence.getCurrentSequence() + 1;
        sequence.setCurrentSequence(nextSeq);
        sequenceRepository.save(sequence);

        return String.format("%s%04d", department.getCodePrefix().toUpperCase(), nextSeq);
    }

    /**
     * Preview the next employee code for a department (read-only query)
     */
    @Transactional(readOnly = true)
    public String previewNextEmployeeCode(Integer departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + departmentId));

        int current = sequenceRepository.findByDepartmentId(departmentId)
                .map(EmployeeCodeSequence::getCurrentSequence)
                .orElse(0);

        return String.format("%s%04d", department.getCodePrefix().toUpperCase(), current + 1);
    }
}
