import type { ChangeEvent, FormEvent } from "react"
import type { InputTextStateType } from "../../types/types"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import Form from "../../components/Form/Form"
import Input from "../../components/Input/Input"
import Checkbox from "../../components/Checkbox/Checkbox"
import Alert from "../../components/Alert/Alert"

import "./AddProduct.css"
import { useDatabase } from "../../contexts/Database"
import { useSearchParams } from "react-router-dom"

const AddProduct = () => {

    const navigate = useNavigate();

    const {addNewProduct} = useDatabase()

    const [searchParams] = useSearchParams();

    const redirectParam = searchParams.get("redirect")

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean | string>(false)
    const [success, setSuccess] = useState<boolean>(false) 


    // @ts-expect-error: Typescript moment
    const successRef = useRef<Timeout | null>(null)

    useEffect(() => {
        success
            ? successRef.current = setTimeout(() => {
                setSuccess(false)
            }, 5000)
            : null
        return () => {
            successRef.current
                ? clearTimeout(successRef.current)
                : null
        }
    }, [success])

    useEffect(() => {
        if(loading)
            if(successRef.current){
                clearTimeout(successRef.current)
                setSuccess(false);
            }
    }, [loading])

    const [redirect, setRedirect] = useState<boolean>(false);

    const handleRedirectSwitch = () => {
        setRedirect(previous => !previous)
    }

    const [name, setName] = useState<InputTextStateType>({
        value: "",
        isError: false,
        errorMessage: "",
    })

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName({...name, value})
    }

    const [price, setPrice] = useState<InputTextStateType>({
        value: "",
        isError: false,
        errorMessage: "",
    })

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPrice({...price, value})
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false)
        setName({...name, isError: false});
        setPrice({...price, isError: false});

        let shouldReturn = false;

        if(!name.value.length){
            shouldReturn = true;
            setName({...name, 
                isError: true,
                errorMessage: "Can't be empty"
            })
        }

        if(!price.value.length){
            shouldReturn = true;
            setPrice({...price, 
                isError: true,
                errorMessage: "Can't be empty"
            })
        }
        else if(isNaN(parseFloat(price.value))){
            shouldReturn = true;
            setPrice({...price,
                isError: true,
                errorMessage: "Not a number",
            })
        }

        if(shouldReturn) return

        try{
            setLoading(true);
            await addNewProduct(
                name.value,
                parseFloat(price.value)
            )

            if(redirect)
                !redirectParam
                    ? navigate("/")
                    : navigate(`/${redirectParam}`)
            else {
                setSuccess(true);
                setName({...name, value: ""})
                setPrice({...price, value: ""})
            }

        }catch(err){
            console.error(err);
            setError("Failed to add a product.")
        }
        
        setLoading(false)

    }


    return <main className="add-product__main">
        <section className="add-product__form">
            <Form
                title="Create a product"
                onSubmit={handleSubmit}
                isError={typeof error == "string"}
                errorMessage={typeof error == "string" ? error : undefined}
            >
                <div className="project--form__input-container">
                    <Input
                        placeholder="Product's name"
                        value={name.value}
                        onChange={handleNameChange}
                        isError={name.isError}
                        errorMessage={name.errorMessage}
                    >
                        Name
                    </Input>
                </div>
                <div className="project--form__input-container">
                    <Input
                        placeholder="Product's price"
                        value={price.value}
                        onChange={handlePriceChange}
                        isError={price.isError}
                        errorMessage={price.errorMessage}
                    >
                        Price
                    </Input>
                </div>
                <div className="project--form__checkbox-container">
                    <Checkbox
                        checked={redirect}
                        onCheck={handleRedirectSwitch}
                    >
                        Redirect after creating.
                    </Checkbox>
                </div>
                {
                    success
                        ? <div className="add-product__success-container">
                            <Alert
                                type="success"
                            >
                                Successfully created a product!
                            </Alert>
                        </div>
                        : <></>
                }
                <button
                    type="submit"
                    className="btn btn--primary btn--in-add-product"
                    disabled={loading}
                >
                    Add product
                </button>
            </Form>
        </section>
    </main>
}

export default AddProduct
