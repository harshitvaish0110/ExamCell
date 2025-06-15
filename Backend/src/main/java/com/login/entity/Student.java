package com.login.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "students")
@Data
public class Student {
    
    @Id
    @Column(nullable = false, unique = true)
    private String email;

    private String mobileNumber;

    @Column(nullable = false, unique = true)
    private String rollNumber;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String program;

    @Column(nullable = false)
    private String course;

    @Column(nullable = false)
    private String semester;

    @Column(nullable = false)
    private String purpose;
} 