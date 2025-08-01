import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { fetchStudyDates } from '../api/sheet'
import { FetchStatus } from '../hooks/types'

interface DateData {
  currentDate: string
  allDates: string[]
  dateStatus: FetchStatus
  dateError: string | undefined
  setDate: (str: string) => void
}

const DateContext = createContext<DateData | undefined>(undefined)

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [currentDate, setCurrentDate] = useState('')
  const [allDates, setAllDates] = useState<string[]>([])
  const [dateStatus, setDateStatus] = useState(FetchStatus.IDLE)
  const [dateError, setDateError] = useState<string | undefined>(undefined)

  useEffect(() => {
    setDateStatus(FetchStatus.LOADING)
    fetchStudyDates()
      .then((fetchResponse) => {
        setDateStatus(FetchStatus.SUCCESS)
        setCurrentDate(fetchResponse.activeDate)
        setAllDates(fetchResponse.dates)
      })
      .catch((err) => {
        setDateStatus(FetchStatus.ERROR)
        setDateError(`Error in retrieving dates: Reason:${err.message || 'Unknown'}`)
      })
      .finally(() => {})
  }, [])

  const setDate = (newDate: string) => setCurrentDate(newDate)

  return (
    <DateContext.Provider value={{ currentDate, allDates, dateStatus, dateError, setDate }}>
      {children}
    </DateContext.Provider>
  )
}

export const useDateContext = (): DateData => {
  const context = useContext(DateContext)
  if (context === undefined) throw new Error('useDate must be used within a DateProvider')
  return context
}


export function getFormattedTimestamp(): string {
  const now = new Date()

  const pad = (n: number) => n.toString().padStart(2, '0')

  const month = pad(now.getMonth() + 1)
  const day = pad(now.getDate())
  const year = now.getFullYear()

  const hours = pad(now.getHours())
  const minutes = pad(now.getMinutes())
  const seconds = pad(now.getSeconds())

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`
}