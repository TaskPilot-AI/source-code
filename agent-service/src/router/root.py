from fastapi.routing import APIRouter

router = APIRouter()


@router.get("/")
async def home():
    return {"message": "Welcome to the AgentX Service!"}
