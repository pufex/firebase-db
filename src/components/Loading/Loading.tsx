import { useIconsContext } from "../../contexts/Icon"

import "./Loading.css"

const Loading = () => {
  
    const { AiOutlineLoading3Quarters } = useIconsContext();

    return <div className="loading__container">
        <div className="loading__loading-container">
            <AiOutlineLoading3Quarters 
                size={30}
                className="loading__loading"
            />
        </div>
    </div>
}

export default Loading
