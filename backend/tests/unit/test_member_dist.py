import unittest
from typing import List

from backend.src.models.study_session import StudySession
from backend.src.models.leader import Leader
from backend.src.models.member import Member

class MyTestCase(unittest.TestCase):

    members:List[Member] = [
        Member(name="Alice", talk_weight=2, present=True),
        Member(name="Bob", talk_weight=5, present=True),
        Member(name="Charlie", talk_weight=3, present=True),
        Member(name="David", talk_weight=4, present=True),
        Member(name="Eve", talk_weight=1, present=True),
        Member(name="Frank", talk_weight=2, present=True),
        Member(name="George", talk_weight=3, present=True),
        Member(name="Harriet", talk_weight=4, present=True),
        Member(name="Isaac", talk_weight=5, present=True),
        Member(name="Michael", talk_weight=1, present=True),
    ]

    leaders:List[Leader] = [
        Leader(name="Alan", talk_weight=5, present=True),
        Leader(name="Beatrice", talk_weight=5, present=True),
        Leader(name="Chuck", talk_weight=5, present=True),
    ]

    session = StudySession(date="01/11/2025", leaders=leaders, members=members)

    def test_groups(self):
        balanced_groups = self.session.get_balanced_groups()
        for group in balanced_groups:
            print(group.leader.name)
            print(group.members)
        assert True

if __name__ == '__main__':
    unittest.main()
