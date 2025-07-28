from backend.src.models.member import Member

class Leader(Member):
    name: str
    talk_weight: float
    present: bool