package com.resultportal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a student's result summary for one semester.
 * Holds SGPA, CGPA, and overall pass/fail status.
 */
@Entity
@Table(
    name = "semester_results",
    uniqueConstraints = {
        // A student can have only one result record per semester
        @UniqueConstraint(
            name = "uq_student_semester",
            columnNames = {"student_id", "semester_number"}
        )
    },
    indexes = {
        @Index(name = "idx_semester_results_student", columnList = "student_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"student", "subjectResults"})
public class SemesterResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The student this semester result belongs to.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    /**
     * Semester number (1–8).
     */
    @Column(name = "semester_number", nullable = false)
    @Min(value = 1, message = "Semester must be between 1 and 8")
    @Max(value = 8, message = "Semester must be between 1 and 8")
    private Integer semesterNumber;

    /**
     * Semester Grade Point Average (e.g., 8.45).
     */
    @Column(name = "sgpa", nullable = false)
    @DecimalMin(value = "0.0", message = "SGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "SGPA cannot exceed 10.0")
    private Double sgpa;

    @Column(name = "cgpa", nullable = false)
    @DecimalMin(value = "0.0", message = "CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "CGPA cannot exceed 10.0")
    private Double cgpa;

    /**
     * Overall semester result: "PASS" or "FAIL".
     */
    @Column(name = "overall_status", nullable = false, length = 10)
    @NotBlank(message = "Overall status is required")
    private String overallStatus;

    /**
     * Subject-wise results for this semester.
     */
    @OneToMany(
        mappedBy = "semesterResult",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<SubjectResult> subjectResults = new ArrayList<>();

    // ---- Convenience helper ----

    public void addSubjectResult(SubjectResult subject) {
        subjectResults.add(subject);
        subject.setSemesterResult(this);
    }

    public void removeSubjectResult(SubjectResult subject) {
        subjectResults.remove(subject);
        subject.setSemesterResult(null);
    }
    public void setStudent(Student student) {
        this.student = student;
    }
    public Student getStudent() {
        return student;
    }
public Integer getSemesterNumber() {
    return semesterNumber;
}

public Double getSgpa() {
    return sgpa;
}

public Double getCgpa() {
    return cgpa;
}

public String getOverallStatus() {
    return overallStatus;
}

public List<SubjectResult> getSubjectResults() {
    return subjectResults;
}
public void setSemesterNumber(Integer semesterNumber) {
    this.semesterNumber = semesterNumber;
}

public void setSgpa(Double sgpa) {
    this.sgpa = sgpa;
}

public void setCgpa(Double cgpa) {
    this.cgpa = cgpa;
}

public void setOverallStatus(String overallStatus) {
    this.overallStatus = overallStatus;
}
}
