package com.login.scheduler;

import com.login.service.BonafideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CertificateCleanupScheduler {
    @Autowired
    private BonafideService bonafideService;

    @Scheduled(cron = "0 0 0 * * ?") // Runs at midnight every day
    public void cleanupExpiredCertificates() {
        bonafideService.deleteExpiredCertificates();
    }
} 