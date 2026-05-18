package com.resultportal.repository;

import com.resultportal.entity.SemesterResult;
import com.resultportal.entity.SubjectResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for SubjectResult entity.
 */
@Repository
public interface SubjectResultRepository extends JpaRepository<SubjectResult, Long> {

    /**
     * Retrieve all subject results belonging to a specific semester result.
     *
     * @param semesterResult the parent semester result
     * @return list of subject results ordered by subject code
     */
    List<SubjectResult> findBySemesterResultOrderBySubjectCode(SemesterResult semesterResult);

    /**
     * Check whether any subject in a semester result has a FAIL status.
     * Used for certificate eligibility validation.
     *
     * @param semesterResult  the semester result to check
     * @param resultStatus    the status to look for (e.g. "FAIL")
     * @return true if at least one subject has the given status
     */
    boolean existsBySemesterResultAndResultStatus(SemesterResult semesterResult, String resultStatus);
}
