package com.login.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "whatsapp_otp")
@Data
public class WhatsAppOtp {
    
    @Id
    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String mobileNumber;

    @Column(nullable = false)
    private String otp;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean verified;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(createdAt.plusMinutes(10));
    }
} 