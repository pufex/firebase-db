import { Link } from "react-router-dom"
import ThemeButton from "../ThemeButton/ThemeButton"

import "./Nav.css"

const Nav = () => {

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
