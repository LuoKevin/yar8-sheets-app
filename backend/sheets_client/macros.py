from backend.sheets_client.client import GoogleSheetsClient
from backend.sheets_client.provider import GoogleServiceProvider


class GoogleSheetsMacros:
    _GROUPS_SHEET_NAME = "Groups_Current"
    _ATTENDANCE_SHEET_NAME = "Attendance_Current"
    _sheets_client = GoogleSheetsClient()

    def __init__(self):
        self._sheets_service = GoogleServiceProvider.get_sheets_service()

    def _clear_sheet_range(self, spreadsheet_id: str, sheet_name: str, cell_range: str):
        full_range = f"{sheet_name}!{cell_range}"
        response = self._sheets_service.spreadsheets().values().clear(
            spreadsheetId=spreadsheet_id,
            range=full_range
        ).execute()

        return response

    def reset(self, spreadsheet_id: str):
        clear_range = self._clear_sheet_range
        write_to_range = self._sheets_client.write_to_range

        clear_range(spreadsheet_id, self._GROUPS_SHEET_NAME, "AF3:AH103")
        clear_range(spreadsheet_id, self._ATTENDANCE_SHEET_NAME, "B1:B200")

        write_to_range(spreadsheet_id, f"{self._GROUPS_SHEET_NAME}!M1", "FALSE")
        write_to_range(spreadsheet_id, f"{self._ATTENDANCE_SHEET_NAME}!AI3:AI136", "FALSE")

        clear_range(spreadsheet_id, self._GROUPS_SHEET_NAME, "B1:B200")
