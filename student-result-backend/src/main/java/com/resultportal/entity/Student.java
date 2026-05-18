package com.resultportal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a student enrolled in the institution.
 * A student can have results across multiple semesters.
 */
@Entity
@Table(
    name = "students",
    indexes = {
        @Index(name = "idx_students_roll_number", columnList = "roll_number", unique = true)
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "semesterResults")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique roll number assigned to each student.
     * Format: 10 uppercase alphanumeric characters (e.g., 22Q71A05A8)
     */
    @Column(name = "roll_number", nullable = false, unique = true, length = 10)
    @NotBlank(message = "Roll number is required")
    @Pattern(
        regexp = "^[A-Z0-9]{10}$",
        message = "Roll number must be exactly 10 uppercase alphanumeric characters"
    )
    private String rollNumber;

    @Column(name = "student_name", nullable = false, length = 150)
    @NotBlank(message = "Student name is required")
    private String studentName;

    /**
     * Branch / Department (e.g., CSE, ECE, MECH)
     */
    @Column(name = "branch", nullable = false, length = 100)
    @NotBlank(message = "Branch is required")
    private String branch;

    /**
     * Academic regulation year (e.g., R20, R22)
     */
    @Column(name = "regulation", nullable = false, length = 10)
    @NotBlank(message = "Regulation is required")
    private String regulation;

    /**
     * Cascade all semester result operations with this student.
     * orphanRemoval ensures deleted results are cleaned from DB.
     */
    @OneToMany(
        mappedBy = "student",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<SemesterResult> semesterResults = new ArrayList<>();

    // ---- Convenience helper ----

    /**
     * Adds a semester result and sets back-reference.
     */
    public void addSemesterResult(SemesterResult result) {
        semesterResults.add(result);
        result.setStudent(this);
    }

    /**
     * Removes a semester result and clears back-reference.
     */
    public void removeSemesterResult(SemesterResult result) {
        semesterResults.remove(result);
        result.setStudent(null);
    }
public String getRollNumber() {
    return rollNumber;
}

public String getStudentName() {
    return studentName;
}

public String getBranch() {
    return branch;
}

public String getRegulation() {
    return regulation;
}

public List<SemesterResult> getSemesterResults() {
    return semesterResults;
}
public void setRollNumber(String rollNumber) {
    this.rollNumber = rollNumber;
}

public void setStudentName(String studentName) {
    this.studentName = studentName;
}

public void setBranch(String branch) {
    this.branch = branch;
}

public void setRegulation(String regulation) {
    this.regulation = regulation;
}
}
