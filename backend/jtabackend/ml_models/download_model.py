from transformers import AutoTokenizer, AutoModelForTokenClassification

# Specify the model name
MODEL_NAME = "dbmdz/bert-large-cased-finetuned-conll03-english"

# Download the tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForTokenClassification.from_pretrained(MODEL_NAME)

# Save the model locally
model.save_pretrained("ml_models/ner_model")
tokenizer.save_pretrained("ml_models/ner_model")

print("Model and tokenizer downloaded and saved to 'ml_models/ner_model'")
