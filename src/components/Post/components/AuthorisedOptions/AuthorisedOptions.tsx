import { ReactElement, useState } from "react"
import { useIconsContext } from "../../../../contexts/Icon";

import "./AuthorisedOptions.css"

type AuthorisedOptionsProps = {
    children: ReactElement[] | ReactElement,
}

const AuthorisedOptions = ({
    children
}: AuthorisedOptionsProps) => {
    
    const {
        HiOutlineDotsHorizontal,
        IoClose,
    } = useIconsContext();

    const [display, setDisplay] = useState(false);

    const switchDisplay = () => {
        setDisplay(previous => !previous)
    }

    return <div className="authorised-options__container">
        <button
            className="btn authorised-options__button"
            onClick={switchDisplay}
        >
            {
                !display 
                    ? <HiOutlineDotsHorizontal
                        size={25}
                        className="authorised-options__button-icon"
                    />
                    : <IoClose
                        size={25}
                        className="authorised-options__button-icon"
                    />
            }
        </button>
        {
            display 
                && <div 
                    className="authorised-options__content"
                >
                    {children}
                </div>
        }
    </div>
}

export default AuthorisedOptions
