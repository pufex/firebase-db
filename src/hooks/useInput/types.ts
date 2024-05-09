export type InputTextStateType = {
    value: string,
    isError: boolean,
    errorMessage: string,
}

export type UseInputOptions = Partial<{
    defaultValue: string,
    defaultErrorState: string,
    defaultErrorMessage: string,
    options: {
        shouldSave?: boolean
    }
}> & { key: string }