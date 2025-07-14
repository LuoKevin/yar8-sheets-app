from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_CREDENTIALS_PATH = os.getenv("GOOGLE_CREDENTIALS_PATH")
SPREADSHEET_ID = os.getenv("SPREADSHEET_ID")
SCRIPT_ID = os.getenv("SCRIPT_ID")
STUDY_GROUPS_RANGE = os.getenv("STUDY_GROUPS_RANGE")
