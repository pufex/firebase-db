export const validateNameLike = (changed: string, options?: {emptyOk?: boolean}): boolean => {
    let isInvalid = false;
    if(options){
        if(typeof options.emptyOk != "undefined")
            if(options.emptyOk === false)
                if(changed.length == 0)
                    isInvalid = true;
        else if(changed.length == 0)
            isInvalid = true;
    }
    if(!changed.match(/[A-Z][a-z]+$/))
        isInvalid = true;
    return isInvalid;
}
export const validateAddress = (changed: string) => {
    let isInvalid = false;
    if(changed.length == 0)
        isInvalid = true;
    return isInvalid
}
export const validateCode = (changed: string, options?: {emptyOk?: boolean}) => {
    if(options)
        if(typeof options.emptyOk != "undefined")
            if(!options.emptyOk)
                if(!changed.length)
                    return [true, "Can't be empty"] as const
    if(!changed.match(/^[0-9][0-9]\-[0-9][0-9][0-9]$/))
        return [true, "Invalid Format"]
    return [false, ""] as const;
}
export const validateEmail = (changed: string, options?: {emptyOk?: boolean}) => {
    let isInvalid = false;
    
    if(options)
        if(typeof options.emptyOk != "undefined")
            if(!options.emptyOk && !changed.length)
                return true;
        else if(!changed.length) return true;
    
    if(
        !String(changed)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    ) isInvalid = true
    return isInvalid;
}

export const validateFullname = (changed: string) => {
    let isInvalid = false;
    const regex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
    if(changed == "" || !changed.match(regex))
        isInvalid = true;
    return isInvalid;
}
export const validateCvv = (changed: string) => {
    let str = changed;
    let isInvalid = false;
    if(str.length !== 3)
        isInvalid = true
    return isInvalid
}