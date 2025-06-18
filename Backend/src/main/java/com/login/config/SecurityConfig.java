package com.login.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/logs",
                    "/api/validate-token",
                    "/api/request-otp", 
                    "/api/login", 
                    "/api/students",
                    "/api/students/**",
                    "/api/admin/login",
                    "/api/admin/**",
                    "/api/bonafide/sign",
                    "/api/bonafide/**", 
                    "/api/start-whatsapp-chat",
                    "/api/update-whatsapp",
                    "/api/verify-whatsapp",
                    "/api/password-requests",
                    "/api/password-requests/delete",
                    "/api/password-requests/create",
                    "/api/password-requests/accept",
                    "/api/password-requests/**"
                ).permitAll()
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
} 