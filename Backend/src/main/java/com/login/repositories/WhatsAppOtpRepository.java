package com.login.repositories;

import com.login.entity.WhatsAppOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WhatsAppOtpRepository extends JpaRepository<WhatsAppOtp, String> {
    Optional<WhatsAppOtp> findByEmailAndOtpAndVerifiedFalse(String email, String otp);
    Optional<WhatsAppOtp> findFirstByEmailOrderByCreatedAtDesc(String email);
    Optional<WhatsAppOtp> findByEmail(String email);
} 