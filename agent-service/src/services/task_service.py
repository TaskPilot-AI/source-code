import json
from typing import Any

from src.prompts.create_tasks import build_create_tasks_prompt
from src.schemas.requests import TaskRequest
from src.services.gemini_service import generate_json, require_list

_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "tasks": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "desc": {"type": "string"},
                    "priority": {
                        "type": "string",
                        "enum": ["Low", "Medium", "High"],
                    },
                    "assigned_to": {"type": "string"},
                    "required_skills": {
                        "type": "array",
                        "items": {"type": "string"},
                    },
                    "deadline": {"type": "string"},
                },
                "required": [
                    "name",
                    "desc",
                    "priority",
                    "assigned_to",
                    "required_skills",
                    "deadline",
                ],
                "additionalProperties": False,
            },
        },
    },
    "required": ["tasks"],
    "additionalProperties": False,
}


def generate_tasks(payload: TaskRequest) -> dict[str, list[Any]]:
    employee_summary = "; ".join(
        f"{employee.name} ({employee.designation}; skills: "
        f"{', '.join(employee.skillset)})"
        for employee in payload.employees
    )
    ssd_request = (
        f"Team members: {employee_summary or 'None provided'}. "
        f"Timeline: {payload.timeline or 'Not specified'} days."
    )
    project_details = json.dumps(
        payload.model_dump(),
        ensure_ascii=False,
        indent=2,
    )
    prompt = build_create_tasks_prompt(
        num_of_devs=len(payload.employees),
        ssd_request=ssd_request,
        documentation=project_details,
    )
    result = generate_json(
        prompt,
        "task generation",
        response_schema=_RESPONSE_SCHEMA,
    )
    return {"tasks": require_list(result, "tasks")}
