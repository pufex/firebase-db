import { useDatabase } from "../../contexts/Database"

import { useMemo } from "react"

import RowUser from "../../components/RowUser/RowUser"

import "./AllUsers.css"

const AllUsers = () => {

    const {
        allUsers
    } = useDatabase();

    const usersList = useMemo(() => {
        if(!allUsers)
            return []
        else
            return allUsers?.map(({id, username, isBanned, email}, index) => {
                console.log(isBanned)
                return <RowUser
                    userId={id || ""}
                    index={index}
                    username={username || ""}
                    isBanned={isBanned}
                    email={email || ""}
                />
            })
    }, [allUsers])

    return <main className="all-users__main">
        <header className="all-users__header">
            <h1 className="all-users__heading">
                All Users
            </h1>
        </header>
        <ul className="all-users__users">
            {usersList}
        </ul>
    </main>
}


export default AllUsers
