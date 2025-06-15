package com.login.services;

import com.login.entity.Admin;
import com.login.repositories.AdminRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Transactional
    public Admin saveAdmin(Admin admin) {
        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return adminRepository.save(admin);
    }

    public Admin updateAdmin(Admin admin) {
        if (!adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Email does not exist");
        }
        return adminRepository.save(admin);
    }

    public Admin getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return adminRepository.existsByEmail(email);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll(Sort.by("email"));
    }
} 