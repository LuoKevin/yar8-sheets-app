import StudyGroupGrid from './components/StudyGroupGrid'
import { useStudyGroupData } from './hooks/useStudyGroupData'
import GradientBackground from './components/GradientBackground'
import DateSelector from './components/DateSelector'
import { useStudyDatesData } from './hooks/useStudyDatesData'
import { useEffect, useState } from 'react'
import { Button } from './components/Button'
import { usePostResetGroups } from './hooks/usePostReset'
import { StudyGroup } from './api/sheet'
import { useShuffle } from './hooks/useShuffle'
import { LoadingText } from './components/LoadingText'
import LoadingIndicator from './components/LoadingIndicator'
import { useToast } from './hooks/useToast'
import SimpleToast from './components/SimpleToast'
import { FetchStatus } from './hooks/types'
import AnimatedCheckbox from './components/AnimatedCheckbox'
import ToggleSwitch from './components/ToggleSwitch'

const App = () => {
  const { toastMessage, toastStatus, showToast } = useToast()
  const { dates, activeDate: currentDate, isDatesLoading } = useStudyDatesData()
  const { fetchGroups, groups, groupsLoading, groupsError, locked: groupsLocked, manualSetGroups, scrambleGroups } =
    useStudyGroupData(currentDate)
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

  const handleDateSelect = () => {
    fetchGroups()
  }

  const [resetWarning, setResetWarning] = useState(true)

  const handleResetGroups = () => {
    if(resetWarning && groupsLocked) {
      showToast("Groups are currently locked. Are you sure?", 'warning')
      setResetWarning(false)
      return
    }
    resetGroups()
      .then(() => {
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
    if(groupsLocked) {
      showToast("Reset groups before shuffling!", 'error')
      return
    }
    try {
      await startShuffle().then(() => {
        if (shuffleStatus == FetchStatus.ERROR) {
          showToast(`Shuffling failed. Reason: ${shufflingError}`, 'error')
        } else {
          showToast('Shuffling successful!', 'success')
        }
      })
      await fetchGroups()
    } catch (err) {
      showToast(`Shuffling failed. Reason: ${shufflingError}`, 'error')
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  return (
    <div className="min-h-screen w-screen overflow-x-visible">
      <GradientBackground />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start p-4 pt-4">
        <LoadingIndicator isLoading={isDatesLoading} />
        <div className="w-full max-w-lg flex items-center space-x-4 mb-6">
          <DateSelector dates={dates} initialDate={currentDate} onSelect={handleDateSelect} />
          <Button disabled={resetLoading || isShuffling} onClick={() => handleResetGroups()}>
            Reset Groups
          </Button>
          <Button disabled={isShuffling || resetLoading} onClick={() => handleShuffle()}>
            Shuffle and Lock
          </Button>
          <ToggleSwitch checked={groupsLocked}/>
        </div>
        <div className="w-full max-w-lg pb-2 flex items-center justify-start">
          <LoadingText visible={isShuffling} text="Shuffling" />
          <LoadingText visible={resetLoading} text="Resetting" />
          {toastMessage && (
            <SimpleToast
              message={toastMessage}
              type={toastStatus}
              onClose={() => showToast('')}
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

export default App
