import { useEffect, useState } from 'react'
import { Button } from '../Button'
import LoadingIndicator from '../LoadingIndicator'
import AttendanceCard from './AttendanceCard'
import { useAttendance } from '../../hooks/useAttendance'
import { FetchStatus } from '../../hooks/types'
import { useStudyGroupData } from '../../hooks/useStudyGroupData'
import { useStudyDatesData } from '../../hooks/useStudyDatesData'
import { useDateContext } from '../../context/DateContext'
import DateSelector from '../study/DateSelector'

interface DisplayedAttendee {
  name: string
  present: boolean
}

const mockAttendees: DisplayedAttendee[] = [
  { name: 'Alice', present: false },
  { name: 'Bob', present: true },
  { name: 'Charlie', present: false },
  { name: 'Dana', present: true },
]

const AttendancePage = () => {
  const [attendees, setAttendees] = useState<DisplayedAttendee[]>(mockAttendees)

  const {fetchAttendance, status: attendanceStatus} = useAttendance()
  const {currentDate, allDates, dateStatus, dateError, setDate} = useDateContext()
  

  useEffect((() => {

    const asyncAttendance = async () => {
      if(currentDate=="") return
      const result = await fetchAttendance(currentDate)

      if(result.status == FetchStatus.SUCCESS) {
        const fetchedAttendees = result.attendees.map((tuple) => {
          return {name:tuple[0], present: tuple[1]} as DisplayedAttendee
        })
        setAttendees(fetchedAttendees)
      }
    }
    
    asyncAttendance()
  }),[currentDate])

  const toggle = (index: number) => {
    setAttendees((prev) =>
      prev.map((a, i) => (i === index ? { ...a, present: !a.present } : a)),
    )
  }

  const handleSubmit = () => {
    setTimeout(() => {
      console.log('Submitted attendance:', attendees)
    }, 1000)
  }

  return (
    <div className="min-h-screen w-screen overflow-x-visible">
      <LoadingIndicator isLoading={dateStatus==FetchStatus.LOADING||attendanceStatus==FetchStatus.LOADING} />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start p-4 pt-4 space-y-4">

        <h1 className="text-2xl font-bold text-white">Take Attendance</h1>
        <DateSelector dates={allDates} initialDate={currentDate} onSelect={(newDate) =>{setDate(newDate)}} />

        <div className="w-full max-w-5xl flex flex-wrap justify-center gap-4">
          {attendees.map((attendee, i) => (
            <AttendanceCard
              key={attendee.name}
              name={attendee.name}
              present={attendee.present}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        <Button className="mt-4" onClick={handleSubmit}>
          Submit Attendance
        </Button>
      </div>
    </div>
  )
}

export default AttendancePage
