import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useDatabase } from "../../contexts/Database"

import ThemeButton from "../ThemeButton/ThemeButton"

import "./Nav.css"
const Nav = () => {

    const [loading, setLoading] = useState<boolean>(false);

    const { pathname } = useLocation();

    const { 
        currentUser,
        logoutUser
    } = useDatabase();

    const handleLogout = async () => {
        try{
            setLoading(true)
            await logoutUser();
            window.location.reload();
        }catch(error){
            console.error(error)
        }
        setLoading(true)
    }

    return <nav className="nav">
        <section className="nav--left">
            <Link 
                className="nav__link"
                to={"/all-products"}
            >
                All products
            </Link>
            <Link 
                className="nav__link"
                to={"/add-product"}
            >
                Add product
            </Link>
        </section>
        <section className="nav--right">
            {
                currentUser 
                    ? <button
                        className="btn nav__link"
                        onClick={handleLogout}
                        disabled={loading}
                    >
                        Log out
                    </button>
                    : <>
                        <Link
                            className="btn nav__link"
                            to={`/register?redirect=${pathname.slice(1)}`}
                        >
                            Register
                        </Link>
                        <Link
                            className="btn nav__link"
                            to={`/login?redirect=${pathname.slice(1)}`}
                        >
                            Login
                        </Link>
                    </>
            }
            <ThemeButton />
            <Link
                className="nav__link nav__link--home"
                to="/"
            >
                Home
            </Link>
        </section>
    </nav>
}

export default Nav
