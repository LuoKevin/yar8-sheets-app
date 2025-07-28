from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..config import Settings
from ..models.study_group import StudyGroup
from ..services.study_groups_service import get_study_groups
from ..sheets_client.client import GoogleSheetsClient
from ..sheets_client.macros import GoogleSheetsMacros

sheets_router = APIRouter(prefix="/sheets", tags=["sheets"])

class DateModel(BaseModel):
    date: str

class StudyDatesResponse(BaseModel):
    activeDate: str
    dates: List[str]


class StudyGroupResponse(BaseModel):
    groups: List[StudyGroup]

settings = Settings()
google_api_client = GoogleSheetsClient()
google_macros = GoogleSheetsMacros()

displayed_groups_range = "Groups_Current!C5:O20"

@sheets_router.get("/study-group-data", response_model=StudyGroupResponse, summary="Get current study group data")
async def get_study_group_data():
    try:
        group_range = google_api_client.read_range(settings.SPREADSHEET_ID, displayed_groups_range)
        new_groups = get_study_groups(group_range)
        return StudyGroupResponse(groups=new_groups)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@sheets_router.post("/active-study-date", response_model=DateModel, summary="Change current active study date")
async def post_active_study_date(data: DateModel):
    try:
        google_api_client.write_cell(settings.SPREADSHEET_ID, "Groups_Current!C1", data.date)
        return DateModel(date=data.date)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@sheets_router.post("/reset-groups", summary="Reset active study groups")
async def reset_study_groups():
    try:
        google_macros.reset(settings.SPREADSHEET_ID)
        return { "status": "Reset successful" }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@sheets_router.post("/shuffle-lock", summary="Shuffles and locks in study groups")
async def shuffle_study_groups():
    try:
        google_macros.paste_value_lock(settings.SPREADSHEET_ID)
        return { "status": "Shuffle successful" }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@sheets_router.get("/study-dates", response_model=StudyDatesResponse, summary= "Get all valid study dates")
async def get_study_dates():
    try:
        date_range = google_api_client.read_range(settings.SPREADSHEET_ID, "Attendance_Current!F2:AG2")
        active_date = google_api_client.read_cell(settings.SPREADSHEET_ID, "Groups_Current!C1")
        return StudyDatesResponse(activeDate=active_date, dates=date_range[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
