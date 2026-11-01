from fastapi.routing import APIRouter
from .root import router as root_router
from .api import router as api_router

router = APIRouter()

router.include_router(root_router, tags=["Root"])
router.include_router(api_router, prefix="/api", tags=["API"])
