package com.login.service;

import com.login.dto.BonafideResponse;
import com.login.entity.BonafideCertificate;
import com.login.repositories.BonafideCertificateRepository;
import com.login.utils.BonafideCertificateGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class BonafideService {
    @Autowired
    private BonafideCertificateRepository certificateRepository;
    
    @Autowired
    private BonafideCertificateGenerator certificateGenerator;

    @Transactional
    public BonafideResponse generateCertificate(String studentName, String email, String course, 
            String semester, String purpose) {
        String enrollmentNumber = email.split("@")[0].toUpperCase();
        
        String date = LocalDateTime.now().toString();
        byte[] pdfBytes = certificateGenerator.generateCertificate(studentName, enrollmentNumber, course, 
            semester, purpose, date);
        
        BonafideCertificate certificate = new BonafideCertificate();
        certificate.setStudentName(studentName);
        certificate.setEnrollmentNumber(enrollmentNumber);
        certificate.setCourse(course);
        certificate.setSemester(semester);
        certificate.setPurpose(purpose);
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
            certificate.setActive(false);
            certificateRepository.save(certificate);
            System.out.println("Marked certificate as inactive: " + certificate.getUid());
        });
    }

    public Resource downloadCertificate(UUID uid) {
        BonafideCertificate certificate = certificateRepository.findById(uid)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certificate not found"));

        if (!certificate.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Certificate has expired");
        }

        if (!certificate.isApproved()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Certificate is not approved yet");
        }

        byte[] pdfBytes = certificateGenerator.generateCertificate(
            certificate.getStudentName(),
            certificate.getEnrollmentNumber(),
            certificate.getCourse(),
            certificate.getSemester(),
            certificate.getPurpose(),
            certificate.getGeneratedAt().toString()
        );

        if (pdfBytes != null) {
            return new ByteArrayResource(pdfBytes);
        } else {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not generate the certificate");
        }
    }

    public List<Map<String, Object>> getCertificatesByRollNo(String rollNo) {
        List<BonafideCertificate> certificates = certificateRepository.findAllByEnrollmentNumber(rollNo.toUpperCase());
        
        if (certificates.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No certificates found for the given roll number");
        }
        
        return certificates.stream()
            .map(cert -> {
                Map<String, Object> certInfo = new HashMap<>();
                certInfo.put("uid", cert.getUid());
                certInfo.put("isActive", cert.isActive());
                certInfo.put("isApproved", cert.isApproved());
                certInfo.put("generatedAt", cert.getGeneratedAt());
                certInfo.put("expiresAt", cert.getExpiresAt());
                return certInfo;
            })
            .collect(Collectors.toList());
    }
} 