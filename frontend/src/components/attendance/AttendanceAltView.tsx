import { DisplayedAttendee } from './AttendancePage.tsx'
import { AttendanceViewProps } from './AttendanceView.tsx'

const AttendanceAltView = ({ attendees, toggleAttendee }: AttendanceViewProps) => {
  return (
    <div className="max-h-[70vh] overflow-y-auto rounded-xl border divide-y">
      {attendees.map((attendee) => (
        <AttendeeRow key={attendee.name} attendee={attendee} toggleAttendee={toggleAttendee} />
      ))}
    </div>
  )
}

interface AttendeeRowProps {
  attendee: DisplayedAttendee
  toggleAttendee: (a: DisplayedAttendee) => void
}

const AttendeeRow = ({ attendee, toggleAttendee }: AttendeeRowProps) => {
  return (
    <button
      type="button"
      role="listitem"
      onClick={() => toggleAttendee(attendee)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggleAttendee(attendee)
        }
      }}
      className="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
    >
      <span className="block truncate text-sm font-xl text-neutral-800 dark:text-neutral-100">
        {attendee.name}
      </span>
    </button>
  )
}

export default AttendanceAltView
