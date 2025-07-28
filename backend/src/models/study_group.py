from typing import List
from pydantic.v1 import BaseModel

from backend.src.models.leader import Leader
from backend.src.models.member import Member


class StudyGroup(BaseModel):
    leader:Leader
    members:List[Member]
