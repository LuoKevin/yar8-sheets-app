from typing import List

from google.oauth2 import service_account
from googleapiclient.discovery import build
from config import GOOGLE_CREDENTIALS_PATH

creds = service_account.Credentials.from_service_account_file(
        GOOGLE_CREDENTIALS_PATH,
        scopes=["https://www.googleapis.com/auth/spreadsheets"],
    )

service = build("sheets", "v4", credentials=creds)

def read_sheet_range(spreadsheet_id: str, cell_range: str) -> List[List[str]]:
    sheet = service.spreadsheets()

    results = sheet.values().get(
        spreadsheetId=spreadsheet_id,
        range=cell_range,
    ).execute()

    return results.get("values", [])

def write_to_range(spreadsheet_id: str, sheet_cell_range: str, value: str, input_option='USER_ENTERED') -> None:

    body = {
        'values': [[value]],

    }

    result = service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range=sheet_cell_range,
        valueInputOption=input_option,
        body=body,
    ).execute()

    #TODO: Add exception handling here