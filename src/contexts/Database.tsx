import type {ReactElement} from "react"

import { createContext, useContext } from "react"

import { productsCollection } from "../firebase/firebase"
import { 
    addDoc, 
    deleteDoc,
    getDocs, 
    query,
    doc,
    serverTimestamp,
    orderBy
} from "firebase/firestore"

export type Product = {
    id: string,
    name: string,
    price: number,
}

export type AddProductFunction = (
    name: string,
    price: number
) => Promise<unknown>

export type RemoveProductFunction = (
    id: string
) => Promise<unknown>

export type GetAllProductsFunction = () => Promise<unknown>

export type DatabaseContextType = {
    addNewProduct: AddProductFunction
    removeProduct: RemoveProductFunction,
    getAllProducts: GetAllProductsFunction,
}

const DatabaseContext = createContext<DatabaseContextType | null>(null)

export const useDatabase = () => {
    const database = useContext(DatabaseContext)
    if(!database) 
        throw Error("Cannot use outside a provider.")
    else return database;
}

type DatabaseProps = {
    children: ReactElement[] | ReactElement
}

const DatabaseProvider = ({
    children,
}:DatabaseProps) => {
    
    const addNewProduct: AddProductFunction = (
        name,
        price,
    ) => {
        return addDoc(productsCollection, {
            name,
            price,
            createdAt: serverTimestamp()
        })
    }

    const removeProduct: RemoveProductFunction = (id) => {
        const product = doc(productsCollection, id)
        return deleteDoc(product)
    }

    const getAllProducts: GetAllProductsFunction = () => {
        const productsQuery = query(
            productsCollection,
            orderBy("createdAt", "desc")
        )

        return getDocs(productsQuery);
    } 


    const value: DatabaseContextType = {
        addNewProduct,
        getAllProducts,
        removeProduct,
    }



    return <DatabaseContext.Provider
        value={value}
    >
        {children}
    </DatabaseContext.Provider>
}

export default DatabaseProvider
