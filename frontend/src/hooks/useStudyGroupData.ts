import { useState, useEffect } from 'react';
import type { StudyGroup, StudyGroupResponse } from '../api/sheet'
import { fetchStudyGroupData } from '../api/sheet';

interface StudyGroupData {
  fetchGroups: () => Promise<void>
  groups: StudyGroup[]
  groupsLoading: boolean
  groupsError: string | null
  
}

export function useStudyGroupData(date: string): StudyGroupData {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    setLoading(true)
    setError(null);

    try {
          await fetchStudyGroupData().then(data => {
              setGroups(data)
          })
        } catch (err) {
          setError(err.message || 'Unknown error');
        } finally {
          setLoading(false);
        }
  }
  return {fetchGroups, groups, groupsLoading: loading, groupsError: error}
}
