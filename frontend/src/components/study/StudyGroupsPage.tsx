import StudyGroupGrid from './StudyGroupGrid'
import { useStudyGroupData } from '../../hooks/useStudyGroupData'
import DateSelector from './DateSelector'
import { useEffect, useState } from 'react'
import { Button } from '../Button'
import { usePostResetGroups } from '../../hooks/usePostReset'
import { StudyGroup } from '../../api/sheet'
import { useShuffle } from '../../hooks/useShuffle'
import { LoadingText } from './LoadingText'
import LoadingIndicator from '../LoadingIndicator'
import { useToast } from '../../hooks/useToast'
import SimpleToast from '../SimpleToast'
import { FetchStatus } from '../../hooks/types'
import Toggle from './GroupLockToggle'
import { useDateContext } from '../../context/DateContext'
import { useNavigate } from 'react-router-dom'
import { usePageContext } from '../../context/PageContext'

const StudyGroupsPage = () => {
  const { page, setPage } = usePageContext()
  const { toastMessage, toastStatus, showToast } = useToast()
  const { currentDate, allDates, dateStatus, dateError, setDate } = useDateContext()
  const {
    fetchGroups,
    groups,
    groupsLoading,
    groupsError,
    locked: groupsLocked,
    manualSetGroups,
    scrambleGroups,
  } = useStudyGroupData(currentDate)
  const { resetGroups, resetSuccess, resetLoading, resetError } = usePostResetGroups()
  const {
    status: shuffleStatus,
    isShuffling,
    startShuffle,
    shufflingError,
  } = useShuffle(
    () => {
      scrambleGroups()
    },
    (newGroups: StudyGroup[]) => {
      manualSetGroups(newGroups)
    },
  )
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
    } catch (err) {
      showToast(`Shuffling failed. Reason: ${shufflingError}`, 'error')
      setPage('groups')
    } finally {
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
      <h1 className="text-xl sm:text-2xl font-bold text-white text-center">Study Groups</h1>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start p-4 pt-4 space-y-4">
        <LoadingIndicator isLoading={dateStatus == FetchStatus.LOADING} />
        <div className="w-full max-w-lg flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
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
