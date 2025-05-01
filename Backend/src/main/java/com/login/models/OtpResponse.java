package com.login.models;
import jakarta.persistence.*;
import lombok.Builder.Default;

@Entity
@Table(name = "otp_response")
public class OtpResponse {
    @Column(name = "success", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean success;
    @Column(name = "message")
    private String message;
    @Id
    @Column(name = "email", unique = true)
    private String email;

    
    public OtpResponse() {
    }
    
    public OtpResponse(boolean success, String message, String email) {
        this.success = success;
        this.message = message;
        this.email = email;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
} 