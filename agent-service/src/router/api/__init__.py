from fastapi.routing import APIRouter
from src.router.api.create_tasks import router as create_tasks_router
from src.router.api.generate_docs import router as generate_docs_router
from src.router.api.identify_key_features import router as identify_key_features_router
from src.router.api.init_project import router as init_project_router
from src.router.api.pipeline import router as pipeline_router

router = APIRouter()
router.include_router(init_project_router)
router.include_router(identify_key_features_router)
router.include_router(generate_docs_router)
router.include_router(create_tasks_router)
router.include_router(pipeline_router)
