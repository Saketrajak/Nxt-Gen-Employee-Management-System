package com.iaip.ems.repository;

import com.iaip.ems.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    Optional<Department> findByName(String name);
    Optional<Department> findByCodePrefix(String codePrefix);

    boolean existsByNameIgnoreCase(String name);
    boolean existsByCodePrefixIgnoreCase(String codePrefix);

    @Query("SELECT COUNT(d) > 0 FROM Department d WHERE UPPER(d.name) = UPPER(:name) AND d.id <> :id")
    boolean existsByNameIgnoreCaseAndDifferentId(@Param("name") String name, @Param("id") Integer id);

    @Query("SELECT COUNT(d) > 0 FROM Department d WHERE UPPER(d.codePrefix) = UPPER(:prefix) AND d.id <> :id")
    boolean existsByCodePrefixIgnoreCaseAndDifferentId(@Param("prefix") String prefix, @Param("id") Integer id);
}
