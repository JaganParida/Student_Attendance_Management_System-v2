package com.attendance.system.repository;

import com.attendance.system.dto.response.TodayClassDTO;
import com.attendance.system.entity.ClassEntity;
import com.attendance.system.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // --- Admin Methods ---
    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.teacher LEFT JOIN FETCH c.classEntity WHERE c.active = true")
    List<Course> findAllActiveWithDetails();
    
    @Query("SELECT COUNT(c) FROM Course c WHERE c.active = true")
    long countAllCourses();

    // --- Teacher Methods ---
    List<Course> findByTeacherId(Long teacherId);
    
    long countByTeacherId(Long teacherId);

    // ✅ UPDATED: Added ORDER BY c.startTime ASC so classes show in correct time order
    @Query("SELECT new com.attendance.system.dto.response.TodayClassDTO(" +
           "c.id, c.courseName, c.courseCode, " +
           "c.startTime, c.endTime, c.classRoom, " +
           "c.classEntity.semester, c.classEntity.section) " +
           "FROM Course c WHERE c.teacher.id = :teacherId " +
           "AND c.dayOfWeek = :dayOfWeek " +  
           "AND c.active = true " +
           "ORDER BY c.startTime ASC")
    List<TodayClassDTO> findTodayClassesByTeacherId(@Param("teacherId") Long teacherId, 
                                                    @Param("dayOfWeek") DayOfWeek dayOfWeek);

    // --- Student/Class Methods ---
    List<Course> findByClassEntity(ClassEntity classEntity);
}