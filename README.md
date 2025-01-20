# Job Tracker Application

## Overview
The **Job Tracker Application** is a full-stack web application designed to streamline the job application process for users. It provides features to log, track, and manage job applications, while integrating with Gmail to automatically extract relevant details. Additionally, the application incorporates a Flask-based machine learning model to analyze email content from Gmail and extract key points such as job positions and application details. Built with React, Spring Boot, MongoDB, Flask, and Material-UI, this application offers a scalable and user-friendly solution for job seekers.

---

## Features

### 1. **Job Application Management**
- Log details for each job application, including:
  - Company name
  - Job title
  - Date applied
  - Application status (e.g., Applied, Interview Scheduled, Offer Received)
- Visual dashboard for tracking statuses.

### 2. **Gmail Integration**
- Uses Google OAuth for secure user authentication.
- Automatically extracts job-related details from emails, such as:
  - Email sender
  - Subject line
  - Email body.
- Auto-populates entries in the application log based on parsed email content.

### 3. **Email Content Analysis**
- Integrates a Flask-based machine learning model to:
  - Analyze email content from Gmail.
  - Extract key points such as job titles, reference IDs, and application links.
  - Provide actionable insights to improve tracking accuracy.

### 4. **Resume Analysis and Keyword Matching**
- Analyzes uploaded resumes and compares them to job descriptions using:
  - React for a responsive UI to handle file uploads and input fields.
  - Flask for server-side processing of resumes and job descriptions.
  - A machine learning model to:
    - Identify matched and missing keywords.
    - Highlight key resume improvements.
- Displays analysis results in a structured table using Material-UI components.

### 5. **Filtering and Sorting**
- Filter applications by:
  - Date
  - Status
  - Company name.
- Server-side pagination for efficient handling of large datasets.

### 6. **Notifications**
- Alerts to remind users of:
  - Upcoming interviews.
  - Follow-up deadlines.

### 7. **Accessibility and Responsiveness**
- Fully responsive design for desktop, tablet, and mobile.
- Meets accessibility standards for inclusivity.

---

## Technology Stack

### **Frontend**
- React.js
  - React hooks for state management.
  - Context API for efficient state sharing.
  - Material-UI for UI components and styling.

### **Backend**
- Spring Boot
  - RESTful API design.
  - Business logic for job tracking and email parsing.

### **Database**
- MongoDB
  - Flexible schema for diverse data structures.
  - Indexed queries for fast data retrieval.

### **Machine Learning**
- Flask
  - Hosts the machine learning model for email and resume analysis.
  - Processes resumes and job descriptions to identify key matching and missing keywords.

### **Integration**
- Gmail API
  - OAuth 2.0 for secure authentication.
  - Real-time email data extraction.

---

## Installation

### Prerequisites
- Node.js and npm/yarn (for the frontend).
- Java 8+ (for the backend).
- Python 3.8+ (for the Flask server).
- MongoDB (running locally or on the cloud).
- Google API credentials for Gmail integration.

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/job-tracker.git
   cd job-tracker
   ```

2. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Setup Backend**:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

4. **Setup Flask Server**:
   ```bash
   cd ml_scripts
   pip install -r requirements.txt
   python app.py
   ```

5. **Configure MongoDB**:
   - Update the connection string in `application.properties` (backend):
     ```properties
     spring.data.mongodb.uri=mongodb://localhost:27017/jobtracker
     ```

6. **Configure Gmail API**:
   - Add your `credentials.json` file in the backend directory.
   - Ensure the Gmail API is enabled in your Google Cloud project.

7. **Run the Application**:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8080`
   - Flask Server: `http://localhost:5000`

---

## Usage
1. Log in using your Google account.
2. Add job applications manually or sync from Gmail.
3. Analyze email content for job-specific details like titles and links.
4. Upload resumes and job descriptions to get a detailed keyword matching analysis.
5. Use the dashboard to track application statuses and manage notifications.

---

## Future Enhancements
- **Analytics Dashboard**: Visual insights into application trends.
- **Multi-Account Support**: Integration with multiple email accounts.
- **Collaboration Features**: Share progress with mentors or peers.
- **Enhanced Machine Learning**: Improve email and resume parsing with additional NLP techniques.

---

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes and submit a pull request.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact
For questions or feedback, please reach out to Me at bjdineshkumar08@gmail.com.
