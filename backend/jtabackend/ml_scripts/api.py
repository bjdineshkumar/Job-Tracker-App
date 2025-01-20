from flask import Flask, request, jsonify
from email_parser import parse_email

app = Flask(__name__)

@app.route('/parse-email', methods=['POST'])
def parse_email_route():
    data = request.get_json()
    email_body = data.get("email_body", "")
    response = parse_email(email_body)
    return jsonify(response)

if __name__ == "__main__":
    app.run(port=5000)
