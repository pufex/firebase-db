import { useNavigate } from "react-router-dom"

import "./RowUser.css"

type RowUserProps = {
    index: number,
    username: string,
    userId: string,
}

const RowUser = ({
    index,
    username,
    userId
}:RowUserProps) => {

    const navigate = useNavigate();

    return <li className="row-user__container">
        <div className="row-user--left">
            <h1 className="row-user__index">
                {index.toString()}
            </h1>
        </div>
        <div className="row-user--middle">
            <h1 className="row-user__name">
                {username}
            </h1>
        </div>
        <div className="row-user--right">
            <button 
                className="btn btn--primary"
                onClick={() => navigate(`/profile?user=${userId}`)}
            >
                See profile
            </button>
        </div>
    </li>
}

export default RowUser
