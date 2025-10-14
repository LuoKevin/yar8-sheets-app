import StudyGroupGrid from './StudyGroupGrid.js'
import { useStudyGroupData } from '../../hooks/useStudyGroupData.ts'
import DateSelector from './DateSelector.tsx'
import { useEffect, useState } from 'react'
import { Button } from '../Button.tsx'
import { usePostResetGroups } from '../../hooks/usePostReset.ts'
import { useShuffle } from '../../hooks/useShuffle.ts'
import { LoadingText } from './LoadingText.tsx'
import LoadingIndicator from '../LoadingIndicator.tsx'
import { useToast } from '../../hooks/useToast.ts'
import SimpleToast from '../SimpleToast.tsx'
import { FetchStatus } from '../../hooks/types.ts'
import Toggle from './GroupLockToggle.tsx'
import { useDateContext } from '../../context/DateContext.tsx'
import { useNavigate } from 'react-router-dom'
import { usePageContext } from '../../context/PageContext.tsx'

const StudyGroupsPage = () => {
  const { setPage } = usePageContext()
  const { toastMessage, toastStatus, showToast } = useToast()
  const { currentDate, allDates, setDate } = useDateContext()
  const {
    fetchGroups,
    groups,
    groupsLoading,
    groupsError,
    locked: groupsLocked,
    scrambleGroups,
  } = useStudyGroupData()
  const { resetGroups, resetLoading } = usePostResetGroups()
  const { isShuffling, startShuffle, shufflingError } = useShuffle(() => {
    scrambleGroups()
  })
  const [resetWarning, setResetWarning] = useState(true)
  const [firstReset, setFirstReset] = useState(false)

  const handleDateSelect = (newDate: string) => {
    setDate(newDate)
    fetchGroups()
    setFirstReset(false)
  }

  const handleResetGroups = () => {
    if (resetWarning && groupsLocked) {
      showToast('Groups are currently locked. Are you sure?', 'warning')
      setResetWarning(false)
      return
    }
    resetGroups()
      .then(() => {
        setPage('groups')
        setFirstReset(true)
        fetchGroups()
      })
      .then(() => {
        if (groupsError != null) {
          showToast(`Reset failed. Reason:${groupsError}`, 'error')
          return
        }
        showToast('Reset successful!', 'success')
      })
  }

  const handleShuffle = async () => {
    if (groupsLocked || !firstReset) {
      showToast('Reset groups before shuffling!', 'error')
      return
    }
    try {
      setPage('shuffling')
      const result = await startShuffle()

      if (result.responseStatus == FetchStatus.ERROR) {
        showToast(`Shuffling failed. Reason: ${result.error}`, 'error')
        setPage('groups')
      } else {
        setPage('locked')
        setFirstReset(false)
        setResetWarning(true)
        showToast('Shuffling successful!', 'success')
      }

      await fetchGroups()
    } catch {
      showToast(`Shuffling failed. Reason: ${shufflingError}`, 'error')
      setPage('groups')
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  useEffect(() => {
    if (groupsLocked) setPage('locked')
    else setPage('groups')
  }, [groupsLocked])

  const navigate = useNavigate()
  const navigateAttendance = () => {
    navigate('/attendance', { replace: true })
    setPage('attendance')
  }

  const navigateCare = () => {
    navigate('/care', { replace: true })
    setPage('care')
  }

  return (
    <div className="min-h-screen w-screen overflow-x-visible">
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start p-4 pt-4 space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white text-center">Study Groups</h1>
        <LoadingIndicator isLoading={groupsLoading && groups.length == 0} />
        <div className="flex flex-row items-center justify-center flex-wrap gap-2">
          <Button onClick={() => navigateAttendance()}>⬅️ Take Attendance</Button>
          <DateSelector dates={allDates} initialDate={currentDate} onSelect={handleDateSelect} />
          <Button disabled={resetLoading || isShuffling} onClick={() => handleResetGroups()}>
            Reset Groups
          </Button>
          <Button disabled={isShuffling || resetLoading} onClick={() => handleShuffle()}>
            Shuffle and Lock
          </Button>
          <Toggle checked={groupsLocked} />
          <Button onClick={() => navigateCare()}>Care Groups ➡️</Button>
        </div>
        <div className="w-full max-w-lg pb-2 flex items-center justify-start">
          <LoadingText visible={isShuffling} text="Shuffling" />
          <LoadingText visible={resetLoading} text="Resetting" />
          {toastMessage && (
            <SimpleToast
              key={toastMessage + toastStatus}
              message={toastMessage}
              type={toastStatus}
              onClose={() => {}}
              // Clear when manually closed
            />
          )}
        </div>
        <div className="w-full pb-2">
          <StudyGroupGrid groups={groups} loading={groupsLoading} error={groupsError} />
        </div>
      </div>
    </div>
  )
}

export default StudyGroupsPage
