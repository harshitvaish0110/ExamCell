package com.login.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_otp")
public class AdminOtp {
    @Id
    @Column(name = "email")
    private String email;

    @Column(name = "otp")
    private String otp;

    @Column(name = "otp_created_at")
    private LocalDateTime otpCreatedAt;

    public AdminOtp() {}

    public AdminOtp(String email, String otp, LocalDateTime otpCreatedAt) {
        this.email = email;
        this.otp = otp;
        this.otpCreatedAt = otpCreatedAt;
    }

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

    public LocalDateTime getOtpCreatedAt() {
        return otpCreatedAt;
    }

    public void setOtpCreatedAt(LocalDateTime otpCreatedAt) {
        this.otpCreatedAt = otpCreatedAt;
    }

    public boolean isOtpExpired() {
        return otpCreatedAt == null || LocalDateTime.now().isAfter(otpCreatedAt.plusMinutes(10));
    }
} 