import { useState } from "react"
import { Themecontext } from "./themeContext";


const  ThemeProvider = ({children})=>{
    const [dark,setDark] = useState(false)
   
    const toggleTheme = ()=>setDark(curr => !curr);

    const themestyles = {
        backgroundColor:dark?"#111":"#fff",
        color:dark?"#fff":"#111",
    }

return(

    <Themecontext.Provider value={{dark,setDark,toggleTheme,themestyles}}>
    
      {children}


    </Themecontext.Provider>
)


}


export default ThemeProvider;