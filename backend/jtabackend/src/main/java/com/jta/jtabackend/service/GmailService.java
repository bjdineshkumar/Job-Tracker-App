package com.jta.jtabackend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.api.services.gmail.model.ListMessagesResponse;
import com.google.api.services.gmail.model.Message;

import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class GmailService {

    private final String clientId = "658978032269-qp83qfdqmcgvijlo0trtkc7caueg7vo1.apps.googleusercontent.com";
    private final String clientSecret = "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";
    private final String redirectUri = "http://localhost:8080/oauth2callback"; // Adjust this

// In GmailService.java or wherever you're handling the OAuth exchange logic
public String getAccessToken(String code) throws Exception {
    // Use the authorization code to get the access token
    GoogleAuthorizationCodeTokenRequest tokenRequest = new GoogleAuthorizationCodeTokenRequest(
            GoogleNetHttpTransport.newTrustedTransport(),
            JacksonFactory.getDefaultInstance(),
            clientId,
            clientSecret,
            code,
            redirectUri);  // This should match the redirect URI you provided in the console
    
    // Exchange the code for an access token
    GoogleTokenResponse response = tokenRequest.execute();
    String accessToken = response.getAccessToken();
    System.out.println("Access Token: " + accessToken);

    String refreshToken = response.getRefreshToken();
    System.out.println("Refresh Token: " + refreshToken);
    
    // Store the token securely for use in future requests
    // You can store it in a session, database, or secure cookie
    return accessToken;
}

    public String getAuthorizationUrl() throws GeneralSecurityException, IOException {
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                clientId,
                clientSecret,
                Collections.singleton(GmailScopes.GMAIL_READONLY)
        ).setAccessType("offline")
         .build();
         System.out.println("Authorization URL: " + flow.newAuthorizationUrl().setRedirectUri(redirectUri).build());

        return flow.newAuthorizationUrl().setRedirectUri(redirectUri).build();
    }

    public Gmail getGmailService(String accessToken) throws GeneralSecurityException, IOException {
        GoogleCredentials credentials = GoogleCredentials.create(new AccessToken(accessToken, null));
        Gmail gmail = new Gmail.Builder(
            GoogleNetHttpTransport.newTrustedTransport(),
            JacksonFactory.getDefaultInstance(),
            new HttpCredentialsAdapter(credentials)
        ).setApplicationName("JobTracking App").build();

        System.out.println("Initializing Gmail service with access token: " + accessToken);

        
        return gmail;
    }

    public List<Message> listMessages(Gmail gmailService) throws IOException {
        String user = "me";  // Refers to the authenticated user
        List<String> labelIds = Arrays.asList("INBOX", "IMPORTANT");
        ListMessagesResponse response = gmailService.users().messages().list("me")
            .setLabelIds(labelIds)  // Pass a list, not individual strings
            .setMaxResults(25L).execute(); 

        System.out.println("Fetching messages with labels: " + labelIds);
        System.out.println("Messages fetched: " + (response.getMessages() != null ? response.getMessages().size() : 0));
            
        
        return response.getMessages();
    }

    public boolean isTokenValid(String accessToken) throws Exception {
        try {
            Gmail gmail = getGmailService(accessToken);
            gmail.users().getProfile("me").execute();
            return true;
        } catch (IOException e) {
            return false;
        }
    }
}
