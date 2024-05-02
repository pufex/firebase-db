import { mergeClasses } from "../../utils/mergeClasses"

import "./Alert.css"

type AlertProps = {
    type: "danger" | "success",
    children: string,
}

const Alert = ({
    type,
    children,
}: AlertProps) => {
  return <div 
    className={mergeClasses(
        "alert__container",
        `alert__container--${type}`
    )}
  >
    <span className="alert__message">
        {children}
    </span>
  </div>
}

export default Alert
