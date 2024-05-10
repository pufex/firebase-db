import { useIconsContext } from "../../Icon"
import { useModals } from "../Modals"

import Button from "../../../components/Button/Button"

import "./ReportSuccessful.css"

const ReportSuccessful = () => {

    const {closeModal} = useModals();
    const { ImCheckmark } = useIconsContext()

    return <div className="modal__container">
        <div className="modal__shadow"></div>
        <div className="modal report-successful__modal">
            <header className="report-successful__header">
                <h1 className="report-successful__heading"> 
                    Reported
                </h1>
                <div className="report-successful__bubble">
                    <ImCheckmark 
                        className="report-successful__bubble-icon"
                        size={35}
                    />
                </div>
            </header>
            <p className="report-successful__information">
                Your report has been sent and will be handled by our stuff.
            </p>
            <Button
                type="primary"
                role="submit"
                onClick={closeModal}
            >
                Close
            </Button>
        </div>
    </div>
}

export default ReportSuccessful
