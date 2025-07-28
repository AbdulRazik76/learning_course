import { useContext } from "react";
import { Themecontext } from "../../context/themeContext";


const Demo = () => {

const {dark,toggleTheme,themestyles} = useContext(Themecontext);


return(
    <div style={themestyles}>
   

   <h1>{dark ? "Dark Mode":"Light mode"}</h1>

   <button onClick={toggleTheme}> Click Now</button>
    </div>
)

}

export default Demo;