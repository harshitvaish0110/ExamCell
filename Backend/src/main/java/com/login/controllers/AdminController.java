package com.login.controllers;

import com.login.entity.Admin;
import com.login.models.JwtResponse;
import com.login.models.OtpResponse;
import com.login.services.AdminService;
import com.login.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.Map;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    private static class OtpRequest {
        @NotBlank 
        @Email
        @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@iiitl\\.ac\\.in$", message = "Email must end with @iiitl.ac.in")
        private String email;

        public String getEmail() {
            return email;
        }
    }

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

    @PostMapping(value = "/request-otp", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OtpResponse> requestAdminOtp(@RequestBody OtpRequest request) {
        try {
            logger.info("Admin OTP requested for email: {}", request.getEmail());
            
            // Check if admin exists
            Admin admin = adminService.getAdminByEmail(request.getEmail());
            if (admin == null) {
                logger.warn("Admin not found for email: {}", request.getEmail());
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new OtpResponse(false, false, "Admin not found", request.getEmail()));
            }

            // Generate OTP
            String otp = adminService.generateOtp(request.getEmail());
            logger.info("Generated OTP for admin {}: {}", request.getEmail(), otp);
            
            // Send OTP via email
            boolean emailOtpSent = false;
            try {
                emailOtpSent = adminService.sendLoginOtp(request.getEmail(), otp);
                logger.info("Email OTP sent successfully to admin {}", request.getEmail());
            } catch (Exception e) {
                logger.error("Failed to send email OTP to admin: {}", e.getMessage());
            }
            
            if (emailOtpSent) {
                OtpResponse response = new OtpResponse(
                    true,
                    false,
                    "OTP sent successfully via email",
                    request.getEmail()
                );
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(response);
            } else {
                OtpResponse response = new OtpResponse(
                    false,
                    false,
                    "Failed to send OTP via email",
                    request.getEmail()
                );
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(response);
            }
        } catch (Exception e) {
            logger.error("Error sending admin OTP: {}", e.getMessage(), e);
            OtpResponse response = new OtpResponse(
                false,
                false,
                "Failed to send OTP: " + e.getMessage(),
                request.getEmail()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);
        }
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> loginWithOtpAndPassword(@RequestBody LoginRequest request) {
        try {
            logger.info("Admin login attempt for email: {}", request.getEmail());
            
            JwtResponse response = adminService.authenticateAdminWithOtpAndPassword(
                request.getEmail(), 
                request.getPassword(), 
                request.getOtp()
            );
            
            logger.info("Admin login successful for email: {}", request.getEmail());
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
        } catch (Exception e) {
            logger.error("Admin login failed for email {}: {}", request.getEmail(), e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .contentType(MediaType.APPLICATION_JSON)
                .body(errorResponse);
        }
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

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<OtpResponse> handleGenericExceptions(Exception ex) {
        String errorMessage = ex.getMessage();
        if (errorMessage != null && errorMessage.contains("Email")) {
            OtpResponse response = new OtpResponse(false, false, "Invalid email format. Email must end with @iiitl.ac.in", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);
        }
        OtpResponse response = new OtpResponse(false, false, "An error occurred: " + errorMessage, null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }
}
