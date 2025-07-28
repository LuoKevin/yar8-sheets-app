from itertools import combinations
from typing import List
from pydantic.v1 import BaseModel
import random
from numpy import var, isclose

from .leader import Leader
from .member import Member
from .study_group import StudyGroup


class StudySession(BaseModel):
    date: str
    leaders: List[Leader]
    members: List[Member]

    def get_balanced_groups(self):
        balanced_members: List[List[Member]] = (self._distribute_members())
        random.shuffle(balanced_members)
        groups: List[StudyGroup] = []
        leader_iter = iter(self.leaders)
        for group in balanced_members:
            groups.append(StudyGroup(members=group, leader=leader_iter.__next__()))
        return groups

    def _distribute_members(self) -> List[List[Member]]:
        members = list(filter(lambda member: member.present, self.members))
        leaders = list(filter(lambda leader: leader.present, self.leaders))
        num_groups = len(leaders)
        m = len(members)

        if num_groups == 0:
            return []

        if m < num_groups:
            return [members]

        min_size = m // num_groups
        remainder = m % num_groups
        group_sizes = [min_size + 1 if i < remainder else min_size for i in range(num_groups)]

        #sorted by talk-weight-descending
        sorted_members = sorted(members, key=lambda x: -x.talk_weight)

        def generate_partitions(
                elements: List[Member],
                sizes: List[int]
        ) -> List[List[List[Member]]]:
            """Recursively generates all equal-sized partitions."""
            if not sizes:
                return [[]]

            size = sizes[0]
            partitions = []

            # Generate unique combinations
            for combo in combinations(elements, size):
                remaining = [m for m in elements if m not in combo]
                for sub_part in generate_partitions(remaining, sizes[1:]):
                    partitions.append([list(combo)] + sub_part)

            return partitions

        best_groups: List[List[Member]] = []
        best_variance = float('inf')

        for partition in generate_partitions(sorted_members, group_sizes):
            sums = [sum(m.talk_weight for m in group) for group in partition]
            variance = var(sums)

            if variance < best_variance:
                best_variance = variance
                best_groups = partition
                if isclose(best_variance, 0):
                    break

        return best_groups
