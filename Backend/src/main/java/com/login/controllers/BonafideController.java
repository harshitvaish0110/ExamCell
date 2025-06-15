package com.login.controllers;

import com.login.dto.BonafideRequest;
import com.login.dto.BonafideResponse;
import com.login.dto.SignRequest;
import com.login.entity.BonafideCertificate;
import com.login.models.JwtUtil;
import com.login.services.AdminService;
import com.login.services.BonafideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
// import java.io.IOException;
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

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AdminService adminService;

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

    @PostMapping("/sign")
    public ResponseEntity<?> signCertificate(@RequestBody SignRequest request) {
        Boolean admin = false;
        Boolean valid = jwtUtil.validateToken(request.getToken(), request.getEmail());
        if (valid) {
            admin = adminService.existsByEmail(request.getEmail());
        }
        if (!valid || !admin) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Not Authorized to Sign the Certificate");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        bonafideService.signCertificate(request.getUid());
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

    @GetMapping("/all")
    public ResponseEntity<?> getAllCertificates() {
        try {
            List<BonafideCertificate> certificates = bonafideService.getAllCertificates();
            return ResponseEntity.ok(certificates);
        } catch (ResponseStatusException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "No certificates");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            throw e;
        }
    }
} 