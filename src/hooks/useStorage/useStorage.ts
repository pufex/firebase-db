import { useState, useRef } from "react"

const fetchLocal = <K>(key: string, defaultValue: K) => {
    const fetched = localStorage.getItem(key);
    if(fetched) return JSON.parse(fetched)
    else localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
}

export const useStorage = <T>(
    defaultValue: T, 
    key: string,
    options?: {
        shouldSave?: boolean
    }
) => {
    const [state, setState] = useState<T>(fetchLocal<T>(key, defaultValue))
    const usedKey = useRef(key);

    const modifyAcross = (newState: T) => {
        if(!options || typeof options.shouldSave == "undefined"){
            localStorage.setItem(usedKey.current, JSON.stringify(newState))
            return setState(newState)
        }else if(options.shouldSave){
            localStorage.setItem(usedKey.current, JSON.stringify(newState))
        }
        setState(newState)
    }

    return [state, modifyAcross] as const
}

