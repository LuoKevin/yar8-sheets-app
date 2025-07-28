from pydantic import BaseModel

class Leader(BaseModel):
    name: str
    talk_weight: float
    present: bool