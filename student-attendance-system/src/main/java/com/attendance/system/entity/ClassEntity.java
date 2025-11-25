package com.attendance.system.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties({"students", "courses"}) // ✅ Prevents infinite JSON recursion
@Entity
@Table(name = "classes")
public class ClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_name", nullable = false)
    private String className;

    @Column(name = "section", nullable = false)
    private String section;

    @Column(name = "academic_year", nullable = false)
    private String academicYear;

    @Column(name = "semester")
    private String semester;

    @OneToMany(mappedBy = "classEntity", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("classEntity") // ✅ Avoid cyclic loop
    private List<Student> students = new ArrayList<>();

    @OneToMany(mappedBy = "classEntity", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("classEntity") // ✅ Avoid cyclic loop
    private List<Course> courses = new ArrayList<>();

    public ClassEntity() {}

    public ClassEntity(String className, String section, String academicYear) {
        this.className = className;
        this.section = section;
        this.academicYear = academicYear;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public List<Student> getStudents() { return students; }
    public void setStudents(List<Student> students) { this.students = students; }

    public List<Course> getCourses() { return courses; }
    public void setCourses(List<Course> courses) { this.courses = courses; }
}
