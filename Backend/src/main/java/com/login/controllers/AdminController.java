package com.login.controllers;

import com.login.entity.Admin;
import com.login.models.JwtResponse;
import com.login.services.AdminService;
import com.login.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*") // Allow frontend to connect (adjust in production)
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    private static class LoginRequest {
        @NotBlank 
        @Email
        @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@iiitl\\.ac\\.in$", message = "Email must end with @iiitl.ac.in")
        private String email;

        @NotBlank
        private String password;
        
        @NotBlank
        private String otp;

        public String getEmail() {
            return email;
        }

        public String getOtp() {
            return otp;
        }

        public String getPassword() {
            return password;
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getStudentByEmail(@PathVariable @Email String email) {
        Admin admin = adminService.getAdminByEmail(email.toLowerCase());
        if (admin != null) {
            return ResponseEntity.ok(admin);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> loginWithOtpAndPassword(@RequestBody LoginRequest request) {
        JwtResponse response = adminService.authenticateAdminWithOtpAndPassword(request.getEmail(), request.getPassword(), request.getOtp());
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(response);
    }

    @GetMapping("/students/csv")
    public ResponseEntity<byte[]> downloadStudentsCSV() {
        byte[] csvBytes = adminService.generateStudentsCSV();
        return ResponseEntity
                .ok()
                .header("Content-Disposition", "attachment; filename=students.csv")
                .header("Content-Type", "text/csv")
                .body(csvBytes);
    }

    @DeleteMapping("/students/{rollNumber}")
    public ResponseEntity<?> deleteStudent(@PathVariable String rollNumber) {
        try {
            adminService.deleteStudentByRollNumber(rollNumber);
            return ResponseEntity.ok("Student deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestAdminOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        String otp = adminService.generateOtp(email);
        adminService.sendLoginOtp(email, otp);
        return ResponseEntity.ok("OTP sent to admin's registered mobile number or email.");
    }
}
