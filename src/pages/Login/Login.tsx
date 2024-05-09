import type { FormEvent } from "react"

import { useState} from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useInput } from "../../hooks/useInput"
import { useDatabase } from "../../contexts/Database"

import { Link } from "react-router-dom"
import ErrorPage from "../ErrorPage/ErrorPage"
import Form from "../../components/Form/Form"
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"

import { validateEmail } from "../../utils/validations"

import "./Login.css"

const Login = () => {

    const navigate = useNavigate();

    const { 
        currentUser,
        loginUser 
    } = useDatabase()

    const [searchParams] = useSearchParams();

    const redirectParam = searchParams.get("redirect")

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean | string>(false)
    const [success, setSuccess] = useState<boolean>(false)

    const [email, handleEmailChange, setEmailError] = useInput({});
    const [password, handlePasswordChange, setPasswordError] = useInput({})

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccess(false)
        setError(false)
        setEmailError();
        setPasswordError();
        
        let shouldReturn = false;

        if(validateEmail(email.value)){
            shouldReturn = true;
            setEmailError(true, "Invalid email")
        }

        if(password.value.length < 8){
            shouldReturn = true;
            setPasswordError(true, "Min. 8 characters")
        }
        
        if(shouldReturn) return
        
        try{
            setLoading(true)
            setSuccess(true)
            await loginUser(email.value, password.value)
            if(!redirectParam || redirectParam !== "true")
                navigate("/")
            else navigate(-1)
        }catch(error){
            setSuccess(false)
            console.error(error)
            setError("Failed to log in.")
        }

        setLoading(false)

    }

    if(currentUser && !success)
        return <ErrorPage />

    return <main className="login__main">
        <section className="login__form">
            <Form
                title="Login"
                onSubmit={handleSubmit}
                isError={typeof error == "string"}
                errorMessage={typeof error == "string" ? error : undefined}
            >
                <div className="project--form__input-container">
                    <Input
                        placeholder="Your Email Address"
                        value={email.value}
                        onChange={handleEmailChange}
                        isError={email.isError}
                        errorMessage={email.errorMessage}
                    >
                        Email
                    </Input>
                </div>
                <div className="project--form__input-container">
                    <Input
                        placeholder="Your Password"
                        value={password.value}
                        onChange={handlePasswordChange}
                        isError={password.isError}
                        errorMessage={password.errorMessage}
                        isPassword={true}
                    >
                        Password
                    </Input>
                </div>
                <div className="project--form__submit-container">
                    <Button
                        type="primary"
                        role="submit"
                        loading={loading}
                        disabled={loading}
                    >
                        Log In
                    </Button>
                </div>
                <div className="login-form__links">
                    <Link
                        to={"/reset-password"}
                        className="link link--small"
                    >
                        Forgot password?
                    </Link>
                    <Link
                        to={"/register"}
                        className="link link--small"
                    >
                        Don't have an account? Register now!
                    </Link>
                </div>
            </Form>
        </section>
    </main>
}

export default Login
