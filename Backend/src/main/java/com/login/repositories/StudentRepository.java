package com.login.repositories;

import com.login.entity.Student;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    Student findByEmail(String email);
    boolean existsByEmail(String email);
    List<Student> findAll();
    String getUsernameByEmail(String email);
}