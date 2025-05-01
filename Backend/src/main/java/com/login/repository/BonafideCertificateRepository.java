package com.login.repository;

import com.login.entity.BonafideCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BonafideCertificateRepository extends JpaRepository<BonafideCertificate, UUID> {
    List<BonafideCertificate> findByExpiresAtBeforeAndIsActiveTrue(LocalDateTime date);
} 