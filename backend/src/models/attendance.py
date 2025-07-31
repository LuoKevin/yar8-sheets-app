from pydantic import BaseModel


class Attendance(BaseModel):
    index: int
    date:str
    attendance_status: dict[str, bool]
