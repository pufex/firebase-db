import type { Product } from "../../contexts/Database";

import { useDatabase } from "../../contexts/Database"
import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom"
import RowProduct from "../../components/RowProduct/RowProduct";
import Loading from "../../components/Loading/Loading";

import "./AllProducts.css"

const AllProducts = () => {

    const {getAllProducts} = useDatabase();

    const [products, setProducts] = useState<Product[] | "loading" | "error">("loading");

    const [error, setError] = useState<string | boolean>(false)

    const fetchAllProducts = async () => {
        getAllProducts()
            .then((snapshot) => {
                const products: Product[] = [];
                // @ts-expect-error: Won't let me import the promise's generics for this function.
                snapshot?.docs?.forEach?.((doc) => {
                    products.push({...doc.data?.(), id: doc.id})
                })
                setProducts(products);
            })
            .catch((error) => {
                console.error(error)
                setProducts("error")
            })
    }

    useEffect(() => {
        fetchAllProducts()
    }, [])

    const handleDeleteError = () => {
        setError("Failed to remove the item.")
    }

    const handleSuccesfulDelete = async () => {
        fetchAllProducts();
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
                onDelete={handleSuccesfulDelete}
            />
        })
    }, [products])

    return <main className="all-products__main">
        <header className="all-products__header">
            <h1 className="all-products__heading">
                All products
            </h1>
            <h1 className="all-products__error-message">
                {error && error}
            </h1>
        </header>
        <section className="all-products__options">
            <Link 
                className="btn btn--primary all-products__option"
                to="/add-product?redirect=all-products"
            >
                Add new product
            </Link>
        </section>
        <ul className="all-products__list">
            {
                productsList.length
                    ? productsList
                    : products == "loading"
                        ? <Loading />
                        : products == "error"
                            ? <h1 className="all-products__fatal-error">
                                Something went terribly wrong...
                            </h1>
                            : <h1 className="all-product__no-products">
                                List is empty
                            </h1>
            }
        </ul>
    </main>
}

export default AllProducts
