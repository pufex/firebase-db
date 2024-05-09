import { mergeClasses } from "../../utils/mergeClasses"

import LoadingIcon from "../LoadingIcon/LoadingIcon"

import "./Button.css"

type ButtonProps = {
    type?: "primary",
    loading?: boolean,
    disabled?: boolean,
    children: string,
    role?: "button" | "submit" | "reset",
    onClick?: (...arg: any[]) => void
}

const Button = ({
    type,
    loading,
    disabled,
    children,
    role,
    onClick,
}:ButtonProps) => {
    return <button 
        className="button"
        disabled={disabled}
        type={role ?? "button"}
        onClick={onClick ? onClick : undefined}
    >
        <div className={mergeClasses(
            type ? `button--${type}` : "button--primary",
            Boolean(loading) ? "loading" : "",
            Boolean(disabled) ? "disabled" : "",
        )}>
            {children}
        </div>
        {
            Boolean(loading)
                && <div className="button__loading-container">
                    <LoadingIcon />
                </div>
        }
    </button>
}

export default Button
