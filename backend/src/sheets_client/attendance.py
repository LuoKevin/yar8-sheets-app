from typing import List, Dict
from fastapi import HTTPException
from .client import GoogleSheetsClient
from ..models.attendance import Attendance


# zero-indexed 0 -> A, 1 -> B,
def _column_to_letter(index: int) -> str:
    result = ""
    while index >= 0:
        index, remainder = divmod(index, 26)
        result = chr(65 + remainder) + result
        index -= 1  # shift for 0-based offset
    return result


class AttendanceClient:
    _ATTENDANCE_SHEET_NAME = "Attendance_Current"
    _NAMES_RANGE = f"{_ATTENDANCE_SHEET_NAME}!E3:E200"
    _DATES_GRID_RANGE = f"{_ATTENDANCE_SHEET_NAME}!F2:AG200"
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
        index = next((i for i, col  in enumerate(date_cols) if col[0] == date), None)
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


    def post_attendance(self, spreadsheet_id: str, index: int, attendance_status: List[bool]):
        base_date_index = 5
        date_col_letter = _column_to_letter(base_date_index + index)
        str_attendance_list: List[str] = list(map(lambda x: "TRUE" if x else "FALSE", attendance_status))
        target_range = f"{self._ATTENDANCE_SHEET_NAME}!{date_col_letter}3:{date_col_letter}200"
        self._sheets_client.write_range(spreadsheet_id,target_range,[str_attendance_list])
