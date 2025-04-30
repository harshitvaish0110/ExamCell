package com.login.controllers;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<String> handleError(HttpServletRequest request) {
        Integer statusCode = (Integer) request.getAttribute("jakarta.servlet.error.status_code");
        Exception exception = (Exception) request.getAttribute("jakarta.servlet.error.exception");
        
        String errorMessage = statusCode == 404 
            ? "The requested resource was not found" 
            : "An error occurred: " + (exception != null ? exception.getMessage() : "Unknown error");
        
        return new ResponseEntity<>(errorMessage, HttpStatus.valueOf(statusCode != null ? statusCode : 500));
    }
} 