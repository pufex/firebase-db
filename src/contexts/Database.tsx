import type {ReactElement} from "react"
import type { UserCredential, User } from "firebase/auth"

import { createContext, useContext, useState, useEffect } from "react"

import LoadingPage from "../pages/LoadingPage/LoadingPage"

import { 
    productsCollection, 
    usersCollection,
    auth, 
    db,
    functions
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
    arrayUnion,
    onSnapshot
} from "firebase/firestore"
import {
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth"
import { httpsCallable } from "firebase/functions"

export type GiveAdminFunction = (email: string) => Promise<unknown>

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
    newPrice: number,
) => Promise<unknown>

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

export type ResetPasswordFunction = (email: string) => Promise<unknown>

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
    products: Product[],
    currentUser?: User & {isAdmin: boolean | undefined},
    usersDocument: UsersDocumentType,
    addNewProduct: AddProductFunction
    removeProduct: RemoveProductFunction,
    editProduct: UpdateProductFunction,
    registerUser: RegisterUserFunction,
    logoutUser: LogoutUserFunction,
    loginUser: LoginUserFunction,
    resetPassword: ResetPasswordFunction,
    getUser: GetUserFunction,
    getAllUsers: GetAllUsersFunction,
    changeUserDescription: ChangeUserDescriptionFunction,
    addPost: AddPostFunction,
    giveAdmin: GiveAdminFunction,
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
    
    const [currentUser, setCurrentUser] = useState<(User & {isAdmin: boolean}) | undefined>();
    const [usersDocument, setUsersDocument] = useState<UsersDocumentType>();
    const [loadingUser, setLoadingUser] = useState<boolean>(true);

    const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([])

    const addAdminRole = httpsCallable(functions, "addAdminRole")

    const giveAdmin: GiveAdminFunction = (email) => {
        return addAdminRole({email})
    }

    useEffect(() => {
        console.log(currentUser)
    }, [currentUser])

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if(user){
                user.getIdTokenResult()
                    .then((result) => {
                        // @ts-expect-error: unknown moment
                        setCurrentUser({...user, isAdmin: result.claims.isAdmin})
                    })
                    .catch((err) => {
                        console.error(err)
                    })
                const usersDocumentRef = doc(usersCollection, user.uid)
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
            setLoadingUser(false);
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
    
    const editProduct: UpdateProductFunction = (id, newName, newPrice) => {
        const product = doc(productsCollection, id)
        return updateDoc(product, { name: newName, price: newPrice })
    }

    useEffect(() => {
        const unsub = onSnapshot(productsCollection, (snapshot) => {
            const productsArr: Product[] = []
            snapshot.docs.forEach((doc) => {
                // @ts-expect-error
                productsArr.push({...doc.data(), id: doc.id})
            })
            setProducts(productsArr);
            setLoadingProducts(false)
        }, (error) => {
            console.error(error)
        })
        return unsub
    }, [])

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

    const resetPassword: ResetPasswordFunction = (email) => {
        return sendPasswordResetEmail(auth, email);
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
        products,
        addNewProduct,
        removeProduct,
        editProduct,
        currentUser,
        usersDocument,
        registerUser,
        logoutUser,
        loginUser,
        resetPassword,
        getUser,
        getAllUsers,
        changeUserDescription,
        addPost,
        giveAdmin,
    }

    return <DatabaseContext.Provider
        value={value}
    >
        {
            loadingUser || 
            loadingProducts 
             ? <LoadingPage />
             : children
        }
    </DatabaseContext.Provider>
}

export default DatabaseProvider
