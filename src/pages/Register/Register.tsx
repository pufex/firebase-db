import type { FormEvent } from "react"

import { useState} from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { useDatabase } from "../../contexts/Database"
import { useInput } from "../../hooks/useInput"

import Form from "../../components/Form/Form"
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"

import "./Register.css"

const Register = () => {

    const navigate = useNavigate();

    const { 
        currentUser,
        registerUser 
    } = useDatabase()

    const [searchParams] = useSearchParams();

    const redirectParam = searchParams.get("redirect")

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean | string>(false)

    const [username, handleUsernameChange, setUsernameError] = useInput({})
    const [email, handleEmailChange, setEmailError] = useInput({})
    const [password, handlePasswordChange, setPasswordError] = useInput({})
    const [confirmPassword, handleConfirmPasswordChange, setConfirmPasswordError] = useInput({})


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false)
        setUsernameError()
        setEmailError()
        setPasswordError()
        setConfirmPasswordError()

        let shouldReturn = false;

        if(username.value.length < 6){
            shouldReturn = true;
            setUsernameError(true, "Min. 6 characters")

        }

        if(!email.value.length){
            shouldReturn = true;
            setEmailError(true, "Can't be empty")
        }else if(!email.value.includes("@")){
            shouldReturn = true;
            setEmailError(true, "Invalid email")  
        }

        if(password.value.length < 8){
            shouldReturn = true;
            setPasswordError(true, "Min. 8 characters")
        }

        if(confirmPassword.value.length <= 0){
            setConfirmPasswordError(true, "Can't be empty")
            shouldReturn = true;
        }
        else if(password.value != confirmPassword.value){
            shouldReturn = true;
            setConfirmPasswordError(true, "Doesn't match")
            setError("Passwords don't match")
        }
        
        if(shouldReturn) return
        
        setLoading(true)
        registerUser(username.value, email.value, password.value)
            .then(() => {
                if(redirectParam === "true")
                    navigate(-1)
                else navigate("/")
            })
            .catch((error) => {
                console.error(error)
                setError("Failer to register.");
            }) 
        setLoading(false)

    }


    if(currentUser)
        navigate("/")

    return <main className="register__main">
        <section className="register__form">
            <Form
                title="Register"
                onSubmit={handleSubmit}
                isError={typeof error == "string"}
                errorMessage={typeof error == "string" ? error : undefined}
            >
                <div className="project--form__input-container">
                    <Input
                        placeholder="Your Username"
                        value={username.value}
                        onChange={handleUsernameChange}
                        isError={username.isError}
                        errorMessage={username.errorMessage}
                    >
                        Username
                    </Input>
                </div>
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
                <div className="project--form__input-container">
                    <Input
                        placeholder="Confirm Password"
                        value={confirmPassword.value}
                        onChange={handleConfirmPasswordChange}
                        isError={confirmPassword.isError}
                        errorMessage={confirmPassword.errorMessage}
                        isPassword={true}
                    >
                        Confirm Password
                    </Input>
                </div>
                <div className="project--form__submit-container">
                    <Button
                        type="primary"
                        role="submit"
                        loading={loading}
                        disabled={loading}
                    >
                        Register
                    </Button>
                </div>
                <div className="register__links">
                    <Link
                        to={"/login"}
                        className="link link--small"
                    >
                        Already registered? Log in!
                    </Link>
                </div>
            </Form>
        </section>
    </main>
}

export default Register
