import type{ InputTextStateType } from "../../types/types";
import type { UsersDocumentType } from "../../contexts/Database";
import type { ChangeEvent, FormEvent } from "react";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDatabase } from "../../contexts/Database"

import Loading from "../../components/Loading/Loading";
import Post from "../../components/Post/Post";
import Input from "../../components/Input/Input";

import ErrorPage from "../ErrorPage/ErrorPage";

import "./Profile.css"
import { useIconsContext } from "../../contexts/Icon";

const Profile = () => {

    const [searchParams] = useSearchParams();
    const userId = searchParams.get("user");
    

    if(!userId)
        return <ErrorPage />

    const {
        FaEdit
    } = useIconsContext();

    const {
        currentUser,
        getUser,
        changeUserDescription,
        addPost,
    } = useDatabase();

    const [userStatus, setUserStatus] = useState<"loading" | "error" | "success">("loading")
    const [userDocument, setUserDocument] = useState<UsersDocumentType>();
    const [editDescription, setEditDescription] = useState<boolean>(false);

    const switchDescriptionEdit = () => {
        setEditDescription(previous => !previous);
    }

    const [error, setError] = useState<boolean | string>(false);
    error
    const [loading, setLoading] = useState<boolean>(false);


    const [description, setDescription] = useState<InputTextStateType>({
        value: userDocument?.description || "",
        isError: false,
        errorMessage: ""
    })

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(value.length <= 200){
            setDescription({...description, value})
        }else{
            setDescription({...description,
                isError: true,
                errorMessage: "Max. 200 characters"
            })
        }

    }

    const handleDescriptionSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false);
        setDescription({...description, isError: false})

        if(!description.value.length){
            setDescription({...description, 
                isError: true,
                errorMessage: "Can't be empty"
            })
            return;
        }

        try{
            setLoading(true);
            await changeUserDescription(
                currentUser!.uid,
                description.value
            )
            handleUserFetch();
            switchDescriptionEdit();
        }catch(error){
            console.error(error)
            setError("Failed to update description.")
        }

        setLoading(false)
    }

    const [showPostForm, setShowPostForm] = useState<boolean>(true);

    const switchShowPostForm = () => {
        setShowPostForm(previous => !previous)
    }

    const [title, setTitle] = useState<InputTextStateType>({
        value: "",
        isError: false,
        errorMessage: "",
    })

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(value.length > 80){
            setTitle({...title, 
                isError: true,
                errorMessage: "Max. 80 characters"
            })
        }else{            
            setTitle({...title, value})
        }

    }

    const [content, setContent] = useState<InputTextStateType>({
        value: "",
        isError: false,
        errorMessage: "",
    })

    const handleContentChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(value.length > 200){
            setContent({...content, 
                isError: true,
                errorMessage: "Max. 200 characters"
            })
        }else{
            setContent({...content, value})
        }

    }

    const handlePostSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false)
        setTitle({...title, isError: false})
        setContent({...content, isError: false})

        let shouldReturn = false;

        if(title.value.length < 15){
            shouldReturn = true;
            setTitle({...title,
                isError: true,
                errorMessage: "Min. 15 characters"
            })
        }

        if(content.value.length < 10){
            shouldReturn = true;
            setContent({...title,
                isError: true,
                errorMessage: "Min. 10 characters"
            })
        }

        if(shouldReturn) return;

        try{
            setLoading(true)
            await addPost(
                currentUser?.uid!,
                title.value,
                description.value
            );
            switchShowPostForm();
            handleUserFetch();
        }catch(error){
            console.error(error);
            setError("Failed to post the post.")
        }
        setLoading(false)
        
    }

    const handleUserFetch = () => {
        getUser(userId)
            .then((snapshot) => {
                //  @ts-expect-error: no u
                setUserDocument({...snapshot.data(), id: snapshot.id});
                setUserStatus("success")
            })
            .catch((err) => {
                console.error(err)
                setUserStatus("error")
            })
    }
    
    useEffect(() => {
        handleUserFetch();
    }, [])

    useEffect(() => {
        console.log(userDocument)
    }, [userDocument])

    const postsList = useMemo(() => {
        if(userDocument)
        return userDocument?.posts?.map(({
            title,
            content,
            createdOn, 
        }) => {
            return <Post
                title={title}
                content={content}
                createdOn={createdOn}
                authorName={userDocument.username || ""}
                authorId={userDocument.id || ""}
            />
        })
        else return []
    }, [userDocument])

    if(userStatus == "loading")
    return <main className="profile-page__loading-container">
        <Loading></Loading>
    </main>

    if(userStatus == "error")
    return <ErrorPage />

    if(userStatus == "success")
    return <main className="profile-page__main">
        <section className="profile-page__profile">
            <h1 className="profile-page__username">
                {userDocument!.username}
            </h1>
            {
                !editDescription
                    ? <p className="profile-page__description">
                        <span className="profile-page__description-content">
                            {
                                userDocument!.description
                                    ? userDocument!.description
                                    : "No description provided."
                            }
                        </span>
                        {
                            currentUser?.uid == userDocument?.id
                                && <button 
                                    className="btn profile-page__edit-button"
                                    onClick={switchDescriptionEdit}
                                    disabled={loading}
                                >
                                    <FaEdit
                                        size={18}
                                        className="profile-page__edit-icon"
                                    />
                                </button>
                        }
                    </p>
                    : <form 
                        className="profile-page__description-form"
                        onSubmit={handleDescriptionSubmit}
                    >
                        <div className="profile-page__description-form__input-container">
                            <Input
                                placeholder="New description (max: 200 char)"
                                value={description.value}
                                onChange={handleDescriptionChange}
                                isError={description.isError}
                                errorMessage={description.errorMessage}
                            >
                                New description
                            </Input>
                        </div>
                        <div className="profile-page__description-form__buttons">
                            <button 
                                className="btn btn--primary"
                                type="submit"
                                disabled={loading}
                                >
                                Change
                            </button>
                            <button 
                                className="btn btn--primary"
                                type="button"
                                onClick={switchDescriptionEdit}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
            }
        </section>
        <section className="profile-page__posts">
            <h1 className="profile-page__posts-header">
                Posts
            </h1>
            {
                currentUser?.uid == userDocument?.id
                    && !showPostForm
                        ? <div className="profile-page__form-container">
                            <button 
                                className="btn btn--primary"
                                onClick={switchShowPostForm}
                            >
                                Add Post
                            </button>
                        </div>
                        : <form
                            className="profile-page__form-post"
                            onSubmit={handlePostSubmit}
                        >
                            <header className="profile-page__form-post__header">
                                <h1 className="profile-page__form-post__heading">
                                    Add a new post
                                </h1>
                            </header>
                            <div className="profile-page__form-post__input-container">
                                <Input
                                    placeholder="Post's title"
                                    value={title.value}
                                    onChange={handleTitleChange}
                                    isError={title.isError}
                                    errorMessage={title.errorMessage}
                                >
                                    Title
                                </Input>
                            </div>
                            <div className="profile-page__form-post__input-container">
                                <Input
                                    placeholder="Post's content"
                                    value={content.value}
                                    onChange={handleContentChange}
                                    isError={content.isError}
                                    errorMessage={content.errorMessage}
                                >
                                    Content
                                </Input>
                            </div>
                            <div className="profile-page__form-post__buttons">
                                <button 
                                    className="btn btn--primary"
                                    type="submit"
                                >
                                    Post
                                </button>
                                <button 
                                    className="btn btn--primary"
                                    type="button"
                                    onClick={switchShowPostForm}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
            
            }
            <div className="profile-page__posts-container">
                {
                    userDocument!.posts?.length
                        ? postsList 
                        : <h1 className="profile-page__no-posts">
                            No posts yet.
                        </h1>
                }
            </div>
        </section>
    </main>
}

export default Profile
