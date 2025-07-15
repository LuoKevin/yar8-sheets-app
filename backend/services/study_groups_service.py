from typing import List
from backend.models.study_group import StudyGroup

def rows_to_cols(rows: List[List[str]]) -> List[List[str]]:
    return list(map(list, zip(*rows)))

def get_study_groups(rows: List[List[str]]) -> List[StudyGroup]:
    invalid_leader_names : List[str] = ["#N/A", "TRUE", "FALSE", ""]
    groups: List[StudyGroup] = []

    columns: List[List[str]] = rows_to_cols(rows)

    for col in columns:
        if not col or col[0] in invalid_leader_names:
            continue
        new_study_group: StudyGroup = StudyGroup(
            leader=col[0],
            members= list(filter(lambda x: x != "", col[1:])),
        )
        groups.append(new_study_group)

    return groups