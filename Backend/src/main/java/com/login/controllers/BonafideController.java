package com.login.controllers;

import com.login.dto.BonafideRequest;
import com.login.dto.BonafideResponse;
import com.login.dto.SignRequest;
import com.login.entity.BonafideCertificate;
import com.login.entity.Log;
import com.login.models.JwtUtil;
import com.login.repositories.LogRepository;
import com.login.services.AdminService;
import com.login.services.BonafideService;
import com.login.services.WhatsAppService;
import com.login.services.StudentService;
import com.login.services.FirebaseService;
import com.login.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import com.login.services.EmailService;

@RestController
@RequestMapping("/api/bonafide")
public class BonafideController {
    @Autowired
    private EmailService emailService;

    @Autowired
    private BonafideService bonafideService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AdminService adminService;

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private WhatsAppService whatsAppService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private FirebaseService firebaseService;

    @PostMapping("/generate")
    public ResponseEntity<BonafideResponse> generateCertificate(@RequestBody BonafideRequest request) {
        
        Student student = studentService.getStudentByEmail(request.getEmail());
        String purpose = student != null ? student.getPurpose() : null;
        BonafideResponse response = bonafideService.generateCertificate(
            request.getStudentName(),
            request.getEmail(),
            request.getCourse(),
            request.getSemester(),
            purpose);
        Log log = new Log();
        log.setMessage("Generated Certificate: " + response.getUid() + " for " + response.getEmail());
        log.setUser(request.getStudentName());
        logRepository.save(log);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{uid}")
    public ResponseEntity<?> downloadCertificate(@PathVariable UUID uid) {
        try {
            Resource resource = bonafideService.downloadCertificate(uid);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
        } catch (ResponseStatusException e) {
            if (e.getStatusCode() == HttpStatus.FORBIDDEN) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Certificate is not approved yet. Please wait for approval before downloading.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            } else if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Certificate not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Certificate has expired");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            throw e;
        }
    }

    @PostMapping("/sign")
    public ResponseEntity<?> signCertificate(@RequestBody SignRequest request) {
        System.out.println("=== SIGN CERTIFICATE REQUEST RECEIVED ===");
        System.out.println("UID: " + request.getUid());
        System.out.println("Email: " + request.getEmail());
        
        Boolean admin = false;
        Boolean valid = jwtUtil.validateToken(request.getToken(), request.getEmail());
        System.out.println("Token valid: " + valid);
        
        if (valid) {
            admin = adminService.existsByEmail(request.getEmail());
            System.out.println("Is admin: " + admin);
        }
        
        if (!valid || !admin) {
            System.out.println("Authorization failed - valid: " + valid + ", admin: " + admin);
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Not Authorized to Sign the Certificate");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        
        System.out.println("Authorization successful, signing certificate...");
        bonafideService.signCertificate(request.getUid());
        BonafideCertificate cert = bonafideService.getCertificateByUid(request.getUid());
        
        System.out.println("Certificate details:");
        System.out.println("- Student Name: " + cert.getStudentName());
        System.out.println("- Enrollment: " + cert.getEnrollmentNumber());
        System.out.println("- Email: " + cert.getEnrollmentNumber().toLowerCase() + "@iiitl.ac.in");
        
        
        try {
            System.out.println(" Attempting to send Firebase notification...");
            Student student = studentService.getStudentByEmail(cert.getEnrollmentNumber().toLowerCase() + "@iiitl.ac.in");
            
            if (student != null) {
                System.out.println("Student found in database");
                System.out.println("- Student email: " + student.getEmail());
                System.out.println("- Firebase token: " + (student.getFirebaseToken() != null ? "Present" : "NULL"));
                
                if (student.getFirebaseToken() != null && !student.getFirebaseToken().isEmpty()) {
                    System.out.println("Sending notification to Firebase token...");
                    boolean notificationSent = firebaseService.sendCertificateSignedNotification(
                        student.getFirebaseToken(), 
                        cert.getStudentName(), 
                        cert.getEnrollmentNumber()
                    );
                    System.out.println("Notification sent: " + notificationSent);
                } else {
                    System.out.println("No Firebase token found for student");
                }
            } else {
                System.out.println("Student not found in database");
            }
        } catch (Exception e) {
            System.err.println("Failed to send Firebase notification: " + e.getMessage());
            e.printStackTrace();
        }
        
        Log log = new Log();
        log.setMessage("Signed Certificate: " + request.getUid() + " by " + cert.getStudentName() + " (" + cert.getEnrollmentNumber() + ")");
        log.setUser("Admin");
        logRepository.save(log);
        
        System.out.println("Certificate signing completed successfully");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/uid/{rollNo}")
    public ResponseEntity<?> getCertificatesByRollNo(@PathVariable String rollNo) {
        try {
            List<Map<String, Object>> certificates = bonafideService.getCertificatesByRollNo(rollNo);
            Map<String, Object> response = new HashMap<>();
            response.put("certificates", certificates);
            return ResponseEntity.ok(response);
        } catch (ResponseStatusException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "No certificates found for the given roll number");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            throw e;
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllCertificates() {
        try {
            List<BonafideCertificate> certificates = bonafideService.getAllCertificates();
            return ResponseEntity.ok(certificates);
        } catch (ResponseStatusException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "No certificates");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            throw e;
        }
    }

    @PostMapping("/send-whatsapp/{uid}")
    public ResponseEntity<?> sendCertificateViaWhatsApp(
            @PathVariable UUID uid,
            @RequestParam(value = "phone", required = false) String phoneNumber) {
        try {
            BonafideCertificate cert = bonafideService.getCertificateByUid(uid);
            if (!cert.isActive()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("status", "error", "message", "Certificate has expired"));
            }
            
            if (phoneNumber == null || phoneNumber.isBlank()) {
                Student student = studentService.getStudentByEmail(cert.getEnrollmentNumber().toLowerCase() + "@iiitl.ac.in");
                phoneNumber = student != null ? student.getMobileNumber() : null;
            }
            if (phoneNumber == null || phoneNumber.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "No phone number provided or found for student."));
            }
            byte[] pdfBytes = bonafideService.downloadCertificate(uid).getInputStream().readAllBytes();
            String filename = cert.getStudentName().replaceAll("\\s+", "_") + "_Bonafide.pdf";
            whatsAppService.sendDocumentMessage(phoneNumber, pdfBytes, filename);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Document sent via WhatsApp successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("status", "error", "message", "Failed to send document via WhatsApp: " + e.getMessage()));
        }
    }

    @PostMapping("/send-email/{uid}")
    public ResponseEntity<?> sendCertificateViaEmail(
            @PathVariable UUID uid,
            @RequestBody Map<String, String> body) {
        try {
            BonafideCertificate cert = bonafideService.getCertificateByUid(uid);
            if (!cert.isActive()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("status", "error", "message", "Certificate has expired"));
            }
            String email = body.get("email");
            if (email == null || email.isBlank()) {
                
                Student student = studentService.getStudentByEmail(cert.getEnrollmentNumber().toLowerCase() + "@iiitl.ac.in");
                email = student != null ? student.getEmail() : null;
            }
            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "No email provided or found for student."));
            }
            byte[] pdfBytes = bonafideService.downloadCertificate(uid).getInputStream().readAllBytes();
            String filename = cert.getStudentName().replaceAll("\\s+", "_") + "_Bonafide.pdf";
            
            emailService.sendCertificate(email, pdfBytes, filename);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Document sent via Email successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("status", "error", "message", "Failed to send document via Email: " + e.getMessage()));
        }
    }
} 