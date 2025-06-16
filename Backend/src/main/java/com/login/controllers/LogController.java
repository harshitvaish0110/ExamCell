package com.login.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.login.entity.Log;
import com.login.repositories.LogRepository;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*") // Allow frontend to connect (adjust in production)
public class LogController {

    @Autowired
    private LogRepository logRepository;

    @GetMapping
    public ResponseEntity<?> getAllLogs() {
        List<Log> logs = logRepository.findAll();
        if (logs.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<Log>());
        }
        return ResponseEntity.ok(logs);
    }
}
