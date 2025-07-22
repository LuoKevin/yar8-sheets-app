// src/hooks/useStudyGroupData.ts
import { useState, useEffect } from 'react';
import type { StudyGroup, StudyGroupResponse } from '../api/sheet'
import { fetchStudyGroupData } from '../api/sheet';

export function useStudyGroupData(): StudyGroup[] {
  const [data, setData] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchStudyGroupData()
      .then(res => setData(res))
      .catch(err => setError(err.message || 'Unknown error'))
      .finally(() => setLoading(false));
  }, []);

  return data as StudyGroup[];
}
