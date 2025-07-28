from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..config import Settings
from ..models.leader import Leader
from ..models.member import Member
from ..models.study_group import StudyGroup
from ..services.study_groups_service import get_study_groups
from ..sheets_client.client import GoogleSheetsClient
from ..sheets_client.macros import GoogleSheetsMacros
from ..sheets_client.study_client import GoogleSheetsStudyClient

sheets_router = APIRouter(prefix="/sheets", tags=["sheets"])

class DateModel(BaseModel):
    date: str

class StudyDatesResponse(BaseModel):
    activeDate: str
    dates: List[str]


class StudyGroupResponse(BaseModel):
    groups: List[StudyGroup]

class StudySessionResponse(BaseModel):
    leaders: List[Leader]
    members: List[Member]
    study_groups: List[StudyGroup]
    date: str

settings = Settings()
google_api_client = GoogleSheetsClient()
google_macros = GoogleSheetsMacros()
google_study_client = GoogleSheetsStudyClient()

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

@sheets_router.get("/current-balanced-groups", response_model=StudySessionResponse, summary="Get current balanced study groups")
async def get_current_balanced_study_groups():
    try:
        study_session = google_study_client.get_current_study_session(settings.SPREADSHEET_ID)

        if study_session is None:
            raise HTTPException(status_code=404, detail="Error: study session not found")
        return StudySessionResponse(leaders=study_session.leaders, members=study_session.members, study_groups=study_session.get_balanced_groups(), date=study_session.date)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")