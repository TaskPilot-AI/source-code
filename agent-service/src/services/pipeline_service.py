from typing import Any

from fastapi import HTTPException

from src.schemas.requests import (
    DocumentationRequest,
    PipelineRequest,
    TaskRequest,
)
from src.services.documentation_service import generate_documentation
from src.services.gemini_service import require_string
from src.services.task_service import generate_tasks


def generate_project_pipeline(payload: PipelineRequest) -> dict[str, Any]:
    if payload.response_type != "json":
        raise HTTPException(
            status_code=400,
            detail="Only JSON responses are supported.",
        )

    definition = payload.definition or payload.description
    if not definition:
        raise HTTPException(
            status_code=400,
            detail="Either description or definition is required.",
        )

    documentation = generate_documentation(
        DocumentationRequest(
            definition=definition,
            key_features=payload.key_features,
        )
    )
    tasks = generate_tasks(
        TaskRequest(
            definition=definition,
            key_features=payload.key_features,
            project_name=payload.project_name,
            employees=payload.employees,
            development_type=payload.development_type,
            complexity=payload.complexity,
            description=payload.description,
            timeline=payload.timeline,
        )
    )

    return {
        "name": documentation["doc_name"],
        "description": documentation["doc_desc"],
        "doc_body": documentation["doc_body"],
        "tasks": tasks["tasks"],
        "er_diagram": require_string(documentation, "er_diagram"),
        "use_case_diagram": require_string(documentation, "use_case_diagram"),
    }
