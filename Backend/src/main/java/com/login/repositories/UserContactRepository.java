package com.login.repositories;

import com.login.entity.UserContact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserContactRepository extends JpaRepository<UserContact, Long> {
    Optional<UserContact> findByEmail(String email);
} 