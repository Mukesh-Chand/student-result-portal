package com.resultportal.service;

import com.resultportal.dto.AdminLoginDTO;
import com.resultportal.dto.ResultResponseDTO;
import com.resultportal.dto.UpdateResultDTO;
import com.resultportal.entity.SemesterResult;
import com.resultportal.entity.Student;
import com.resultportal.entity.SubjectResult;
import com.resultportal.exception.ResultNotFoundException;
import com.resultportal.exception.StudentNotFoundException;
import com.resultportal.repository.SemesterResultRepository;
import com.resultportal.repository.StudentRepository;
import com.resultportal.repository.SubjectResultRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

@Service
public class AdminService {

    private final StudentRepository studentRepository;
    private final SemesterResultRepository semesterResultRepository;
    private final SubjectResultRepository subjectResultRepository;
    private final ResultService resultService;
    @Value("${admin.username}")
private String adminUsername;

@Value("${admin.password}")
private String adminPassword;

    public AdminService(
            StudentRepository studentRepository,
            SemesterResultRepository semesterResultRepository,
            SubjectResultRepository subjectResultRepository,
            ResultService resultService
    ) {
        this.studentRepository = studentRepository;
        this.semesterResultRepository = semesterResultRepository;
        this.subjectResultRepository = subjectResultRepository;
        this.resultService = resultService;
    }

    public String login(AdminLoginDTO dto) {
        if (adminUsername.equals(dto.getUsername()) &&
    adminPassword.equals(dto.getPassword())) {
    return "Login successful";
}

        throw new RuntimeException("Invalid admin credentials");
    }

    public ResultResponseDTO getEditableResult(String rollNumber, int semester) {

    ResultResponseDTO dto =
            resultService.getResult(rollNumber, semester, "ADMIN");

    ResultResponseDTO reportDto =
            resultService.getStudentReport(rollNumber);

    dto.setCgpa(reportDto.getCgpa());

    return dto;
}

    @Transactional
    public void updateResult(UpdateResultDTO dto) {

        Student student = studentRepository.findByRollNumber(
                dto.getRollNumber().trim().toUpperCase()
        ).orElseThrow(() ->
                new StudentNotFoundException("Student not found"));

        SemesterResult semesterResult = semesterResultRepository
                .findByStudentAndSemesterNumberWithSubjects(
                        student,
                        dto.getSemester()
                )
                .orElseThrow(() ->
                        new ResultNotFoundException("Result not found"));

        semesterResult.setSgpa(dto.getSgpa());
        semesterResult.setOverallStatus(dto.getOverallStatus());
        semesterResultRepository.findByStudent(student)
        .forEach(sem -> {
            sem.setCgpa(dto.getCgpa());
            semesterResultRepository.save(sem);
        });

        for (SubjectResult updatedSubject : semesterResult.getSubjectResults()) {

            dto.getSubjects().stream()
                    .filter(s -> s.getId().equals(updatedSubject.getId()))
                    .findFirst()
                    .ifPresent(subjectDTO -> {
                        updatedSubject.setSubjectCode(subjectDTO.getSubjectCode());
                        updatedSubject.setSubjectName(subjectDTO.getSubjectName());
                        updatedSubject.setMarks(subjectDTO.getMarks());
                        updatedSubject.setGrade(subjectDTO.getGrade());
                        updatedSubject.setResultStatus(subjectDTO.getResultStatus());

                        subjectResultRepository.save(updatedSubject);
                    });
        }

        semesterResultRepository.save(semesterResult);
    }
}