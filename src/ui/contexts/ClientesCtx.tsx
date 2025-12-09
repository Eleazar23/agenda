import React, { useState, createContext, useContext } from 'react';

type Props = {
    children: React.ReactNode;
}

type ClientesData = {
    isEditing?: boolean,
    dataTable?: Array<any>,
}

type ClientesContexType = {
    sideBarData: ClientesData,
    setSideBarData: React.Dispatch<React.SetStateAction<ClientesData>>
}

export const ClientesContext = createContext<ClientesContexType | null>(null)


const initialContextData = {
    isEditing: false,
    dataTable: [],
}

export const ClientexCtxProvider = ({children}: Props) =>{
    const [sideBarData, setSideBarData] = useState<ClientesData>(initialContextData)
    
    return (
        <ClientesContext.Provider value={{sideBarData, setSideBarData}}>
            {children}
        </ClientesContext.Provider>
    )

}

export function useClientesCtx() {
    const context = useContext(ClientesContext);
    if (!context){
        throw new Error(
            "useClientesCtx must be used within a ClientexCtxProvider"
        )
    }
    return context
}