package com.resultportal.dto;

import java.util.List;

public class ResultResponseDTO {

    private String studentName;
    private String rollNumber;
    private String branch;
    private String regulation;
    private Integer semester;
    private Double sgpa;
    private Double cgpa;
    private String overallStatus;
    private List<SubjectResultDTO> subjects;
    private Integer totalBacklogs;
    private List<SemesterReportDTO> semesterReports;

    public ResultResponseDTO() {}

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getRegulation() { return regulation; }
    public void setRegulation(String regulation) { this.regulation = regulation; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Double getSgpa() { return sgpa; }
    public void setSgpa(Double sgpa) { this.sgpa = sgpa; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public List<SubjectResultDTO> getSubjects() { return subjects; }
    public void setSubjects(List<SubjectResultDTO> subjects) { this.subjects = subjects; }

    public Integer getTotalBacklogs() {
    return totalBacklogs;
}

public void setTotalBacklogs(Integer totalBacklogs) {
    this.totalBacklogs = totalBacklogs;
}

public List<SemesterReportDTO> getSemesterReports() {
    return semesterReports;
}

public void setSemesterReports(List<SemesterReportDTO> semesterReports) {
    this.semesterReports = semesterReports;
}
}