import type { FormEvent } from "react"

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDatabase } from "../../contexts/Database"
import { useInput } from "../../hooks/useInput";

import RowProduct from "../../components/RowProduct/RowProduct";
import Button from "../../components/Button/Button";
import Form from "../../components/Form/Form";
import Input from "../../components/Input/Input";

import { validateEmail } from "../../utils/validations";

import "./Dashboard.css"


const AllProducts = () => {

    const navigate = useNavigate();

    const {
        currentUser,
        products,
        giveAdmin
    } = useDatabase();

    const [error, setError] = useState<string | boolean>(false)

    const handleDeleteError = () => {
        setError("Failed to remove the item.")
    }

    const handleEditError = () => {
        setError("Failed to remove the item.")
    }

    const productsList = useMemo(() => {
        if(typeof products == "string")
            return []
        else return products?.map(({
            id,
            name,
            price
        }, index) => {
            return <RowProduct
                key={id}
                id={id}
                name={name}
                price={price}
                index={index+1}
                onDeleteError={handleDeleteError}
                onEditError={handleEditError}
            />
        })
    }, [products])


    const [APL, setAPL] = useState<boolean>(false)
    const [APE, setAPE] = useState<boolean | string>(false);
    const [showAdminForm, setShowAdminForm] = useState<boolean>(false);
    const switchAdminForm = () => {
        setShowAdminForm(previous => !previous)
    }

    const [adminEmail, handleAdminEmailChange, setAdminEmailError] = useInput({});

    const handleAdminSubmit = async (e: FormEvent<HTMLFormElement >) => {
        e.preventDefault();
        setAPE(false);
        setAdminEmailError();

        if(validateEmail(adminEmail.value))
            return setAdminEmailError(true, "Can't be blank")

        try{
            setAPL(true)
            await giveAdmin(adminEmail.value)
        }catch(error){
            console.error(error)
            setAPE("Failed to give admin privilage.")
        }
        setAPL(false)
    }

    return <main className="all-products__main">
        <header className="all-products__header">
            <h1 className="all-products__heading">
                All products
            </h1>
            <h1 className="all-products__error-message">
                {error && error}
            </h1>
        </header>
        {
            currentUser?.isAdmin
                && <section className="all-products__options">
                    <Button 
                        type="primary"
                        role="submit"
                        onClick={() => navigate("/add-product?redirect=true")}
                    >
                        Add new product
                    </Button>
                    {
                        !showAdminForm
                            && <Button
                                type="primary"
                                role="button"
                                onClick={switchAdminForm}
                            >
                                    Give admin
                            </Button>
                    }
                </section>
        }
        {
            showAdminForm
                && <div className="dashboard__add-admin-form">
                    <Form
                        title="Give admin"
                        onSubmit={handleAdminSubmit}
                        isError={typeof APE == "string"}
                        errorMessage={typeof APE == "string" ? APE : undefined}
                    >
                        <div className="project--form__input-container">
                            <Input
                                value={adminEmail.value}
                                isError={adminEmail.isError}
                                errorMessage={adminEmail.errorMessage}
                                onChange={handleAdminEmailChange}
                                placeholder="New Admin's Email Address"
                                isPassword={true}
                            >
                                Email Address
                            </Input>
                        </div>
                        <div className="dashboard__add-admin-form__buttons">
                            <Button
                                type="primary"
                                role="submit"
                                loading={APL}
                                disabled={APL}
                            >
                                Submit
                            </Button>
                            <Button
                                type="primary"
                                role="button"
                                onClick={switchAdminForm}
                            >
                                Cancel
                            </Button>
                        </div> 
                    </Form>

                </div>
                
        }
        <ul className="all-products__list">
            {
                productsList.length
                    && productsList
            }
        </ul>
    </main>
}

export default AllProducts
