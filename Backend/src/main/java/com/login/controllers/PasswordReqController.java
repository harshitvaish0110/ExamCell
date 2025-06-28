package com.login.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.login.entity.Log;
import com.login.entity.PasswordRequest;
import com.login.models.JwtUtil;
import com.login.repositories.PasswordReqRepository;
import com.login.services.AdminService;
import com.login.services.PasswordReqService;

import lombok.Data;
import lombok.NoArgsConstructor;

@RestController
@RequestMapping("/api/password-requests")
@CrossOrigin(origins = "*") // Allow frontend to connect (adjust in production)
public class PasswordReqController {

    @Autowired
    private PasswordReqRepository passwordReqRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordReqService passwordReqService;

    @Autowired
    private AdminService adminService;

    @GetMapping
    public ResponseEntity<?> getAllPasswordRequests() {
        if (passwordReqRepository.count() == 0) {
            return ResponseEntity.ok("No password requests found");
        }
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(passwordReqRepository.findAll());
    }

    @GetMapping("/export-csv")
    public ResponseEntity<?> exportPasswordRequestsCSV() {
        try {
            byte[] csvData = adminService.generatePasswordRequestsCSV();
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header("Content-Disposition", "attachment; filename=\"password_requests.csv\"")
                .body(csvData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body("Error generating CSV: " + e.getMessage());
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getPasswordRequest(@PathVariable String email) {
        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body("Email cannot be null or empty");
        }
        PasswordRequest pq = passwordReqRepository.findById(email).orElse(null);
        if (pq == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.APPLICATION_JSON)
                .body("No password request found for email: " + email);
        }
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(pq);
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deletePasswordRequest(@RequestBody PasswordRequestReq preq) {
        Boolean response = jwtUtil.validateToken(preq.getToken(), preq.getEmail()) || jwtUtil.validateToken(preq.getToken(), preq.getAdminMail());
        if (response) {
            passwordReqService.deleteRequest(preq.getEmail());
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body("Password request deleted successfully for email: " + preq.getEmail());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .contentType(MediaType.APPLICATION_JSON)
            .body("Invalid token or email mismatch");
    }

    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createPasswordRequest(@RequestBody PasswordRequestReq preq) {
        Boolean response = jwtUtil.validateToken(preq.getToken(), preq.getEmail());
        if (response) {
            PasswordRequest passwordRequest = new PasswordRequest();
            passwordRequest.setEmail(preq.getEmail());
            passwordRequest.setReason(preq.getReason());
            passwordRequest.setPassword(preq.getPassword());
            passwordReqService.createRequest(passwordRequest);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .contentType(MediaType.APPLICATION_JSON)
            .body("Invalid token or email mismatch");
    }

    @PostMapping(value = "/accept", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> acceptPasswordRequest(@RequestBody PasswordRequestReq preq) {
        Boolean response = jwtUtil.validateToken(preq.getToken(), preq.getAdminMail());
        if (response) {
            Boolean result = adminService.existsByEmail(preq.getAdminMail());
            if (result) {
                // Accept the password request
                Log log = new Log();
                log.setUser("Admin");
                log.setMessage("Accepted password request for email: " + preq.getEmail());
                passwordReqRepository.deleteById(preq.getEmail());
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("Password request accepted for email: " + preq.getEmail());
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .contentType(MediaType.APPLICATION_JSON)
                .body("You do not have permission to accept this request");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .contentType(MediaType.APPLICATION_JSON)
            .body("Invalid token or email mismatch");
    }

    @Data
    @NoArgsConstructor
    public static class PasswordRequestReq {
        private String email;
        private String adminMail = null;
        private String token;
        private String reason = null;
        private String password = null;
    }
}
