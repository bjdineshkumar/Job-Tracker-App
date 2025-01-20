package com.jta.jtabackend.service;

import java.net.http.*;
import java.net.URI;
import java.net.http.HttpRequest.BodyPublishers;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class JobParsingService {

    private static final String FLASK_SERVICE_URL = "http://flask-service:5000/parse-email"; // Flask API URL

    @SuppressWarnings("unchecked")
    public Map<String, String> parseEmail(String emailBody) {
        Map<String, String> parsedResult = new HashMap<>();
        try {
            // Create HTTP client
            HttpClient client = HttpClient.newHttpClient();

            ObjectMapper objectMapper = new ObjectMapper();

            // Create JSON payload
            String requestBody = objectMapper.writeValueAsString(Map.of("emailBody", emailBody));
            System.out.println("Payload sent to Flask: " + requestBody);
    

            System.out.println("Before inintializing the flask");

            // Build HTTP POST request
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(FLASK_SERVICE_URL))
                .header("Content-Type", "application/json")
                .POST(BodyPublishers.ofString(requestBody))
                .build();

            // Send request and get response
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // Check for successful response
            if (response.statusCode() != 200) {
                throw new IllegalStateException("Flask service returned error: " + response.body());
            }

            // Parse the JSON response
            parsedResult = new ObjectMapper().readValue(response.body(), HashMap.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to call Flask service: " + e.getMessage());
        }
        return parsedResult;
    }
}