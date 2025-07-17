from backend.sheets_client.client import GoogleSheetsClient
from backend.sheets_client.provider import GoogleServiceProvider


class GoogleSheetsMacros:
    _GROUPS_SHEET_NAME = "Groups_Current"
    _ATTENDANCE_SHEET_NAME = "Attendance_Current"
    _sheets_client = GoogleSheetsClient()

    def __init__(self):
        self._sheets_service = GoogleServiceProvider.get_sheets_service()



    def reset(self, spreadsheet_id: str):
        clear_range = self._sheets_service.clear_range
        write_range = self._sheets_client.write_range

        clear_range(spreadsheet_id, self._GROUPS_SHEET_NAME, "AF3:AH103")
        clear_range(spreadsheet_id, self._ATTENDANCE_SHEET_NAME, "B1:B200")

        write_range(spreadsheet_id, f"{self._GROUPS_SHEET_NAME}!M1", "FALSE")
        write_range(spreadsheet_id, f"{self._ATTENDANCE_SHEET_NAME}!AI3:AI136", "FALSE")

        clear_range(spreadsheet_id, self._GROUPS_SHEET_NAME, "B1:B200")

    def paste_value_lock(self, spreadsheet_id):
        