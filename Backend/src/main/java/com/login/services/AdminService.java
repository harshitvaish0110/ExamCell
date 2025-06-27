package com.login.services;

import com.login.entity.Admin;
import com.login.repositories.AdminRepository;
import com.login.repositories.StudentRepository;
import com.login.entity.Student;

import java.util.List;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private StudentRepository studentRepository;

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

    public byte[] generateStudentsCSV() {
        List<Student> students = studentRepository.findAll(Sort.by("rollNumber"));
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);
        // Write CSV header
        writer.println("Email,Mobile Number,Roll Number,Full Name,Program,Course,Semester,Purpose");
        // Write student data
        for (Student student : students) {
            writer.println(
                escapeCSV(student.getEmail()) + "," +
                escapeCSV(student.getMobileNumber()) + "," +
                escapeCSV(student.getRollNumber()) + "," +
                escapeCSV(student.getFullName()) + "," +
                escapeCSV(student.getProgram()) + "," +
                escapeCSV(student.getCourse()) + "," +
                escapeCSV(student.getSemester()) + "," +
                escapeCSV(student.getPurpose())
            );
        }
        writer.flush();
        return out.toByteArray();
    }

    // Helper method to escape CSV values (if needed)
    private String escapeCSV(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            value = value.replace("\"", "\"\"");
            return "\"" + value + "\"";
        }
        return value;
    }
} 