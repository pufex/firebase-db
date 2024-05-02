import type {ReactElement} from "react"
import type { UserCredential, User } from "firebase/auth"

import { createContext, useContext, useState, useEffect } from "react"

import LoadingPage from "../pages/LoadingPage/LoadingPage"

import { productsCollection, auth } from "../firebase/firebase"
import { 
    addDoc, 
    deleteDoc,
    updateDoc,
    getDocs, 
    query,
    doc,
    serverTimestamp,
    orderBy
} from "firebase/firestore"
import {
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword
} from "firebase/auth"

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

export type UpdateProductFunction = (
    id: string,
    newName: string,
) => Promise<unknown>

export type GetAllProductsFunction = () => Promise<unknown>

export type RegisterUserFunction = (
    email: string,
    password: string,
) => Promise<UserCredential>

export type LogoutUserFunction = () => Promise<void>

export type LoginUserFunction = (
    email: string,
    password: string,
) => Promise<UserCredential>

export type DatabaseContextType = {
    currentUser?: User,
    addNewProduct: AddProductFunction
    removeProduct: RemoveProductFunction,
    editProduct: UpdateProductFunction,
    getAllProducts: GetAllProductsFunction,
    registerUser: RegisterUserFunction,
    logoutUser: LogoutUserFunction,
    loginUser: LoginUserFunction,
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
    
    const [currentUser, setCurrentUser] = useState<User | undefined>()
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if(user){
                setCurrentUser(user);
            }
            setLoading(false);
            console.log(user)
        })
        return unsubscribe
    }, [])


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
    
    const editProduct: UpdateProductFunction = (id, newName) => {
        const product = doc(productsCollection, id)
        return updateDoc(product, { name: newName })
    }

    const getAllProducts: GetAllProductsFunction = () => {
        const productsQuery = query(
            productsCollection,
            orderBy("createdAt", "desc")
        )

        return getDocs(productsQuery);
    } 

    const registerUser: RegisterUserFunction = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    } 

    const logoutUser: LogoutUserFunction = () => {
        return signOut(auth)
    }


    const loginUser: LoginUserFunction = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const value: DatabaseContextType = {
        addNewProduct,
        removeProduct,
        editProduct,
        getAllProducts,
        currentUser,
        registerUser,
        logoutUser,
        loginUser,
    }

    return <DatabaseContext.Provider
        value={value}
    >
        {
            loading 
             ? <LoadingPage />
             : children
        }
    </DatabaseContext.Provider>
}

export default DatabaseProvider
