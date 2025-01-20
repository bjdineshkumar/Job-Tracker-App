package com.jta.jtabackend.config;


import com.jta.jtabackend.filter.JwtRequestFilter;
import com.jta.jtabackend.service.MongoUserDetailsService;


import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
public class SecurityConfig {

    @Autowired
    private MongoUserDetailsService userDetailsService; 

    private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    // Define AuthenticationManager as a Bean
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authManagerBuilder.userDetailsService(userDetailsService)  // Use the injected service, not a method call
                           .passwordEncoder(passwordEncoder());    // Set the password encoder
        return authManagerBuilder.build();
    }



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity (re-enable with token for production)
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Apply CORS configuration
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(
                    "/oauth2callback", 
                    "/start-oauth", 
                    "/api/gmail/messages", 
                    "/api/users/register", 
                    "/api/auth/login", 
                    "/error", 
                    "/home", 
                    "/api/auth/register", 
                    "/", 
                    "api/get-session-data",
                    "/api/parse-email"
                ).permitAll() // Public endpoints
                .anyRequest().authenticated()) // Secure all other endpoints
            .formLogin(form -> form.disable()) // Disable form-based login
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter if needed

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Allow frontend origin
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allow HTTP methods
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type", "X-Requested-With")); // Allow headers
        configuration.setExposedHeaders(Arrays.asList("Authorization")); // Expose headers for the frontend
        configuration.setAllowCredentials(true); // Allow cookies/credentials

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply to all endpoints
        return source;
    }

    

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // Stronger password encoding
    }


}
