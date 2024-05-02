import type { FormEvent, ReactElement } from "react"
import "./Form.css"

type FormProps = {
    title?: string,
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    children: ReactElement[] | ReactElement,
    isError?: boolean,
    errorMessage?: string,
}

const Form = ({
    title,
    onSubmit,
    children,
    isError,
    errorMessage,
}:FormProps) => {
    return <form 
        className="form__container"
        onSubmit={onSubmit}
    >
        <header className="form__header">
            <h1 className="form__heading">
                {title}
            </h1>
            {
                isError 
                    ? <span className="form__error">
                        {errorMessage ?? "Something went wrong"}
                    </span>
                    : null
            }
        </header>
        <div className="form__content">
            {children}
        </div>
    </form>
}

export default Form
