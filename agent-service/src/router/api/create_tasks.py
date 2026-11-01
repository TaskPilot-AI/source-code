from typing import Any

from fastapi import APIRouter

from src.schemas.requests import TaskRequest
from src.services.task_service import generate_tasks

router = APIRouter()


@router.post("/create_tasks")
def create_tasks(payload: TaskRequest) -> dict[str, Any]:
    return generate_tasks(payload)
