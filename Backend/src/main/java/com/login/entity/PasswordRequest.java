package com.login.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "password_requests")
@Data
public class PasswordRequest {
    @Id
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Reason is required")
    private String reason;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;

    @NotBlank(message = "New password is required")
    private String password;
}
