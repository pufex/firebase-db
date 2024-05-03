import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDatabase } from "../../contexts/Database"

import ThemeButton from "../ThemeButton/ThemeButton"

import "./Nav.css"
const Nav = () => {

    const navigate = useNavigate()
    
    const [loading, setLoading] = useState<boolean>(false);
    
    const { pathname } = useLocation();

    const { 
        currentUser,
        usersDocument,
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
            <Link 
                className="nav__link"
                to={"/all-users"}
            >
                All Users
            </Link>
        </section>
        <section className="nav--right">
            {
                currentUser 
                    ? <>
                        <span 
                            className="nav__username"
                            onClick={() => navigate(`/profile?user=${usersDocument?.id}`)}
                        >
                            {usersDocument?.username}
                        </span>
                        <button
                            className="btn nav__link"
                            onClick={handleLogout}
                            disabled={loading}
                        >
                            Log out
                        </button>
                    </>
                    
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
