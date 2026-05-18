package com.resultportal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Represents the result of a single subject within a semester.
 * Stores marks, grade letter, and pass/fail status.
 */
@Entity
@Table(
    name = "subject_results",
    indexes = {
        @Index(name = "idx_subject_results_semester", columnList = "semester_result_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "semesterResult")
public class SubjectResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The semester result this subject belongs to.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_result_id", nullable = false)
    private SemesterResult semesterResult;

    /**
     * Subject code as per university curriculum (e.g., CS301).
     */
    @Column(name = "subject_code", nullable = false, length = 20)
    @NotBlank(message = "Subject code is required")
    private String subjectCode;

    /**
     * Full subject name (e.g., Data Structures and Algorithms).
     */
    @Column(name = "subject_name", nullable = false, length = 200)
    @NotBlank(message = "Subject name is required")
    private String subjectName;

    /**
     * Marks obtained (0–100).
     */
    @Column(name = "marks", nullable = false)
    @Min(value = 0, message = "Marks cannot be negative")
    @Max(value = 100, message = "Marks cannot exceed 100")
    private Integer marks;

    /**
     * Grade awarded (e.g., O, A+, A, B+, B, C, F).
     */
    @Column(name = "grade", nullable = false, length = 5)
    @NotBlank(message = "Grade is required")
    private String grade;

    /**
     * Individual subject result status: "PASS" or "FAIL".
     */
    @Column(name = "result_status", nullable = false, length = 10)
    @NotBlank(message = "Result status is required")
    private String resultStatus;

    public void setSemesterResult(SemesterResult semesterResult) {
        this.semesterResult = semesterResult;
    }

    public SemesterResult getSemesterResult() {
      return semesterResult;
    }
public String getSubjectCode() {
    return subjectCode;
}

public String getSubjectName() {
    return subjectName;
}

public Integer getMarks() {
    return marks;
}

public String getGrade() {
    return grade;
}

public String getResultStatus() {
    return resultStatus;
}
public void setSubjectCode(String subjectCode) {
    this.subjectCode = subjectCode;
}

public void setSubjectName(String subjectName) {
    this.subjectName = subjectName;
}

public void setMarks(Integer marks) {
    this.marks = marks;
}

public void setGrade(String grade) {
    this.grade = grade;
}

public void setResultStatus(String resultStatus) {
    this.resultStatus = resultStatus;
}
public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}
}
