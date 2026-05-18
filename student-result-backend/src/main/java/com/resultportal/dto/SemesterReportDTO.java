package com.resultportal.dto;

public class SemesterReportDTO {

    private int semester;
    private Double sgpa;
    private int backlogs;

    public SemesterReportDTO() {
    }

    public SemesterReportDTO(int semester, Double sgpa, int backlogs) {
        this.semester = semester;
        this.sgpa = sgpa;
        this.backlogs = backlogs;
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

    public int getBacklogs() {
        return backlogs;
    }

    public void setBacklogs(int backlogs) {
        this.backlogs = backlogs;
    }
}