package com.login.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class SignRequest {
    private UUID uid;
    private String token;
    private String email;
}
