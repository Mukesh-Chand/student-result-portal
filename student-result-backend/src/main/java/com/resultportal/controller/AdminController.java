package com.resultportal.controller;

import com.resultportal.dto.UploadResponseDTO;
import com.resultportal.service.ExcelImportService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.resultportal.dto.AdminLoginDTO;
import com.resultportal.dto.ResultResponseDTO;
import com.resultportal.dto.UpdateResultDTO;
import com.resultportal.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ExcelImportService excelImportService;
    private final AdminService adminService;

    public AdminController(
        ExcelImportService excelImportService,
        AdminService adminService
) {
    this.excelImportService = excelImportService;
    this.adminService = adminService;
}

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResponseDTO> uploadExcel(
            @RequestParam("file") MultipartFile file
    ) {
        UploadResponseDTO response = excelImportService.importWorkbook(file);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/login")
public ResponseEntity<String> login(@RequestBody AdminLoginDTO dto) {
    return ResponseEntity.ok(adminService.login(dto));
}

@GetMapping("/result")
public ResponseEntity<ResultResponseDTO> getEditableResult(
        @RequestParam String rollNumber,
        @RequestParam int semester
) {
    return ResponseEntity.ok(
            adminService.getEditableResult(rollNumber, semester)
    );
}

@PutMapping("/result")
public ResponseEntity<String> updateResult(
        @RequestBody UpdateResultDTO dto
) {
    adminService.updateResult(dto);
    return ResponseEntity.ok("Result updated successfully");
}
}