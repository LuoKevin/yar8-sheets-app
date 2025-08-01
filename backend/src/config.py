from typing import List
from pydantic.v1 import BaseSettings

class Settings(BaseSettings):
    GOOGLE_APPLICATION_CREDENTIALS: str
    SPREADSHEET_ID: str
    SERVICE_SCOPE: List[str] = [
        "https://www.googleapis.com/auth/spreadsheets",
    ]

    class Config:
        env_file = ".env"
