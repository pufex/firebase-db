import type { ChangeEvent, FormEvent } from "react"
import type { InputTextStateType } from "../../types/types"

import { useState} from "react"
import { useNavigate } from "react-router-dom"

import Form from "../../components/Form/Form"
import Input from "../../components/Input/Input"

import { useDatabase } from "../../contexts/Database"
import { useSearchParams } from "react-router-dom"

import "./Login.css"

const Login = () => {

    const navigate = useNavigate();

    const { loginUser } = useDatabase()

    const [searchParams] = useSearchParams();

    const redirectParam = searchParams.get("redirect")

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean | string>(false)

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


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false)
        setEmail({...email, isError: false});
        setPassword({...password, isError: false});

        let shouldReturn = false;

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
        
        if(shouldReturn) return
        
        
        try{
            setLoading(true)
            await loginUser(email.value, password.value)
            if(!redirectParam)
                navigate("/")
            else navigate(`/${redirectParam}`)
        }catch(error){
            console.error(error)
            setError("Failed to log in.")
        }

        setLoading(false)

    }


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
                <button
                    type="submit"
                    className="btn btn--primary btn--in-login"
                    disabled={loading}
                >
                    Log In
                </button>
            </Form>
        </section>
    </main>
}

export default Login
