package com.login.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "bonafide_certificates")
public class BonafideCertificate {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID uid;

    private String studentName;
    private String enrollmentNumber;
    private String course;
    private String semester;
    private String purpose;
    private LocalDateTime generatedAt;
    private LocalDateTime expiresAt;
    private boolean isActive;
    private boolean isApproved;
} 