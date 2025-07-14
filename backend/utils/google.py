from google.oauth2 import service_account
from googleapiclient.discovery import build
from config import GOOGLE_CREDENTIALS_PATH, SPREADSHEET_ID, SCRIPT_ID, STUDY_GROUPS_RANGE

def read_sheet_data():
    creds = service_account.Credentials.from_service_account_file(
        GOOGLE_CREDENTIALS_PATH,
        scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"],
    )

    service = build("sheets", "v4", credentials=creds)
    sheet = service.spreadsheets()

    results = sheet.values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=STUDY_GROUPS_RANGE,
    ).execute()

    return results.get("values", [])
