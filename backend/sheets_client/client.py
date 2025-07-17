from typing import List

from backend.sheets_client.provider import GoogleServiceProvider


class GoogleSheetsClient:
    def __init__(self):
        self._service = GoogleServiceProvider.get_sheets_service()

    def read_sheet_range(self, spreadsheet_id: str, cell_range: str) -> List[List[str]]:
        sheet = self._service.spreadsheets()

        results = sheet.values().get(
            spreadsheetId=spreadsheet_id,
            range=cell_range,
        ).execute()

        return results.get("values", [])

    def write_to_range(
            self,
            spreadsheet_id: str,
            sheet_cell_range: str,
            value: str,
            input_option='USER_ENTERED'
    ) -> None:
        body = {
            'values': [[value]],
        }

        result = self._service.spreadsheets().values().update(
            spreadsheetId=spreadsheet_id,
            range=sheet_cell_range,
            valueInputOption=input_option,
            body=body,
        ).execute()

        # TODO: Add exception handling here
