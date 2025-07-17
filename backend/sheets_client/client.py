from typing import List

from backend.sheets_client.provider import GoogleServiceProvider


class GoogleSheetsClient:
    def __init__(self):
        self._service = GoogleServiceProvider.get_sheets_service()

    def read_range(self, spreadsheet_id: str, cell_range: str) -> List[List[str]]:
        sheet = self._service.spreadsheets()

        results = sheet.values().get(
            spreadsheetId=spreadsheet_id,
            range=cell_range,
        ).execute()

        return results.get("values", [])

    def write_range(
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

    def write_cell(
            self,
            spreadsheet_id: str,
            cell: str,
            value: str,
    ) -> None:
        self.write_range(spreadsheet_id, cell, value)

    def read_cell(self, spreadsheet_id: str, cell: str, ):
        resp = self.read_range(spreadsheet_id, cell)
        return resp[0][0] if resp else None

    def clear_range(self, spreadsheet_id: str, sheet_name: str, cell_range: str):
        full_range = f"{sheet_name}!{cell_range}"
        response = self._service.spreadsheets().values().clear(
            spreadsheetId=spreadsheet_id,
            range=full_range
        ).execute()

        return response
