package com.iaip.ems.repository;

import com.iaip.ems.entity.EmployeeTransferHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeTransferHistoryRepository extends JpaRepository<EmployeeTransferHistory, Long> {
    List<EmployeeTransferHistory> findByEmployeeIdOrderByTransferDateDescCreatedAtDesc(Long employeeId);
}
