from pydantic import BaseModel


class Member(BaseModel):
    name: str
    talk_weight: float
    present: bool
