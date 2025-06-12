package com.login.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "students")
@Data
public class Student {
    
    @Id
    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String mobileNumber;
} 