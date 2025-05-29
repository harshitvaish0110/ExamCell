package com.login.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class BonafideResponse {
    private UUID uid;
    private String studentName;
    private String email;
    private String enrollmentNumber;
    private String course;
    private String semester;
    private String purpose;
    private LocalDateTime generatedAt;
    private LocalDateTime expiresAt;
    private boolean isActive;
    private boolean isApproved;
} 