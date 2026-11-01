from typing import Any

from fastapi import APIRouter

from src.schemas.requests import PipelineRequest
from src.services.pipeline_service import generate_project_pipeline

router = APIRouter()


@router.post("/pipeline")
def pipeline(payload: PipelineRequest) -> dict[str, Any]:
    return generate_project_pipeline(payload)
