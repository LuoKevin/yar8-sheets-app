from ..config import Settings
from google.oauth2 import service_account
from googleapiclient.discovery import build

class GoogleSheetsServiceProvider:
    # Singleton object provider
    _sheets_service = None

    @classmethod
    def get_sheets_service(cls):
        if cls._sheets_service is None:
            settings = Settings()
            creds = service_account.Credentials.from_service_account_file(
                settings.GOOGLE_CREDENTIALS_PATH,
                scopes=settings.SERVICE_SCOPE,
            )
            cls._sheets_service = build("sheets", "v4", credentials=creds)

        return cls._sheets_service
