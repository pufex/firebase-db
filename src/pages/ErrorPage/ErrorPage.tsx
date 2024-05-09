import { useIconsContext } from "../../contexts/Icon"
import { useNavigate } from "react-router-dom";
import { useRef, useState,useEffect } from "react";

import { Link } from "react-router-dom";

import "./ErrorPage.css"

const ErrorPage = () => {

    const navigate = useNavigate();

    const { IoIosSad } = useIconsContext();

    const [seconds, setSeconds] = useState<number>(5)
    // @ts-expect-error: ???
    const intervalRef = useRef<Interval | undefined>();

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            console.log("cock");
            setSeconds((previous) => {
                if(previous - 1 <= 0)
                    navigate("/")
                return previous - 1
            })
        }, 1000)
        return () => { 
            clearInterval(intervalRef.current)
        }
    }, [])

    return <main className="error-page__main">
        <header className="error-page__content">
            <section className="error-page__message-wrapper">
                <h1 className="error-page__message">
                    Oops!
                </h1>
                <IoIosSad
                    className="error-page__sad-face"
                    size={70}
                />
            </section>
            <p className="error-page__information">
                Are you lost? <Link to="/" className="link">Go home</Link> or get moved there in {seconds}...
            </p>
        </header>
    </main>
}

export default ErrorPage
