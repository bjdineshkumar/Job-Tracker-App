package com.jta.jtabackend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Date;

import org.springframework.stereotype.Component;  // Import this for Spring to recognize this as a bean

@Component  // Register this class as a Spring bean
public class JWTUtil {

    private String secretKey = "Wqng1PHH4277ZkvxIJvovyJcIB6ar41F";  // Use a more secure key in production

    // Generate JWT Token
    @SuppressWarnings("deprecation")
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour expiration
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract Username from the token
    public String extractUsername(String token) {
        Claims claims = parseClaims(token);
        return claims.getSubject();
    }

    // Parse the token to extract claims
    @SuppressWarnings("deprecation")
    private Claims parseClaims(String token) {
        // Use Jwts.parser() to parse the JWT
        return Jwts.parser()
                .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))  // Provide the same secret key for parsing
                .build()
                .parseClaimsJws(token)  // Parse the token and get the claims
                .getBody();  // Return the claims (body of the token)
    }

    // Validate token (check if it's expired or invalid)
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extract expiration date from the token
    public Date extractExpiration(String token) {
        Claims claims = parseClaims(token);
        return claims.getExpiration();
    }

    // Validate the token
    public boolean validateToken(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }
}


