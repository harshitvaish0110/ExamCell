package com.login.service;

import com.login.dto.BonafideResponse;
import com.login.entity.BonafideCertificate;
import com.login.repository.BonafideCertificateRepository;
import com.login.utils.BonafideCertificateGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.UUID;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.nio.file.Files;

@Service
public class BonafideService {
    @Autowired
    private BonafideCertificateRepository certificateRepository;
    
    @Autowired
    private BonafideCertificateGenerator certificateGenerator;

    @Transactional
    public BonafideResponse generateCertificate(String studentName, String email, String course, 
            String semester, String purpose) {
        // Derive enrollment number from email
        String enrollmentNumber = email.split("@")[0].toUpperCase();
        
        String date = LocalDateTime.now().toString();
        String filePath = certificateGenerator.generateCertificate(studentName, enrollmentNumber, course, 
            semester, purpose, date);
        
        BonafideCertificate certificate = new BonafideCertificate();
        certificate.setStudentName(studentName);
        certificate.setEnrollmentNumber(enrollmentNumber);
        certificate.setCourse(course);
        certificate.setSemester(semester);
        certificate.setPurpose(purpose);
        certificate.setFilePath(filePath);
        certificate.setGeneratedAt(LocalDateTime.now());
        certificate.setExpiresAt(LocalDateTime.now().plusDays(30));
        certificate.setActive(true);
        certificate.setApproved(false);
        
        certificate = certificateRepository.save(certificate);
        return convertToResponse(certificate);
    }

    private BonafideResponse convertToResponse(BonafideCertificate certificate) {
        BonafideResponse response = new BonafideResponse();
        response.setUid(certificate.getUid());
        response.setStudentName(certificate.getStudentName());
        response.setEmail(certificate.getEnrollmentNumber().toLowerCase() + "@iiitl.ac.in");
        response.setEnrollmentNumber(certificate.getEnrollmentNumber());
        response.setCourse(certificate.getCourse());
        response.setSemester(certificate.getSemester());
        response.setPurpose(certificate.getPurpose());
        response.setFilePath(certificate.getFilePath());
        response.setGeneratedAt(certificate.getGeneratedAt());
        response.setExpiresAt(certificate.getExpiresAt());
        response.setActive(certificate.isActive());
        response.setApproved(certificate.isApproved());
        return response;
    }

    @Transactional
    public void approveCertificate(UUID uid) {
        certificateRepository.findById(uid).ifPresent(certificate -> {
            certificate.setApproved(true);
            certificateRepository.save(certificate);
        });
    }

    @Transactional
    public void deleteExpiredCertificates() {
        LocalDateTime now = LocalDateTime.now();
        certificateRepository.findByExpiresAtBeforeAndIsActiveTrue(now).forEach(certificate -> {
            try {
                // Delete the physical file
                Path filePath = Paths.get(certificate.getFilePath());
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                    System.out.println("Deleted file: " + filePath);
                }
                
                // Mark as inactive in database
                certificate.setActive(false);
                certificateRepository.save(certificate);
                System.out.println("Marked certificate as inactive: " + certificate.getUid());
            } catch (IOException e) {
                System.err.println("Error deleting file for certificate " + certificate.getUid() + ": " + e.getMessage());
            }
        });
    }

    public Resource downloadCertificate(UUID uid) throws IOException {
        BonafideCertificate certificate = certificateRepository.findById(uid)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certificate not found"));

        if (!certificate.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Certificate has expired");
        }

        if (!certificate.isApproved()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Certificate is not approved yet");
        }

        Path filePath = Paths.get(certificate.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not read the file");
        }
    }
} 