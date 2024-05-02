import { useIconsContext } from "../../contexts/Icon"

import { mergeClasses } from "../../utils/mergeClasses"

import "./Checkbox.css"

type CheckboxProps = {
    children?: string
    checked: boolean,
    onCheck: () => void,
}

const Checkbox = ({
    children,
    checked,
    onCheck
}: CheckboxProps) => {

    const { ImCheckmark } = useIconsContext();

    return <div 
        className="checkbox__container"
        onClick={onCheck}
    >
        <div 
            className={mergeClasses(
                "checkbox__checkbox",
                checked ? "active" : ""
            )}
        >
            {
                checked 
                    && <ImCheckmark
                        size={10}
                        className="checkbox__inner-icon"
                    />
            }
        </div>
        {
            children 
                && <label className="checkbox__label">
                    {children}
                </label>
        }
    </div>
}

export default Checkbox
