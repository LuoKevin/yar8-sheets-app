import { useState, useEffect } from 'react'
import { apiFetchStudyDates, StudyDatesResponse } from '../api/sheet.ts'
import { useDateContext } from '../context/DateContext.tsx'

interface StudyDatesData {
  activeDate: string
  dates: string[]
  isDatesLoading: boolean
  error: string | null
}

export function useStudyDatesData(): StudyDatesData {
  const [datesData, setDates] = useState<StudyDatesResponse>({ activeDate: '', dates: [] })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const context = useDateContext()

  useEffect(() => {
    setLoading(true)
    setError(null)

    apiFetchStudyDates()
      .then((res) => {
        setDates(res)
        context.setDate(res.activeDate)
      })
      .catch((err) => setError(err.message || 'Unknown error'))
      .finally(() => setLoading(false))
  }, [])

  return {
    activeDate: datesData.activeDate,
    dates: datesData.dates,
    error,
    isDatesLoading: loading,
  }
}
