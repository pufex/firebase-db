import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDatabase } from "../../contexts/Database"

import ThemeButton from "../ThemeButton/ThemeButton"

import "./Nav.css"
const Nav = () => {

    const navigate = useNavigate()
    
    const [loading, setLoading] = useState<boolean>(false);
    
    const { 
        currentUser,
        usersDocument,
        logoutUser
    } = useDatabase();

    const handleLogout = async () => {
        try{
            setLoading(true)
            await logoutUser();
        }catch(error){
            console.error(error)
        }
        setLoading(false)
    }

    return <nav className="nav">
        <section className="nav--left">
            <Link 
                className="nav__link"
                to={"/all-products"}
            >
                All products
            </Link>
            {
                currentUser?.isAdmin
                    && <Link 
                        className="nav__link"
                        to={"/add-product"}
                    >
                        Add product
                    </Link>
            }
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
                            {
                                currentUser?.isAdmin
                                    && <span className="nav__username-role">
                                        ADMIN
                                    </span>   
                            }
                            <span className="nav__username-content">
                                {usersDocument?.username}
                            </span>
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
                            to={`/register?redirect=true`}
                        >
                            Register
                        </Link>
                        <Link
                            className="btn nav__link"
                            to={`/login?redirect=true`}
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
