package com.login.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.project.id}")
    private String firebaseProjectId;

    @Bean
    public FirebaseMessaging firebaseMessaging() throws IOException {
        try {
            logger.info("Initializing Firebase Admin SDK...");
            
            if (FirebaseApp.getApps().isEmpty()) {
                // Initialize Firebase Admin SDK
                logger.info("Loading Firebase service account file...");
                InputStream serviceAccount = new ClassPathResource("firebase-service-account.json").getInputStream();
                
                logger.info("Building Firebase options with project ID: {}", firebaseProjectId);
                FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setProjectId(firebaseProjectId)
                    .build();

                logger.info("Initializing Firebase app...");
                FirebaseApp.initializeApp(options);
                logger.info("Firebase Admin SDK initialized successfully!");
            } else {
                logger.info("Firebase app already initialized, using existing instance.");
            }
            
            FirebaseMessaging messaging = FirebaseMessaging.getInstance();
            logger.info("Firebase Messaging instance created successfully!");
            return messaging;
            
        } catch (Exception e) {
            logger.error("Failed to initialize Firebase Admin SDK: {}", e.getMessage(), e);
            throw e;
        }
    }
} 