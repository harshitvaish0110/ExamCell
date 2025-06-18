package com.login.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.login.entity.PasswordRequest;

@Repository
public interface PasswordReqRepository extends JpaRepository<PasswordRequest, String> {
    
}
