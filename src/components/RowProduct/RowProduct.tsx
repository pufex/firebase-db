import type { Product } from "../../contexts/Database"

import { useState } from "react"
import { useDatabase } from "../../contexts/Database"
import { useIconsContext } from "../../contexts/Icon"

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
}

const RowProduct = ({
    id,
    name,
    price,
    index,
    onDeleteError,
    onDelete,
}: RowProductProps) => {

    const [loading, setLoading] = useState<boolean>(false)

    // const [editToggle, setEditToggle] = useState<boolean>(false)

    const { 
        IoClose,
        FaEdit,
    } = useIconsContext()

    const { removeProduct } = useDatabase();

    const removingProductHandler = async (id: Product["id"]) => {
        try{
            setLoading(true);
            await removeProduct(id);
            onDelete();
        }catch(error){
            onDeleteError();
        }
        setLoading(false);
    }

    return <li className="row-product__item">
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
                // onClick={() => }
                disabled={loading}
            >
                <FaEdit
                    size={21}
                    className="row-product__option-icon row-product__edit-icon"
                />
            </button>
            <button 
                className="btn row-product__option"
                onClick={() => removingProductHandler(id)}
                disabled={loading}
            >
                <IoClose
                    size={30}
                    className="row-product__option-icon row-product__remove-icon"
                />
            </button>
        </div>
    </li>
}

export default RowProduct
