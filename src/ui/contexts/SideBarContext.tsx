import React, { useState, createContext, useContext } from 'react';

type Props = {
    children: React.ReactNode;
}

type DataSideBar = {
    isOpen: boolean,
    currentPage: string
}

type SideBarContex = {
    sideBarData: DataSideBar,
    setSideBarData: React.Dispatch<React.SetStateAction<DataSideBar>>
}

export const SideBarContext = createContext<SideBarContex | null>(null)


const initialContextData = {
    isOpen: false,
    currentPage: 'agenda'
}

export const SideBarContextProvider = ({children}: Props) =>{
    const [sideBarData, setSideBarData] = useState<DataSideBar>(initialContextData)
    
    return (
        <SideBarContext.Provider value={{sideBarData, setSideBarData}}>
            {children}
        </SideBarContext.Provider>
    )

}

export function useSideBarContext() {
    const context = useContext(SideBarContext);
    if (!context){
        throw new Error(
            "useSideBarContext must be used within a SideBarContextProvider"
        )
    }
    return context
}