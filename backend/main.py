from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from backend.services.study_groups_service import get_study_groups
from backend.utils.google_sheets_api import GoogleSheetsAPI
from config import SPREADSHEET_ID, SCRIPT_ID, STUDY_GROUPS_RANGE, STUDY_DATE_CELL, GOOGLE_CREDENTIALS_PATH
app = FastAPI()

class DateModel(BaseModel):
    date: str

google_api_client = GoogleSheetsAPI(GOOGLE_CREDENTIALS_PATH)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/study-sheet-data")
def study_sheet_data():
    return {
        "study_sheet_data": get_study_groups(
            google_api_client.read_sheet_range(SPREADSHEET_ID, STUDY_GROUPS_RANGE)
        )
    }

@app.post("/study-group-date")
def post_study_group_date(data: DateModel):
    try:
        # TODO: add date validation here
        google_api_client.write_to_range(SPREADSHEET_ID, STUDY_DATE_CELL, data.date)
        return {
            "status": "success",
            "study_group_date": data.date
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error: {str(e)}"
        )
