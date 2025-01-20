package com.jta.jtabackend.controller;

import com.jta.jtabackend.util.JWTUtil;
import com.jta.jtabackend.model.JtaUser;
import com.jta.jtabackend.repository.UserRepository;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController  // Marks this class as a REST controller
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtil jwtUtil;  // Your JWT utility class

    // Endpoint for user Registration
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody JtaUser user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }
        // Check if email already exists
        Optional<JtaUser> existingUser = userRepository.findByEmail(user.getEmail());
        
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already in use");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));  // Hash password
        userRepository.save(user);  // Save user in MongoDB

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody JtaUser loginRequest) {
        try {
            // Authenticate the user with provided credentials
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(), loginRequest.getPassword()
                )
            );

            // Generate JWT token upon successful authentication
            String token = jwtUtil.generateToken(loginRequest.getUsername());

            // Create a structured JSON response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", loginRequest.getUsername());

            // Return the JWT token in the response
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            // Handle authentication failure with specific message
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Invalid username or password"));
        } catch (Exception e) {
            // Handle other exceptions (e.g., server errors)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "An unexpected error occurred"));
        }
    }

     // Endpoint for fetching user profile
     @GetMapping("/profile")
     public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String token) {
         try {
             // Extract token from Authorization header
             String jwtToken = token.substring(7);  // Remove "Bearer " prefix
             String username = jwtUtil.extractUsername(jwtToken);  // Extract username from token
 
             // Fetch user from the repository
             Optional<JtaUser> user = userRepository.findByUsername(username);
             if (user.isPresent()) {
                 // Return user profile data
                 Map<String, Object> profile = new HashMap<>();
                 profile.put("username", user.get().getUsername());
                 profile.put("email", user.get().getEmail());
                 // You can add more fields from the user object if necessary
                 return ResponseEntity.ok(profile);
             } else {
                 return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
             }
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                     .body(Collections.singletonMap("error", "An unexpected error occurred"));
         }
     }
}
