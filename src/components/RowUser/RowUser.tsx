import { useNavigate } from "react-router-dom"

import { useDatabase } from "../../contexts/Database"

import Button from "../Button/Button"

import "./RowUser.css"
import { useEffect, useState } from "react"

type RowUserProps = {
    index: number,
    username: string,
    userId: string,
    email: string,
    isBanned: boolean,
}

const RowUser = ({
    index,
    username,
    userId,
    email,
    isBanned,
}:RowUserProps) => {

    const navigate = useNavigate();

    const { currentUser, banUser } = useDatabase();

    const [banLoading, setBanLoading] = useState(false);
    const [banError, setBanError] = useState("");

    useEffect(() => {
        console.error(banError)
    }, [banError])

    const handleBan = async () => {
        try{
            setBanLoading(true);
            await banUser(email);
        }catch(err){
            console.error(err)
            setBanError("Failed to ban user.")
        }
        setBanLoading(false);
    }

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
            {
                currentUser?.isAdmin
                    && <>
                    {
                        !isBanned
                            ? currentUser?.uid != userId
                                ? <Button
                                    role="button"
                                    type="primary"
                                    onClick={handleBan}
                                    loading={banLoading}
                                    disabled={banLoading}
                                >
                                    Ban
                                </Button>
                                : null
                            : <span className="row-user__banned"> 
                                Banned
                            </span>   
                    }
                    </>
            }
            <Button
                type="primary"
                role="button"
                onClick={() => navigate(`/profile?user=${userId}`)}
            >
                Profile
            </Button>
        </div>
    </li>
}

export default RowUser
