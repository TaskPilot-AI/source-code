from fastapi import APIRouter

from src.schemas.requests import InitProjectRequest
from src.services.init_project_service import initialize_project

router = APIRouter()


@router.post("/init_project")
def init_project(payload: InitProjectRequest) -> dict[str, str]:
    return initialize_project(payload)
