import { useEffect, useState } from 'react'
import { Button } from '../Button'
import LoadingIndicator from '../LoadingIndicator'
import AttendanceCard from './AttendanceCard'
import { useAttendance } from '../../hooks/useAttendance'
import { FetchStatus } from '../../hooks/types'

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
  const [loading, setLoading] = useState(false)

  const {fetchAttendance, status: attendanceStatus} = useAttendance()

  useEffect((() => {

    const asyncAttendance = async () => {
      const result = await fetchAttendance("7/18/2025")

      if(result.status == FetchStatus.SUCCESS) {
        const fetchedAttendees = result.attendees.map((tuple) => {
          return {name:tuple[0], present: tuple[1]} as DisplayedAttendee
        })
        setAttendees(fetchedAttendees)
      }
    }
    
    asyncAttendance()

  }),[])

  const toggle = (index: number) => {
    setAttendees((prev) =>
      prev.map((a, i) => (i === index ? { ...a, present: !a.present } : a)),
    )
  }

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      console.log('Submitted attendance:', attendees)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen w-screen overflow-x-visible">
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start p-4 pt-4 space-y-4">
        <LoadingIndicator isLoading={loading} />

        <h1 className="text-2xl font-bold text-white">Take Attendance</h1>

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
