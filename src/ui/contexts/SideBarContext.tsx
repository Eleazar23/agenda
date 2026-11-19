import React, { useState, createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
    const location = useLocation()

    useEffect(() => {
        const page = location.pathname.replace(/^\//, '').split('/')[0] || 'agenda'
        setSideBarData((prev) => prev.currentPage === page ? prev : { ...prev, currentPage: page })
    }, [location.pathname])

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