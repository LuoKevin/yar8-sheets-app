from typing import List

from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware

from backend.config import Settings
from backend.routers.sheets import sheets_router
from backend.services.study_groups_service import get_study_groups
from backend.sheets_client.client import GoogleSheetsClient
from backend.sheets_client.macros import GoogleSheetsMacros

app = FastAPI(
    title="YAR8 Sheets API",
    descriptions="Reads and performs operations on YAR8 Attendance Google Sheets",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=[],
)

app.include_router(router=sheets_router)

@app.get("/", include_in_schema=False)
def health_check():
    return {"status": "ok"}
