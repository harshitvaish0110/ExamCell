package com.login.controllers;

import com.login.entity.Student;
import com.login.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*") // Allow frontend to connect (adjust in production)
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    public ResponseEntity<?> createStudent(@Valid @RequestBody StudentRequest request) {
        try {
            Student student = new Student();
            student.setEmail(request.getEmail());
            student.setMobileNumber(request.getMobileNumber());
            
            Student savedStudent = studentService.saveStudent(student);
            return ResponseEntity.ok(savedStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getStudentByEmail(@PathVariable @Email String email) {
        Student student = studentService.getStudentByEmail(email);
        if (student != null) {
            return ResponseEntity.ok(student);
        }
        return ResponseEntity.notFound().build();
    }

    private static class StudentRequest {
        @NotBlank
        @Email
        @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@iiitl\\.ac\\.in$", message = "Email must end with @iiitl.ac.in")
        private String email;

        @NotBlank
        @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
        private String mobileNumber;

        public String getEmail() {
            return email;
        }

        public String getMobileNumber() {
            return mobileNumber;
        }
    }
}
