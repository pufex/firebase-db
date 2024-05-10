import type {FormEvent} from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useInput } from "../../../hooks/useInput"
import { useDatabase } from "../../Database"
import { useModals } from "../Modals"

import Form from "../../../components/Form/Form"
import Input from "../../../components/Input/Input"
import Button from "../../../components/Button/Button"
import CloseModal from "../components/CloseModal/CloseModal"

import "./ReportUser.css"

const ReportUser = () => {
    
    const { closeModal, openModal } = useModals();
    const { currentUser, reportUser } = useDatabase();

    const [params, setParams] = useSearchParams();
    const reportedUserId = params.get("report-id")
    const reportedName = params.get("report-name")

    const closeReportModal = () => {
        setParams(previous => {
            if(previous.has("report-id"))
                previous.delete("report-id")
            if(previous.has("report-name"))
                previous.delete("report-name")
            return previous
        })
        closeModal();
    }

    if(!reportedUserId || !reportedName)
        closeReportModal();

    useEffect(() => {
        if(!currentUser)
            closeReportModal();
    }, [currentUser])

    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const [reason, handleReasonChange, setReasonError] = useInput({defaultValue: "Inappropriate Behaviour"});
    const [details, handleDetailsChange, setDetailsError] = useInput({})

    const handleReportSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setReasonError()
        setDetailsError()

        let shouldReturn = false;

        if(!reason.value.length){
            shouldReturn = true;
            setReasonError(true, "Can't be empty")
        }else if(reason.value.length > 40){
            shouldReturn = true;
            setReasonError(true, "Max. 20 char")
        }
        
        if(!details.value.length){
            shouldReturn = true;
            setDetailsError(true, "Can't be empty.")
        }else if(reason.value.length > 100){
            shouldReturn = true;
            setReasonError(true, "Max. 100 char")
        }

        if(shouldReturn || !currentUser) return;

        try{
            setLoading(true);
            await reportUser({
                reportingUserId: currentUser?.uid,
                reportedUserId: reportedUserId ?? "",
                reason: reason.value,
                details: details.value,
            })
            closeReportModal();
            openModal("report-successful");
        }catch(error){
            console.error(error)
            setError("Failed to report the user.")
        }
        setLoading(false);

    }

    return <div className="modal__container">
        <div className="modal__shadow"></div>
        <div className="report-user__modal modal">
            <CloseModal 
                top="1rem"
                right="1rem"
                onClose={closeReportModal}
            />
            <header className="report-user__header">
                <h1 className="report-user__title">
                    Report User
                </h1>
                <h3 className="report-user__heading">
                    Disclaimer
                </h3>
                <p className="report-user__disclaimer">
                    Fake reports will be punished.
                </p>
                <span className="report-user__username">
                    Username: {reportedName}
                </span>
            </header>
            <Form
                onSubmit={handleReportSubmit}
                isError={error != ""}
                errorMessage={error}
            >
                <div className="project--form__input-container">
                    <Input
                        value={reason.value}
                        isError={reason.isError}
                        errorMessage={reason.errorMessage}
                        onChange={handleReasonChange}
                        placeholder="Your Reason"
                    >
                        Reason
                    </Input>
                </div>
                <div className="project--form__input-container">
                    <Input
                        value={details.value}
                        isError={details.isError}
                        errorMessage={details.errorMessage}
                        onChange={handleDetailsChange}
                        placeholder="Provide Details"
                    >
                        Details
                    </Input>
                </div>
                <div className="project--form__submit-container">
                    <Button
                        role="submit"
                        type="primary"
                        loading={loading}
                        disabled={loading}
                    >
                        Submit Report 
                    </Button>
                </div>
            </Form>
        </div>
    </div>
}

export default ReportUser
