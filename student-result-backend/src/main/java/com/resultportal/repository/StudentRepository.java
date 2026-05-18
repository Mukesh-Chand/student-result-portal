package com.resultportal.repository;

import com.resultportal.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Student entity.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Find a student by their unique roll number.
     *
     * @param rollNumber 10-character alphanumeric roll number
     * @return Optional containing the student if found
     */
    Optional<Student> findByRollNumber(String rollNumber);

    /**
     * Check whether a student with the given roll number exists.
     *
     * @param rollNumber 10-character alphanumeric roll number
     * @return true if exists
     */
    boolean existsByRollNumber(String rollNumber);
}
