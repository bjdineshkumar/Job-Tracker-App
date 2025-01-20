from flask import Flask, request, jsonify
from transformers import pipeline
from fuzzywuzzy import process
import spacy
import re
import json
import os
import html
import logging
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Preload NER model and known titles
logger.info("Loading NER model...")
ner_pipeline = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")

logger.info("Loading known titles...")
current_dir = os.path.dirname(__file__)
json_file_path = os.path.join(current_dir, "known_title.json")

with open(json_file_path, "r") as f:
    known_titles = json.load(f)

# Load SpaCy model
logger.info("Loading SpaCy model...")
try:
    nlp = spacy.load("en_core_web_sm")
except Exception as e:
    logger.error(f"Failed to load SpaCy model: {e}")
    raise

# Helper functions
def clean_email_body(email_body):
    """Cleans up the email body by removing unnecessary characters and formatting."""
    if not email_body:
        return ""
    email_body = re.sub(r"<[^>]*>", "", email_body)
    email_body = html.unescape(email_body)
    email_body = re.sub(r"\s+", " ", email_body).strip()
    return email_body

def parse_email(email_body):
    """Parses the email body to extract job-related entities."""
    try:
        logger.info("Received email body for parsing.")
        results = ner_pipeline(email_body)
        logger.info(f"NER Results: {results}")

        entities = {
            "role": "",
            "company": "",
            "date": "",
        }

        for item in results:
            if item["entity"] == "ORG":
                entities["company"] = item["word"]
            elif item["entity"] == "DATE":
                entities["date"] = item["word"]

        raw_title = extract_job_position(email_body)
        entities["role"] = clean_job_title(raw_title)

        if not entities["company"]:
            entities["company"] = extract_company_name(email_body)

        logger.info(f"Extracted Entities: {entities}")
        return entities
    except Exception as e:
        logger.error(f"Error occurred while parsing email: {str(e)}")
        return {"error": str(e)}

def extract_company_name(text):
    """Extracts the company name from the email body."""
    patterns = [
        r"thank you for applying to (\w+)",
        r"your application for .*? at (\w+)",
        r"application received for .*? at (\w+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return "Unknown Company"

def extract_job_position(text):
    """Extracts the job position from the email body."""
    patterns = [
        r"the position of (.*?),",
        r"the (.*?) position",
        r"thank you for applying to the (.*?),",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return "Unknown Position"

def clean_job_title(raw_title):
    """Cleans and normalizes the extracted job title."""
    cleaned_title = re.sub(r"\s\d{4,}", "", raw_title)
    cleaned_title = re.sub(r"\s(at|with|for)\s.+", "", cleaned_title, flags=re.IGNORECASE)
    cleaned_title = re.sub(r"(position of|role of|vacancy for)\s", "", cleaned_title, flags=re.IGNORECASE)
    cleaned_title = re.sub(r"\s+", " ", cleaned_title).strip()

    match = process.extractOne(cleaned_title, known_titles)
    if match and match[1] > 80:
        return match[0]
    return cleaned_title

def extract_text(file):
    """Extracts text from uploaded resume file."""
    try:
        if file.filename.endswith(".pdf"):
            from PyPDF2 import PdfReader
            reader = PdfReader(file)
            return " ".join([page.extract_text() for page in reader.pages])
        elif file.filename.endswith(".docx"):
            import docx
            doc = docx.Document(file)
            return " ".join([p.text for p in doc.paragraphs])
        elif file.filename.endswith(".txt"):
            return file.read().decode("utf-8")
        else:
            return ""
    except Exception as e:
        logger.error(f"Error extracting text from file: {str(e)}")
        return ""

def keyword_analysis(resume_text, jd_text):
    """Analyzes the resume against the job description for missing keywords."""
    resume_doc = nlp(resume_text)
    jd_doc = nlp(jd_text)

    resume_keywords = {token.text.lower() for token in resume_doc if token.is_alpha and not token.is_stop}
    jd_keywords = {token.text.lower() for token in jd_doc if token.is_alpha and not token.is_stop}

    missing_keywords = jd_keywords - resume_keywords
    matched_keywords = jd_keywords & resume_keywords

    analysis = {
        "Matched Keywords": list(matched_keywords),
        "Missing Keywords": list(missing_keywords),
    }
    return analysis

# Routes
@app.route("/parse-email", methods=["POST"])
def parse_email_endpoint():
    try:
        data = request.get_json()
        if not data or "emailBody" not in data:
            return jsonify({"error": "No email body provided"}), 400

        email_body = data["emailBody"]
        result = parse_email(email_body)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/resume-analyze", methods=["POST"])
def resume_analyze():
    try:
        resume_file = request.files["resume"]
        jd_text = request.form["jd"]

        resume_text = extract_text(resume_file)
        if not resume_text or not jd_text:
            return jsonify({"error": "Invalid input!"}), 400

        analysis = keyword_analysis(resume_text, jd_text)
        return jsonify(analysis), 200
    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
