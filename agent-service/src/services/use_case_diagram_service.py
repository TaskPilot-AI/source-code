from src.prompts.use_case_diagram import build_use_case_diagram_prompt
from src.services.gemini_service import generate_json, require_string

_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "use_case_diagram": {"type": "string"},
    },
    "required": ["use_case_diagram"],
    "additionalProperties": False,
}


def generate_use_case_diagram(definition: str) -> str:
    prompt = build_use_case_diagram_prompt(definition)
    result = generate_json(
        prompt,
        "use-case diagram",
        response_schema=_RESPONSE_SCHEMA,
    )
    return require_string(result, "use_case_diagram")
