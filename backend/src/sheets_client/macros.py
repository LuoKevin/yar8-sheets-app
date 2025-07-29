from .client import GoogleSheetsClient

class GoogleSheetsMacros:
    _GROUPS_SHEET_NAME = "Groups_Current"
    _ATTENDANCE_SHEET_NAME = "Attendance_Current"
    _sheets_client = GoogleSheetsClient()
    _shuffle_bool= True

    def reset(self, spreadsheet_id: str):
        clear_range = self._sheets_client.clear_range
        write_cell = self._sheets_client.write_cell


        clear_range(spreadsheet_id, self._GROUPS_SHEET_NAME, "AF3:AH103")
        clear_range(spreadsheet_id, self._ATTENDANCE_SHEET_NAME, "B1:B200")

        write_cell(spreadsheet_id, f"{self._GROUPS_SHEET_NAME}!M1", "FALSE")
        write_cell(spreadsheet_id, f"{self._ATTENDANCE_SHEET_NAME}!AI3:AI136", "FALSE")

        clear_range(spreadsheet_id, self._GROUPS_SHEET_NAME, "B1:B200")

    def _toggle_shuffle(self,spreadsheet_id: str):
        toggle_shuffle_cell = f"{self._GROUPS_SHEET_NAME}!I1"
        self._sheets_client.write_cell(spreadsheet_id, toggle_shuffle_cell, "TRUE" if self._shuffle_bool else "FALSE")
        self._shuffle_bool = not self._shuffle_bool

    def paste_value_lock(self, spreadsheet_id):
        client = self._sheets_client
        copy_range = f"{self._GROUPS_SHEET_NAME}!AC3:AE103"
        paste_range = f"{self._GROUPS_SHEET_NAME}!AF3:AH103"
        alt_run: bool = client.read_cell(spreadsheet_id, f"{self._GROUPS_SHEET_NAME}!I2") == "TRUE"

        while (
                client.read_cell(spreadsheet_id, f"{self._GROUPS_SHEET_NAME}!X22") != "OK" or
                (alt_run and client.read_cell(spreadsheet_id, "Exceptions!E1") != "OK")
        ):
            self._toggle_shuffle(spreadsheet_id)

        client.write_range(spreadsheet_id, paste_range, client.read_range(spreadsheet_id, copy_range))
        client.write_cell(spreadsheet_id,f"{self._GROUPS_SHEET_NAME}!M1", "TRUE")