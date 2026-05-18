package com.resultportal.controller;

import com.resultportal.dto.ResultResponseDTO;
import com.resultportal.service.ResultService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping
    public ResponseEntity<ResultResponseDTO> getResult(
            @RequestParam String rollNumber,
            @RequestParam int semester,
            HttpServletRequest request
    ) {
        String clientIp = request.getRemoteAddr();

        ResultResponseDTO response =
                resultService.getResult(rollNumber, semester, clientIp);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/report/{rollNumber}")
    public ResponseEntity<ResultResponseDTO> getStudentReport(
            @PathVariable String rollNumber
    ) {
        ResultResponseDTO response =
                resultService.getStudentReport(rollNumber);

        return ResponseEntity.ok(response);
    }
}