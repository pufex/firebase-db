import type { UsersDocumentType } from "../../contexts/Database";
import type { FormEvent } from "react";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useIconsContext } from "../../contexts/Icon";
import { useInput } from "../../hooks/useInput";
import { useDatabase } from "../../contexts/Database"

import Loading from "../../components/Loading/Loading";
import Post from "../../components/Post/Post";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

import ErrorPage from "../ErrorPage/ErrorPage";

import "./Profile.css"

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

    useEffect(() => {
        console.log(userId)
        setUserStatus("loading")
        handleUserFetch();
    }, [userId])

    const [error, setError] = useState<boolean | string>(false);
    error
    const [loading, setLoading] = useState<boolean>(false);


    const [description, handleDescriptionChange, changeDescriptionError] = useInput({defaultValue: userDocument?.description});

    const handleDescriptionSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false);
        changeDescriptionError();

        if(!description.value.length)
            return changeDescriptionError(true, "Can't leave empty")
        
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

    const [showPostForm, setShowPostForm] = useState<boolean>(false);

    const switchShowPostForm = () => {
        setShowPostForm(previous => !previous)
    }

    const [title, handleTitleChange, changeTitleError] = useInput({})
    const [content, handleContentChange, changeContentError] = useInput({})

    const handlePostSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false)
        changeTitleError()
        changeContentError()

        let shouldReturn = false;

        if(title.value.length < 15){
            shouldReturn = true;
            changeTitleError(true, "Min. 15 characters");
        }

        if(content.value.length < 10){
            shouldReturn = true;
            changeContentError(true, "Min. 10 characters")
        }

        if(shouldReturn) return;

        try{
            setLoading(true)
            await addPost(
                currentUser?.uid!,
                title.value,
                content.value
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
        <Loading />
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
                            <Button
                                type="primary"
                                role="submit"
                                disabled={loading}
                                loading={loading}
                            >
                                Change
                            </Button>
                            <Button
                                type="primary"
                                role="button"
                                onClick={switchDescriptionEdit}
                            >
                                Cancel
                            </Button>
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
                    ? !showPostForm
                        ? <div className="profile-page__form-container">
                            <Button
                                type="primary"
                                role="button"
                                onClick={switchShowPostForm}
                            >
                                Add Post
                            </Button>
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
                                <Button
                                    type="primary"
                                    role="submit"
                                    disabled={loading}
                                    loading={loading}
                                >
                                    Post
                                </Button>
                                <Button
                                    type="primary"
                                    role="submit"
                                    onClick={switchShowPostForm}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    : null
            
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
