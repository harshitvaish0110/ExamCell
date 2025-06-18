package com.login.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.login.entity.Log;
import com.login.entity.PasswordRequest;
import com.login.repositories.LogRepository;
import com.login.repositories.PasswordReqRepository;

@Service
public class PasswordReqService {

    @Autowired
    private PasswordReqRepository passwordReqRepository;

    @Autowired
    private LogRepository logRepository;

    @Autowired
    private StudentService studentService;

    // @Transactional
    public PasswordRequest createRequest(PasswordRequest preq) {
        if (passwordReqRepository.existsById(preq.getEmail())) {
            Log log = new Log();
            log.setMessage("Updated Password request for " + preq.getEmail());
            log.setUser(studentService.getUsernameByEmail(preq.getEmail()));
            logRepository.save(log);
            return passwordReqRepository.save(preq);
        };
        Log log = new Log();
        log.setMessage("Password request made for " + preq.getEmail());
        String username = studentService.getUsernameByEmail(preq.getEmail());
        log.setUser(username);
        logRepository.save(log);
        return passwordReqRepository.save(preq);
    }

    @Transactional
    public void deleteRequest(String email) {
        if (!passwordReqRepository.existsById(email)) {
            throw new RuntimeException("Password request does not exist for email: " + email);
        }
        passwordReqRepository.deleteById(email);
        Log log = new Log();
        log.setMessage("Deleted Password request for " + email);
        log.setUser(studentService.getUsernameByEmail(email));
        logRepository.save(log);
    }
    
}
