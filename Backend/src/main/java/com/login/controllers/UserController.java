package com.login.controllers;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.login.services.UserService;
import com.login.models.JwtResponse;
import com.login.models.OtpResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
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

    @PostMapping(value = "/request-otp", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OtpResponse> requestLoginOtp(@RequestBody OtpRequest request) {
        boolean otpSent = userService.sendLoginOtp(request.getEmail());
        if (otpSent) {
            OtpResponse response = new OtpResponse(true, "OTP sent to your email for login.", request.getEmail());
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);
        } else {
            OtpResponse response = new OtpResponse(false, "Failed to send OTP.", request.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);
        }
    }
    
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JwtResponse> loginWithOtp(@RequestBody LoginRequest request) {
        JwtResponse response = userService.authenticateUserWithOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<OtpResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        OtpResponse response = new OtpResponse(false, errorMessage, null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<OtpResponse> handleGenericExceptions(Exception ex) {
        String errorMessage = ex.getMessage();
        if (errorMessage != null && errorMessage.contains("Email")) {
            OtpResponse response = new OtpResponse(false, "Invalid email format. Email must end with @iiitl.ac.in", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);
        }
        OtpResponse response = new OtpResponse(false, "An error occurred: " + errorMessage, null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }
}