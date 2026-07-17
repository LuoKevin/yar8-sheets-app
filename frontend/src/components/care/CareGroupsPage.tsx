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
    <div className="min-h-[100dvh] w-full overflow-x-hidden">
      <main className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1800px] flex-col items-center gap-5 px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="flex w-full flex-col items-center justify-center gap-3 text-center">
          <h1 className="text-center text-[clamp(1.5rem,3vw,2rem)] font-bold text-white">
            Care Groups
          </h1>
          <Button onClick={() => handleNavigate()}>⬅️ Study Groups</Button>
        </header>

        <LoadingIndicator isLoading={status == FetchStatus.LOADING} />

        {toastMessage && (
          <div className="flex w-full justify-center">
            <SimpleToast
              key={toastMessage + toastStatus}
              message={toastMessage}
              type={toastStatus}
              onClose={() => {}}
              // Clear when manually closed
            />
          </div>
        )}

        <section className="w-full pb-4" aria-label="Care groups">
          <CareGroupsDisplay groups={careGroups} />
        </section>
      </main>
    </div>
  )
}

export default CareGroupsPage
