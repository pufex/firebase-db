import type {ReactElement} from "react"

import { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
} from "react"

export type ThemeContextType = {
    theme: "light" | "dark"
    switchTheme: () => void,
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
    const themeContext = useContext(ThemeContext)
    if(!themeContext) throw Error("Cannot use outside a provider")
    else return themeContext;
}

type ThemeProviderProps = {
    children: ReactElement[] | ReactElement
}

const fetchTheme = (): ThemeContextType["theme"] => {
    const theme = localStorage.getItem("dashboard-app-theme");
    if(theme == "light" || theme == "dark")
        return theme
    localStorage.setItem("dashboard-app-theme", "dark")
    return "dark";
}

const saveTheme = (theme: ThemeContextType["theme"]) => {
    localStorage.setItem("dashboard-app-theme", theme);
}

const ThemeProvider = ({
    children,
}:ThemeProviderProps) => {
  
    const [theme, setTheme] = useState<ThemeContextType["theme"]>(fetchTheme())

    useEffect(() => {
        const body = document.querySelector("body")!;
        if(!body.classList.contains(theme))
            body.classList.add(theme)
        switch(theme){
            case "light":
                body.classList.remove("dark")
                break;
            case "dark":
                body.classList.remove("light")
                break;
        }
        saveTheme(theme);
    }, [theme])

    const switchTheme = () => {
        switch(theme){
            case "light":
                setTheme("dark")
                break;
            case "dark":
                setTheme("light")
                break;
        }
    }

    return <ThemeContext.Provider
        value={{
            theme,
            switchTheme
        }}
    >
        {children}
    </ThemeContext.Provider>
}

export default ThemeProvider
