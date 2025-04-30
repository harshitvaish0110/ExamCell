package com.login.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class UserEntity {
    
    @Id
    @Column(name = "email_id")
    private String emailId;
    
    @Column(name = "otp")
    private String otp;
    
    @Column(name = "otp_created_at")
    private LocalDateTime otpCreatedAt;
    
    public UserEntity() {
    }
    
    public UserEntity(String emailId, String otp, LocalDateTime otpCreatedAt) {
        this.emailId = emailId;
        this.otp = otp;
        this.otpCreatedAt = otpCreatedAt;
    }
    
    public String getEmailId() {
        return emailId;
    }
    
    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }
    
    public String getOtp() {
        return otp;
    }
    
    public void setOtp(String otp) {
        this.otp = otp;
    }
    
    public LocalDateTime getOtpCreatedAt() {
        return otpCreatedAt;
    }
    
    public void setOtpCreatedAt(LocalDateTime otpCreatedAt) {
        this.otpCreatedAt = otpCreatedAt;
    }
    
    public boolean isOtpExpired() {
        // OTP is valid for 10 minutes
        return LocalDateTime.now().isAfter(otpCreatedAt.plusMinutes(10));
    }
} 