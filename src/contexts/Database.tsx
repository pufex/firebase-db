import type {ReactElement} from "react"
import type { UserCredential, User } from "firebase/auth"

import { createContext, useContext, useState, useEffect } from "react"

import LoadingPage from "../pages/LoadingPage/LoadingPage"

import { 
    productsCollection, 
    usersCollection,
    auth, 
    db 
} from "../firebase/firebase"
import { 
    addDoc, 
    deleteDoc,
    updateDoc,
    getDocs, 
    getDoc,
    setDoc,
    query,
    doc,
    serverTimestamp,
    orderBy,
    arrayUnion
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

export type GetAllProductsFunction = () => void

export type PostType = {
    title: string,
    content: string,
    createdOn: Date,
}

export type UsersDocumentType = {
    id: string,
    username?: string,
    email?: string,
    description?: string,
    posts?: PostType[],
} | undefined

export type RegisterUserFunction = (
    username: string,
    email: string,
    password: string,
) => Promise<void>

export type LogoutUserFunction = () => Promise<void>

export type LoginUserFunction = (
    email: string,
    password: string,
) => Promise<UserCredential>

export type GetUserFunction = (
    id: string,
) => Promise<unknown>

export type ChangeUserDescriptionFunction = (
    id: string,
    newDescription: string,
) => Promise<unknown>

export type GetAllUsersFunction = () => Promise<unknown>

export type AddPostFunction = (
    id: string,
    title: string,
    content: string,
) => Promise<unknown>

export type DatabaseContextType = {
    currentUser?: User,
    usersDocument: UsersDocumentType,
    addNewProduct: AddProductFunction
    removeProduct: RemoveProductFunction,
    editProduct: UpdateProductFunction,
    getAllProducts: GetAllProductsFunction,
    registerUser: RegisterUserFunction,
    logoutUser: LogoutUserFunction,
    loginUser: LoginUserFunction,
    getUser: GetUserFunction,
    getAllUsers: GetAllUsersFunction,
    changeUserDescription: ChangeUserDescriptionFunction,
    addPost: AddPostFunction,
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
    
    const [currentUser, setCurrentUser] = useState<User | undefined>();
    const [usersDocument, setUsersDocument] = useState<UsersDocumentType>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if(user){
                const usersDocumentRef = doc(usersCollection, user.uid)
                setCurrentUser(user);
                getDoc(usersDocumentRef)
                    .then((doc) => {
                        // @ts-expect-error: This is gonna be valid, trust me.
                        const data: UsersDocumentType = doc.data();
                        setUsersDocument({...data, id: user.uid})
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }else {
                setUsersDocument(undefined)
                setCurrentUser(undefined)
            }
            
            setLoading(false);
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

    const registerUser: RegisterUserFunction = async (username, email, password) => {
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const userId = userCredential.user.uid;
            await setDoc(
                doc(db, "users", userId),
                {
                    username,
                    email,
                    description: "",
                    posts: []
                }
            )

        }catch(error){
            console.error(error)
        }
    } 

    const logoutUser: LogoutUserFunction = () => {
        return signOut(auth)
    }


    const loginUser: LoginUserFunction = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const getUser: GetUserFunction = (id: string) => {
        const docRef = doc(db, "users", id);
        return getDoc(docRef);
    }

    const getAllUsers: GetAllUsersFunction = () => {
        const productsQuery = query(
            usersCollection
        )

        return getDocs(productsQuery);
    }

    const changeUserDescription: ChangeUserDescriptionFunction = (
        id: string,
        newDescription: string,
    ) => {
        const user = doc(usersCollection, id)
        return updateDoc(user, { description: newDescription })
    }

    const addPost: AddPostFunction = (
        id: string,
        title: string,
        content: string,
    ) => {
        const userRef = doc(db, "users", id);
        return updateDoc(userRef, {
            posts: arrayUnion({
                title,
                content,
                createdOn: "unset",
            })
        })
    }

    const value: DatabaseContextType = {
        addNewProduct,
        removeProduct,
        editProduct,
        getAllProducts,
        currentUser,
        usersDocument,
        registerUser,
        logoutUser,
        loginUser,
        getUser,
        getAllUsers,
        changeUserDescription,
        addPost,
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
