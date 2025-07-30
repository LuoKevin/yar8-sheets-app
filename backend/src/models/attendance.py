from pydantic import BaseModel


class Attendance(BaseModel):
    date:str
    attendance_status: dict[str, bool]
