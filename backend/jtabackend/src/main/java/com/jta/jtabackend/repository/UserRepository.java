package com.jta.jtabackend.repository;

import com.jta.jtabackend.model.JtaUser;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<JtaUser, String> {
    
    // This returns an Optional of User, which can be handled with orElse()
    Optional<JtaUser> findByUsername(String username);

    // Custom query to check if a user exists by their username
    boolean existsByUsername(String username);

    Optional<JtaUser> findByEmail(String email);
}
