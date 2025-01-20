package com.jta.jtabackend.filter;

import com.jta.jtabackend.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {  // Extending OncePerRequestFilter

    @Autowired
    private JWTUtil jwtUtil;  // Inject JWT utility class

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response, 
                                     FilterChain filterChain) throws ServletException, IOException {
        
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        // Check if Authorization header exists and starts with "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);  // Extract JWT token from header
            username = jwtUtil.extractUsername(jwtToken);  // Extract username from token
        }

        // If username is not null and authentication is not already set
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(jwtToken, username)) {  // Validate the token
                // If token is valid, set the authentication object
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(username, null, null);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));  // Add details to the token
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);  // Set authentication context
            }
        }

        filterChain.doFilter(request, response);  // Continue with the filter chain
    }
}
