import json
import logging
import os
from json import JSONDecoder, JSONDecodeError
from typing import Any
from dotenv import load_dotenv
from fastapi import HTTPException
from langchain_google_genai import GoogleGenerativeAI

load_dotenv()  # Load environment variables from .env file

logger = logging.getLogger(__name__)


def generate_json(
    prompt: str,
    agent_name: str,
    response_schema: dict[str, Any] | None = None,
) -> dict[str, Any]:
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Google Gemini API key is not configured.",
        )

    try:
        model = GoogleGenerativeAI(
            model=os.getenv("GOOGLE_MODEL", "gemini-3.5-flash-lite"),
            temperature=1,
            api_key=api_key,
        )
        invoke_options = (
            {
                "response_mime_type": "application/json",
                "response_schema": response_schema,
            }
            if response_schema is not None
            else {}
        )
        response = model.invoke(prompt, **invoke_options)
    except Exception as error:
        logger.exception("Gemini request failed for agent %s", agent_name)
        raise HTTPException(
            status_code=502,
            detail="The AI provider could not complete the request.",
        ) from error

    result = _parse_json_response(response)

    if not isinstance(result, dict):
        raise HTTPException(
            status_code=502,
            detail=f"The {agent_name} agent returned an unexpected JSON response.",
        )
    return result


def require_string(result: dict[str, Any], key: str) -> str:
    value = result.get(key)
    if not isinstance(value, str):
        raise HTTPException(
            status_code=502,
            detail=f"The AI provider returned an invalid '{key}' value.",
        )
    return value


def require_string_list(result: dict[str, Any], key: str) -> list[str]:
    value = result.get(key)
    if not isinstance(value, list) or not all(
        isinstance(item, str) for item in value
    ):
        raise HTTPException(
            status_code=502,
            detail=f"The AI provider returned an invalid '{key}' value.",
        )
    return value


def require_list(result: dict[str, Any], key: str) -> list[Any]:
    value = result.get(key)
    if not isinstance(value, list):
        raise HTTPException(
            status_code=502,
            detail=f"The AI provider returned an invalid '{key}' value.",
        )
    return value


def _parse_json_response(response: str) -> Any:
    text = response.strip()
    if text.startswith("```"):
        text = text.removeprefix("```json").removeprefix("```").strip()
        if text.endswith("```"):
            text = text[:-3].strip()

    start = min(
        (index for index, character in enumerate(text) if character in "{["),
        default=-1,
    )
    if start < 0:
        raise _invalid_json_response()

    try:
        value, _ = JSONDecoder().raw_decode(text[start:])
    except JSONDecodeError as error:
        raise _invalid_json_response() from error
    return value


def _invalid_json_response() -> HTTPException:
    return HTTPException(
        status_code=502,
        detail="The AI provider did not return valid JSON.",
    )
