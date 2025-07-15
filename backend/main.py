from fastapi import FastAPI
from backend.services.study_groups_service import get_study_groups
from utils.google import read_sheet_data
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/study-sheet-data")
def study_sheet_data():
    return {"study_sheet_data": get_study_groups(read_sheet_data())}
