from typing import List
from pydantic import BaseModel
import random

from .member import Member
from .leader import Leader
from .study_group import StudyGroup


class StudySession(BaseModel):
    date: str
    leaders: List[Leader]
    members: List[Member]

    def get_balanced_groups(self):
        if len(self.members) == 0: return []
        balanced_members: List[List[Member]] = (self._distribute_members())
        random.shuffle(balanced_members)
        groups: List[StudyGroup] = []
        leader_iter = filter(lambda leader: leader.present, self.leaders)
        for group in balanced_members:
            groups.append(StudyGroup(members=group, leader=leader_iter.__next__()))
        return groups

    def _distribute_members(self) -> List[List[Member]]:
        members = list(filter(lambda m: m.present, self.members))
        leaders = list(filter(lambda leader: leader.present, self.leaders))
        n = len(leaders)

        groups = [[] for _ in range(n)]
        sums = [0] * n

        members: List[Member] = sorted(members, key=lambda m: m.talk_weight, reverse=True)

        for member in members:
            value = member.talk_weight
            smallest_sum_index = sums.index(min(sums))
            groups[smallest_sum_index].append(member)
            sums[smallest_sum_index] += value

        max_len = max(len(group) for group in groups)
        min_len = min(len(group) for group in groups)

        while max_len - min_len > 1:
            max_group_index = max(range(n), key=lambda i: (len(groups[i]), sums[i]))
            min_group_index = min(range(n), key=lambda i: (len(groups[i]), sums[i]))

            if groups[max_group_index]:

                element_to_move = groups[max_group_index].pop()
                sums[max_group_index] -= element_to_move

                groups[min_group_index].append(element_to_move)
                sums[min_group_index] += element_to_move

                max_len = max(len(group) for group in groups)
                min_len = min(len(group) for group in groups)

        return groups
