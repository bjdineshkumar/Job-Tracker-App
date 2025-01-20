package com.jta.jtabackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")  // Map to the root route (/)
    public String home() {
        
        return "Welcome to Job Tracker Application!";
    }

    @GetMapping("/home")
    public String homePage() {
        return "Welcome to the Home Page!";  // Simple text response for testing
    }


        @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
    }


    
}
