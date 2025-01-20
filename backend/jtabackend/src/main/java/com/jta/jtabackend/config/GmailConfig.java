package com.jta.jtabackend.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

@Configuration
public class GmailConfig {

    @Value("${spring.gmail.api.credentials-path}")
    private Resource credentialsPath; // Automatically loads the value from application.properties

    @Bean
    public Resource getCredentialsPath() {
        return credentialsPath;
    }
}

