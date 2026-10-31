package com.iaip.ems.repository;

import com.iaip.ems.entity.EmployeeTransferHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeTransferHistoryRepository extends JpaRepository<EmployeeTransferHistory, Long> {
    List<EmployeeTransferHistory> findByEmployeeIdOrderByTransferDateDescCreatedAtDesc(Long employeeId);
    List<EmployeeTransferHistory> findAllByOrderByTransferDateDescCreatedAtDesc();

    @Modifying
    @Query("DELETE FROM EmployeeTransferHistory h WHERE h.oldDepartment.id = :deptId OR h.newDepartment.id = :deptId")
    void deleteByDepartmentInvolvement(@Param("deptId") Integer deptId);

    @Modifying
    @Query("DELETE FROM EmployeeTransferHistory h WHERE h.employee.department.id = :deptId")
    void deleteByEmployeeDepartment(@Param("deptId") Integer deptId);
}
