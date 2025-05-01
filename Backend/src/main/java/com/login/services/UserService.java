package com.login.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Pattern;

import com.login.models.UserEntity;
import com.login.models.OtpUtil;
import com.login.models.JwtUtil;
import com.login.models.JwtResponse;
import com.login.repositories.UserRepository;

@Service
public class UserService {

    private static final Pattern IIITL_EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@iiitl\\.ac\\.in$");
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private JwtUtil jwtUtil;

    public boolean sendLoginOtp(String email) {
        if (!IIITL_EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email must end with @iiitl.ac.in");
        }
        
        String otp = OtpUtil.generateOtp();
        
        // Create or update user in database
        UserEntity userEntity = userRepository.findById(email)
                                .orElse(new UserEntity());
        userEntity.setEmailId(email);
        userEntity.setOtp(otp);
        userEntity.setOtpCreatedAt(LocalDateTime.now());
        
        userRepository.save(userEntity);
        emailService.sendOtpEmail(email, otp);
        return true;
    }
    
    public JwtResponse authenticateUserWithOtp(String email, String otp) {
        if (!IIITL_EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email must end with @iiitl.ac.in");
        }
        
        // Check if email exists in database
        Optional<UserEntity> userEntityOpt = userRepository.findById(email);
        
        if (userEntityOpt.isPresent()) {
            UserEntity userEntity = userEntityOpt.get();
            
            // Check if OTP is expired
            if (userEntity.isOtpExpired()) {
                return new JwtResponse(null, email, "OTP has expired. Please request a new one.");
            }
            
            // Check OTP from database
            if (userEntity.getOtp() != null && userEntity.getOtp().equals(otp)) {
                // Clear the OTP after successful authentication
                userRepository.delete(userEntity);
                
                // Generate JWT token
                String token = jwtUtil.generateToken(email);
                emailService.sendWelcomeEmail(email);
                return new JwtResponse(token, email, "Authentication successful!");
                
            } else {
                return new JwtResponse(null, email, "Invalid OTP!");
            }
        } else {
            return new JwtResponse(null, email, "User not found! Please request an OTP first.");
        }
    }
}