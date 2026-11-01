from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from src.router import router

app = FastAPI(
    title="AgentX Service",
    version="1.0.0",
    docs_url=None,
    redoc_url=None
)

app.include_router(router)


@app.exception_handler(RequestValidationError)
async def handle_request_validation_error(
    request: Request, error: RequestValidationError
) -> JSONResponse:
    missing_fields = list(
        dict.fromkeys(
            str(item["loc"][-1])
            for item in error.errors()
            if item["type"] == "missing"
            and item["loc"]
            and item["loc"][0] == "body"
        )
    )
    message = (
        f"Missing parameters: {', '.join(missing_fields)}"
        if missing_fields
        else "Bad request, please check the data"
    )
    return JSONResponse(status_code=400, content={"error": message})
