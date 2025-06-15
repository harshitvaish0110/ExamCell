package com.login.controllers;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.login.services.UserService;
// import com.login.services.WhatsAppService;
import com.login.models.JwtResponse;
import com.login.models.OtpResponse;
// import com.login.models.WhatsAppResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
// import org.springframework.web.client.HttpClientErrorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
// import java.util.Map;
// import java.util.HashMap;
// import com.login.services.StudentService;
// import com.login.entity.Student;
import com.login.models.JwtUtil;
// import com.login.entity.WhatsAppOtp;
// import com.login.repositories.WhatsAppOtpRepository;
// import com.login.entity.UserContact;
// import java.time.LocalDateTime;
// import java.util.Optional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@Validated
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    // @Autowired
    // private WhatsAppService whatsAppService;

    // @Autowired
    // private StudentService studentService;

    @Autowired
    private JwtUtil jwtUtil;

    // @Autowired
    // private WhatsAppOtpRepository whatsAppOtpRepository;

    
    private static class OtpRequest {
        @NotBlank 
        @Email
        @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@iiitl\\.ac\\.in$", message = "Email must end with @iiitl.ac.in")
        private String email;

        // private String messaging_product;
        // private String recipient_type;
        // private String to;
        // private String type;
        // private Map<String, Object> text;

        public String getEmail() {
            return email;
        }

        // public String getMessagingProduct() {
        //     return messaging_product;
        // }

        // public String getRecipientType() {
        //     return recipient_type;
        // }

        // public String getTo() {
        //     return to;
        // }

        // public String getType() {
        //     return type;
        // }

        // public Map<String, Object> getText() {
        //     return text;
        // }
    }


    private static class VerifyTokenRequest {
        @NotBlank 
        @Email
        @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@iiitl\\.ac\\.in$", message = "Email must end with @iiitl.ac.in")
        private String email;
        private String token;

        public String getEmail() {
            return email;
        }
        public String getToken() {
            return token;
        }
    }

    
    // private static class WhatsAppOtpRequest {
    //     @NotBlank 
    //     @Email
    //     @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@iiitl\\.ac\\.in$", message = "Email must end with @iiitl.ac.in")
    //     private String email;

    //     @NotBlank
    //     @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    //     private String mobileNumber;

    //     public String getEmail() {
    //         return email;
    //     }

    //     public String getMobileNumber() {
    //         return mobileNumber;
    //     }
    // }

    
    private static class LoginRequest {
        @NotBlank 
        @Email
        @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@iiitl\\.ac\\.in$", message = "Email must end with @iiitl.ac.in")
        private String email;
        
        @NotBlank
        private String otp;

        public String getEmail() {
            return email;
        }

        public String getOtp() {
            return otp;
        }
    }

    @PostMapping(value = "/request-otp", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OtpResponse> requestLoginOtp(@RequestBody OtpRequest request) {
        try {
            // Generate a single OTP for both email and WhatsApp
            String otp = userService.generateOtp(request.getEmail());
            logger.info("Generated OTP for {}: {}", request.getEmail(), otp);
            
            // Check if student exists and has WhatsApp number
            // Student student = studentService.getStudentByEmail(request.getEmail());
            boolean whatsappOtpSent = false;
            boolean emailOtpSent = false;
            
            // if (student == null) {
            //     logger.warn("Student not found for email: {}", request.getEmail());
            //     return ResponseEntity.status(HttpStatus.NOT_FOUND)
            //         .body(new OtpResponse(false, false, "Student not found", request.getEmail()));
            // }

            // Send OTP via email
            try {
                emailOtpSent = userService.sendLoginOtp(request.getEmail(), otp);
                logger.info("Email OTP sent successfully to {}", request.getEmail());
            } catch (Exception e) {
                logger.error("Failed to send email OTP: {}", e.getMessage());
            }
            
            // If student has WhatsApp number, send OTP via WhatsApp
            // if (student.getMobileNumber() != null && !student.getMobileNumber().isEmpty()) {
            //     // Find existing WhatsApp OTP record or create new one
            //     WhatsAppOtp whatsAppOtp = whatsAppOtpRepository.findByEmail(request.getEmail())
            //         .orElse(new WhatsAppOtp());
                
            //     // Update the record with new OTP
            //     whatsAppOtp.setEmail(request.getEmail());
            //     whatsAppOtp.setMobileNumber(student.getMobileNumber());
            //     whatsAppOtp.setOtp(otp); // Using the same OTP
            //     whatsAppOtp.setCreatedAt(LocalDateTime.now());
            //     whatsAppOtp.setVerified(false);
            //     whatsAppOtpRepository.save(whatsAppOtp);

            //     // Prepare WhatsApp message
            //     Map<String, Object> whatsappRequest = new HashMap<>();
            //     whatsappRequest.put("messaging_product", "whatsapp");
            //     whatsappRequest.put("recipient_type", "individual");
            //     whatsappRequest.put("to", student.getMobileNumber());
            //     whatsappRequest.put("type", "text");
                
            //     Map<String, Object> text = new HashMap<>();
            //     text.put("preview_url", false);
            //     String messageBody = String.format(
            //         "Dear Student,\n\n" +
            //         "Your OTP for authentication to the Indian Institute of Information Technology, Lucknow portal is: %s\n\n" +
            //         "This OTP is valid for a limited time. Please do not share this OTP with anyone.\n\n" +
            //         "If you did not request this OTP, please ignore this message.\n\n" +
            //         "Regards,\n" +
            //         "Examination Cell\n" +
            //         "Indian Institute of Information Technology, Lucknow\n" +
            //         "Chak Ganjaria, Mastemau, Lucknow - 226002\n" +
            //         "https://iiitl.ac.in",
            //         otp
            //     );
            //     text.put("body", messageBody);
            //     whatsappRequest.put("text", text);
                
            //     try {
            //         whatsappOtpSent = whatsAppService.sendTextMessage(whatsappRequest);
            //         logger.info("WhatsApp OTP sent successfully to {}", student.getMobileNumber());
            //     } catch (Exception e) {
            //         logger.error("Failed to send WhatsApp message: {}", e.getMessage());
            //     }
            // } else {
            //     logger.warn("No WhatsApp number found for student: {}", request.getEmail());
            // }
            
            if (emailOtpSent || whatsappOtpSent) {
                String message = "OTP sent successfully";
                if (emailOtpSent && whatsappOtpSent) {
                    message += " via both email and WhatsApp";
                } else if (emailOtpSent) {
                    message += " via email";
                } else {
                    message += " via WhatsApp";
                }
                
                OtpResponse response = new OtpResponse(
                    emailOtpSent,
                    whatsappOtpSent,
                    message,
                    request.getEmail()
                );
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(response);
            } else {
                OtpResponse response = new OtpResponse(
                    false,
                    false,
                    "Failed to send OTP via any channel.",
                    request.getEmail()
                );
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(response);
            }
        } catch (Exception e) {
            logger.error("Error sending OTP: {}", e.getMessage(), e);
            OtpResponse response = new OtpResponse(
                false,
                false,
                "Failed to send OTP: " + e.getMessage(),
                request.getEmail()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);
        }
    }

    @PostMapping(value = "/validate-token", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> validateUserToken(@RequestBody VerifyTokenRequest tokenReq) {
        Boolean response = jwtUtil.validateToken(tokenReq.getToken(), tokenReq.getEmail());
        if (response) {
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .contentType(MediaType.APPLICATION_JSON)
            .body(response);
    }
    
    
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> loginWithOtp(@RequestBody LoginRequest request) {
        JwtResponse response = userService.authenticateUserWithOtp(request.getEmail(), request.getOtp());
        
        
        // Student student = studentService.getStudentByEmail(request.getEmail());
        // if (student == null || student.getMobileNumber() == null) {
        //     Map<String, Object> responseMap = new HashMap<>();
        //     responseMap.put("requiresWhatsApp", true);
        //     responseMap.put("message", "Please update your WhatsApp number");
        //     return ResponseEntity.ok()
        //             .contentType(MediaType.APPLICATION_JSON)
        //             .body(responseMap);
        // }
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }
    
    // @PostMapping(value = "/update-whatsapp", consumes = MediaType.APPLICATION_JSON_VALUE)
    // public ResponseEntity<?> updateWhatsAppNumber(@RequestBody WhatsAppOtpRequest request) {
    //     try {
    //         // Generate OTP
    //         String otp = userService.generateOtp(request.getEmail());
            
    //         // Find existing WhatsApp OTP record or create new one
    //         WhatsAppOtp whatsAppOtp = whatsAppOtpRepository.findByEmail(request.getEmail())
    //             .orElse(new WhatsAppOtp());
            
    //         // Update the record with new OTP and mobile number
    //         whatsAppOtp.setEmail(request.getEmail());
    //         whatsAppOtp.setMobileNumber(request.getMobileNumber());
    //         whatsAppOtp.setOtp(otp);
    //         whatsAppOtp.setCreatedAt(LocalDateTime.now());
    //         whatsAppOtp.setVerified(false);
    //         whatsAppOtpRepository.save(whatsAppOtp);
            
    //         // Prepare WhatsApp message
    //         Map<String, Object> whatsappRequest = new HashMap<>();
    //         whatsappRequest.put("messaging_product", "whatsapp");
    //         whatsappRequest.put("recipient_type", "individual");
    //         whatsappRequest.put("to", request.getMobileNumber());
    //         whatsappRequest.put("type", "text");
            
    //         Map<String, Object> text = new HashMap<>();
    //         text.put("preview_url", false);
    //         String messageBody = String.format(
    //             "Dear Student,\n\n" +
    //             "Your OTP for authentication to the Indian Institute of Information Technology, Lucknow portal is: %s\n\n" +
    //             "This OTP is valid for a limited time. Please do not share this OTP with anyone.\n\n" +
    //             "If you did not request this OTP, please ignore this message.\n\n" +
    //             "Regards,\n" +
    //             "Examination Cell\n" +
    //             "Indian Institute of Information Technology, Lucknow\n" +
    //             "Chak Ganjaria, Mastemau, Lucknow - 226002\n" +
    //             "https://iiitl.ac.in",
    //             otp
    //         );
    //         text.put("body", messageBody);
    //         whatsappRequest.put("text", text);
            
    //         try {
    //             boolean whatsappOtpSent = whatsAppService.sendTextMessage(whatsappRequest);
                
    //             if (whatsappOtpSent) {
    //                 WhatsAppResponse response = new WhatsAppResponse(
    //                     true,
    //                     "WhatsApp OTP sent successfully.",
    //                     request.getMobileNumber()
    //                 );
    //                 return ResponseEntity.ok()
    //                         .contentType(MediaType.APPLICATION_JSON)
    //                         .body(response);
    //             } else {
    //                 WhatsAppResponse response = new WhatsAppResponse(
    //                     false,
    //                     "Failed to send WhatsApp OTP.",
    //                     request.getMobileNumber(),
    //                     "Could not send OTP to the provided number"
    //                 );
    //                 return ResponseEntity.status(HttpStatus.BAD_REQUEST)
    //                         .contentType(MediaType.APPLICATION_JSON)
    //                         .body(response);
    //             }
    //         } catch (Exception e) {
    //             logger.error("Failed to send WhatsApp message: {}", e.getMessage());
    //             WhatsAppResponse response = new WhatsAppResponse(
    //                 false,
    //                 "Failed to send WhatsApp OTP.",
    //                 request.getMobileNumber(),
    //                 e.getMessage()
    //             );
    //             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .body(response);
    //         }
    //     } catch (Exception e) {
    //         logger.error("Error sending WhatsApp OTP: {}", e.getMessage(), e);
    //         WhatsAppResponse response = new WhatsAppResponse(
    //             false,
    //             "Failed to send WhatsApp OTP.",
    //             request.getMobileNumber(),
    //             e.getMessage()
    //         );
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //                 .contentType(MediaType.APPLICATION_JSON)
    //                 .body(response);
    //     }
    // }

    // @PostMapping(value = "/verify-whatsapp", consumes = MediaType.APPLICATION_JSON_VALUE)
    // public ResponseEntity<?> verifyWhatsAppNumber(@RequestBody LoginRequest request) {
    //     try {
    //         // Find the WhatsApp OTP record
    //         Optional<WhatsAppOtp> whatsAppOtpOpt = whatsAppOtpRepository.findByEmail(request.getEmail());
            
    //         if (whatsAppOtpOpt.isEmpty()) {
    //             return ResponseEntity.badRequest()
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .body(new WhatsAppResponse(false, "No OTP found", null, "Please request a new OTP"));
    //         }

    //         WhatsAppOtp whatsAppOtp = whatsAppOtpOpt.get();
            
    //         // Check if OTP is expired
    //         if (whatsAppOtp.isExpired()) {
    //             return ResponseEntity.badRequest()
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .body(new WhatsAppResponse(false, "OTP expired", null, "Please request a new OTP"));
    //         }

    //         // Verify OTP
    //         if (!whatsAppOtp.getOtp().equals(request.getOtp())) {
    //             return ResponseEntity.badRequest()
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .body(new WhatsAppResponse(false, "Invalid OTP", null, "The provided OTP is invalid"));
    //         }

    //         // Get or create student record
    //         Student student = studentService.getStudentByEmail(request.getEmail());
    //         if (student == null) {
    //             // Create new student record
    //             student = new Student();
    //             student.setEmail(request.getEmail());
    //             student.setMobileNumber(whatsAppOtp.getMobileNumber());
    //             logger.info("Creating new student record for email: {}", request.getEmail());
    //         } else {
    //             // Update existing student's mobile number
    //             student.setMobileNumber(whatsAppOtp.getMobileNumber());
    //             logger.info("Updating mobile number for existing student: {}", request.getEmail());
    //         }
            
    //         // Save student record
    //         studentService.saveStudent(student);

    //         // Delete the WhatsApp OTP record
    //         whatsAppOtpRepository.delete(whatsAppOtp);
            
    //         // Generate JWT token
    //         String token = jwtUtil.generateToken(request.getEmail());
    //         JwtResponse response = new JwtResponse(
    //             token, 
    //             request.getEmail(), 
    //             "WhatsApp number verified successfully!", 
    //             true, 
    //             whatsAppOtp.getMobileNumber()
    //         );
    //         return ResponseEntity.ok()
    //                 .contentType(MediaType.APPLICATION_JSON)
    //                 .body(response);
    //     } catch (Exception e) {
    //         logger.error("Error verifying WhatsApp number: {}", e.getMessage(), e);
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //                 .contentType(MediaType.APPLICATION_JSON)
    //                 .body(new WhatsAppResponse(false, "Failed to verify WhatsApp number", null, e.getMessage()));
    //     }
    // }

    // @PostMapping(value = "/start-whatsapp-chat", consumes = MediaType.APPLICATION_JSON_VALUE)
    // public ResponseEntity<WhatsAppResponse> startWhatsAppChat(@RequestBody Map<String, Object> request) {
    //     try {
    //         logger.info("Received WhatsApp template message request: {}", request);
            
    //         String recipientNumber = (String) request.get("to");
    //         if (recipientNumber == null || recipientNumber.isEmpty()) {
    //             logger.error("Missing recipient phone number in request");
    //             WhatsAppResponse response = new WhatsAppResponse(
    //                 false,
    //                 "Failed to send WhatsApp template message.",
    //                 null,
    //                 "Recipient phone number is required"
    //             );
    //             return ResponseEntity.badRequest().body(response);
    //         }

            
    //         Map<String, Object> template = (Map<String, Object>) request.get("template");
    //         if (template == null || !template.containsKey("name")) {
    //             logger.error("Invalid template format in request");
    //             WhatsAppResponse response = new WhatsAppResponse(
    //                 false,
    //                 "Failed to send WhatsApp template message.",
    //                 recipientNumber,
    //                 "Template information is required and must include a name"
    //             );
    //             return ResponseEntity.badRequest().body(response);
    //         }

    //         whatsAppService.sendTemplateMessage(request);
    //         WhatsAppResponse response = new WhatsAppResponse(
    //             true,
    //             "WhatsApp template message sent successfully.",
    //             recipientNumber
    //         );
    //         return ResponseEntity.ok()
    //                 .contentType(MediaType.APPLICATION_JSON)
    //                 .body(response);

    //     } catch (HttpClientErrorException e) {
    //         logger.error("WhatsApp API error: {}", e.getResponseBodyAsString());
    //         WhatsAppResponse response = new WhatsAppResponse(
    //             false,
    //             "Failed to send WhatsApp template message.",
    //             (String) request.get("to"),
    //             e.getResponseBodyAsString()
    //         );
    //         return ResponseEntity.status(e.getStatusCode())
    //                 .contentType(MediaType.APPLICATION_JSON)
    //                 .body(response);
    //     } catch (IllegalArgumentException e) {
    //         logger.error("Invalid request: {}", e.getMessage());
    //         WhatsAppResponse response = new WhatsAppResponse(
    //             false,
    //             "Failed to send WhatsApp template message.",
    //             (String) request.get("to"),
    //             e.getMessage()
    //         );
    //         return ResponseEntity.badRequest()
    //                 .contentType(MediaType.APPLICATION_JSON)
    //                 .body(response);
    //     } catch (Exception e) {
    //         logger.error("Unexpected error: {}", e.getMessage(), e);
    //         WhatsAppResponse response = new WhatsAppResponse(
    //             false,
    //             "Failed to send WhatsApp template message.",
    //             (String) request.get("to"),
    //             "An unexpected error occurred: " + e.getMessage()
    //         );
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //                 .contentType(MediaType.APPLICATION_JSON)
    //                 .body(response);
    //     }
    // }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<OtpResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        OtpResponse response = new OtpResponse(false, false, errorMessage, null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<OtpResponse> handleGenericExceptions(Exception ex) {
        String errorMessage = ex.getMessage();
        if (errorMessage != null && errorMessage.contains("Email")) {
            OtpResponse response = new OtpResponse(false, false, "Invalid email format. Email must end with @iiitl.ac.in", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);
        }
        OtpResponse response = new OtpResponse(false, false, "An error occurred: " + errorMessage, null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }
}