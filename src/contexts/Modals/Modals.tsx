import { createContext, useContext, useState, useEffect, ReactElement } from "react"
import { useSearchParams } from "react-router-dom"

import ReportUser from "./ReportUser/ReportUser"
import ReportSuccessful from "./ReportSuccessful/ReportSuccessful"

type ModalsContextType = {
    openModal: (id: string) => void
    closeModal: () => void
}

const ModalsContext = createContext<ModalsContextType | null>(null)

export const useModals = () => {
    const modals = useContext(ModalsContext);
    if(!modals) throw Error("Cannot use outside a provider.")
    else return modals;
}

type ModalsProviderProps = {
    children: ReactElement[] | ReactElement,
}

const ModalsProvider = ({
    children
}: ModalsProviderProps) => {

    const [params, setParams] = useSearchParams();
    const modalId = params.get("modal")

    const [modal, setModal] = useState<JSX.Element | null>(null)

    const determineModal = () => {
        switch(modalId){
            case "report-user":
                return <ReportUser />
            case "report-successful":
                return <ReportSuccessful />
            default:
                return null
        }
    }

    useEffect(() => {
        setModal(determineModal())
    }, [modalId])

    const openModal = (id: string) => {
        setParams(previous => {
            previous.set("modal", id);
            return previous
        })
    }

    const closeModal = () => {
        setParams(previous => {
            if(previous.has("modal"))
                previous.delete("modal");
            return previous
        })
    }

    const value: ModalsContextType = {
        openModal,
        closeModal,
    }

    return <ModalsContext.Provider
        value={value}
    >
        {modal}
        {children}
    </ModalsContext.Provider>
}

export default ModalsProvider
