package com.iaip.ems.repository;

import com.iaip.ems.entity.EmployeePersonalDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeePersonalDetailsRepository extends JpaRepository<EmployeePersonalDetails, Long> {
    Optional<EmployeePersonalDetails> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT COUNT(p) > 0 FROM EmployeePersonalDetails p WHERE p.email = :email AND p.employee.id <> :empId")
    boolean existsByEmailAndDifferentEmployee(@Param("email") String email, @Param("empId") Long empId);

    boolean existsByAadhaarNumber(String aadhaarNumber);

    @Query("SELECT COUNT(p) > 0 FROM EmployeePersonalDetails p WHERE p.aadhaarNumber = :aadhaarNumber AND p.employee.id <> :empId")
    boolean existsByAadhaarNumberAndDifferentEmployee(@Param("aadhaarNumber") String aadhaarNumber, @Param("empId") Long empId);

    boolean existsByPanNumberIgnoreCase(String panNumber);

    @Query("SELECT COUNT(p) > 0 FROM EmployeePersonalDetails p WHERE UPPER(p.panNumber) = UPPER(:panNumber) AND p.employee.id <> :empId")
    boolean existsByPanNumberAndDifferentEmployee(@Param("panNumber") String panNumber, @Param("empId") Long empId);
}
