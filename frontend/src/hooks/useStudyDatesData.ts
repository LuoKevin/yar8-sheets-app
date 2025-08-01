import { useState, useEffect } from 'react'
import { fetchStudyDates, StudyDatesResponse } from '../api/sheet'
import { useDateContext } from '../context/DateContext'

interface StudyDatesData {
  activeDate: string
  dates: string[]
  isDatesLoading: boolean
}

export function useStudyDatesData(): StudyDatesData {
  const [datesData, setDates] = useState<StudyDatesResponse>({ activeDate: '', dates: [] })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const context = useDateContext()

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchStudyDates()
      .then((res) => {
        setDates(res)
        context.setDate(res.activeDate)
      })
      .catch((err) => setError(err.message || 'Unknown error'))
      .finally(() => setLoading(false))
  }, [])

  return { activeDate: datesData.activeDate, dates: datesData.dates, isDatesLoading: loading }
}
