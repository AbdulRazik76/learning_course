import { useState } from "react";
import { createContext } from "react";
import { useContext } from "react";

export const SearchContext = createContext();


export const SearchProvider = ({children}) =>{
    const [searchCourse,setSearchCourse] =useState("");
    return(
        <SearchContext.Provider value={{searchCourse,setSearchCourse}} >
           {children}
        </SearchContext.Provider>
    )
}

export const useSearch = () => useContext(SearchContext);