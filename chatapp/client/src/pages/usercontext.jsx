import { createContext, useState } from "react";
export const UserContext=createContext({});
export function Context( {children } ){
    const [username,setusername ]=useState('');
    const [id,setid ]=useState('');
    
    return(<>
    <UserContext.Provider value={{username,setusername,id,setid}} >
        {children }
    </UserContext.Provider >
    </>)
}