import { BrowserRouter, Routes,Route } from "react-router-dom";
import Home from "../pages/User/home";



export default function UserRoutes(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/user/home" element={<Home/>} />
            <Route path="/user/home" element={<Home/>} />
        </Routes>
        </BrowserRouter>
    )
}