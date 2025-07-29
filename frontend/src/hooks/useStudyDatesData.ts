import { useState, useEffect } from 'react'
import { fetchStudyDates, StudyDatesResponse } from '../api/sheet'

interface StudyDatesData {
  activeDate: string
  dates: string[]
  isDatesLoading: boolean
}

export function useStudyDatesData(): StudyDatesData {
  const [datesData, setDates] = useState<StudyDatesResponse>({ activeDate: '', dates: [] })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchStudyDates()
      .then((res) => setDates(res))
      .catch((err) => setError(err.message || 'Unknown error'))
      .finally(() => setLoading(false))
  }, [])

  return { activeDate: datesData.activeDate, dates: datesData.dates, isDatesLoading: loading }
}
