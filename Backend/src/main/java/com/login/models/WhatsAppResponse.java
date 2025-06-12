package com.login.models;

public class WhatsAppResponse {
    private boolean success;
    private String message;
    private String mobileNumber;
    private String errorDetails;

    public WhatsAppResponse(boolean success, String message, String mobileNumber) {
        this.success = success;
        this.message = message;
        this.mobileNumber = mobileNumber;
    }

    public WhatsAppResponse(boolean success, String message, String mobileNumber, String errorDetails) {
        this.success = success;
        this.message = message;
        this.mobileNumber = mobileNumber;
        this.errorDetails = errorDetails;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public String getErrorDetails() {
        return errorDetails;
    }
} 