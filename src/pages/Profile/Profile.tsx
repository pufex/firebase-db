import type { FormEvent } from "react";

import { useState, useEffect, useMemo, useRef } from "react";
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

    const {FaEdit} = useIconsContext();
    const { 
        user, setProfileUser, profileLoading,
        currentUser, changeUserDescription, addPost,
    } = useDatabase();

    const [searchParams] = useSearchParams();
    const userId = searchParams.get("user");
    
    const [loadedPage, setLoadedPage] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<boolean | string>(false);
    
    useEffect(() => {
        console.error(error)
    }, [error])

    useEffect(() => {
        setProfileUser(userId || "", () => setLoadedPage(true))
    }, [userId])

    const [editDescription, setEditDescription] = useState<boolean>(false);
    const switchDescriptionEdit = () => {
        setEditDescription(previous => !previous);
    }
    const [description, handleDescriptionChange, changeDescriptionError] = useInput({defaultValue: user?.description ?? ""});
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
            switchDescriptionEdit();
        }catch(error){
            console.error(error)
            setError("Failed to update description.")
        }

        setLoading(false)
    }
    
    const postFormRef = useRef<HTMLFormElement>();
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

        if(title.value.length < 2){
            shouldReturn = true;
            changeTitleError(true, "Min. 2 characters");
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
            if(postFormRef.current)
                postFormRef.current.reset();
        }catch(error){
            console.error(error);
            setError("Failed to post the post.")
        }
        setLoading(false)
        
    }
    
    const postsList = useMemo(() => {
        if(user)
        return user.posts?.map(({
            title,
            content,
            createdOn, 
        }, index) => {
            return <Post
                title={title}
                content={content}
                createdOn={createdOn}
                authorName={user.username || ""}
                authorId={user.id || ""}
                index={index}
                posts={user?.posts || []}
            />
        })
        else return []
    }, [user])

    if(!userId) return <ErrorPage />

    if(profileLoading == "loading" || loadedPage == false)
    return <main className="profile-page__loading-container">
        <Loading />
    </main>
    
    if(profileLoading == "static" && user)
    return <main className="profile-page__main">
        <section className="profile-page__profile">
            <h1 className="profile-page__username">
                {user!.username}
                {
                    user.isBanned
                        && <span className="profile-page__banned">
                         BANNED
                        </span>
                }
            </h1>
            {
                !editDescription
                    ? <p className="profile-page__description">
                        <span className="profile-page__description-content">
                            {
                                user.description
                                    ? user.description
                                    : "No description provided."
                            }
                        </span>
                        {
                            currentUser?.uid == user.id
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
                currentUser?.uid == user?.id
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
                            // @ts-expect-error
                            ref={postFormRef}
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
                    !user.isBanned 
                    ?   user.posts?.length
                        ? postsList 
                        : <h1 className="profile-page__no-posts">
                            No posts yet.
                        </h1>
                    : <div className="profile-page__ban-information">
                        This user has been banned, therefore his posts are not available.
                    </div>
                }
            </div>
        </section>
    </main>
    else if(profileLoading == "static") return <ErrorPage />
}

export default Profile
