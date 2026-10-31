from pathlib import Path
from agents.main_agents import *
from agents.diagram_agents import *
from agents.format_response import *
from flask import Flask, request, jsonify

BASE_DIR = Path(__file__).resolve().parent

# Flask app initialization
app = Flask(__name__)

# Template rendering setup
app.template_folder = str(Path(BASE_DIR, 'templates'))
app.static_folder = str(Path(BASE_DIR, 'static'))

# Utility function for validating request data


def validate_request_data(data, required_keys):
    missing_keys = [key for key in required_keys if key not in data]
    if missing_keys:
        return jsonify({"error": f"Missing parameters: {', '.join(missing_keys)}"}), 400
    return None

# Common error handling route


@app.errorhandler(400)
def handle_bad_request(error):
    return jsonify({"error": "Bad request, please check the data"}), 400


@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    return jsonify({"message": "Welcome to the AgentX Service!"})


@app.route("/init_project", methods=["POST"])
def init_project():
    data = request.get_json()
    validation_error = validate_request_data(
        data, ['project_name', 'defination'])
    if validation_error:
        return validation_error

    new_defination = redefine_defination(
        data['project_name'], data['defination'])

    try:
        new_defination = json.loads(new_defination)
    except:
        new_defination = {}
        new_defination['new_defination'] = ""

    return new_defination


@app.route("/identify_key_features", methods=["POST"])
def identify_key_features():
    data = request.get_json()
    validation_error = validate_request_data(data, ['defination'])
    if validation_error:
        return validation_error

    key_features = key_features_identification(data['defination'])

    try:
        key_features = json.loads(key_features)
    except:
        key_features = {}
        key_features['key_features'] = []

    return key_features


@app.route("/generate_docs", methods=["POST"])
def generate_docs():
    data = request.get_json()
    validation_error = validate_request_data(
        data, ['defination', 'key_features'])
    if validation_error:
        return validation_error

    doc_result = generate_documentation(
        data['defination'], data['key_features'])

    try:
        doc_result = json.loads(doc_result)
        doc_name = doc_result['doc_name']
        doc_desc = doc_result['doc_desc']
        doc_body = doc_result['doc_body']
    except:
        doc_name = ""
        doc_desc = ""
        doc_body = {}

    use_case = use_case_diagram(
        data['defination'])

    er = er_diagram(data['defination'], data['key_features'])

    return {
        "doc_name": doc_name,
        "doc_desc": doc_desc,
        "doc_body": doc_body,
        "use_case_diagram": use_case,
        "er_diagram": er
    }


@app.route("/create_tasks", methods=["POST"])
def create_tasks():
    data = request.get_json()
    validation_error = validate_request_data(
        data, ['defination', 'key_features'])
    if validation_error:
        return validation_error

    result = generate_tasks(data)

    try:
        result = json.loads(result)
    except:
        result = {}
        result['tasks'] = []
    return result


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
