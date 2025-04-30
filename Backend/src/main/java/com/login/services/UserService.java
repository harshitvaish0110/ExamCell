package com.login.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import com.login.models.User;
import com.login.models.OtpUtil;
import com.login.models.JwtUtil;
import com.login.models.JwtResponse;

@Service
public class UserService {

    private static final Pattern IIITL_EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@iiitl\\.ac\\.in$");
    
    // In-memory storage for OTPs
    private final Map<String, String> otpStorage = new HashMap<>();
    
    // In-memory user storage
    private final Map<String, User> userStorage = new HashMap<>();

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;

    public boolean sendLoginOtp(String email) {
        if (!IIITL_EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email must end with @iiitl.ac.in");
        }
        
        String otp = OtpUtil.generateOtp();
        
        // Create or update user in memory
        User user = userStorage.getOrDefault(email, new User());
        user.setEmail(email);
        userStorage.put(email, user);
        
        // Store OTP in memory
        otpStorage.put(email, otp);
        emailService.sendOtpEmail(email, otp);
        return true;
    }
    
    public JwtResponse authenticateUserWithOtp(String email, String otp) {
        if (!IIITL_EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email must end with @iiitl.ac.in");
        }
        
        // Check if email exists in memory
        User user = userStorage.get(email);
        
        if (user != null) {
            // Check OTP from in-memory storage
            String storedOtp = otpStorage.get(email);
            if (storedOtp != null && storedOtp.equals(otp)) {
                // Clear the OTP after successful authentication
                otpStorage.remove(email);
                
                // Generate JWT token
                String token = jwtUtil.generateToken(email);
                emailService.sendWelcomeEmail(email);
                return new JwtResponse(token, email, "Authentication successful!");
                
            } else {
                return new JwtResponse(null, email, "Invalid OTP!");
            }
        } else {
            // Create user on the fly
            user = new User();
            user.setEmail(email);
            userStorage.put(email, user);
            
            return new JwtResponse(null, email, "User not found! Please request an OTP first.");
        }
    }
}