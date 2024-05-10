import type { PostType } from "../../contexts/Database"
import type { FormEvent } from "react"

import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useIconsContext } from "../../contexts/Icon"
import { useInput } from "../../hooks/useInput"
import { useDatabase } from "../../contexts/Database"

import AuthorisedOptions from "./components/AuthorisedOptions/AuthorisedOptions"
import Input from "../Input/Input"
import Button from "../Button/Button"

import { mergeClasses } from "../../utils/mergeClasses"

import "./Post.css"

type PostProps = Pick<
    PostType,
    "title" |
    "content" |
    "createdOn" 
> & {
    authorName: string,
    authorId: string,
    posts: PostType[],
    index: number,
}

const Post = ({
    title,
    content,
    createdOn,
    authorId,
    authorName,
    posts,
    index,
}:PostProps) => {
    
    const navigate = useNavigate();

    const [_params, setParams] = useSearchParams();

    const {currentUser, removePost, updatePosts} = useDatabase();
    const {FaEdit,FaTrashCan,MdReportProblem,} = useIconsContext()

    const [removeLoading, setRemoveLoading] = useState<boolean>(false);
    const [removeError, setRemoveError] = useState<string>("");

    useEffect(() => console.error(removeError), [removeError])

    const [editForm, setEditForm] = useState(false);
    const switchEditForm = () => {
        setEditForm(previous => !previous);
    }

    const [editLoading, setEditLoading] = useState(false)
    const [editError, setEditError] = useState("")

    useEffect(() => console.error(editError), [editError])

    const [newTitle, handleTitleChange, setTitleError] = useInput({defaultValue: title})
    const [newContent, handleContentChange, setContentError] = useInput({defaultValue: content})

    const handlePostRemove = async () => {
        setRemoveError("");
        try{
            setRemoveLoading(false);
            await removePost(authorId, {
                title,
                content,
                createdOn,
            })
        }catch(err){
            console.error(err)
            setRemoveError("Failed to remove the post.")
        }
        setRemoveLoading(true);
    }

    const handleReportUser = () => {
        setParams(previous => {
            previous.set("modal", "report-user")
            previous.set("report-id", authorId)
            previous.set("report-name", authorName)
            return previous
        })
    }

    const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEditError("");
        setTitleError();
        setContentError();

        let shouldReturn = false;
        
        if(newTitle.value.length < 2){
            shouldReturn = true;
            setTitleError(true, "Min. 2 characters")
        }

        if(newContent.value.length < 20){
            shouldReturn = true;
            setContentError(true, "Min. 20 characters")
        }

        if(shouldReturn) return;
        
        try{
            setEditLoading(true);
            const newPosts = [...posts].map((post, i) => {
                if(i === index)
                    return {...post, 
                    title: newTitle.value,
                    content: newContent.value,
                }
                return post
            });
            await updatePosts(authorId, newPosts);
            setEditForm(false);
        }catch(error){
            console.error(error)
            setEditError("Failed to edit post.")
        }
        setEditLoading(false);
    }

    return <div
        className="post-component__container"
    >
        <section className="post-component__info">
            <section className="post-component__info--top">
                <div className="post-component__info--left">
                    <h3 
                        className="post-component__author-name"
                        onClick={() => navigate(`/profile?user=${authorId}`)}
                    >
                        {authorName}
                    </h3>
                    <span className="post-component__created-on">
                        {createdOn.toString()}
                    </span>
                </div>
                <div className="post-component__info--right">
                    {
                        !editForm
                            ? currentUser?.uid == authorId 
                                ? <AuthorisedOptions>
                                    <div className="post-component__options-group">
                                        <div 
                                            className="post-component__option"
                                            onClick={switchEditForm}
                                        >
                                            <span className="post-component__option__title">
                                                Edit  
                                            </span>  
                                            <FaEdit
                                                size={18}
                                                className="post-component__option__icon"
                                            />                  
                                        </div>
                                        <button 
                                            className={mergeClasses(
                                                "btn post-component__option post-component__option--danger",
                                                removeLoading ? "loading" : "",
                                            )}
                                            onClick={handlePostRemove}
                                            disabled={removeLoading}
                                        >
                                            <span className="post-component__option__title">
                                                Remove  
                                            </span>
                                            <FaTrashCan
                                                size={18}
                                                className="post-component__option__icon"
                                            />                  
                                        </button>
                                    </div>
                                    <div className="post-component__options-group">
                                        <div 
                                            className="post-component__option post-component__option--danger"
                                            onClick={handleReportUser}
                                        >
                                            <span className="post-component__option__title">
                                                Report  
                                            </span>
                                            <MdReportProblem
                                                size={18}
                                                className="post-component__option__icon"
                                            />                  
                                        </div>
                                    </div>
                                </AuthorisedOptions>
                                : <AuthorisedOptions>
                                    <div className="post-component__options-group">
                                        <div 
                                            className="post-component__option post-component__option--danger"
                                            onClick={handleReportUser}
                                        >
                                            <span className="post-component__option__title">
                                                Report  
                                            </span>
                                            <MdReportProblem
                                                size={18}
                                                className="post-component__option__icon"
                                            />                  
                                        </div>
                                    </div>
                                </AuthorisedOptions>
                            : null
                    }
                </div>
            </section>
            <section className="post-component__info--bottom">
                {
                    !editForm
                        &&<h1 className="post-component__title">
                            {title}
                        </h1>
                }
            </section>
        </section>
        <section className="post-component__content">
            {   
                !editForm
                    ? content
                    : <div className="post-component__edit-form-container">
                        <form 
                            className="post-component__edit-form"
                            onSubmit={handleEditSubmit}
                        >
                            <header className="post-component__edit-form__header">
                                <h1 className="post-component__edit-form__heading">
                                    Edit Post
                                </h1>
                            </header>
                            <div className="project--form__input-container">
                                <Input
                                    placeholder="New Title"
                                    onChange={handleTitleChange}
                                    value={newTitle.value}
                                    isError={newTitle.isError}
                                    errorMessage={newTitle.errorMessage}
                                >
                                    Title
                                </Input>
                            </div>
                            <div className="project--form__input-container">
                                <Input
                                    placeholder="New Title"
                                    onChange={handleContentChange}
                                    value={newContent.value}
                                    isError={newContent.isError}
                                    errorMessage={newContent.errorMessage}
                                >
                                    Content
                                </Input>
                            </div>
                            <div className="post-component__edit-form__buttons">
                                <Button
                                    role="submit"
                                    type="primary"
                                    loading={editLoading}
                                    disabled={editLoading}
                                >
                                    Update 
                                </Button>
                                <Button
                                    role="button"
                                    type="primary"
                                    onClick={() => setEditForm(false)}
                                >
                                    Cancel 
                                </Button>
                            </div>
                        </form>
                    </div>
            }
        </section>
    </div>
}

export default Post
