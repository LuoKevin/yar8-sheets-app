from dotenv import load_dotenv
import os

env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

creds_raw = os.getenv("GOOGLE_CREDENTIALS_PATH")

GOOGLE_CREDENTIALS_PATH = (
    os.path.abspath(os.path.join(os.path.dirname(__file__), creds_raw))
    if creds_raw and not os.path.isabs(creds_raw)
    else creds_raw
)

SPREADSHEET_ID = os.getenv("SPREADSHEET_ID")
SCRIPT_ID = os.getenv("SCRIPT_ID")
STUDY_GROUPS_RANGE = os.getenv("STUDY_GROUPS_RANGE")
