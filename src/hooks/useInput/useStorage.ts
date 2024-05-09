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
) => {
    const [state, setState] = useState<T>(fetchLocal<T>(key, defaultValue))
    const usedKey = useRef(key);

    const modifyAcross = (newState: T) => {
        localStorage.setItem(usedKey.current, JSON.stringify(newState))
        setState(newState)
    }

    return [state, modifyAcross] as const
}

