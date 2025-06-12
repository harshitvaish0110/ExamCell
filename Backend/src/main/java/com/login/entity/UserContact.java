package com.login.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_contacts")
@Data
public class UserContact {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String whatsappNumber;

    @Column(nullable = false)
    private boolean verified;
} 