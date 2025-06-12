package com.login.models;

public class JwtResponse {
    private String token;
    private String email;
    private String message;
    private boolean hasWhatsAppNumber;
    private String whatsAppNumber;

    public JwtResponse() {
    }

    public JwtResponse(String token, String email, String message) {
        this.token = token;
        this.email = email;
        this.message = message;
        this.hasWhatsAppNumber = false;
    }

    public JwtResponse(String token, String email, String message, boolean hasWhatsAppNumber, String whatsAppNumber) {
        this.token = token;
        this.email = email;
        this.message = message;
        this.hasWhatsAppNumber = hasWhatsAppNumber;
        this.whatsAppNumber = whatsAppNumber;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isHasWhatsAppNumber() {
        return hasWhatsAppNumber;
    }

    public String getWhatsAppNumber() {
        return whatsAppNumber;
    }
} 