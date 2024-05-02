import { useIconsContext } from "../../contexts/Icon"
import { useTheme } from "../../contexts/Theme";
import "./ThemeButton.css"

const ThemeButton = () => {
  
    const {
        theme,
        switchTheme
    } = useTheme();

    const {
        FaSun,
        FaMoon,
    } = useIconsContext();
  
    return <div 
        className="theme-button__container"
        onClick={switchTheme}
    >
        {
            theme == "light"
                ? <FaSun 
                    size={25}
                    className="theme-button__icon"
                />
                : <FaMoon 
                    size={20}
                    className="theme-button__icon"
                />
        }
    </div>
    
}

export default ThemeButton
