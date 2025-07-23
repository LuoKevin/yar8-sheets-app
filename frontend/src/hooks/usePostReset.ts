import { useState } from 'react';
import { postResetGroups } from '../api/sheet';

interface PostResetGroupsResponse {
  resetGroups: () => Promise<void>
  success: boolean
  loading: boolean
  error: string | null
}

export function usePostResetGroups(): PostResetGroupsResponse {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const resetGroups = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await postResetGroups();
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return {resetGroups, success, loading, error} as PostResetGroupsResponse;
}
