import type { ChangeEvent, FormEvent } from "react"
import type { InputTextStateType } from "../../types/types"

import { useState} from "react"
import { useNavigate } from "react-router-dom"

import Form from "../../components/Form/Form"
import Input from "../../components/Input/Input"

import { useDatabase } from "../../contexts/Database"
import { useSearchParams } from "react-router-dom"

import "./Register.css"

const Register = () => {

    const navigate = useNavigate();

    const { registerUser } = useDatabase()

    const [searchParams] = useSearchParams();

    const redirectParam = searchParams.get("redirect")

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean | string>(false)

    const [username, setUsername] = useState<InputTextStateType>({
        value: "",
        isError: false,
        errorMessage: "",
    })

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername({...username, value})
    }

    const [email, setEmail] = useState<InputTextStateType>({
        value: "",
        isError: false,
        errorMessage: "",
    })

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail({...email, value})
    }

    const [password, setPassword] = useState<InputTextStateType>({
        value: "",
        isError: false,
        errorMessage: "",
    })

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword({...password, value})
    }

    const [confirmPassword, setConfirmPassword] = useState<InputTextStateType>({
        value: "",
        isError: false,
        errorMessage: "",
    })

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword({...confirmPassword, value})
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false)
        setUsername({...username, isError: false});
        setEmail({...email, isError: false});
        setPassword({...password, isError: false});

        let shouldReturn = false;

        if(username.value.length < 6){
            shouldReturn = true;
            setUsername({...username, 
                isError: true,
                errorMessage: "Min. 6 characters"
            })
        }

        if(!email.value.length){
            shouldReturn = true;
            setEmail({...email, 
                isError: true,
                errorMessage: "Can't be empty"
            })

        }else if(!email.value.includes("@")){
            shouldReturn = true;
            setEmail({...email,
                isError: true,
                errorMessage: "Invalid email"
            })  
        }

        if(password.value.length < 8){
            shouldReturn = true;
            setPassword({...password, 
                isError: true,
                errorMessage: "Min. 8 characters"
            })
        }

        
        if(password.value != confirmPassword.value){
            shouldReturn = true;
            setConfirmPassword({...confirmPassword,
                isError: true,
                errorMessage: "Doesn't match"
            })
            setError("Passwords don't match")
        }
        
        if(shouldReturn) return
        
        
        try{
            setLoading(true)
            const user = await registerUser(email.value, password.value)
            console.log(user)
            if(!redirectParam)
                navigate("/")
            else navigate(`/${redirectParam}`)
        }catch(error){
            console.error(error)
            setError("Failed to register.")
        }

        setLoading(false)

    }


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
                <button
                    type="submit"
                    className="btn btn--primary btn--in-register"
                    disabled={loading}
                >
                    Register
                </button>
            </Form>
        </section>
    </main>
}

export default Register
