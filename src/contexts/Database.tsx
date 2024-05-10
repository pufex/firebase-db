import type {ReactElement} from "react"
import type { UserCredential, User } from "firebase/auth"

import { createContext, useContext, useState, useEffect, useRef } from "react"

import LoadingPage from "../pages/LoadingPage/LoadingPage"
import BannedPage from "../pages/BannedPage/BannedPage"

import { 
    productsCollection, 
    usersCollection,
    reportsCollection,
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
    onSnapshot,
    arrayRemove
} from "firebase/firestore"
import {
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth"
import { httpsCallable } from "firebase/functions"

export type GiveAdminFunction = (email: string) => Promise<unknown>

export type BanUserFunction = (email: string) => Promise<unknown>

export type Product = {
    id: string,
    name: string,
    price: number,
}

export type ReportObj = {
    reportingUserId: string,
    reportedUserId: string,
    reason: string,
    details: string,
}


export type LoadingStatus = "loading" | "error" | "static"

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
    isBanned: boolean,
    username?: string,
    email?: string,
    description?: string,
    posts?: PostType[],
}

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

export type SetProfileUserFunction = (id: string, callback: () => void) => void;

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

export type RemovePostFunction = (
    id: string,
    post: PostType
) => Promise<void>

export type UpdatePostsFunction = (
    id: string,
    posts: PostType[],
) => Promise<unknown>

export type ReportUserFunction = (
    report: ReportObj
) => Promise<unknown>

export type DatabaseContextType = {
    products: Product[],
    currentUser?: User & {isAdmin: boolean | undefined},
    usersDocument: UsersDocumentType | undefined,

    user?: UsersDocumentType,
    profileLoading: LoadingStatus,

    addNewProduct: AddProductFunction
    removeProduct: RemoveProductFunction,
    editProduct: UpdateProductFunction,

    registerUser: RegisterUserFunction,
    logoutUser: LogoutUserFunction,
    loginUser: LoginUserFunction,
    resetPassword: ResetPasswordFunction,

    getUser: GetUserFunction,
    getAllUsers: GetAllUsersFunction,
    
    setProfileUser: SetProfileUserFunction,
    changeUserDescription: ChangeUserDescriptionFunction,

    addPost: AddPostFunction,
    removePost: RemovePostFunction,
    updatePosts: UpdatePostsFunction,

    reportUser: ReportUserFunction,

    giveAdmin: GiveAdminFunction,
    banUser: BanUserFunction,
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
    
    const [currentUser, setCurrentUser] = useState<(User & {isAdmin: boolean, isBanned: boolean}) | undefined>();
    const [usersDocument, setUsersDocument] = useState<UsersDocumentType | undefined>();
    const [loadingUser, setLoadingUser] = useState<boolean>(true);

    const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([])

    const unsubUser = useRef<Function | null>(null);
    const [user, setUser] = useState<UsersDocumentType | undefined>();
    const [profileLoading, setProfileLoading] = useState<LoadingStatus>("static");

    const setProfileUser: SetProfileUserFunction = (id, callback) => {
        if(unsubUser.current) unsubUser.current();
        const userRef = doc(db, "users", id);
        const unsub = onSnapshot(userRef, (doc) => {
            setProfileLoading("loading")
            // @ts-expect-error
            const userDoc: UsersDocumentType = {
                id: doc.id,
                ...doc.data(),
            }
            setUser(userDoc)
            setProfileLoading("static")
            callback();
        }, (err) => {
            console.error(err)
            setProfileLoading("error");
        })
        unsubUser.current = unsub;
    }

    const addAdminRole = httpsCallable(functions, "addAdminRole")

    const giveAdmin: GiveAdminFunction = (email) => {
        if(currentUser && !currentUser?.isAdmin) 
            return Promise.reject(new Error("You're not authorised."))
        else return addAdminRole({email})
    }

    const banUserWithEmail = httpsCallable(functions, "banUserWithEmail")

    const banUser: BanUserFunction = async (email) => {
        if(currentUser && !currentUser?.isAdmin)
            return Promise.reject(new Error("You're not authorised."))
        else return banUserWithEmail({email})
            .then((res) => {
                console.log(res)
                // @ts-expect-error
                console.log(res.data.uid)
                // @ts-expect-error
                const userRef = doc(db, "users", res.data.uid ?? "")
                return updateDoc(userRef, {
                    isBanned: true,
                })
            })
            .catch((err) => {
                console.error(err);
            })
    }

    useEffect(() => {
        console.log(currentUser)
    }, [currentUser])

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if(user){
                user.getIdTokenResult()
                    .then((result) => {
                        setCurrentUser({...user, 
                            // @ts-expect-error: unknown moment
                            isAdmin: result.claims.isAdmin,
                            // @ts-expect-error: unknown moment
                            isBanned: result.claims.isBanned
                        })
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
        const product = doc(productsCollection, id);
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
                    isAdmin: false,
                    isBanned: false,
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
                createdOn: new Date().toDateString(),
            })
        })
    }

    const removePost: RemovePostFunction = (id, post) => {
        const userRef = doc(db, "users", id);
        return updateDoc(userRef, {
            posts: arrayRemove(post)
        })
    }

    const updatePosts: UpdatePostsFunction = (id, posts) => {
        const userRef = doc(db, "users", id)
        return updateDoc(userRef, {posts})
    }

    const reportUser: ReportUserFunction = (report) => {
        return addDoc(reportsCollection, {
            ...report
        })
    }

    const value: DatabaseContextType = {
        products,
        user,
        profileLoading,
        setProfileUser,
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
        removePost,
        updatePosts,
        reportUser,
        giveAdmin,
        banUser,
    }

    return <DatabaseContext.Provider
        value={value}
    >
        {
            loadingUser || 
            loadingProducts 
                ? <LoadingPage />
                : currentUser
                    ? currentUser?.isBanned
                        ? <BannedPage/>
                        : children
                    : children
        }
    </DatabaseContext.Provider>
}

export default DatabaseProvider
