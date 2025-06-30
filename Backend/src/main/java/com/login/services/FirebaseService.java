package com.login.services;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushNotification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@Service
public class FirebaseService {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseService.class);

    @Autowired
    private FirebaseMessaging firebaseMessaging;

    public boolean sendNotification(String token, String title, String body) {
        if (token == null || token.isEmpty()) {
            logger.warn("Firebase token is null or empty, skipping notification");
            return false;
        }

        try {
            logger.info("Sending Firebase notification to token: {}...", 
                       token.substring(0, Math.min(20, token.length())) + "...");
            
            // Create data payload
            Map<String, String> data = new HashMap<>();
            data.put("title", title);
            data.put("body", body);
            data.put("timestamp", String.valueOf(System.currentTimeMillis()));
            data.put("click_action", "FLUTTER_NOTIFICATION_CLICK");

            // Build the message with both notification and data
            Message message = Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build())
                .putAllData(data)
                .setWebpushConfig(WebpushConfig.builder()
                    .setNotification(WebpushNotification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .setIcon("/vite.svg")
                        .setBadge("/vite.svg")
                        .setRequireInteraction(true)
                        .build())
                    .putAllData(data)
                    .build())
                .build();

            logger.info(" Sending message to Firebase...");
            String response = firebaseMessaging.send(message);
            logger.info("Firebase notification sent successfully. Message ID: {}", response);
            return true;
            
        } catch (Exception e) {
            logger.error("Error sending Firebase notification: {}", e.getMessage(), e);
            return false;
        }
    }

    public boolean sendCertificateSignedNotification(String token, String studentName, String enrollmentNumber) {
        String title = " Certificate Signed!";
        String body = String.format("Your bonafide certificate has been signed by the admin. Student: %s (%s)", 
                                   studentName, enrollmentNumber);
        
        logger.info(" Sending certificate signed notification for student: {} ({})", studentName, enrollmentNumber);
        
        return sendNotification(token, title, body);
    }

    public boolean sendTestNotification(String token, String title, String body) {
        logger.info("Sending test notification to token: {}...", 
                   token.substring(0, Math.min(20, token.length())) + "...");
        
        return sendNotification(token, title, body);
    }
} 