import { useState, useEffect } from 'react'
import { postActiveStudyDate } from '../api/sheet'

interface ActiveDateResponse {
  postDate: (payloadDate: string) => Promise<void>
  success: boolean
  loading: boolean
  error: string | null
}

export function usePostActiveDate(): ActiveDateResponse {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const postDate = async (payloadDate: string) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await postActiveStudyDate(payloadDate)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { postDate, success, loading, error } as ActiveDateResponse
}
