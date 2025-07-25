from typing import List
from pydantic import BaseModel

class StudyGroup(BaseModel):
    leader:str
    members:List[str]
