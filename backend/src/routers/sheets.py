from http.client import responses
from typing import List, Tuple

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..config import Settings
from ..models.study_group import StudyGroup
from ..services.study_groups_service import get_study_groups
from ..sheets_client.attendance import AttendanceClient
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
    locked: bool

class CurrentAttendanceResponse(BaseModel):
    date: str
    attendees: List[Tuple[str, bool]]
    index: int

class PostAttendanceRequest(BaseModel):
    index: int
    attendees: List[bool]

settings = Settings()
google_api_client = GoogleSheetsClient()
google_macros = GoogleSheetsMacros()
attendance_client = AttendanceClient()

DISPLAY_GROUPS_RANGE = "Groups_Current!C5:O20"
LOCKED_CELL = "Groups_Current!M1"

@sheets_router.get("/study-group-data", response_model=StudyGroupResponse, summary="Get current study group data")
async def get_study_group_data():
    try:
        group_range = google_api_client.read_range(settings.SPREADSHEET_ID, DISPLAY_GROUPS_RANGE)
        new_groups = get_study_groups(group_range)
        lock_status = True if google_api_client.read_cell(settings.SPREADSHEET_ID, LOCKED_CELL) == "TRUE" else False
        return StudyGroupResponse(groups=new_groups, locked=lock_status)
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

@sheets_router.get("/attendance", response_model=CurrentAttendanceResponse, summary="Get current attendance for date")
async def get_current_attendance(date: str):
    try:
        current_attendance = attendance_client.get_attendance(settings.SPREADSHEET_ID, date)
        attendee_tuples: List[Tuple[str, bool]] = list(current_attendance.attendance_status.items())
        return CurrentAttendanceResponse(date=date, attendees=attendee_tuples, index=current_attendance.index)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@sheets_router.post("/take-attendance", summary="post attendance for date")
async def take_attendance(request: PostAttendanceRequest):
    try:
        attendance_client.post_attendance(settings.SPREADSHEET_ID, request.date, request.attendance)
        return { "status" : "Attendance updated successfully" }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
