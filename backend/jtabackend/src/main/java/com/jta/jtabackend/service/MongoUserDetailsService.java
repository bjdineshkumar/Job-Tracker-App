package com.jta.jtabackend.service;

import com.jta.jtabackend.model.JtaUser;
import com.jta.jtabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class MongoUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Fetch user from MongoDB based on the username
        Optional<JtaUser> optionalUser  = userRepository.findByUsername(username);

        // Throw an exception if the user is not found
        // Check if the user is present; throw exception if not
        JtaUser user = optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));


        // Map user roles (if you have them) to authorities; currently using empty roles
        return new User(
            user.getUsername(),           // Username from MongoDB
            user.getPassword(),           // Hashed password from MongoDB
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")) // Default role
        );
    }
}
