package com.login.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public String welcome() {
        return "Welcome to IIITL Student Login API\n" +
               "Available endpoints:\n" +
               "- /api/request-otp - Get OTP for login (any email ending with @iiitl.ac.in)\n" +
               "- /api/login - Authenticate with email and OTP\n\n" +
               "Note: Any valid @iiitl.ac.in email will be accepted";
    }
} 