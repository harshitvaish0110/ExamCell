package com.login.dto;

import lombok.Data;

@Data
public class BonafideRequest {
    private String studentName;
    private String email;
    private String course;
    private String semester;
    private String purpose;
} 