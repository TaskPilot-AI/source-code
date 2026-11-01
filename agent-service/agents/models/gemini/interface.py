import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAI

BASE_DIR = Path(__file__).resolve().parent
env_path = str(Path(BASE_DIR, '.env.dev'))
# print(str(Path(BASE_DIR, '.env')))

load_dotenv(env_path)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


if GOOGLE_API_KEY:
    pass
    # print("API Key loaded successfully")
else:
    pass
    # print("API Key not found!")


def init_gemini(temperature=1):
    model_name = "gemini-3.5-flash-lite"
    gemini = GoogleGenerativeAI(
        model=model_name,
        temperature=temperature,
        api_key=GOOGLE_API_KEY
    )
    # print("Gemini initialized successfully")
    return gemini
