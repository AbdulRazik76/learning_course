import NavBar from './navbar'
import HeroSection from './heroSection'
import ProductsList from './productsList'
import Footer from './footer'
import Login from '../login'
import PlacementPartners from './placementPartners'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useContext } from "react";
import { UserContext } from '../../context/userContext'

export default function Home() {
const navigate = useNavigate();
    const [message,setMessage]=useState("");
    // const [user,setUser]=useState({});
    const [token,setToken]=useState("");

        const {user,setUser} =useContext(UserContext)




useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        axios.get("http://localhost:5000/api/auth/dashboard", {
            headers: { Authorization: storedToken },
        })
        .then((res) => {
            setUser(res.data.user);
            setMessage(res.data.message);

            // Optional: Sync latest user back to localStorage
            localStorage.setItem("user", JSON.stringify(res.data.user));
        })
        .catch((err) => {
            console.log("Token invalid or expired:", err.message);
            setMessage("Unauthorized");
            setToken(null);
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
        });
    } else {
        navigate("/"); // No token at all
    }
}, []);



  const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        //navigate("/login");
    };






    return (
        <div>
            <NavBar token={token} handleLogout={handleLogout}   message={message} /> 
            <HeroSection />
            <ProductsList user={user} token={token}  message={message}  />
            <PlacementPartners />
            <Footer />
        </div>
    )
}