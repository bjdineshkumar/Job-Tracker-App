package com.jta.jtabackend.controller;

import com.jta.jtabackend.model.JtaUser;
import com.jta.jtabackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public JtaUser register(@RequestBody JtaUser user) {
        return userService.registerUser(user);
    }

    @GetMapping("/profile")
    public ResponseEntity<String> getUserProfile() {
        return ResponseEntity.ok("This is a protected user profile route.");
    }
}
