package com.login.repositories;

import com.login.entity.BonafideCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BonafideCertificateRepository extends JpaRepository<BonafideCertificate, UUID> {
    List<BonafideCertificate> findByExpiresAtBeforeAndIsActiveTrue(LocalDateTime date);
    
    Optional<BonafideCertificate> findByEnrollmentNumber(String enrollmentNumber);
    
    List<BonafideCertificate> findAllByEnrollmentNumber(String enrollmentNumber);
} 