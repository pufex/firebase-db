import { useIconsContext } from "../../../Icon"
import { useModals } from "../../Modals"

import "./CloseModal.css"

type CloseModalProps = {
    top?: string,
    left?: string,
    bottom?: string,
    right?: string,
    onClose?: () => void,
}

const CloseModal = ({
    top, 
    left, 
    bottom, 
    right,
    onClose,
}: CloseModalProps) => {

    const {IoClose} = useIconsContext();
    const {closeModal} = useModals();

    return <button 
        className="btn close-modal__button"
        onClick={!onClose ? closeModal : onClose}
        style={{
            left: left ?? "unset",
            top: top ?? "unset",
            bottom: bottom ?? "unset",
            right: right ?? "unset",
        }}
    >
        <IoClose 
            className="close-modal__button-icon"
            size={40}
        />
    </button>
}

export default CloseModal
