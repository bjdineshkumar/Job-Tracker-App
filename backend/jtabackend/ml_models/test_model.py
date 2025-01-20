import re
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline

# Load the tokenizer and model
MODEL_PATH = "./ner_model"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForTokenClassification.from_pretrained(MODEL_PATH)

# Create a Named Entity Recognition (NER) pipeline
ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer)

# Test text
text = """
Hi Dinesh Kumar,
thank you for your interest in Front-End Engineer II, AWS Distributed SQL (ID: 2824068).

If you have completed the application:
Great! You can now check the application status here.

If you are still working on the application:
Don’t worry! You can complete it here when you're ready.

If you'd like to learn more about our culture and peculiar ways, visit amazon.jobs. Or you can get the latest Amazon news and stories by following our Day One blog.

Best regards,
Amazon Recruiting Team

Amazon is an equal-opportunity employer. Protecting your privacy and the security of your data are longstanding top priorities for Amazon. If you are an external candidate, please consult our Privacy Notice to learn more about how we collect, use and transfer the personal data of our candidates. You can let us know if you do not want to be contacted for recruitment purposes. Please refer to the "What are my rights under applicable data protection laws?" section of the Notice for more information. If you are an internal candidate, please consult the Employee Privacy Notice.

Please don’t reply to this email, as we can’t review or respond to messages at this address.

"""

# Perform NER
entities = ner_pipeline(text)

# Function to extract job position using regex
def extract_job_position(text):
    # Regex patterns to match job positions
    patterns = [
        r"the (.*?) position",                # "the [job title] position"
        r"the (.*?) role",                    # "the [job title] role"
        r"applying to the (.*?) ",            # "applying to the [job title]"
        r"your interest in the (.*?) position",  # "your interest in the [job title] position"
        r"your application for (.*?) \(",     # "your application for [job title] (details)"
        r"your application for (.*?)\.",      # "your application for [job title]."
        r"applied for (.*?)\.",               # "applied for [job title]."
        r"applied to (.*?) \(Job number",     # "applied to [job title] (Job number: XYZ)"
        r"for the role of (.*?) with reference",  # "for the role of [job title] with reference ID"
        r"your resume for the (.*?) ",        # "your resume for the [job title]"
        r"interest in the (.*?) job",         # "interest in the [job title] job"
        r"for the '(.*?)' role",              # "for the '[job title]' role"
        r"applying for \"(.*?)\"",            # 'applying for "[job title]"'
        r"applied for the position of (.*?)\.",  # "applied for the position of [job title]."
        r"application has been received for (.*?)\."  # "application has been received for [job title]."
        r"Thank you for your interest in (.*?)\." # Matches "Thank you for your interest in [job title]."
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()  # Extract the matched job title
    return "Unknown Position"

# Get the job position
job_position = extract_job_position(text)

print("Job Position:", job_position)
