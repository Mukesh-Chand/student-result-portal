package com.resultportal.service;

import com.resultportal.dto.ResultResponseDTO;
import com.resultportal.dto.SubjectResultDTO;
import com.resultportal.entity.SemesterResult;
import com.resultportal.entity.Student;
import com.resultportal.entity.SubjectResult;
import com.resultportal.exception.ResultNotFoundException;
import com.resultportal.exception.StudentNotFoundException;
import com.resultportal.repository.SemesterResultRepository;
import com.resultportal.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import com.resultportal.dto.SemesterReportDTO;
import java.util.ArrayList;

@Service
public class ResultService {

    private final StudentRepository studentRepository;
    private final SemesterResultRepository semesterResultRepository;

    private static final Pattern ROLL_PATTERN =
            Pattern.compile("^[A-Z0-9]{10}$");

    public ResultService(StudentRepository studentRepository,
                         SemesterResultRepository semesterResultRepository) {
        this.studentRepository = studentRepository;
        this.semesterResultRepository = semesterResultRepository;
    }

    @Transactional(readOnly = true)
    public ResultResponseDTO getResult(String rollNumber, int semester, String clientIp) {

        String normalized = rollNumber.trim().toUpperCase();

        if (!ROLL_PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Invalid roll number format");
        }

        Student student = studentRepository.findByRollNumber(normalized)
                .orElseThrow(() ->
                        new StudentNotFoundException("Student not found"));

        SemesterResult semesterResult = semesterResultRepository
                .findByStudentAndSemesterNumberWithSubjects(student, semester)
                .orElseThrow(() ->
                        new ResultNotFoundException("Result not found"));

        return mapToDTO(student, semesterResult);
    }

    @Transactional(readOnly = true)
public ResultResponseDTO getStudentReport(String rollNumber) {

    String normalized = rollNumber.trim().toUpperCase();

    if (!ROLL_PATTERN.matcher(normalized).matches()) {
        throw new IllegalArgumentException("Invalid roll number format");
    }

    Student student = studentRepository.findByRollNumber(normalized)
            .orElseThrow(() ->
                    new StudentNotFoundException("Student not found"));

    List<SemesterResult> semesterResults =
        semesterResultRepository.findByStudent(student)
                .stream()
                .sorted((a, b) -> Integer.compare(
                        a.getSemesterNumber(),
                        b.getSemesterNumber()
                ))
                .toList();

    List<SemesterReportDTO> reports = new ArrayList<>();

    double totalSgpa = 0;
    int totalBacklogs = 0;

    for (SemesterResult sem : semesterResults) {

        int backlogCount = sem.getSubjectResults().stream()
                .filter(s -> s.getSubjectName().equalsIgnoreCase("Backlogs"))
                .findFirst()
                .map(s -> Integer.parseInt(s.getGrade()))
                .orElse(0);

        reports.add(new SemesterReportDTO(
                sem.getSemesterNumber(),
                sem.getSgpa(),
                backlogCount
        ));

        totalSgpa += sem.getSgpa();
        totalBacklogs += backlogCount;
    }

    ResultResponseDTO dto = new ResultResponseDTO();

    dto.setStudentName(student.getStudentName());
    dto.setRollNumber(student.getRollNumber());
    dto.setBranch(student.getBranch());
    dto.setRegulation(student.getRegulation());
    dto.setCgpa(totalSgpa / semesterResults.size());
    dto.setTotalBacklogs(totalBacklogs);
    dto.setOverallStatus(totalBacklogs == 0 ? "PASS" : "FAIL");
    dto.setSemesterReports(reports);

    return dto;
}

    private ResultResponseDTO mapToDTO(Student student, SemesterResult semesterResult) {

        List<SubjectResultDTO> subjects = semesterResult.getSubjectResults()
                .stream()
                .map(this::mapSubject)
                .collect(Collectors.toList());

        ResultResponseDTO dto = new ResultResponseDTO();

        dto.setStudentName(student.getStudentName());
        dto.setRollNumber(student.getRollNumber());
        dto.setBranch(student.getBranch());
        dto.setRegulation(student.getRegulation());
        dto.setSemester(semesterResult.getSemesterNumber());
        dto.setSgpa(semesterResult.getSgpa());
        dto.setCgpa(semesterResult.getCgpa());
        dto.setOverallStatus(semesterResult.getOverallStatus());
        dto.setSubjects(subjects);

        return dto;
    }

    private SubjectResultDTO mapSubject(SubjectResult subject) {
        SubjectResultDTO dto = new SubjectResultDTO();

        dto.setId(subject.getId());
        dto.setSubjectCode(subject.getSubjectCode());
        dto.setSubjectName(subject.getSubjectName());
        dto.setMarks(subject.getMarks());
        dto.setGrade(subject.getGrade());
        dto.setResultStatus(subject.getResultStatus());

        return dto;
    }
}