package com.login.controllers;

import com.login.models.StudentRequestDTO; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*") // Allow frontend to connect (adjust in production)
public class StudentController {

    @PostMapping("/submit")
    public ResponseEntity<String> submitStudentInfo(@RequestBody StudentRequestDTO studentData) {
        // You can process or save the data here
        System.out.println("Received form data:");
        System.out.println("Roll Number: " + studentData.getRollNumber());
        System.out.println("Full Name: " + studentData.getFullName());
        System.out.println("Email ID: " + studentData.getEmailId());
        System.out.println("Program: " + studentData.getProgram());
        System.out.println("Specialization: " + studentData.getSpecialization());
        System.out.println("Semester: " + studentData.getSemester());
        System.out.println("Purpose: " + studentData.getPurpose());

        return ResponseEntity.ok("Form data received successfully.");
    }
}
