import { useEffect, useState } from 'react'
import { Button } from '../Button'
import LoadingIndicator from '../LoadingIndicator'
import AttendanceCard from './AttendanceCard'
import { useAttendance } from '../../hooks/useAttendance'
import { FetchStatus } from '../../hooks/types'
import { getFormattedTimestamp, useDateContext } from '../../context/DateContext'
import DateSelector from '../study/DateSelector'
import { usePostAttendance } from '../../hooks/usePostAttendance'
import SimpleToast from '../SimpleToast'
import { useToast } from '../../hooks/useToast'
import { useNavigate } from 'react-router-dom'
import LatecomerToggle from './LatecomerToggle'

interface DisplayedAttendee {
  name: string
  present: boolean
  lateTime: string
}

const AttendancePage = () => {
  const [attendees, setAttendees] = useState<DisplayedAttendee[]>([])
  const [attDateIndex, setAttDateIndex] = useState<number>(-1)
  const [searchTerm, setSearchTerm] = useState('')
  const [hasUnsavedChanges, setHasChanges] = useState(false)
  const [latecomerMode, setLatecomerMode] = useState(false)

  const { fetchAttendance, status: attendanceStatus } = useAttendance()
  const { currentDate, allDates, dateStatus, dateError, setDate } = useDateContext()
  const { submitAttendance } = usePostAttendance()
  const { toastMessage, toastStatus, showToast } = useToast()

  useEffect(() => {
    const asyncAttendance = async () => {
      if (currentDate == '') return
      const result = await fetchAttendance(currentDate)

      if (result.status == FetchStatus.SUCCESS) {
        const fetchedAttendees = result.attendees.map((tuple, i) => {
          return { name: tuple[0], present: tuple[1], lateTime: result.latecomerTimes[i] } as DisplayedAttendee
        })
        setAttendees(fetchedAttendees)
        setAttDateIndex(result.attDateIndex)
        setHasChanges(false)
      } else {
        showToast(`Error: Unable to fetch attendees for:${result.error || ''}`, FetchStatus.ERROR)
      }
    }
    asyncAttendance()
  }, [currentDate])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

 const toggleAttendee = (attendee: DisplayedAttendee) => {
  if(latecomerMode && attendee.present && attendee.lateTime == "") {
    showToast("Cannot toggle off present attendees while in Latecomer Mode", 'warning')
    return
  }
  setHasChanges(true)
  setAttendees((prev) =>
    prev.map((a) => {
      if (a.name !== attendee.name) return a

      const wasPresent = a.present
      const nowPresent = !a.present

      let updatedLateTime = a.lateTime

      if (latecomerMode) {
        if (!wasPresent && nowPresent) {
          updatedLateTime = getFormattedTimestamp() // just became present
        } else if (wasPresent && !nowPresent) {
          updatedLateTime = "" // just toggled off while in Latecomer Mode
        }
      }

      return {
        ...a,
        present: nowPresent,
        lateTime: updatedLateTime,
      }
    })
  )
}


  const toggleLatecomerMode = (b: boolean) => {
    setLatecomerMode(!b)
  }

  const handleSubmit = () => {
    submitAttendance(
      attDateIndex,
      attendees.map((attendee) => attendee.present),
      attendees.map((attendee) => attendee.lateTime)
      
    )
      .then((res) => {
        if (res.status == FetchStatus.SUCCESS) {
          showToast('Successfully updated attendance', FetchStatus.SUCCESS)
          setHasChanges(false)
        }
      })
      .catch((err) => {
        showToast(
          `Error in updating attendance. Reason:${err.message || 'Unknown'}`,
          FetchStatus.ERROR,
        )
      })
  }

  const navigate = useNavigate()

  const handleNavigate = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('Unsaved changes, navigate anyway?')
      if (!confirmLeave) return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen w-screen overflow-x-visible px-2 sm:px-4">
      <LoadingIndicator
        isLoading={dateStatus == FetchStatus.LOADING || attendanceStatus == FetchStatus.LOADING}
      />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start p-4 pt-4 space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white text-center">Take Attendance</h1>
        <DateSelector
          dates={allDates}
          initialDate={currentDate}
          onSelect={(newDate) => {
            setDate(newDate)
          }}
        />

        <LatecomerToggle checked={latecomerMode} onClick={() => {
          setLatecomerMode(!latecomerMode)
        }}/>

        <Button onClick={() => handleNavigate()}>Study Groups Page ➡️</Button>

        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 rounded-md border border-gray-300 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {toastMessage && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
            <SimpleToast message={toastMessage} type={toastStatus} onClose={() => showToast('')} />
          </div>
        )}

        <Button className="fixed bottom-4 right-4 z-50 shadow-lg  " onClick={handleSubmit}>
          Submit Attendance
        </Button>

        <div className="w-full max-w-3xl flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {attendees
            .filter((a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((attendee) => (
              <AttendanceCard
                key={attendee.name}
                name={attendee.name}
                present={attendee.present}
                lateTime={attendee.lateTime}
                latecomerMode={latecomerMode}
                onToggle={() => toggleAttendee(attendee)}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default AttendancePage
