import type { 
    InputTextStateType,
    UseInputOptions
} from "../../types"
import type  { ChangeEvent } from "react";

import { useState } from "react";

export const useInput = ({
    defaultValue,
    defaultErrorState,
    defaultErrorMessage,
}:Pick<
    UseInputOptions, 
    "defaultValue" |
    "defaultErrorState" |
    "defaultErrorMessage"
>) => {
  
    const [state, setState] = useState<InputTextStateType>({
        value: defaultValue != "" && typeof defaultValue == "string" ? defaultValue : "",
        isError: Boolean(defaultErrorState),
        errorMessage: defaultErrorMessage != "" && typeof defaultErrorMessage == "string" ? defaultErrorMessage : "Invalid value"
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setState({...state,
            value
        })
    }

    const changeInputError = (value?: boolean, message?: string) => {
        setState({...state,
            isError: Boolean(value),
            errorMessage: message || "",
        })
    }

    const resetValue = () => {
        setState({...state,
            value: "",
        })
    }

    return [
        state,
        handleChange,
        changeInputError,
        resetValue
    ] as const 
}

