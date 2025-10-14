import { useState } from 'react'
import { Button } from '../Button.tsx'
import SimpleModal from '../SimpleModal.tsx'
import { usePostNewAttendee } from '../../hooks/usePostNewAttendee.ts'
import SimpleToast from '../SimpleToast.tsx'
import { useToast } from '../../hooks/useToast.ts'
import { FetchStatus } from '../../hooks/types.ts'

const AddNewAttendeeModal = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const { toastMessage, toastStatus, showToast } = useToast()

  const { addNewAttendee } = usePostNewAttendee()

  const onSubmit = async (name: string) => {
    if (name == '') {
      showToast('Please enter a name!', 'warning')
      return
    }
    const result = await addNewAttendee(name)

    if (result.status == FetchStatus.SUCCESS) {
      showToast('Successfully added new attendee!', 'success')
    } else {
      showToast(`Error in adding attendee. Reason: ${result.error || 'Unknown'}`)
    }
  }

  const onClose = () => {
    setModalOpen(false)
  }

  return (
    <div>
      {toastMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <SimpleToast message={toastMessage} type={toastStatus} onClose={() => showToast('')} />
        </div>
      )}
      <Button
        onClick={() => {
          setModalOpen(true)
        }}
      >
        Add new member
      </Button>

      <SimpleModal isOpen={modalOpen} onClose={onClose} onSubmit={onSubmit} />
    </div>
  )
}

export default AddNewAttendeeModal
