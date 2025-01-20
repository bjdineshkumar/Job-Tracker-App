package com.jta.jtabackend.controller;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MongoDBTestController {

    @GetMapping("/test-mongodb")
    public String testMongoDBConnection() {
        try (MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017")) {
            mongoClient.listDatabaseNames();  // Try to retrieve database names
            return "Connected to MongoDB successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to connect to MongoDB: " + e.getMessage();
        }
    }
}
