import { useIconsContext } from "../../contexts/Icon"

import "./LoadingIcon.css"

const LoadingIcon = () => {
    
    const {
        AiOutlineLoading3Quarters,
    } = useIconsContext()
    
    return <>
        <div className="loading__loading-container">
            <AiOutlineLoading3Quarters 
                size={30}
                className="loading__loading"
            />
        </div>
    </>
    
}

export default LoadingIcon
