from typing import List, Dict

from fastapi import HTTPException

from .client import GoogleSheetsClient
from ..models.attendance import Attendance


class AttendanceClient:
    _ATTENDANCE_SHEET_NAME = "Attendance_Current"
    _NAMES_RANGE = f"{_ATTENDANCE_SHEET_NAME}!E3:E136"
    _DATES_GRID_RANGE = f"{_ATTENDANCE_SHEET_NAME}!F2:AG136"
    _sheets_client = GoogleSheetsClient()
    '''
    1. Get all names and all dates-grid
    2. Get date index based on range of dates
    '''
    def get_attendance(self, spreadsheet_id: str, date: str) -> Attendance:
        #List results -> Lists of ranges -> Lists of rows/cols
        results: List[List[List[str]]] = self._sheets_client.read_ranges(
            spreadsheet_id,
            [self._NAMES_RANGE, self._DATES_GRID_RANGE],
            "COLUMNS"
        )
        names = results[0][0]
        date_cols = results[1]
        index = next((i for i, col  in date_cols if col[0] == date), None)
        target_col = date_cols[index] if index is not None else None
        if target_col is None:
            raise HTTPException(status_code=400, detail=f"Error: {date} attendance not found")
        target_col = target_col[1:]
        current_attendance: Dict[str,bool] = {}
        for i in range(0, len(names)):
            current_attendance[names[i]] = True if target_col[i] == "TRUE" else False

        return Attendance(
            date=date,
            attendance_status=current_attendance,
            index=index
        )