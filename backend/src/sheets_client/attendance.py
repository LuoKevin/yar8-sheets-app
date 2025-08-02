from typing import List, Dict, Callable
from fastapi import HTTPException
from .client import GoogleSheetsClient
from ..models.attendance import Attendance
from ..models.care_group import CareGroup


# zero-indexed 0 -> A, 1 -> B,
def _column_to_letter(index: int) -> str:
    result = ""
    while index >= 0:
        index, remainder = divmod(index, 26)
        result = chr(65 + remainder) + result
        index -= 1  # shift for 0-based offset
    return result

def format_group(str_group: List[str], status_dict: dict[str, bool]) -> CareGroup | None:
    invalid_leader_names : List[str] = ["#N/A", "TRUE", "FALSE", ""]
    if len(str_group) == 0 or str_group[0] in invalid_leader_names:
        return None
    attendance_status: List[bool] = list(map(lambda m: status_dict[m], str_group))
    return CareGroup(members=str_group, attendance=attendance_status)

class AttendanceClient:
    _GROUPS_SHEET_NAME = "Groups_Current"
    _ATTENDANCE_SHEET_NAME = "Attendance_Current"
    _NAMES_RANGE = f"{_ATTENDANCE_SHEET_NAME}!E3:E200"
    _ATTENDANCE_GRID_RANGE = f"{_ATTENDANCE_SHEET_NAME}!F2:AG200"
    _LATECOMER_TIME_COL_RANGE = f"{_ATTENDANCE_SHEET_NAME}!B3:B200"
    _sheets_client = GoogleSheetsClient()
    '''
    1. Get all names and all dates-grid
    2. Get date index based on range of dates
    '''
    def get_attendance(self, spreadsheet_id: str, date: str) -> Attendance:
        #List results -> Lists of ranges -> Lists of rows/cols
        results: List[List[List[str]]] = self._sheets_client.read_ranges(
            spreadsheet_id,
            [self._NAMES_RANGE, self._ATTENDANCE_GRID_RANGE, self._LATECOMER_TIME_COL_RANGE],
            "COLUMNS"
        )
        names = results[0][0]
        date_cols = results[1]
        latecomer_times = results[2][0] if len(results[2]) > 0 else []
        index = next((i for i, col  in enumerate(date_cols) if col[0] == date), None)
        target_col = date_cols[index] if index is not None else None
        if target_col is None:
            raise HTTPException(status_code=400, detail=f"Error: {date} attendance not found")
        target_col = target_col[1:]
        current_attendance: Dict[str,bool] = {}
        for i in range(0, len(names)):
            current_attendance[names[i]] = True if target_col[i] == "TRUE" else False
        target_late_length = 197
        num_to_fill = target_late_length - len(latecomer_times)

        if num_to_fill > 0:
            latecomer_times.extend([""] * num_to_fill)

        return Attendance(
            date=date,
            attendance_status=current_attendance,
            index=index,
            latecomer_timestamps=latecomer_times
        )

    def post_attendance(
            self,
            spreadsheet_id: str,
            index: int,
            attendance_status: List[bool],
            attendee_timestamps: List[str]
    ):
        base_date_index = 5
        date_col_letter = _column_to_letter(base_date_index + index)
        str_attendance_list: List[str] = list(map(lambda x: "TRUE" if x else "FALSE", attendance_status))
        attendance_col_range = f"{self._ATTENDANCE_SHEET_NAME}!{date_col_letter}3:{date_col_letter}200"
        latecomer_col_range = self._LATECOMER_TIME_COL_RANGE

        self._sheets_client.write_ranges(
            spreadsheet_id=spreadsheet_id,
            sheet_cell_ranges=[attendance_col_range, latecomer_col_range],
            values=[[str_attendance_list], [attendee_timestamps]],
            major_dimension='COLUMNS'
        )

    def get_care_groups(self,spreadsheet_id: str) -> List[CareGroup]:
        care_group_ranges= [
            f"{self._GROUPS_SHEET_NAME}!C25:M32",
            f"{self._GROUPS_SHEET_NAME}!C35:M43",
        ]
        current_date_cell = f"{self._GROUPS_SHEET_NAME}!C1"
        current_date = self._sheets_client.read_cell(spreadsheet_id, current_date_cell)

        results = self._sheets_client.read_ranges(spreadsheet_id, care_group_ranges, major_dimension='COLUMNS')

        top_groups:List[List[str]] = results[0]
        bottom_groups:List[List[str]] = results[1]
        all_groups = top_groups + bottom_groups

        attendance = self.get_attendance(spreadsheet_id, current_date)

        filtered_groups = map(lambda group: format_group(group, attendance.attendance_status), all_groups)
        final_groups : List[CareGroup] = [group for group in filtered_groups if group is not None]

        return final_groups
