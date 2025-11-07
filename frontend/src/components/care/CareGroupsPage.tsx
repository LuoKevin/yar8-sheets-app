import { useNavigate } from 'react-router-dom'
import { Button } from '../Button.tsx'
import LoadingIndicator from '../LoadingIndicator.tsx'
import { FetchStatus } from '../../hooks/types.ts'
import { useEffect } from 'react'
import { useCareGroups } from '../../hooks/useCareGroups.ts'
import { usePageContext } from '../../context/PageContext.tsx'
import { useToast } from '../../hooks/useToast.ts'
import SimpleToast from '../SimpleToast.tsx'
import CareGroupsDisplay from './CareGroupsDisplay.tsx'
import GlitchyWordBox from './GlitchyWordBox.tsx'
import { motion } from 'motion/react'

const CareGroupsPage = () => {
  const { fetchCareGroups, careGroups, status, nonMembers } = useCareGroups()
  const navigate = useNavigate()
  const { setPage } = usePageContext()
  const { toastMessage, toastStatus } = useToast()
  const handleNavigate = () => {
    navigate('/', { replace: true })
    setPage('groups')
  }

  useEffect(() => {
    fetchCareGroups()
  }, [])

  return (
    <div className="min-h-screen w-screen">
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start p-4 pt-10 space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white text-center">Care Groups</h1>
        <LoadingIndicator isLoading={status == FetchStatus.LOADING} />
        <div className="w-full max-w-lg flex flex-col justify-center sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
          <Button onClick={() => handleNavigate()}>⬅️ Study Groups</Button>
        </div>
        <div className="w-full max-w-lg pb-2 flex items-center justify-start">
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
          <CareGroupsDisplay groups={careGroups} />
        </div>
        {/* <GirlsGroupDisplay girls={nonMembers} /> */}

        {nonMembers.length > 0 && (
          <motion.div
            className="w-full pb-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            <GlitchyWordBox words={nonMembers} />
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CareGroupsPage
