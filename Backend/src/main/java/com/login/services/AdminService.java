package com.login.services;

import com.login.entity.Admin;
import com.login.repositories.AdminRepository;
import com.login.repositories.StudentRepository;
import com.login.repositories.PasswordReqRepository;
import com.login.repositories.BonafideCertificateRepository;
import com.login.entity.Student;
import com.login.entity.AdminOtp;
import com.login.entity.BonafideCertificate;
import com.login.repositories.AdminOtpRepository;
import com.login.models.JwtResponse;
import com.login.models.JwtUtil;
import com.login.services.WhatsAppService;
import com.login.entity.PasswordRequest;

import java.util.List;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.Map;
import java.util.HashMap;

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

    @Autowired
    private PasswordReqRepository passwordReqRepository;

    @Autowired
    private BonafideCertificateRepository bonafideCertificateRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AdminOtpRepository adminOtpRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private WhatsAppService whatsAppService;

    private static final Pattern IIITL_EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@iiitl\\.ac\\.in$");

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

    public byte[] generatePasswordRequestsCSV() {
        List<PasswordRequest> passwordRequests = passwordReqRepository.findAll(Sort.by("timestamp"));
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);
        // Write CSV header
        writer.println("Email,Reason,New Password");
        // Write password request data
        for (PasswordRequest request : passwordRequests) {
            writer.println(
                escapeCSV(request.getEmail()) + "," +
                escapeCSV(request.getReason()) + "," +
                escapeCSV(request.getPassword())
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
  
    @Transactional
    public void deleteStudentByRollNumber(String rollNumber) {
        // First, get the student to find their email
        Student student = studentRepository.findByRollNumber(rollNumber);
        if (student != null) {
            // Delete all bonafide certificates for this student's email
            String enrollmentNumber = student.getEmail().split("@")[0].toUpperCase();
            List<BonafideCertificate> certificates = bonafideCertificateRepository.findAllByEnrollmentNumber(enrollmentNumber);
            if (!certificates.isEmpty()) {
                bonafideCertificateRepository.deleteAll(certificates);
            }
            
            // Delete the student
            studentRepository.deleteByRollNumber(rollNumber);
        } else {
            throw new RuntimeException("Student not found with roll number: " + rollNumber);
        }
    }

    public String generateOtp(String email) {
        if (!IIITL_EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email must end with @iiitl.ac.in");
        }
        String otp = com.login.models.OtpUtil.generateOtp();
        Admin admin = adminRepository.findByEmail(email);
        if (admin == null) {
            throw new IllegalArgumentException("Admin not found");
        }
        AdminOtp adminOtp = new AdminOtp(email, otp, LocalDateTime.now());
        adminOtpRepository.save(adminOtp);
        return otp;
    }

    public boolean sendLoginOtp(String email, String otp) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin == null) {
            throw new IllegalArgumentException("Admin not found");
        }
        if (admin.getMobileNumber() != null && !admin.getMobileNumber().isEmpty()) {
            // Send OTP via WhatsApp
            try {
                java.util.Map<String, Object> request = new java.util.HashMap<>();
                request.put("messaging_product", "whatsapp");
                request.put("recipient_type", "individual");
                request.put("to", admin.getMobileNumber());
                request.put("type", "text");
                java.util.Map<String, String> text = new java.util.HashMap<>();
                text.put("body", "Dear Admin,\n\n" +
                    "Your OTP for authentication to the Indian Institute of Information Technology, Lucknow portal is: " + otp + "\n\n" +
                    "This OTP is valid for a limited time. Please do not share this OTP with anyone.\n\n" +
                    "If you did not request this OTP, please ignore this message.\n\n" +
                    "Regards,\n" +
                    "Examination Cell\n" +
                    "Indian Institute of Information Technology, Lucknow\n" +
                    "Chak Ganjaria,  C. G. City, Lucknow - 226002\n" +
                    "https://iiitl.ac.in");
                request.put("text", text);
                whatsAppService.sendTextMessage(request);
                return true;
            } catch (Exception e) {
                // If WhatsApp fails, fallback to email
                emailService.sendOtpEmail(email, otp);
                return true;
            }
        } else {
            // Fallback to email
            emailService.sendOtpEmail(email, otp);
            return true;
        }
    }

    public boolean authenticateAdminWithOtp(String email, String otp) {
        if (!IIITL_EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email must end with @iiitl.ac.in");
        }
        AdminOtp adminOtp = adminOtpRepository.findById(email).orElse(null);
        if (adminOtp == null) {
            return false;
        }
        if (adminOtp.isOtpExpired()) {
            return false;
        }
        if (adminOtp.getOtp() != null && adminOtp.getOtp().equals(otp)) {
            adminOtpRepository.delete(adminOtp);
            return true;
        }
        return false;
    }

    public boolean verifyOtp(String email, String otp) {
        AdminOtp adminOtp = adminOtpRepository.findById(email).orElse(null);
        if (adminOtp == null) {
            return false;
        }
        if (adminOtp.isOtpExpired()) {
            return false;
        }
        if (adminOtp.getOtp() != null && adminOtp.getOtp().equals(otp)) {
            adminOtpRepository.delete(adminOtp);
            return true;
        }
        return false;
    }

    public void deleteOtp(String email) {
        adminOtpRepository.deleteById(email);
    }

    public JwtResponse authenticateAdminWithOtpAndPassword(String email, String password, String otp) {
        if (!IIITL_EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email must end with @iiitl.ac.in");
        }
        AdminOtp adminOtp = adminOtpRepository.findById(email).orElse(null);
        if (adminOtp == null) {
            return new JwtResponse(null, email, "User not found! Please request an OTP first.");
        }
        if (adminOtp.isOtpExpired()) {
            return new JwtResponse(null, email, "OTP has expired. Please request a new one.");
        }
        if (adminOtp.getOtp() != null && adminOtp.getOtp().equals(otp)) {
            Admin admin = adminRepository.findByEmail(email);
            if (admin != null) {
                Boolean passwordMatches = password.equals(admin.getPassword());
                if (!passwordMatches) {
                    return new JwtResponse(null, email, "Invalid Credentials!");
                }
                String token = jwtUtil.generateToken(email);
                emailService.sendWelcomeEmail(email);
                adminOtpRepository.delete(adminOtp);
                return new JwtResponse(token, email, "Authentication successful!");
            } else {
                return new JwtResponse(null, email, "Invalid Credentials!");
            }
        } else {
            return new JwtResponse(null, email, "Invalid OTP!");
        }
    }

    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalCertificates", bonafideCertificateRepository.count());
        stats.put("pendingRequests", bonafideCertificateRepository.countByIsSignedFalse());
        stats.put("approvedToday", 0L); // Placeholder, implement logic if needed
        return stats;
    }

    public String generateOtp(String email) {
        if (!IIITL_EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email must end with @iiitl.ac.in");
        }
        String otp = com.login.models.OtpUtil.generateOtp();
        Admin admin = adminRepository.findByEmail(email);
        if (admin == null) {
            throw new IllegalArgumentException("Admin not found");
        }
        AdminOtp adminOtp = new AdminOtp(email, otp, LocalDateTime.now());
        adminOtpRepository.save(adminOtp);
        return otp;
    }

    public boolean sendLoginOtp(String email, String otp) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin == null) {
            throw new IllegalArgumentException("Admin not found");
        }
        if (admin.getMobileNumber() != null && !admin.getMobileNumber().isEmpty()) {
            // Send OTP via WhatsApp
            try {
                java.util.Map<String, Object> request = new java.util.HashMap<>();
                request.put("messaging_product", "whatsapp");
                request.put("recipient_type", "individual");
                request.put("to", admin.getMobileNumber());
                request.put("type", "text");
                java.util.Map<String, String> text = new java.util.HashMap<>();
                text.put("body", "Dear Admin,\n\n" +
                    "Your OTP for authentication to the Indian Institute of Information Technology, Lucknow portal is: " + otp + "\n\n" +
                    "This OTP is valid for a limited time. Please do not share this OTP with anyone.\n\n" +
                    "If you did not request this OTP, please ignore this message.\n\n" +
                    "Regards,\n" +
                    "Examination Cell\n" +
                    "Indian Institute of Information Technology, Lucknow\n" +
                    "Chak Ganjaria,  C. G. City, Lucknow - 226002\n" +
                    "https://iiitl.ac.in");
                request.put("text", text);
                whatsAppService.sendTextMessage(request);
                return true;
            } catch (Exception e) {
                // If WhatsApp fails, fallback to email
                emailService.sendOtpEmail(email, otp);
                return true;
            }
        } else {
            // Fallback to email
            emailService.sendOtpEmail(email, otp);
            return true;
        }
    }

    public boolean authenticateAdminWithOtp(String email, String otp) {
        if (!IIITL_EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email must end with @iiitl.ac.in");
        }
        AdminOtp adminOtp = adminOtpRepository.findById(email).orElse(null);
        if (adminOtp == null) {
            return false;
        }
        if (adminOtp.isOtpExpired()) {
            return false;
        }
        if (adminOtp.getOtp() != null && adminOtp.getOtp().equals(otp)) {
            adminOtpRepository.delete(adminOtp);
            return true;
        }
        return false;
    }

    public boolean verifyOtp(String email, String otp) {
        AdminOtp adminOtp = adminOtpRepository.findById(email).orElse(null);
        if (adminOtp == null) {
            return false;
        }
        if (adminOtp.isOtpExpired()) {
            return false;
        }
        if (adminOtp.getOtp() != null && adminOtp.getOtp().equals(otp)) {
            adminOtpRepository.delete(adminOtp);
            return true;
        }
        return false;
    }

    public void deleteOtp(String email) {
        adminOtpRepository.deleteById(email);
    }

    public JwtResponse authenticateAdminWithOtpAndPassword(String email, String password, String otp) {
        if (!IIITL_EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email must end with @iiitl.ac.in");
        }
        AdminOtp adminOtp = adminOtpRepository.findById(email).orElse(null);
        if (adminOtp == null) {
            return new JwtResponse(null, email, "User not found! Please request an OTP first.");
        }
        if (adminOtp.isOtpExpired()) {
            return new JwtResponse(null, email, "OTP has expired. Please request a new one.");
        }
        if (adminOtp.getOtp() != null && adminOtp.getOtp().equals(otp)) {
            Admin admin = adminRepository.findByEmail(email);
            if (admin != null) {
                Boolean passwordMatches = password.equals(admin.getPassword());
                if (!passwordMatches) {
                    return new JwtResponse(null, email, "Invalid Credentials!");
                }
                String token = jwtUtil.generateToken(email);
                emailService.sendWelcomeEmail(email);
                adminOtpRepository.delete(adminOtp);
                return new JwtResponse(token, email, "Authentication successful!");
            } else {
                return new JwtResponse(null, email, "Invalid Credentials!");
            }
        } else {
            return new JwtResponse(null, email, "Invalid OTP!");
        } 
    }
} 