import { AttendeeFilter } from '../../hooks/types.ts'
import AttendanceCard from './AttendanceCard.tsx'
import { DisplayedAttendee } from './AttendancePage.tsx'
import { motion } from 'framer-motion'

interface AttendanceViewProps {
  attendees: DisplayedAttendee[]
  filterMode: AttendeeFilter
  searchTerm: string
  toggleAttendee: (a: DisplayedAttendee) => void
}

const AttendanceView = ({
  attendees,
  filterMode,
  searchTerm,
  toggleAttendee,
}: AttendanceViewProps) => {
  return (
    <div className="w-full max-w-3xl flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {attendees
        .filter((a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((a) => {
          switch (filterMode) {
            case 'only-present':
              return a.present
            case 'only-absent':
              return !a.present
            default:
              return true
          }
        })
        .map((attendee) => (
          <motion.div
            key={attendee.name}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            <AttendanceCard
              name={attendee.name}
              present={attendee.present}
              lateTime={attendee.lateTime}
              onToggle={() => toggleAttendee(attendee)}
            />
          </motion.div>
        ))}
    </div>
  )
}

export default AttendanceView
