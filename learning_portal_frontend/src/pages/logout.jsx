import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";

export default function LogoutButton() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    useEffect(()=>{
handleLogout()
    },[])

    const handleLogout = () => {
        localStorage.removeItem("token");  // Clear token
        setUser(null);                     // Clear context
        navigate("/");                     // Redirect to login
    };

   
}
