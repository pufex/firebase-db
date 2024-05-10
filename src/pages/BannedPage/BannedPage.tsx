import { useEffect, useState } from "react";
import { useDatabase } from "../../contexts/Database";
import { useIconsContext } from "../../contexts/Icon"

import Button from "../../components/Button/Button";

import "./BannedPage.css"

const BannedPage = () => {

    const {logoutUser} = useDatabase();
    const {FaBan} = useIconsContext();

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        console.error(error)
    }, [error])

    const handleLogout = async () => {
        try{
            setLoading(true)
            await logoutUser();
        }catch(err){
            console.error(err)
            setError("Failed to log out.")
        }
        setLoading(false);
    }

    return <main className="banned-page__main">
        <article className="banned-page__wrapper">
            <header className="banned-page__header">
                <h1 className="banned-page__heading">
                    You have been BANNED!
                </h1>
                <FaBan 
                    className="banned-page__ban-icon"
                    size={80}
                />
            </header>
            <section className="banned-page__info">
                <p className="banned-page__information">
                    You have violated our terms of policy, therefore you can no longer access this website. Your account has been suspended indefinitely. We didn't remove your data, but you or other users cannot read it, and you can't modify it anymore.
                </p>
                <p className="banned-page__information">
                    To appeal your account's suspension, you would need to send an email requst to <span className="marked">j.abram1@wp.pl</span>. If the Email Address you use doesn't match the account's address, the appeal will be ignored.
                </p>
            </section>
            <section className="banned-page__button">
                <Button
                    role="button"
                    type="primary"
                    onClick={handleLogout}
                    loading={loading}
                    disabled={loading}
                >
                    Log me out
                </Button>
            </section>
        </article>
    </main>
}

export default BannedPage
