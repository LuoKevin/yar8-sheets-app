from typing import List
from pydantic import BaseModel

from .leader import Leader
from .member import Member


class StudyGroup(BaseModel):
    leader:Leader
    members:List[Member]
