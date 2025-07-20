from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.config import Settings
from backend.models.study_group import StudyGroup
from backend.services.study_groups_service import get_study_groups
from backend.sheets_client.client import GoogleSheetsClient
from backend.sheets_client.macros import GoogleSheetsMacros

sheets_router = APIRouter(prefix="/sheets", tags=["sheets"])

class DateModel(BaseModel):
    date: str

class DateDataResponse(BaseModel):
    date: str


class StudyGroupResponse(BaseModel):
    data: List[StudyGroup]

settings = Settings()
google_api_client = GoogleSheetsClient()
google_macros = GoogleSheetsMacros()

@sheets_router.get("/study-group-data", response_model=StudyGroupResponse, summary="Get current study group data")
def get_study_group_data():
    try:
        group_range = google_api_client.read_range(settings.SPREADSHEET_ID, "Groups_Current!C5:O20")
        return StudyGroupResponse(data = get_study_groups(group_range))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@sheets_router.post("/active-study-date", response_model=DateModel, summary="Change current active study date")
def post_active_study_date(data: DateModel):
    try:
        google_api_client.write_cell(settings.SPREADSHEET_ID, "Groups_Current!C1", data.date)
        return DateModel(date=data.date)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@sheets_router.post("/reset-groups", summary="Reset active study groups")
def reset_study_groups():
    try:
        google_macros.reset(settings.SPREADSHEET_ID)
        return { "status": "Reset successful" }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@sheets_router.post("/shuffle-lock", summary="Shuffles and locks in study groups")
def shuffle_study_groups():
    try:
        google_macros.paste_value_lock(settings.SPREADSHEET_ID)
        return { "status": "Shuffle successful" }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
