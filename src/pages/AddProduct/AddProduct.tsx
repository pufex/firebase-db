import type { FormEvent } from "react"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useInput } from "../../hooks/useInput"
import { useDatabase } from "../../contexts/Database"

import ErrorPage from "../ErrorPage/ErrorPage"

import Form from "../../components/Form/Form"
import Input from "../../components/Input/Input"
import Checkbox from "../../components/Checkbox/Checkbox"
import Alert from "../../components/Alert/Alert"
import Button from "../../components/Button/Button"

import "./AddProduct.css"

const AddProduct = () => {

    const navigate = useNavigate();

    const {
        currentUser,
        addNewProduct
    } = useDatabase()

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

    const [name, handleNameChange, setNameError, resetName] = useInput({})
    const [price, handlePriceChange, setPriceError, resetPrice] = useInput({})

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false)
        setNameError();
        setPriceError();

        let shouldReturn = false;

        if(!name.value.length){
            shouldReturn = true;
            setNameError(true, "Can't be empty")
        }

        if(!price.value.length){
            shouldReturn = true;
            setPriceError(true, "Can't be empty")
        }
        else if(isNaN(parseFloat(price.value))){
            shouldReturn = true;
            setPriceError(true, "Not a number")
        }

        if(shouldReturn) return

        try{
            setLoading(true);
            await addNewProduct(
                name.value,
                parseFloat(price.value)
            )

            if(redirect)
                !redirectParam || redirectParam !== "true"
                    ? navigate("/")
                    : navigate(-1)
            else {
                setSuccess(true);
                resetName()
                resetPrice()
                setNameError()
                setPriceError()
            }

        }catch(err){
            console.error(err);
            setError("Failed to add a product.")
        }
        
        setLoading(false)

    }

    if(!currentUser?.isAdmin) return <ErrorPage />

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
                <Button
                    type="primary"
                    role="submit"
                    disabled={loading}
                    loading={loading}
                >
                    Add product
                </Button>
            </Form>
        </section>
    </main>
}

export default AddProduct
