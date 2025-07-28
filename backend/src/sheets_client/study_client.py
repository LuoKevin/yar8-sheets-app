from ..models.leader import Leader
from ..models.member import Member
from ..models.study_session import StudySession
from ..sheets_client.client import GoogleSheetsClient
import logging

class GoogleSheetsStudyClient:
    _GROUPS_SHEET_NAME = "Groups_Current"
    _ATTENDANCE_SHEET_NAME = "Attendance_Current"
    _ALL_LEADERS_RANGE = f"{_GROUPS_SHEET_NAME}!X3:X9"
    _PRESENT_LEADERS_RANGE = f"{_GROUPS_SHEET_NAME}!Z3:Z9"
    _REG_MEMBERS_RANGE = f"{_GROUPS_SHEET_NAME}!AC3:AC103"
    _REG_MEMBERS_WEIGHTS_RANGE = f"{_GROUPS_SHEET_NAME}!AP3:AP103"
    _CURRENT_DATE_CELL = "C1"

    _sheets_client = GoogleSheetsClient()

    def get_current_study_session(self, spreadsheet_id: str) -> StudySession | None:
        # (All Leaders, Present Leaders, Members, Weights, Date)
        batch_data = self._sheets_client.read_ranges(spreadsheet_id,[
            self._ALL_LEADERS_RANGE,
            self._PRESENT_LEADERS_RANGE,
            self._REG_MEMBERS_RANGE,
            self._REG_MEMBERS_WEIGHTS_RANGE,
            self._CURRENT_DATE_CELL])

        all_leaders = batch_data[0][0]
        present_leaders = batch_data[1][0] if len(batch_data[1]) > 0 else []
        present_members = batch_data[2][0] if len(batch_data[2]) > 0 else []
        weights = batch_data[3][0] if len(batch_data[3]) > 0 else []
        date = batch_data[4][0][0] if len(batch_data[4]) > 0 else ""

        leaders = list(map(lambda leader_name: Leader(name=leader_name, talk_weight=5, present=leader_name in present_leaders), all_leaders))
        members = []
        for i in range(0, len(present_members)):
            members.append(Member(name=present_members[i], talk_weight=float(weights[i]), present=True))
        return StudySession(date=date, leaders=leaders, members=members)