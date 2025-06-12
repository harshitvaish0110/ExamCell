package com.login.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.Map;
import java.util.HashMap;

import com.login.models.UserEntity;
import com.login.models.OtpUtil;
import com.login.models.JwtUtil;
import com.login.models.JwtResponse;
import com.login.repositories.UserRepository;
import com.login.entity.Student;

@Service
public class UserService {

    private static final Pattern IIITL_EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@iiitl\\.ac\\.in$");
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private StudentService studentService;

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private Map<String, String> temporaryWhatsAppNumbers = new HashMap<>();

    public String generateOtp(String email) {
        if (!IIITL_EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email must end with @iiitl.ac.in");
        }
        
        String otp = OtpUtil.generateOtp();
        
        
        UserEntity userEntity = userRepository.findById(email)
                                .orElse(new UserEntity());
        userEntity.setEmailId(email);
        userEntity.setOtp(otp);
        userEntity.setOtpCreatedAt(LocalDateTime.now());
        
        userRepository.save(userEntity);
        return otp;
    }

    public boolean sendLoginOtp(String email, String otp) {
        emailService.sendOtpEmail(email, otp);
        return true;
    }
    
    public JwtResponse authenticateUserWithOtp(String email, String otp) {
        if (!IIITL_EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email must end with @iiitl.ac.in");
        }
        
        
        Optional<UserEntity> userEntityOpt = userRepository.findById(email);
        
        if (userEntityOpt.isPresent()) {
            UserEntity userEntity = userEntityOpt.get();
            
            
            if (userEntity.isOtpExpired()) {
                return new JwtResponse(null, email, "OTP has expired. Please request a new one.");
            }
            
            
            if (userEntity.getOtp() != null && userEntity.getOtp().equals(otp)) {
                
                userRepository.delete(userEntity);
                
                
                String token = jwtUtil.generateToken(email);
                emailService.sendWelcomeEmail(email);
                logger.info("User logged in successfully: {}", email);

                
                Student student = studentService.getStudentByEmail(email);
                if (student != null && student.getMobileNumber() != null) {
                    return new JwtResponse(token, email, "Authentication successful!", true, student.getMobileNumber());
                } else {
                    return new JwtResponse(token, email, "Authentication successful!", false, null);
                }
            } else {
                return new JwtResponse(null, email, "Invalid OTP!");
            }
        } else {
            return new JwtResponse(null, email, "User not found! Please request an OTP first.");
        }
    }

    public void saveTemporaryWhatsAppNumber(String email, String mobileNumber) {
        temporaryWhatsAppNumbers.put(email, mobileNumber);
    }

    public String getTemporaryWhatsAppNumber(String email) {
        return temporaryWhatsAppNumbers.remove(email);
    }

    public boolean verifyOtp(String email, String otp) {
        Optional<UserEntity> userEntityOpt = userRepository.findById(email);
        
        if (userEntityOpt.isPresent()) {
            UserEntity userEntity = userEntityOpt.get();
            
            
            if (userEntity.isOtpExpired()) {
                return false;
            }
            
            
            if (userEntity.getOtp() != null && userEntity.getOtp().equals(otp)) {
                
                userRepository.delete(userEntity);
                return true;
            }
        }
        return false;
    }
}