import { createContext, useState } from "react";

export const UserContext = createContext();

export default function  UserProvider({children}){
    const [user,setUser] =useState({})

    console.log("user context",user);
    
    return(
        <UserContext.Provider value={{user,setUser}} >
             {children}
        </UserContext.Provider>
    )
}
