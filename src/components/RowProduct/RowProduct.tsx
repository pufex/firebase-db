import type { ChangeEvent, FormEvent } from "react"
import type { InputTextStateType } from "../../types/types"
import type { Product } from "../../contexts/Database"

import { useState } from "react"
import { useDatabase } from "../../contexts/Database"
import { useIconsContext } from "../../contexts/Icon"

import Form from "../Form/Form"
import Input from "../Input/Input"

import "./RowProduct.css"

type RowProductProps = Pick<
    Product,
    "id" | 
    "name" |
    "price"
> & { 
    index: number,
    onDeleteError: () => void,
    onDelete: () => void,
    onEdit: () => void,
    onEditError: () => void,
}

const RowProduct = ({
    id,
    name,
    price,
    index,
    onEdit,
    onEditError,
    onDeleteError,
    onDelete,
}: RowProductProps) => {

    
    const { 
        IoClose,
        FaEdit,
    } = useIconsContext()
    const { 
        removeProduct,
        editProduct
    } = useDatabase();

    const [error, setError] = useState<boolean | string>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [editToggle, setEditToggle] = useState<boolean>(false)

    const switchEditToggle = () => {
        setEditToggle(previous => !previous)
    }

    const [newName, setNewName] = useState<InputTextStateType>({
        value: "",
        isError: false,
        errorMessage: "",
    })

    const handleNewNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewName({...newName, value})
    }

    const handleEditFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false)
        setNewName({...newName, isError: false})

        if(!newName.value.length){
            setNewName({...newName, 
                isError: true,
                errorMessage: "Can't be empty"
            })
            return;
        }

        
        try{
            setLoading(true)
            await editProduct(id, newName.value);
            onEdit();
            switchEditToggle()
        }catch(error){
            console.error(error)
            setError("Failed to edit the product");
            onEditError();
        }

        setLoading(false)
    }



    const removingProductHandler = async () => {
        try{
            setLoading(true);
            await removeProduct(id);
            onDelete();
        }catch(error){
            onDeleteError();
        }
        setLoading(false);
    }

    return <>
        <li className="row-product__item">
            <div className="row-product--left">
                <span className="row-product__index">
                    {index}
                </span>
            </div>
            <div className="row-product--left-middle">
                <h1 className="row-product__name">
                    {name}
                </h1>
            </div>
            <div className="row-product--right-middle">
                <span className="row-product__price">
                    {`$${price.toFixed(2)}`}
                </span>
            </div>
            <div className="row-product--right">
                <button 
                    className="btn row-product__option"
                    onClick={switchEditToggle}
                    disabled={loading}
                >
                    <FaEdit
                        size={21}
                        className="row-product__option-icon row-product__edit-icon"
                    />
                </button>
                <button 
                    className="btn row-product__option"
                    onClick={removingProductHandler}
                    disabled={loading}
                >
                    <IoClose
                        size={30}
                        className="row-product__option-icon row-product__remove-icon"
                    />
                </button>
            </div>
        </li>
        {
            editToggle
                && <section className="row-product__edit-form-container">
                    <Form
                        onSubmit={handleEditFormSubmit}
                        isError={typeof error == "string"}
                        errorMessage={typeof error == "string" ? error : undefined}
                    >
                        <h1 className="row-product__edit-form__heading">
                            Edit {name}
                        </h1>
                        <div className="row-product__edit-form__input-container">
                            <Input
                                placeholder={"New name for item"}
                                value={newName.value}
                                onChange={handleNewNameChange}
                                isError={newName.isError}
                                errorMessage={newName.errorMessage}
                            >
                                New name
                            </Input>
                        </div>
                        <div className="row-product__edit-form__options">
                            <button 
                                className="btn btn--primary"
                                type="submit"
                            >
                                Submit
                            </button>
                            <button
                                className="btn btn--primary"
                                onClick={switchEditToggle}
                                type="button"
                            >
                                Cancel
                            </button>
                        </div>
                    </Form>

                </section>
        }
    </>
    
}

export default RowProduct
