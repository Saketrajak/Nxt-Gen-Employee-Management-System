package com.iaip.ems.repository;

import com.iaip.ems.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {
    Optional<Employee> findByEmployeeCode(String employeeCode);
    boolean existsByEmployeeCode(String employeeCode);
    long countByStatus(String status);
    long countByDepartmentId(Integer departmentId);
    long countByDepartmentIdAndStatus(Integer departmentId, String status);

    List<Employee> findByDepartmentId(Integer departmentId);

    @Modifying
    @Query("DELETE FROM Employee e WHERE e.department.id = :departmentId")
    void deleteByDepartmentId(@Param("departmentId") Integer departmentId);
}
