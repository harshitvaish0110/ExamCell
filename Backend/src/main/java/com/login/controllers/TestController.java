package com.login.controllers;

import com.login.services.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @Autowired
    private FirebaseService firebaseService;

    @PostMapping("/send-notification")
    public ResponseEntity<?> sendTestNotification(@RequestBody Map<String, String> request) {
        try {
            logger.info("Received test notification request: {}", request);
            
            String token = request.get("token");
            String title = request.get("title");
            String body = request.get("body");
            
            if (token == null || title == null || body == null) {
                logger.warn("Missing required fields: token={}, title={}, body={}", token, title, body);
                return ResponseEntity.badRequest().body(Map.of(
                    "status", "error", 
                    "message", "token, title, and body are required"
                ));
            }
            
            logger.info("Attempting to send test notification to token: {}...", 
                       token.substring(0, Math.min(20, token.length())) + "...");
            
            boolean result = firebaseService.sendTestNotification(token, title, body);
            
            if (result) {
                logger.info("Test notification sent successfully");
                return ResponseEntity.ok(Map.of(
                    "status", "success", 
                    "message", "Test notification sent successfully"
                ));
            } else {
                logger.error("Failed to send test notification");
                return ResponseEntity.status(500).body(Map.of(
                    "status", "error", 
                    "message", "Failed to send test notification - check Firebase configuration"
                ));
            }
            
        } catch (Exception e) {
            logger.error("Error in sendTestNotification: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                "status", "error", 
                "message", "Error: " + e.getMessage(),
                "details", "Check Firebase service account configuration"
            ));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        logger.info("Health check endpoint called");
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Firebase notification service is running",
            "timestamp", System.currentTimeMillis()
        ));
    }

    @GetMapping("/firebase-status")
    public ResponseEntity<?> firebaseStatus() {
        try {
            logger.info("Checking Firebase status...");
            // Try to get Firebase instance to test configuration
            if (firebaseService != null) {
                return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Firebase service is available",
                    "firebaseService", "initialized"
                ));
            } else {
                return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "Firebase service is not available"
                ));
            }
        } catch (Exception e) {
            logger.error("Error checking Firebase status: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Firebase configuration error: " + e.getMessage()
            ));
        }
    }
} 