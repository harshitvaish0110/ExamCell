package com.login.controllers;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.login.services.UserService;
import com.login.models.JwtResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;

@RestController
@RequestMapping("/api")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    // Request body class for OTP request
    private static class OtpRequest {
        @NotBlank 
        @Email
        @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@iiitl\\.ac\\.in$", message = "Email must end with @iiitl.ac.in")
        private String email;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    // Request body class for login
    private static class LoginRequest {
        @NotBlank 
        @Email
        @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@iiitl\\.ac\\.in$", message = "Email must end with @iiitl.ac.in")
        private String email;
        
        @NotBlank
        private String otp;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }

    @PostMapping("/request-otp")
    public ResponseEntity<String> requestLoginOtp(@RequestBody OtpRequest request) {
        boolean otpSent = userService.sendLoginOtp(request.getEmail());
        if (otpSent) {
            return ResponseEntity.ok("OTP sent to your email for login.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to send OTP.");
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> loginWithOtp(@RequestBody LoginRequest request) {
        JwtResponse response = userService.authenticateUserWithOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok(response);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericExceptions(Exception ex) {
        String errorMessage = ex.getMessage();
        if (errorMessage != null && errorMessage.contains("Email")) {
            return new ResponseEntity<>("Invalid email format. Email must end with @iiitl.ac.in", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("An error occurred: " + errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}