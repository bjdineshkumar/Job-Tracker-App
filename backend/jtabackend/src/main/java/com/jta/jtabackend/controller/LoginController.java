package com.jta.jtabackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @GetMapping("/login")
    public String loginPage() {
        return "Login Page";  // Return some response or HTML for the login page
    }
}
