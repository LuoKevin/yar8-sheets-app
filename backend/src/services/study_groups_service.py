from typing import List
from ..models.study_group import StudyGroup

def rows_to_cols(rows: List[List[str]]) -> List[List[str]]:
    if not rows:
        return []
        # figure out how many columns appear in at least one row
    max_cols = max(len(r) for r in rows)
    cols: List[List[str]] = []
    for col_idx in range(max_cols):
        # collect only rows that have this column
        col = [r[col_idx] for r in rows if col_idx < len(r)]
        cols.append(col)
    return cols

def get_study_groups(rows: List[List[str]]) -> List[StudyGroup]:
    invalid_leader_names : List[str] = ["#N/A", "TRUE", "FALSE", ""]
    groups: List[StudyGroup] = []

    columns: List[List[str]] = rows_to_cols(rows)
    print(columns)
    for col in columns:
        if not col or col[0] in invalid_leader_names:
            continue
        new_study_group: StudyGroup = StudyGroup(
            leader=col[0],
            members= list(filter(lambda x: x != "", col[1:])),
        )
        groups.append(new_study_group)

    return groups