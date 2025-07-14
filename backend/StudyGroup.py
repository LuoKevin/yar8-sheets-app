from dataclasses import dataclass
from typing import List

@dataclass
class StudyGroup:
    leader:str
    members:List[str]