import type { PostType } from "../../contexts/Database"

import { useNavigate } from "react-router-dom"
import { useDatabase } from "../../contexts/Database"

import AuthorisedOptions from "./components/AuthorisedOptions/AuthorisedOptions"

import "./Post.css"
import { useState } from "react"
import { useIconsContext } from "../../contexts/Icon"

type PostProps = PostType & {
    authorName: string,
    authorId: string,
}

type PostState = "normal" | "edited"

const Post = ({
    title,
    content,
    createdOn,
    authorId,
    authorName,
}:PostProps) => {
    
    const navigate = useNavigate();

    const {
        currentUser
    } = useDatabase();

    const {
        FaEdit,
        FaTrashCan,
        MdReportProblem,
    } = useIconsContext()

    const [postState, setPostState] = useState<PostState>("normal");

    const handlePostRemove = (authorId: string) => {
        authorId
    }

    const handleReportUser = (authorId: string) => {
        authorId
    }

    if(postState == "normal")
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
                        currentUser?.uid == authorId
                            ? <AuthorisedOptions>
                                <div className="post-component__options-group">
                                    <div 
                                        className="post-component__option"
                                        onClick={() => setPostState("edited")}
                                    >
                                        <span className="post-component__option__title">
                                            Edit  
                                        </span>  
                                        <FaEdit
                                            size={18}
                                            className="post-component__option__icon"
                                        />                  
                                    </div>
                                    <div 
                                        className="post-component__option post-component__option--danger"
                                        onClick={() => handlePostRemove(authorId)}
                                    >
                                        <span className="post-component__option__title">
                                            Remove  
                                        </span>
                                        <FaTrashCan
                                            size={18}
                                            className="post-component__option__icon"
                                        />                  
                                    </div>
                                </div>
                                <div className="post-component__options-group">
                                    <div 
                                        className="post-component__option post-component__option--danger"
                                        onClick={() => handleReportUser(authorId)}
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
                                        onClick={() => handleReportUser(authorId)}
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
                    }
                </div>
            </section>
            <section className="post-component__info--bottom">
                <h1 className="post-component__title">
                    {title}
                </h1>
            </section>
        </section>
        <section className="post-component__content">
            {content}
        </section>
    </div>
}

export default Post
