from transformers import pipeline
from fuzzywuzzy import process
import re
import json
import logging
import sys
import json
import os
import html

# Configure logging to a file or disable it
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)  # Change to ERROR to suppress logs in production

# Get the current script's directory
current_dir = os.path.dirname(__file__)

# Reference the JSON file in the same directory
json_file_path = os.path.join(current_dir, "known_title.json")

with open(json_file_path, "r") as f:
    known_titles = json.load(f)

def parse_email(email_body):
    """
    Extracts job-related entities from an email body using NER and regex.
    """
    # Load the NER model
    ner_pipeline = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")
    try:
        # Log input for debugging
        logger.info("Received email body for parsing.")

        # Perform NER
        results = ner_pipeline(email_body)
        logger.info(f"NER Results: {results}")

        # Initialize entities
        entities = {
            "role": "",
            "company": "",
            "date": "",
        }

        # Extract entities from NER
        for item in results:
            if item["entity"] == "ORG":
                entities["company"] = item["word"]
            elif item["entity"] == "DATE":
                entities["date"] = item["word"]

        # Use regex to extract job position
        raw_title = extract_job_position(email_body)

        # Clean the raw title
        entities["role"] = clean_job_title(raw_title)

        # Extract company name using regex if not found by NER
        if not entities["company"]:
            entities["company"] = extract_company_name(email_body)


        # Return the extracted entities
        logger.info(f"Extracted Entities: {entities}")
        return entities
    except Exception as e:
        logger.error(f"Error occurred while parsing email: {str(e)}")
        return {"error": str(e)}
    
def extract_company_name(text):
    """
    Extracts the company name from the email body using regex patterns.
    """
    patterns = [
        r"thank you for applying to (\w+)",  # Matches "Thank you for applying to [Company]"
        r"your application for .*? at (\w+)",  # Matches "Your application for [Role] at [Company]"
        r"we’ve received your application for .*? at (\w+)",  # Matches "We've received your application for [Role] at [Company]"
        r"application received for .*? at (\w+)",  # Matches "Application received for [Role] at [Company]"
        r"interview with (\w+)",  # Matches "Interview with [Company]"
        r"from (\w+ recruiting team)",  # Matches "From [Company] recruiting team"
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            logger.info(f"Matched Company Pattern: {pattern}, Extracted Company: {match.group(1)}")
            return match.group(1).strip()

    logger.warning("No pattern matched for company name.")
    return "Unknown Company"

def extract_job_position(text):
    """
    Extracts the job position from the email body using regex patterns.
    """
    patterns = [
        # General patterns for job titles
        r"the position of (.*?),",  # Matches "the position of [role],"
        r"the (.*?) position",  # Matches "the [role] position"
        r"the (.*?) role",  # Matches "the [role] role"
        r"applying to the (.*?) ",  # Matches "applying to the [role]"

        # Patterns for specific phrases
        r"your interest in the (.*?) position",  # Matches "your interest in the [role] position"
        r"your application for (.*?) \(",  # Matches "your application for [role] (details)"
        r"your application for (.*?)\.",  # Matches "your application for [role]."
        r"applied for (.*?)\.",  # Matches "applied for [role]."
        r"applied to (.*?) \(Job number",  # Matches "applied to [role] (Job number)"
        r"for the role of (.*?) with reference",  # Matches "for the role of [role] with reference ID"

        # Patterns with job IDs or suffixes
        r"we’ve received your application for the (.*?),",  # Matches "we’ve received your application for the [role],"
        r"application received for the (.*?) \(ID:",  # Matches "application received for the [role] (ID: XYZ)"
        r"we have received your application for the (.*?),",  # Matches "we have received your application for the [role],"
        r"application for the (.*?),",  # Matches "application for the [role],"
        r"your application for the (.*?) at",  # Matches "your application for the [role] at [Company]"

        # Patterns for direct mention of job roles
        r"interest in the (.*?) job",  # Matches "interest in the [role] job"
        r"for the '(.*?)' role",  # Matches "for the '[role]' role"
        r"applying for \"(.*?)\"",  # Matches 'applying for "[role]"'
        r"applied for the position of (.*?)\.",  # Matches "applied for the position of [role]."

        # Patterns with additional descriptive text
        r"application for the (.*?), (.*?)\.",  # Matches "application for the [role], [details]."
        r"we regret to inform you that the (.*?) position",  # Matches "we regret to inform you that the [role] position"
        r"thank you for your interest in the (.*?) role",  # Matches "thank you for your interest in the [role] role"
        r"thank you for applying to the (.*?),",  # Matches "thank you for applying to the [role],"
        r"your application for the (.*?) with",  # Matches "your application for the [role] with [details]"
        r"your resume for the (.*?) ",  # Matches "your resume for the [role]"
        r"you have applied for the (.*?) position",  # Matches "you have applied for the [role] position"
        r"job application for the (.*?) position",  # Matches "job application for the [role] position"

        # Rejection or update notifications
        r"we will not be moving forward with your application for the (.*?) role",  # Matches "we will not be moving forward with your application for the [role] role"
        r"we regret to inform you that the (.*?) position",  # Matches "we regret to inform you that the [role] position"
        r"your profile was not shortlisted for the (.*?) vacancy",  # Matches "your profile was not shortlisted for the [role] vacancy"
        r"your application for the (.*?) has been declined",  # Matches "your application for the [role] has been declined"

        # Progress and success
        r"congratulations on progressing for the (.*?) position",  # Matches "congratulations on progressing for the [role] position"
        r"we are pleased to offer you the (.*?) position",  # Matches "we are pleased to offer you the [role] position"
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            logger.info(f"Matched Pattern: {pattern}, Extracted Role: {match.group(1)}")
            return match.group(1).strip()
        else:
            logger.debug(f"No match for pattern: {pattern}")
    logger.warning("No pattern matched for job position.")
    return "Unknown Position"


def clean_job_title(raw_title):
    """
    Cleans the extracted job title by removing extra details like IDs, company names, and unnecessary words.
    """
    # Remove trailing numbers or IDs (e.g., "1782207")
    cleaned_title = re.sub(r"\s\d{4,}", "", raw_title)
    # Remove company names (e.g., "at Microsoft")
    cleaned_title = re.sub(r"\s(at|with|for)\s.+", "", cleaned_title, flags=re.IGNORECASE)
    # Remove phrases like "position of" or "role of"
    cleaned_title = re.sub(r"(position of|role of|vacancy for|candidacy for)\s", "", cleaned_title, flags=re.IGNORECASE)
    # Normalize whitespace
    cleaned_title = re.sub(r"\s+", " ", cleaned_title).strip()

    match = process.extractOne(cleaned_title, known_titles)
    if match and match[1] > 80:
        return match[0]

    return cleaned_title

def clean_email_body(email_body):
    if not email_body:
        return ""
    # Remove HTML tags
    email_body = re.sub(r"<[^>]*>", "", email_body)
    # Decode HTML entities
    email_body = html.unescape(email_body)
    # Normalize newlines and whitespace
    email_body = re.sub(r"\s+", " ", email_body).strip()
    return email_body


if __name__ == "__main__":
    # Check if an email body was passed as an argument
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No email body provided."}))
        sys.exit(1)

    # Read the email body from the first argument
    email_body = sys.argv[1]
    email_body = clean_email_body(email_body)

    # Parse the email
    parsed_data = parse_email(email_body)

    # Print the parsed data as JSON for the Java backend
    print(json.dumps(parsed_data))