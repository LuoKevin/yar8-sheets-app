from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from backend.config import Settings
from backend.services.study_groups_service import get_study_groups
from backend.sheets_client.client import GoogleSheetsClient
from backend.sheets_client.macros import GoogleSheetsMacros

app = FastAPI()


class DateModel(BaseModel):
    date: str


settings = Settings()
google_api_client = GoogleSheetsClient()
google_macros = GoogleSheetsMacros()
SCRAMBLE_FUNC_NAME = "PasteValueLock"
RESET_FUNC_NAME = "Reset"


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/study-sheet-data")
def study_sheet_data():
    return {
        "study_sheet_data": get_study_groups(
            google_api_client.read_sheet_range(settings.SPREADSHEET_ID, "Groups_Current!C5:O20")
        )
    }


@app.post("/study-group-date")
def post_study_group_date(data: DateModel):
    try:
        # TODO: add date validation here
        google_api_client.write_to_range(settings.SPREADSHEET_ID, "Groups_Current!C1", data.date)
        return {
            "status": "success",
            "study_group_date": data.date
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error: {str(e)}"
        )
    # TODO: client methods should not be called at this layer


@app.post("/reset-groups")
def reset_study_groups():
    try:
        google_macros.reset(settings.SPREADSHEET_ID)
        return {
            "status": "Reset successful",
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error: {str(e)}"
        )
