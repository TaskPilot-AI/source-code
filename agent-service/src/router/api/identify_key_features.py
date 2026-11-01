from fastapi import APIRouter

from src.schemas.requests import DefinitionRequest
from src.services.key_features_service import (
    identify_key_features as run_identify_key_features,
)

router = APIRouter()


@router.post("/identify_key_features")
def identify_key_features(payload: DefinitionRequest) -> dict[str, list[str]]:
    return run_identify_key_features(payload)
