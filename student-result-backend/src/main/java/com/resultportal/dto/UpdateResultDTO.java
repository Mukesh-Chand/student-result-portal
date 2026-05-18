package com.resultportal.dto;

import java.util.List;

public class UpdateResultDTO {

    private String rollNumber;
    private int semester;
    private Double sgpa;
    private Double cgpa;
    private String overallStatus;
    private List<SubjectResultDTO> subjects;

    public UpdateResultDTO() {
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public Double getSgpa() {
        return sgpa;
    }

    public void setSgpa(Double sgpa) {
        this.sgpa = sgpa;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public String getOverallStatus() {
        return overallStatus;
    }

    public void setOverallStatus(String overallStatus) {
        this.overallStatus = overallStatus;
    }

    public List<SubjectResultDTO> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectResultDTO> subjects) {
        this.subjects = subjects;
    }
}