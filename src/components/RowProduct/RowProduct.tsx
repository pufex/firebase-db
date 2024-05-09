import type { MouseEvent, FormEvent } from "react"
import type { Product } from "../../contexts/Database"

import { useRef, useState } from "react"
import { useDatabase } from "../../contexts/Database"
import { useIconsContext } from "../../contexts/Icon"
import { useInput } from "../../hooks/useInput"

import Form from "../Form/Form"
import Input from "../Input/Input"
import Button from "../Button/Button"
import LoadingIcon from "../../components/LoadingIcon/LoadingIcon";

import { mergeClasses } from "../../utils/mergeClasses"

import "./RowProduct.css"

type RowProductProps = Pick<
    Product,
    "id" | 
    "name" |
    "price"
> & { 
    index: number,
    onDeleteError: () => void,
    onEditError: () => void,
}

const RowProduct = ({
    id,
    name,
    price,
    index,
    onEditError,
    onDeleteError,
}: RowProductProps) => {

    const { 
        IoClose,
        FaEdit,
    } = useIconsContext()
    const { 
        currentUser,
        removeProduct,
        editProduct
    } = useDatabase();

    const [error, setError] = useState<boolean | string>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [editToggle, setEditToggle] = useState<boolean>(false);

    const [busyDeleting, setBusyDeleting] = useState<boolean>(false);
    
    const switchEditToggle = () => {
        setEditToggle(previous => !previous)
    }

    const [newName, handleNameChange, setNameError] = useInput({defaultValue: name})
    const [newPrice, handlePriceChange, setPriceError] = useInput({defaultValue: price.toString()})


    const handleEditFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false)
        setNameError()
        setPriceError()

        let shouldReturn = false;

        if(!newName.value.length){
            shouldReturn = true;
            setNameError(true, "Can't be empty")
        }

        if(!newPrice.value.length){
            shouldReturn = true;
            setPriceError(true, "Can't be empty")
        }
        else if(isNaN(parseFloat(newPrice.value))){
            shouldReturn = true;
            setPriceError(true, "Invalid price")
        }

        if(shouldReturn) return;

        try{
            setLoading(true)
            await editProduct(id, newName.value, parseFloat(newPrice.value));
            switchEditToggle()
        }catch(error){
            console.error(error)
            setError("Failed to edit the product");
            onEditError();
        }
        
        setLoading(false)
    }
    
    
    const currentButton = useRef<HTMLButtonElement>();
    const removingProductHandler = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {

        currentButton.current = e.currentTarget
        const button: HTMLButtonElement = currentButton.current

        
        try{
            setBusyDeleting(true);
            setLoading(true);
            button.classList.add("loading")
            await removeProduct(id);
        }catch(error){
            onDeleteError();
        }
        setLoading(false);
        setBusyDeleting(false);
    }

    return <>
        <li 
            className={mergeClasses(
                "row-product__item",
                currentUser?.isAdmin ? "admin" : ""
            )}
        >
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
            {
                currentUser?.isAdmin
                    && <div className="row-product--right">
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
                            onClick={(e) => removingProductHandler(e)}
                            disabled={busyDeleting}
                        >
                            <IoClose
                                size={30}
                                className="row-product__option-icon row-product__remove-icon"
                            />
                            <LoadingIcon />
                        </button>
                    </div>
            }
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
                                onChange={handleNameChange}
                                isError={newName.isError}
                                errorMessage={newName.errorMessage}
                            >
                                New name
                            </Input>
                        </div>
                        <div className="row-product__edit-form__input-container">
                            <Input
                                placeholder={"New name for item"}
                                value={newPrice.value}
                                onChange={handlePriceChange}
                                isError={newPrice.isError}
                                errorMessage={newPrice.errorMessage}
                            >
                                New price
                            </Input>
                        </div>
                        <div className="row-product__edit-form__options">
                            <Button 
                                type="primary"
                                role="submit"
                                loading={loading}
                                disabled={loading}
                            >
                                Submit
                            </Button>
                            <Button
                                type="primary"
                                role="button"
                                onClick={switchEditToggle}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>

                </section>
        }
    </>
    
}

export default RowProduct
