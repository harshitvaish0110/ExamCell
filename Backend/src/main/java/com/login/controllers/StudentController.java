package com.login.controllers;

import com.login.entity.Student;
import com.login.services.StudentService;

import java.util.List;

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
            student.setEmail(request.getEmail().toLowerCase());
            student.setMobileNumber(request.getMobileNumber());
            student.setRollNumber(request.getRollNumber());
            student.setFullName(request.getFullName());
            student.setProgram(request.getProgram());
            student.setCourse(request.getCourse());
            student.setSemester(request.getSemester());
            student.setPurpose(request.getPurpose());
            
            Student savedStudent = studentService.saveStudent(student);
            return ResponseEntity.ok(savedStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> updateStudent(@Valid @RequestBody StudentRequest request) {
        try {
            Student student = new Student();
            student.setEmail(request.getEmail().toLowerCase());
            student.setMobileNumber(request.getMobileNumber());
            student.setRollNumber(request.getRollNumber());
            student.setFullName(request.getFullName());
            student.setProgram(request.getProgram());
            student.setCourse(request.getCourse());
            student.setSemester(request.getSemester());
            student.setPurpose(request.getPurpose());
            
            Student updatedStudent = studentService.updateStudent(student);
            return ResponseEntity.ok(updatedStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getStudentByEmail(@PathVariable @Email String email) {
        Student student = studentService.getStudentByEmail(email.toLowerCase());
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

        @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
        private String mobileNumber;

        @NotBlank
        private String rollNumber;

        @NotBlank
        private String fullName;

        @NotBlank
        private String program;

        @NotBlank
        private String course;

        @NotBlank
        private String semester;

        @NotBlank
        private String purpose;

        public String getEmail() {
            return email;
        }

        public String getMobileNumber() {
            return mobileNumber;
        }

        public String getRollNumber() {
            return rollNumber;
        }

        public String getFullName() {
            return fullName;
        }

        public String getProgram() {
            return program;
        }

        public String getCourse() {
            return course;
        }

        public String getSemester() {
            return semester;
        }

        public String getPurpose() {
            return purpose;
        }
    }
}
