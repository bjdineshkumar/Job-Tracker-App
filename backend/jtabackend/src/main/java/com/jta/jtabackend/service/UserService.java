package com.jta.jtabackend.service;

import com.jta.jtabackend.model.JtaUser;
import com.jta.jtabackend.repository.UserRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public JtaUser registerUser(JtaUser user) {
        // if (emailExists(user.getEmail())) {
        //     throw new IllegalArgumentException("Email already exists");
        // }
        // Encode the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Method to check if a user exists by email
    // public boolean emailExists(String email) {
    //     return userRepository.findByEmail(email) != false;
    // }

    public JtaUser findByUsername(String username) {
        // Correct usage of Optional
        Optional<JtaUser> userOptional = userRepository.findByUsername(username);
        
        // Use .orElse() on the Optional, not the User object itself
        return userOptional.orElse(null);  // Returns the User if present, or null if not
    }
}
