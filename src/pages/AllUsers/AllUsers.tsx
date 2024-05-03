import type { UsersDocumentType } from "../../contexts/Database"
import { useDatabase } from "../../contexts/Database"

import { useState, useEffect, useMemo } from "react"

import Loading from "../../components/Loading/Loading"
import ErrorPage from "../ErrorPage/ErrorPage"
import RowUser from "../../components/RowUser/RowUser"

import "./AllUsers.css"

type AllStateType = "loading" | "success" | "error"

const AllUsers = () => {

    const {
        getAllUsers
    } = useDatabase();

    const [allState, setAllState] = useState<AllStateType>("loading")
    const [allUsers, setAllUsers] = useState<UsersDocumentType[]>()

    const fetchAllUsers = () => {
        getAllUsers()
            .then((snapshot) => {
                const users: UsersDocumentType[] = [];
                // @ts-expect-error: Won't let me import the promise's generics for this function.
                snapshot?.docs?.forEach?.((doc) => {
                    users.push({...doc.data(), id: doc.id})
                })
                setAllUsers(users);
                setAllState('success')
            })
            .catch((error) => {
                console.error(error)
                setAllState("error")
            })
    }

    useEffect(() => {
        fetchAllUsers();
    }, [])

    const usersList = useMemo(() => {
        if(!allUsers)
            return []
        else
            return allUsers?.map((user, index) => {
                return <RowUser
                    userId={user?.id || ""}
                    index={index}
                    username={user?.username || ""}

                />
            })
    }, [allUsers])


    if(allState == "loading")
    return <main className="all-users__loading-container">
        <Loading />
    </main>
    if(allState == "success")
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
    if(allState == "error")
    return <ErrorPage />
}


export default AllUsers
