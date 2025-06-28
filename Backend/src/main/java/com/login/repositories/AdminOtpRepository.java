package com.login.repositories;

import com.login.entity.AdminOtp;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminOtpRepository extends JpaRepository<AdminOtp, String> {
} 