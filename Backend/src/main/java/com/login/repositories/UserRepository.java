package com.login.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.login.models.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
} 