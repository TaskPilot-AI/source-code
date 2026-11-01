from src.prompts.init_project import build_init_project_prompt
from src.schemas.requests import InitProjectRequest
from src.services.gemini_service import generate_json, require_string

_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "new_definition": {"type": "string"},
    },
    "required": ["new_definition"],
    "additionalProperties": False,
}


def initialize_project(payload: InitProjectRequest) -> dict[str, str]:
    prompt = build_init_project_prompt(
        project_name=payload.project_name,
        definition=payload.definition,
    )
    result = generate_json(
        prompt,
        "project definition",
        response_schema=_RESPONSE_SCHEMA,
    )
    return {"new_definition": require_string(result, "new_definition")}
