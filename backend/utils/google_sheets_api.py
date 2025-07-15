from typing import List

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


class GoogleSheetsAPI:
    def __init__(self, credentials_file: str):
        scopes = ["https://www.googleapis.com/auth/spreadsheets",
                  "https://www.googleapis.com/auth/script.projects",
                  "https://www.googleapis.com/auth/script.scriptapp"
                  ]
        self._creds = service_account.Credentials.from_service_account_file(
            credentials_file,
            scopes=scopes,
        )
        self._sheets_service = build("sheets", "v4", credentials=self._creds)
        self._script_service = build("script", "v1", credentials=self._creds)

    def read_sheet_range(self, spreadsheet_id: str, cell_range: str) -> List[List[str]]:
        sheet = self._sheets_service.spreadsheets()

        results = sheet.values().get(
            spreadsheetId=spreadsheet_id,
            range=cell_range,
        ).execute()

        return results.get("values", [])

    def write_to_range(self, spreadsheet_id: str, sheet_cell_range: str, value: str,
                       input_option='USER_ENTERED') -> None:
        body = {
            'values': [[value]],
        }

        result = self._sheets_service.spreadsheets().values().update(
            spreadsheetId=spreadsheet_id,
            range=sheet_cell_range,
            valueInputOption=input_option,
            body=body,
        ).execute()

        # TODO: Add exception handling here

    def run_script(self, script_id: str, function_name: str) -> None:
        request_body = {
            "function": function_name,
            "devMode": True
        }

        try:
            self._script_service.scripts().run(
                scriptId=script_id,
                body=request_body
            ).execute()

        except HttpError as err:
            raise Exception(f"API error: {err.content}") from err



