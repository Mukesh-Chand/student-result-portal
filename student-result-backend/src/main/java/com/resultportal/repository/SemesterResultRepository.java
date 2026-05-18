package com.resultportal.repository;

import com.resultportal.entity.SemesterResult;
import com.resultportal.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for SemesterResult entity.
 */
@Repository
public interface SemesterResultRepository extends JpaRepository<SemesterResult, Long> {

    /**
     * Find a semester result for a specific student and semester number.
     * Uses JOIN FETCH to eagerly load subject results in one query,
     * avoiding N+1 selects when building the response DTO.
     *
     * @param student        the student entity
     * @param semesterNumber semester (1–8)
     * @return Optional containing the semester result if found
     */
    @Query("""
            SELECT sr FROM SemesterResult sr
            LEFT JOIN FETCH sr.subjectResults
            WHERE sr.student = :student
              AND sr.semesterNumber = :semesterNumber
            """)
    Optional<SemesterResult> findByStudentAndSemesterNumberWithSubjects(
            @Param("student") Student student,
            @Param("semesterNumber") Integer semesterNumber
    );

    /**
     * Retrieve all semester results for a student, with subjects eagerly loaded.
     * Used by the certificate-eligibility check.
     *
     * @param student the student entity
     * @return list of all semester results (may be empty)
     */
    @Query("""
            SELECT sr FROM SemesterResult sr
            LEFT JOIN FETCH sr.subjectResults
            WHERE sr.student = :student
            ORDER BY sr.semesterNumber
            """)
    List<SemesterResult> findAllByStudentWithSubjects(@Param("student") Student student);

    /**
     * Count how many semester results exist for a given student.
     *
     * @param student the student entity
     * @return count of semester records
     */
    List<SemesterResult> findByStudent(Student student);
    long countByStudent(Student student);
}
