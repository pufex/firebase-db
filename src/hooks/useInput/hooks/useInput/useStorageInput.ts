import type { 
    InputTextStateType,
    UseInputOptions
} from "../../types"
import type  { ChangeEvent } from "react";

import { useStorage } from "../../useStorage";

export const useStorageInput = ({
    defaultValue,
    defaultErrorState,
    defaultErrorMessage,
    key,
}:UseInputOptions) => {

    const [state, setState] = useStorage<InputTextStateType>({
        value: defaultValue != "" && typeof defaultValue == "string" ? defaultValue : "",
        isError: Boolean(defaultErrorState),
        errorMessage: defaultErrorMessage != "" && typeof defaultErrorMessage == "string" ? defaultErrorMessage : "Invalid value"
    }, key);

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

