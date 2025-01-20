const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// OAuth2 client credentials (clientID, clientSecret, and redirectURI)
const credentials = require('./credentials.json'); // This should be the path to the credentials file you downloaded from Google Developer Console

const oauth2Client = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  credentials.redirect_uris[0]  // Use the redirect URI you've defined in your Google Developer Console
);

// Generate an authentication URL
function generateAuthUrl() {
  const scopes = ['https://www.googleapis.com/auth/gmail.readonly']; // Request Gmail API access
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
}

// Get the tokens after user authenticates
async function getTokens(code) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens); // Set tokens for future API requests
    return tokens;
  } catch (error) {
    console.error('Error getting tokens:', error);
    throw error;
  }
}

// Get user profile (for example, email address, name, etc.)
async function getUserProfile() {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  try {
    const response = await gmail.users.getProfile({
      userId: 'me',  // 'me' refers to the authenticated user
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

module.exports = {
  generateAuthUrl,
  getTokens,
  getUserProfile,
};
