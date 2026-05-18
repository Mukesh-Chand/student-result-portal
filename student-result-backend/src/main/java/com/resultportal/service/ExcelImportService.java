package com.resultportal.service;

import com.resultportal.dto.UploadResponseDTO;
import com.resultportal.entity.SemesterResult;
import com.resultportal.entity.Student;
import com.resultportal.entity.SubjectResult;
import com.resultportal.exception.ExcelImportException;
import com.resultportal.repository.SemesterResultRepository;
import com.resultportal.repository.StudentRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ExcelImportService {

    private final StudentRepository studentRepository;
    private final SemesterResultRepository semesterResultRepository;

    private static final Map<String, Integer> SEMESTER_MAP = new HashMap<>();

    static {
        SEMESTER_MAP.put("I-I", 1);
        SEMESTER_MAP.put("I-II", 2);
        SEMESTER_MAP.put("II-I", 3);
        SEMESTER_MAP.put("II-II", 4);
        SEMESTER_MAP.put("III-I", 5);
        SEMESTER_MAP.put("III-II", 6);
        SEMESTER_MAP.put("IV-I", 7);
        SEMESTER_MAP.put("IV-II", 8);
    }

    public ExcelImportService(StudentRepository studentRepository,
                              SemesterResultRepository semesterResultRepository) {
        this.studentRepository = studentRepository;
        this.semesterResultRepository = semesterResultRepository;
    }

    @Transactional
    public UploadResponseDTO importWorkbook(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new ExcelImportException("Excel file is empty");
        }

        int studentsImported = 0;
        int semesterResultsImported = 0;
        int subjectResultsImported = 0;

        Map<String, Double> cgpaMap = new HashMap<>();

        try (
                InputStream inputStream = file.getInputStream();
                Workbook workbook = new XSSFWorkbook(inputStream)
        ) {
            FormulaEvaluator evaluator =
                    workbook.getCreationHelper().createFormulaEvaluator();

            Sheet reportSheet = workbook.getSheet("Report");

            if (reportSheet != null) {
                for (int i = 1; i <= reportSheet.getLastRowNum(); i++) {
                    Row row = reportSheet.getRow(i);
                    if (row == null) continue;

                    String roll = getString(row.getCell(0), evaluator);
                    Double cgpa = getDouble(row.getCell(3), evaluator);

                    if (roll != null && cgpa != null) {
                        cgpaMap.put(roll.trim().toUpperCase(), cgpa);
                    }
                }
            }

            for (String sheetName : SEMESTER_MAP.keySet()) {

                Sheet sheet = workbook.getSheet(sheetName);

                if (sheet == null) continue;

                int semesterNumber = SEMESTER_MAP.get(sheetName);

                Row headerRow = sheet.getRow(0);

                if (headerRow == null) continue;

                int sgpaColumn = -1;
                int statusColumn = -1;

                for (int col = 0; col < headerRow.getLastCellNum(); col++) {
                    String header = getString(headerRow.getCell(col), evaluator);

                    if (header == null) continue;

                    header = header.trim().toUpperCase();

                    if ("SGPA".equals(header)) {
                        sgpaColumn = col;
                    }

                    if ("STATUS".equals(header)) {
                        statusColumn = col;
                    }
                }

                for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {

                    Row row = sheet.getRow(rowIndex);

                    if (row == null) continue;

                    String rollNumber = getString(row.getCell(0), evaluator);

                    if (rollNumber == null || rollNumber.isBlank()) {
                        continue;
                    }

                    rollNumber = rollNumber.trim().toUpperCase();

                    String studentName = getString(row.getCell(1), evaluator);

                    if (studentName == null || studentName.isBlank()) {
                        studentName = "Unknown";
                    }

                    Optional<Student> existingStudent =
                            studentRepository.findByRollNumber(rollNumber);

                    Student student;

                    if (existingStudent.isPresent()) {
                        student = existingStudent.get();
                    } else {
                        student = new Student();
                        student.setRollNumber(rollNumber);
                        student.setStudentName(studentName);
                        student.setBranch("CSE");
                        student.setRegulation("R22");

                        studentRepository.save(student);
                        studentsImported++;
                    }

                    semesterResultRepository
                            .findByStudentAndSemesterNumberWithSubjects(student, semesterNumber)
                            .ifPresent(existing -> {
                                semesterResultRepository.delete(existing);
                                semesterResultRepository.flush();
                            });

                    SemesterResult semesterResult = new SemesterResult();

                    semesterResult.setStudent(student);
                    semesterResult.setSemesterNumber(semesterNumber);

                    Double sgpa = sgpaColumn >= 0
                            ? getDouble(row.getCell(sgpaColumn), evaluator)
                            : 0.0;

                    Double cgpa = cgpaMap.getOrDefault(rollNumber, sgpa);

                    String status = statusColumn >= 0
                            ? getString(row.getCell(statusColumn), evaluator)
                            : "PASS";

                    semesterResult.setSgpa(sgpa);
                    semesterResult.setCgpa(cgpa);
                    semesterResult.setOverallStatus(status);

                    for (int col = 2; col < headerRow.getLastCellNum(); col++) {

                        if (col == sgpaColumn || col == statusColumn) {
                            continue;
                        }

                        String subjectName = getString(headerRow.getCell(col), evaluator);
                        String grade = getString(row.getCell(col), evaluator);

                        if (subjectName == null || grade == null || grade.isBlank()) {
                            continue;
                        }

                        SubjectResult subject = new SubjectResult();

                        subject.setSubjectCode("SUB" + col);
                        subject.setSubjectName(subjectName);
                        subject.setGrade(grade);
                        subject.setMarks(0);

                        if ("F".equalsIgnoreCase(grade)) {
                            subject.setResultStatus("FAIL");
                        } else {
                            subject.setResultStatus("PASS");
                        }

                        semesterResult.addSubjectResult(subject);
                        subjectResultsImported++;
                    }

                    semesterResultRepository.save(semesterResult);
                    semesterResultsImported++;
                }
            }

            UploadResponseDTO response = new UploadResponseDTO();
            response.setMessage("Import completed");
            response.setStudentsImported(studentsImported);
            response.setSemesterResultsImported(semesterResultsImported);
            response.setSubjectResultsImported(subjectResultsImported);

            return response;

        } catch (Exception ex) {
            throw new ExcelImportException("Import failed: " + ex.getMessage());
        }
    }

    private String getString(Cell cell, FormulaEvaluator evaluator) {
        if (cell == null) return null;

        try {
            if (cell.getCellType() == CellType.FORMULA) {
                CellValue value = evaluator.evaluate(cell);

                if (value == null) return null;

                if (value.getCellType() == CellType.STRING) {
                    return value.getStringValue();
                }

                if (value.getCellType() == CellType.NUMERIC) {
                    return String.valueOf(value.getNumberValue());
                }
            }

            if (cell.getCellType() == CellType.STRING) {
                return cell.getStringCellValue();
            }

            if (cell.getCellType() == CellType.NUMERIC) {
                return String.valueOf(cell.getNumericCellValue());
            }

        } catch (Exception ignored) {
        }

        return null;
    }

    private Double getDouble(Cell cell, FormulaEvaluator evaluator) {
        String value = getString(cell, evaluator);

        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            return Double.parseDouble(value);
        } catch (Exception ex) {
            return null;
        }
    }
}