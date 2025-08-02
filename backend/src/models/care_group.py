from typing import List

from pydantic import BaseModel

class CareGroup(BaseModel):
    members:List[str]
    attendance:List[bool]
