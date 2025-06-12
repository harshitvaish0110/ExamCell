package com.login.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {
    private static final Logger logger = LoggerFactory.getLogger(WhatsAppService.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${whatsapp.user-access-token}")
    private String userAccessToken;

    @Value("${whatsapp.version}")
    private String version;

    @Value("${whatsapp.phone-number-id}")
    private String phoneNumberId;

    private final RestTemplate restTemplate;
    private static final String BASE_URL = "https://graph.facebook.com";

    public WhatsAppService() {
        this.restTemplate = new RestTemplate();
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String token = userAccessToken;
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        headers.setBearerAuth(token);
        return headers;
    }

    public boolean sendTemplateMessage(Map<String, Object> request) {
        try {
            String url = String.format("%s/%s/%s/messages", BASE_URL, version, phoneNumberId);
            
            HttpHeaders headers = createHeaders();

            
            logger.info("Sending WhatsApp template message to URL: {}", url);
            logger.info("Request body: {}", objectMapper.writeValueAsString(request));
            logger.info("Using phone number ID: {}", phoneNumberId);
            logger.info("Using access token: {}", userAccessToken.substring(0, 10) + "...");

            
            if (!request.containsKey("to") || request.get("to") == null) {
                logger.error("Missing 'to' field in request");
                throw new IllegalArgumentException("Recipient phone number is required");
            }

            if (!request.containsKey("template") || request.get("template") == null) {
                logger.error("Missing 'template' field in request");
                throw new IllegalArgumentException("Template information is required");
            }

            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            var response = restTemplate.postForEntity(url, entity, String.class);
            
            logger.info("WhatsApp API Response: {}", response.getBody());
            return true;
        } catch (HttpClientErrorException e) {
            logger.error("WhatsApp API Error: {}", e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            logger.error("Error sending WhatsApp message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send WhatsApp message: " + e.getMessage(), e);
        }
    }

    public boolean sendTextMessage(Map<String, Object> request) {
        try {
            String url = String.format("%s/%s/%s/messages", BASE_URL, version, phoneNumberId);
            
            HttpHeaders headers = createHeaders();

            
            String prettyRequest = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(request);
            logger.info("Sending WhatsApp text message to URL: {}", url);
            logger.info("Request body:\n{}", prettyRequest);
            logger.info("Using phone number ID: {}", phoneNumberId);
            logger.info("Using access token: {}", userAccessToken.substring(0, 10) + "...");

            
            if (!request.containsKey("to") || request.get("to") == null) {
                logger.error("Missing 'to' field in request");
                throw new IllegalArgumentException("Recipient phone number is required");
            }

            if (!request.containsKey("type") || !"text".equals(request.get("type"))) {
                logger.error("Invalid or missing 'type' field in request");
                throw new IllegalArgumentException("Message type must be 'text'");
            }

            if (!request.containsKey("text") || request.get("text") == null) {
                logger.error("Missing 'text' field in request");
                throw new IllegalArgumentException("Text message information is required");
            }

            
            Map<String, Object> formattedRequest = new HashMap<>();
            formattedRequest.put("messaging_product", request.get("messaging_product"));
            formattedRequest.put("recipient_type", request.get("recipient_type"));
            formattedRequest.put("to", request.get("to"));
            formattedRequest.put("type", request.get("type"));
            formattedRequest.put("text", request.get("text"));

            
            String prettyFormattedRequest = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(formattedRequest);
            logger.info("Formatted request body:\n{}", prettyFormattedRequest);

            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(formattedRequest, headers);
            var response = restTemplate.postForEntity(url, entity, String.class);
            
            
            String prettyResponse = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(response.getBody());
            logger.info("WhatsApp API Response:\n{}", prettyResponse);
            return true;
        } catch (HttpClientErrorException e) {
            logger.error("WhatsApp API Error: Status code: {}, Response: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            logger.error("Error sending WhatsApp message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send WhatsApp message: " + e.getMessage(), e);
        }
    }
} 