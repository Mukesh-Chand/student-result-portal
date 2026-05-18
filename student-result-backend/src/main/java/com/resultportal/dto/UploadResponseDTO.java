package com.resultportal.dto;

public class UploadResponseDTO {

    private String message;
    private int studentsImported;
    private int semesterResultsImported;
    private int subjectResultsImported;

    public UploadResponseDTO() {
    }

    public UploadResponseDTO(String message,
                             int studentsImported,
                             int semesterResultsImported,
                             int subjectResultsImported) {
        this.message = message;
        this.studentsImported = studentsImported;
        this.semesterResultsImported = semesterResultsImported;
        this.subjectResultsImported = subjectResultsImported;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStudentsImported() {
        return studentsImported;
    }

    public void setStudentsImported(int studentsImported) {
        this.studentsImported = studentsImported;
    }

    public int getSemesterResultsImported() {
        return semesterResultsImported;
    }

    public void setSemesterResultsImported(int semesterResultsImported) {
        this.semesterResultsImported = semesterResultsImported;
    }

    public int getSubjectResultsImported() {
        return subjectResultsImported;
    }

    public void setSubjectResultsImported(int subjectResultsImported) {
        this.subjectResultsImported = subjectResultsImported;
    }
}