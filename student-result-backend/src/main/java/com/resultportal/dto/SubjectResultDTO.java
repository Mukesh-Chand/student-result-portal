package com.resultportal.dto;

public class SubjectResultDTO {

    private String subjectCode;
    private String subjectName;
    private Integer marks;
    private String grade;
    private String resultStatus;
    private Long id;

    public SubjectResultDTO() {}

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public Integer getMarks() { return marks; }
    public void setMarks(Integer marks) { this.marks = marks; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getResultStatus() { return resultStatus; }
    public void setResultStatus(String resultStatus) { this.resultStatus = resultStatus; }

    public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}
}