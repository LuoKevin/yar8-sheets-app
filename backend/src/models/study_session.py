import math
from functools import reduce
from math import isclose
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
        leader_iter = filter(lambda l: l.present, self.leaders)
        for group in balanced_members:
            groups.append(StudyGroup(members=group, leader=leader_iter.__next__()))
        for missing_leader in filter(lambda l: not l.present, self.leaders):
            groups.append(StudyGroup(members=[], leader=missing_leader))
        organized_groups: List[StudyGroup] = []
        for leader in self.leaders:
            next_group = next(filter(lambda g: g.leader.name == leader.name, groups))
            organized_groups.append(next_group)
        return organized_groups

    def _distribute_members(self, iterations=1000):
        members = self.members
        n = len(list(filter(lambda l: l.present, self.leaders)))

        if not members or n <= 0:
            return [[] for _ in range(n)]

        total_sum = sum(map(lambda mem: mem.talk_weight, members))
        avg_sum = total_sum / min(n, len(members))  # Handle case when n > len(values)
        best_groups = None
        best_deviation = float('inf')

        # Calculate target sizes (some groups size m, others m+1, some 0 if n > len(values))
        m = len(members) // n
        remainder = len(members) % n
        target_sizes = []

        for i in range(n):
            if i < len(members):
                # Groups get either m or m+1 elements
                target_sizes.append(m + 1 if i < remainder else m)
            else:
                # Excess groups get 0 elements (when n > len(values))
                target_sizes.append(0)

        for _ in range(iterations):
            # Shuffle for randomization
            shuffled = members.copy()
            random.shuffle(shuffled)

            # Initialize groups with target sizes
            groups = [[] for _ in range(n)]
            sums = [0] * n
            indices = [i for i in range(n) if target_sizes[i] > 0]  # Only consider groups that should get items

            # Assign values to groups maintaining exact size constraints
            for member in shuffled:
                # Among groups that need more items, pick the one with smallest current sum
                chosen_index = min(indices, key=lambda i: sums[i])
                groups[chosen_index].append(member)
                sums[chosen_index] += member.talk_weight

                # Remove group from consideration if it reached target size
                if len(groups[chosen_index]) == target_sizes[chosen_index]:
                    indices.remove(chosen_index)

            # Calculate sum deviation from ideal (only for non-empty groups)
            current_deviation = sum(abs(s - avg_sum) for s in sums if s > 0)

            # Keep track of best solution
            if current_deviation < best_deviation:
                best_groups = [group.copy() for group in groups]
                best_deviation = current_deviation

                # Early exit if we find a perfectly balanced solution
                if isclose(best_deviation, 0, abs_tol=1e-9):
                    break

        return best_groups
