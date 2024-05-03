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
import { IoIosSad } from "react-icons/io";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaTrashCan } from "react-icons/fa6";
import { MdReportProblem } from "react-icons/md";

type IconsContextType = {
    IoIosLock: IconType,
    IoIosUnlock: IconType,
    IoClose: IconType,
    ImCheckmark: IconType,
    AiOutlineLoading3Quarters: IconType,
    FaEdit: IconType,
    FaSun: IconType,
    FaMoon: IconType,
    IoIosSad: IconType,
    HiOutlineDotsHorizontal: IconType,
    FaTrashCan: IconType,
    MdReportProblem: IconType,
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
            IoIosSad,
            HiOutlineDotsHorizontal,
            FaTrashCan,
            MdReportProblem,
        }}
    >
        {children}
    </IconsContext.Provider>
}

export default IconsProvider
