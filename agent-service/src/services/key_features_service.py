from src.prompts.identify_key_features import (
    build_identify_key_features_prompt,
)
from src.schemas.requests import DefinitionRequest
from src.services.gemini_service import generate_json, require_string_list

_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "key_features": {
            "type": "array",
            "items": {"type": "string"},
        },
    },
    "required": ["key_features"],
    "additionalProperties": False,
}


def identify_key_features(payload: DefinitionRequest) -> dict[str, list[str]]:
    prompt = build_identify_key_features_prompt(payload.definition)
    result = generate_json(
        prompt,
        "key-features",
        response_schema=_RESPONSE_SCHEMA,
    )
    return {"key_features": require_string_list(result, "key_features")}
