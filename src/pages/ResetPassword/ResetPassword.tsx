import type { FormEvent } from "react";

import { useState } from "react"
import { useInput } from "../../hooks/useInput/hooks/useInput/useInput";
import { useDatabase } from "../../contexts/Database";

import ErrorPage from "../ErrorPage/ErrorPage";

import { Link } from "react-router-dom";
import Form from "../../components/Form/Form";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

import { validateEmail } from "../../utils/validations";

import "./ResetPassword.css"

const ResetPassword = () => {

    const {currentUser, resetPassword} = useDatabase();

    const [formStep, setFormStep] = useState<number>(1);

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean | string>(false)
    const [email, handleEmailChange, setEmailError] = useInput({});

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false)
        setEmailError()

        if(validateEmail(email.value))
            return setEmailError(true, "Invalid Email")

        try{
            setLoading(true);
            await resetPassword(email.value);
            setFormStep(2);
        }catch(error){
            console.error(error)
            setError("Failed to send you an email.")
        }
        
        setLoading(false);
    }

    if(currentUser) return <ErrorPage />

    if(formStep == 1)
    return <main className="reset-password__main">
        <section className="reset-password__card">
            <Form
                title="Reset Password"
                onSubmit={handleSubmit}
                isError={typeof error == "string"}
                errorMessage={typeof error == "string" ? error : undefined}
            >
                <div className="project--form__input-container">
                    <Input
                        placeholder="Email Address"
                        value={email.value}
                        isError={email.isError}
                        errorMessage={email.errorMessage}
                        onChange={handleEmailChange}
                    >
                        Email
                    </Input>
                </div>
                <div className="project--form__submit-container-2">
                    <Button
                        role="submit"
                        type="primary"
                        loading={loading}
                        disabled={loading}
                    >
                        Send Auth Email
                    </Button>
                </div>
                <div className="reset-password__links">
                    <Link
                        className="link link--small"
                        to={"/login"}
                    >
                        Go back to Log In
                    </Link>
                </div>
            </Form>
        </section>
    </main>
    
    if(formStep == 2)
    return <main className="reset-password__main">
        <section className="reset-password__card">
            <header className="reset-password__header">
                <h1 className="reset-password__heading">
                    Auth Email Sent!
                </h1>
            </header>
            <span className="reset-password__the-email">
                {email.value}
            </span>
            <p className="reset-password__information">
                A confirmation email has been sent to that email adrress. Make sure to check the spam folder if you can't see it.
            </p>
            <div className="reset-password__links">
                <a
                    className="link link--small"
                    style={{
                        cursor: "pointer"
                    }}
                    onClick={() => setFormStep(1)}
                >
                    Change email or resend it
                </a>
                <Link
                    className="link link--small"
                    to={"/login"}
                >
                    Go back to Log In
                </Link>
            </div>
        </section>
    </main>
}

export default ResetPassword
