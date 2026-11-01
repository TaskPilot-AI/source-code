from typing import Any

from fastapi import APIRouter

from src.schemas.requests import DocumentationRequest
from src.services.documentation_service import generate_documentation

router = APIRouter()


@router.post("/generate_docs")
def generate_docs(payload: DocumentationRequest) -> dict[str, Any]:
    return generate_documentation(payload)
