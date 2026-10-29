package com.iaip.ems.repository;

import com.iaip.ems.entity.EmployeeCodeSequence;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeCodeSequenceRepository extends JpaRepository<EmployeeCodeSequence, Integer> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM EmployeeCodeSequence s WHERE s.departmentId = :deptId")
    Optional<EmployeeCodeSequence> findByDepartmentIdForUpdate(@Param("deptId") Integer deptId);

    Optional<EmployeeCodeSequence> findByDepartmentId(Integer deptId);
}
