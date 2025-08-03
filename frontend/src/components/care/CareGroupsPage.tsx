import { useNavigate } from "react-router-dom"
import { Button } from "../Button"
import LoadingIndicator from "../LoadingIndicator"
import DateSelector from "../study/DateSelector"
import { FetchStatus } from "../../hooks/types"
import { useEffect, useState } from "react"
import { useCareGroups } from "../../hooks/useCareGroups"
import { usePageContext } from "../../context/PageContext"
import { useToast } from "../../hooks/useToast"
import SimpleToast from "../SimpleToast"
import StudyGroupGrid from "../study/StudyGroupGrid"
import CareGroupsDisplay from "./CareGroupsDisplay"




const CareGroupsPage = () => {

    const {fetchCareGroups, careGroups, status, loading, error} = useCareGroups()
    const navigate = useNavigate()
    const {page, setPage} = usePageContext()
    const { toastMessage, toastStatus, showToast } = useToast()

    const handleNavigate = () => {
        navigate('/', {replace: true})
        setPage('groups')
    }

    useEffect(() => {
        fetchCareGroups().then(() => console.log(careGroups))
    }
    , [])


    return (
        <div className="min-h-screen w-screen overflow-x-visible">
        <h1 className="text-xl sm:text-2xl font-bold text-white text-center">Care Groups</h1>
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-start p-4 pt-4 space-y-4">
        <LoadingIndicator isLoading={status == FetchStatus.LOADING} />
        <div className="w-full max-w-lg flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
          <Button onClick={() => handleNavigate()}>⬅️ Take Attendance</Button>
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
      </div>
    </div>
    )
}

export default CareGroupsPage