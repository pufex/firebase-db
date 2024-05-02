import { IconType } from "react-icons";
import type { ReactElement } from "react"

import { createContext, useContext } from "react"

import { IoIosLock } from "react-icons/io";
import { IoIosUnlock } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { ImCheckmark } from "react-icons/im";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";

type IconsContextType = {
    IoIosLock: IconType,
    IoIosUnlock: IconType,
    IoClose: IconType,
    ImCheckmark: IconType,
    AiOutlineLoading3Quarters: IconType,
    FaEdit: IconType,
    FaSun: IconType,
    FaMoon: IconType,
}

const IconsContext = createContext<IconsContextType | null>(null)

export const useIconsContext = () => {
    const iconsContext = useContext(IconsContext);
    if(!iconsContext)
        throw Error("Cannot be used outside a provider.")
    else return iconsContext
}

type IconProviderProps = {
    children: ReactElement[] | ReactElement
}

const IconsProvider = ({
    children
}:IconProviderProps) => {
    return <IconsContext.Provider
        value={{
            IoIosLock,
            IoIosUnlock,
            IoClose,
            ImCheckmark,
            AiOutlineLoading3Quarters,
            FaEdit,
            FaSun,
            FaMoon,
        }}
    >
        {children}
    </IconsContext.Provider>
}

export default IconsProvider
