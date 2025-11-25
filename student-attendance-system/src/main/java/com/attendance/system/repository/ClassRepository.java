package com.attendance.system.repository;

import com.attendance.system.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, Long> {

    Optional<ClassEntity> findByClassNameAndSectionAndAcademicYear(String className, String section, String academicYear);

    List<ClassEntity> findByAcademicYear(String academicYear);

    @Query("SELECT COUNT(c) FROM ClassEntity c")
    Long countAllClasses();
}
