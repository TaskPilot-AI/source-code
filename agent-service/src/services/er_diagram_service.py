from src.prompts.er_diagram import build_er_diagram_prompt
from src.services.gemini_service import generate_json, require_string

_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "er_diagram": {"type": "string"},
    },
    "required": ["er_diagram"],
    "additionalProperties": False,
}


def generate_er_diagram(definition: str, key_features: list[str]) -> str:
    prompt = build_er_diagram_prompt(definition, key_features)
    result = generate_json(
        prompt,
        "ER diagram",
        response_schema=_RESPONSE_SCHEMA,
    )
    return require_string(result, "er_diagram")
