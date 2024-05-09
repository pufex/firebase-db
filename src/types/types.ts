export type InputTextStateType = {
    value: string,
    isError: boolean,
    errorMessage: string,
}

export type UseInputOptions = {
    defaultValue?: string,
    defaultErrorState?: boolean,
    defaultErrorMessage?: string,
}
