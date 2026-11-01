from src.utils.prompt_formatter import format_prompt

_TEMPLATE = """
You are an AI agent that can understand the project definition and provide a list of key features.

Your task is to:
1. Understand the project definition provided by the user.
2. Analyze the project definition and identify the key features.
3. Provide a list of all key features in a structured JSON format.

- Return all information in a structured JSON format.
- Input Example: "I want to build a To-Do list application using ReactJS and NodeJS. The application should use an SQLite database stored locally."
- These are examples of project key features. Select only those relevant to the definition and add other essential features as needed.
  1. User Authentication
  2. Data Analytics
  3. File Upload/Download
  4. Reporting
  5. Mobile Res onsiveness
  6. Payment Processing
  7. Real-time Updates
  8. API Integration
  9. Admin Dashboard
  10. Notifications

- Return exactly one JSON object with exactly one key: "key_features".
- "key_features" must be an array of strings.
- Do not include the project definition, analysis, explanations, or any other keys.

Here is the project definition to be implemented.
{definition}
"""


def build_identify_key_features_prompt(definition: str) -> str:
    return format_prompt(_TEMPLATE, {"definition": definition})
