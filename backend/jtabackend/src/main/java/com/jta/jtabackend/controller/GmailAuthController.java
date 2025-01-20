package com.jta.jtabackend.controller;

import com.jta.jtabackend.service.GmailService;
import com.jta.jtabackend.service.JobParsingService;

import jakarta.servlet.http.HttpSession;

import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;
import com.google.api.services.gmail.model.MessagePart;
import com.google.api.services.gmail.model.MessagePartHeader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
public class GmailAuthController {

    @Value("${spring.gmail.redirect-uri}")
    private String redirectUri;

    private final GmailService gmailService;

    public GmailAuthController(GmailService gmailService) {
        this.gmailService = gmailService;
    }

    @Autowired
    private JobParsingService jobParsingService;

    @PostMapping("/api/parse-email")
    public Map<String, String> parseEmail(@RequestBody Map<String, String> request) {
        String emailBody = request.get("emailBody");
        if (emailBody == null || emailBody.isEmpty()) {
            throw new IllegalArgumentException("emailBody is required.");
        }
        return jobParsingService.parseEmail(emailBody);
    }

    @GetMapping("/start-oauth")
    @ResponseBody
    public Map<String, Object> startOAuth(HttpSession session) throws Exception {
        Map<String, Object> response = new HashMap<>();
        String accessToken = (String) session.getAttribute("accessToken");

        if (accessToken != null && !gmailService.isTokenValid(accessToken)) {
            session.removeAttribute("accessToken");
            response.put("isLinked", false);
            response.put("authUrl", gmailService.getAuthorizationUrl());
        } else if (accessToken != null) {
            response.put("isLinked", true);
        } else {
            response.put("isLinked", false);
            response.put("authUrl", gmailService.getAuthorizationUrl());
        }

        return response;
    }

    @GetMapping("/oauth2callback")
    public RedirectView handleGoogleCallback(@RequestParam("code") String code, HttpSession session) {
        List<Map<String, String>> emailDetailsList = new ArrayList<>();
        try {
            System.out.println("inside the oauth2cal;lback");
            String accessToken = gmailService.getAccessToken(code);
            session.setAttribute("accessToken", accessToken);

            Gmail gmail = gmailService.getGmailService(accessToken);
            List<Message> messages = gmailService.listMessages(gmail);

            if (messages != null && !messages.isEmpty()) {
                for (Message message : messages) {

                    System.out.println("Inside the looooop");
                    Message detailedMessage = gmail.users().messages().get("me", message.getId()).execute();

                    String snippet = detailedMessage.getSnippet();
                    String sender = extractHeader(detailedMessage, "From");
                    String date = extractHeader(detailedMessage, "Date");
                    String body = getEmailBody(detailedMessage);

                    // Skip emails that are identified as generic or security-related
                    if (isNonJobRelatedEmail(sender, body)) {
                        continue;
                    }

                    // ML call of the API for getting the role
                    Map<String, String> parsedEmail = jobParsingService.parseEmail(body);

                    String company = extractCompany(sender, body);
                    String role = parsedEmail.getOrDefault("role", "Unknown Role");
                    String careerPage = extractCareerPage(body);
                    String status = extractStatus(body);

                    Map<String, String> emailData = new HashMap<>();
                    emailData.put("company", company);
                    emailData.put("role", role);
                    emailData.put("date", date);
                    emailData.put("careerPage", careerPage);
                    emailData.put("status", status);
                    emailDetailsList.add(emailData);
                }

                session.setAttribute("emails", emailDetailsList);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new RedirectView("http://localhost:3000/jobtracking");
    }

    @GetMapping("api/get-session-data")
    public Map<String, Object> getSessionData(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        @SuppressWarnings("unchecked")
        List<Map<String, String>> emailDetails = (List<Map<String, String>>) session.getAttribute("emails");
        String accessToken = (String) session.getAttribute("accessToken");

        response.put("isLinked", accessToken != null);
        response.put("emails", emailDetails != null ? emailDetails : new ArrayList<>());

        return response;
    }

    private String extractHeader(Message message, String headerName) {
        for (MessagePartHeader header : message.getPayload().getHeaders()) {
            if (header.getName().equalsIgnoreCase(headerName)) {
                return header.getValue();
            }
        }
        return "Unknown";
    }

    private String getEmailBody(Message message) {
        try {
            String body = "";
            List<MessagePart> parts = message.getPayload().getParts();
            if (parts != null) {
                for (MessagePart part : parts) {
                    if ("text/plain".equals(part.getMimeType())) {
                        body = part.getBody().getData();
                        break;
                    }
                }
            }
            return decodeBase64(body);
        } catch (Exception e) {
            return "No content available";
        }
    }

    private boolean isNonJobRelatedEmail(String sender, String body) {
        // Domains that often send unrelated emails
        String[] ignoredDomains = {
            "google", "security", "notifications", "newsletter", "marketing",
            "updates", "support", "helpdesk"
        };
    
        // Keywords indicating unrelated content
        String[] ignoredKeywords = {
            "security alert", "access granted", "password reset", "unusual activity",
            "device login", "account update", "subscription", "promotions",
            "offer", "sale", "discount", "newsletter", "donation", "survey",
            "feedback", "thank you for your purchase"
        };
    
        // Check for ignored domains in sender
        for (String domain : ignoredDomains) {
            if (sender.toLowerCase().contains(domain)) {
                return true; // Unrelated email
            }
        }
    
        // Check for ignored keywords in email body
        String lowerCaseBody = body.toLowerCase();
        for (String keyword : ignoredKeywords) {
            if (lowerCaseBody.contains(keyword)) {
                return true; // Unrelated email
            }
        }
    
        // Optional: Use regex to identify unrelated patterns (e.g., promotional links)
        Pattern promoPattern = Pattern.compile("(unsubscribe|click here to manage|promo code)", Pattern.CASE_INSENSITIVE);
        if (promoPattern.matcher(body).find()) {
            return true; // Unrelated email
        }
    
        return false; // Assume job-related if none of the checks matched
    }

    private String extractCompany(String sender, String body) {
        if (sender.contains("<")) {
            String name = sender.substring(0, sender.indexOf('<')).trim();
            return !name.isEmpty() ? name : extractFromDomain(sender);
        }
        return extractFromDomain(sender);
    }

    private String extractFromDomain(String sender) {
        if (sender.contains("@")) {
            String domain = sender.substring(sender.indexOf("@") + 1);
            domain = domain.split("\\.")[0];
            return domain.substring(0, 1).toUpperCase() + domain.substring(1);
        }
        return "Unknown Company";
    }

    private String extractRole(String body) {
        Pattern rolePattern = Pattern.compile("(your interest in the|applied for the|position of|role) (.*?) (position|role)?", Pattern.CASE_INSENSITIVE);
        Matcher matcher = rolePattern.matcher(body);
        return matcher.find() ? matcher.group(2).trim() : "Unknown Role";
    }

    private String extractCareerPage(String body) {
        Pattern urlPattern = Pattern.compile("(https?://[\\w./-]+/(careers|jobs)[\\w./-]*)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = urlPattern.matcher(body);
        return matcher.find() ? matcher.group(1) : "No Career Page Found";
    }

    private String extractStatus(String body) {
        // Normalize the text: remove commas and standardize whitespace
        String normalizedBody = body.toLowerCase().replaceAll("[,]", "").replaceAll("\\s+", " ").trim();
    
        // Rejection scenarios (prioritized)
        if (normalizedBody.contains("decided to continue forward with other candidates") || 
            normalizedBody.contains("unfortunately") || 
            normalizedBody.contains("we regret to inform you") || 
            normalizedBody.contains("after careful consideration") || 
            normalizedBody.contains("we will not be moving forward") || 
            normalizedBody.contains("your application was not successful") || 
            normalizedBody.contains("unable to proceed with your application") || 
            normalizedBody.contains("thank you for your interest but") || 
            normalizedBody.contains("we have decided not to pursue") || 
            normalizedBody.contains("you have not been selected") || 
            normalizedBody.contains("your profile did not meet our requirements") || 
            normalizedBody.contains("position has been filled")) {
            return "Rejected";
        }
    
        // Progress scenarios
        if (normalizedBody.contains("we are thrilled") || 
            normalizedBody.contains("congratulations") || 
            normalizedBody.contains("progressing") || 
            normalizedBody.contains("next steps") || 
            normalizedBody.contains("moving forward in the process") || 
            normalizedBody.contains("we would like to schedule") || 
            normalizedBody.contains("we are pleased to invite you")) {
            return "Progressing";
        }
    
        // Offer scenarios
        if (normalizedBody.contains("offer") || 
            normalizedBody.contains("we are excited to extend") || 
            normalizedBody.contains("we are pleased to offer") || 
            normalizedBody.contains("you have been selected for the role") || 
            normalizedBody.contains("your employment offer") || 
            normalizedBody.contains("we are thrilled to extend")) {
            return "Offer Made";
        }
    
        // Default status
        return "Unknown Status";
    }
    
    

    public String decodeBase64(String encoded) {
        String fixedString = encoded.replace('-', '+').replace('_', '/');
        return new String(Base64.getDecoder().decode(fixedString));
    }
}
