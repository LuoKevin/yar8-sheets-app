from typing import List
from pydantic.v1 import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    GOOGLE_APPLICATION_CREDENTIALS: str
    SPREADSHEET_ID: str
    SERVICE_SCOPE: List[str] = [
        "https://www.googleapis.com/auth/spreadsheets",
    ]