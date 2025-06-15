package com.login.repositories;

import com.login.entity.Admin;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
    Admin findByEmail(String email);
    boolean existsByEmail(String email);
    List<Admin> findAll();
}