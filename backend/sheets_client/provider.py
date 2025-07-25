from ..config import Settings
from google.oauth2 import service_account
from googleapiclient.discovery import build


class GoogleServiceProvider:
    # Singleton object provider
    _sheets_service = None
    _settings = Settings()
    _creds = service_account.Credentials.from_service_account_file(
        _settings.GOOGLE_APPLICATION_CREDENTIALS,
        scopes=_settings.SERVICE_SCOPE,
    )

    @classmethod
    def get_sheets_service(cls):
        if cls._sheets_service is None:
            cls._sheets_service = build("sheets", "v4", credentials=cls._creds)

        return cls._sheets_service
