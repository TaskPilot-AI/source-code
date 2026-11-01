from typing import Any

from src.prompts.generate_docs import build_generate_docs_prompt
from src.schemas.requests import DocumentationRequest
from src.services.er_diagram_service import generate_er_diagram
from src.services.gemini_service import (
    generate_json,
    require_list,
    require_string,
)
from src.services.use_case_diagram_service import generate_use_case_diagram

_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "doc_name": {"type": "string"},
        "doc_desc": {"type": "string"},
        "doc_body": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "section": {"type": "string"},
                    "content": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "subsection": {"type": "string"},
                                "content": {"type": "string"},
                            },
                            "required": ["subsection", "content"],
                            "additionalProperties": False,
                        },
                    },
                },
                "required": ["section", "content"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["doc_name", "doc_desc", "doc_body"],
    "additionalProperties": False,
}


def generate_documentation(
    payload: DocumentationRequest,
) -> dict[str, Any]:
    prompt = build_generate_docs_prompt(
        definition=payload.definition,
        key_features=payload.key_features,
    )
    result = generate_json(
        prompt,
        "documentation",
        response_schema=_RESPONSE_SCHEMA,
    )
    result["doc_name"] = require_string(result, "doc_name")
    result["doc_desc"] = require_string(result, "doc_desc")
    result["doc_body"] = require_list(result, "doc_body")

    result["use_case_diagram"] = generate_use_case_diagram(
        payload.definition
    )
    result["er_diagram"] = generate_er_diagram(
        payload.definition,
        payload.key_features,
    )
    return result
