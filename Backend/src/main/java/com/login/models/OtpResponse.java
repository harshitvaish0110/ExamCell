package com.login.models;
import jakarta.persistence.*;

@Entity
@Table(name = "otp_response")
public class OtpResponse {
    @Column(name = "mail_success", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean mailSuccess;

    @Column(name = "whatsapp_success", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean whatsappSuccess;

    @Column(name = "message")
    private String message;

    @Id
    @Column(name = "email", unique = true)
    private String email;

    public OtpResponse() {
    }
    
    public OtpResponse(boolean mailSuccess, boolean whatsappSuccess, String message, String email) {
        this.mailSuccess = mailSuccess;
        this.whatsappSuccess = whatsappSuccess;
        this.message = message;
        this.email = email;
    }
    
    public boolean isMailSuccess() {
        return mailSuccess;
    }
    
    public void setMailSuccess(boolean mailSuccess) {
        this.mailSuccess = mailSuccess;
    }

    public boolean isWhatsappSuccess() {
        return whatsappSuccess;
    }
    
    public void setWhatsappSuccess(boolean whatsappSuccess) {
        this.whatsappSuccess = whatsappSuccess;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
} 