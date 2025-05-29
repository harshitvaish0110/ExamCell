package com.login.controllers;

import com.login.dto.BonafideRequest;
import com.login.dto.BonafideResponse;
import com.login.service.BonafideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/bonafide")
public class BonafideController {
    @Autowired
    private BonafideService bonafideService;

    @PostMapping("/generate")
    public ResponseEntity<BonafideResponse> generateCertificate(@RequestBody BonafideRequest request) {
        BonafideResponse response = bonafideService.generateCertificate(
            request.getStudentName(),
            request.getEmail(),
            request.getCourse(),
            request.getSemester(),
            request.getPurpose());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{uid}")
    public ResponseEntity<?> downloadCertificate(@PathVariable UUID uid) {
        try {
            Resource resource = bonafideService.downloadCertificate(uid);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
        } catch (ResponseStatusException e) {
            if (e.getStatusCode() == HttpStatus.FORBIDDEN) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Certificate is not approved yet. Please wait for approval before downloading.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            } else if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Certificate not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Certificate has expired");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            throw e;
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/approve/{uid}")
    public ResponseEntity<?> approveCertificate(@PathVariable UUID uid) {
        bonafideService.approveCertificate(uid);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/uid/{rollNo}")
    public ResponseEntity<?> getCertificatesByRollNo(@PathVariable String rollNo) {
        try {
            List<Map<String, Object>> certificates = bonafideService.getCertificatesByRollNo(rollNo);
            Map<String, Object> response = new HashMap<>();
            response.put("certificates", certificates);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "No certificates found for the given roll number");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            throw e;
        }
    }
} 