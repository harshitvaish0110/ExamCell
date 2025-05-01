package com.login.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendOtpEmail(String to, String otp) {
        System.out.println("Sending this OTP: " + otp);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Authentication OTP - Indian Institute of Information Technology, Lucknow");
        message.setText("Dear " + to + ",\n\n"
                + "We have received a request for authentication on the IIIT Lucknow portal. "
                + "Your One-Time Password (OTP) for secure authentication is: " + otp + "\n\n"
                + "This OTP will expire in 10 minutes. Please do not share this OTP with anyone, "
                + "as it is meant for secure verification purposes only.\n\n"
                + "If you did not request this OTP, please contact the IT department immediately.\n\n"
                + "Regards,\n"
                + "Examination Cell\n"
                + "Indian Institute of Information Technology, Lucknow\n"
                + "Chak Ganjaria, Mastemau, Lucknow - 226002\n"
                + "https://iiitl.ac.in");
        
        try {
            message.setFrom("namanhere23@gmail.com");
            javaMailSender.send(message);
            
        } catch (Exception e) {
            logger.error("Failed to send OTP email: {}", e.getMessage());
        }
    }

    public void sendWelcomeEmail(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to IIIT Lucknow Portal - Authentication Successful");
        message.setText("Dear " + to + ",\n\n"
                + "We are pleased to confirm your successful authentication to the Indian Institute of Information Technology, Lucknow portal.\n\n"
                + "You now have access to our institutional services and resources. If you encounter any technical difficulties or have questions regarding your account, please contact our IT support team.\n\n"
                + "Thank you for maintaining the security protocols of our institution.\n\n"
                + "Regards,\n"
                + "Examination Cell\n"
                + "Indian Institute of Information Technology, Lucknow\n"
                + "Chak Ganjaria, Mastemau, Lucknow - 226002\n"
                + "https://iiitl.ac.in");
        
        try {
            message.setFrom("namanhere23@gmail.com");
            javaMailSender.send(message);
            
        } catch (Exception e) {
            logger.error("Failed to send welcome email: {}", e.getMessage());
        }
    }
    
    private String extractName(String email) {
        // Extract name from email if possible, otherwise use default
        if (email != null && email.contains("@")) {
            String username = email.substring(0, email.indexOf('@'));
            // Convert format like "john.doe" to "John Doe"
            if (username.contains(".")) {
                String[] parts = username.split("\\.");
                StringBuilder nameBuilder = new StringBuilder();
                for (String part : parts) {
                    if (part.length() > 0) {
                        nameBuilder.append(Character.toUpperCase(part.charAt(0)))
                                  .append(part.substring(1))
                                  .append(" ");
                    }
                }
                return nameBuilder.toString().trim();
            } else {
                // Just capitalize the first letter
                if (username.length() > 0) {
                    return Character.toUpperCase(username.charAt(0)) + username.substring(1);
                }
            }
        }
        return "Student";
    }
}