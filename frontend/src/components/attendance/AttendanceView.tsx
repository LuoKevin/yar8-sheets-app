import AttendanceCard from './AttendanceCard.tsx'
import { DisplayedAttendee } from './AttendancePage.tsx'
import { motion } from 'framer-motion'

export interface AttendanceViewProps {
  attendees: DisplayedAttendee[]
  toggleAttendee: (a: DisplayedAttendee) => void
}

const AttendanceView = ({ attendees, toggleAttendee }: AttendanceViewProps) => {
  return (
    <div className="w-full max-w-3xl flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {attendees.map((attendee) => (
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
