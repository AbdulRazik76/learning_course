import { LockClosedIcon } from "@heroicons/react/16/solid";
import { FileWarning, Lock, Mail, User, User2, User2Icon, Eye, EyeOff, EyeClosed } from "lucide-react";
import { useState } from "react";
import { CgPassword } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function Login() {
    const navigate = useNavigate()
    const [login, setLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [signupData, setSignupData] = useState({ name: "", email: "", password: "", role: "student" })
    const [error, setError] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showSignupPassword, setShowSignupPassword] = useState(false)

    const {setUser} =useContext(UserContext)

    const handleChange = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value })
    }

    const handlesignup = async (a) => {
        a.preventDefault();
        if (!signupData.name || !signupData.email || !signupData.password) {
            return alert("Fill all mandatory fields")
        }
        try {
            await axios.post('http://localhost:5000/api/auth/register-user', signupData)
            alert("Successfully registered");
            setLogin(true)
        }
        catch (err) {
            alert("Something went wrong")
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!signupData.email || !signupData.password) return alert("Fill all mandatory fields")
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login-user', signupData)
            localStorage.setItem("token", res.data.token)
            console.log("ress", res.data.userDetails.role);

            if (res.data.userDetails.role === "admin") return navigate("/admin/dashboard")
            navigate("/home")
        }
        catch (err) {
            setError(true)
            console.error("Error : ", err.message)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100" >
            {
                login ?
                    <form className="bg-white pb-8 pt-8  w-full md:w-1/4 m-4 lg:w-1/4  rounded-2xl shadow-xl " >
                        <div className="flex flex-col justify-center items-center   ">
                            <div className="flex justify-center items-center">
                                <h1 className="font-bold text-3xl tracking-widest" >Login</h1>
                            </div>
                            <div className="w-full flex justify-center items-center ">
                                <User2 className="text-gray-500" />
                                <input type="text"
                                    name="email"
                                    value={signupData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Username" className="h-14 w-3/4 bg-transparent border-b-2 border-gray-300  pl-2 focus:outline-none" />
                            </div>
                            <div className="w-full flex justify-center items-center mt-8 relative">
                                <Lock className="text-gray-500" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={signupData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Password" 
                                    className="bg-transparent border-b-2 border-gray-300 h-14 w-3/4 pl-2 focus:outline-none" 
                                />
                                <button 
                                    type="button"
                                    className="absolute right-10 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                            <div className="w-full flex justify-center items-center  mt-12 text-white " >
                                <button className="h-12 w-3/4 bg-black rounded-sm font-medium cursor-pointer"
                                    onClick={handleLogin} >
                                    Login
                                </button>
                            </div>
                            <div className="flex mt-2">
                                <h1 className="" >New User ? </h1>
                                <button className="ml-2 font-semibold cursor-pointer hover:text-gray-800"
                                    onClick={() => setLogin(false)}>Signup</button>
                            </div>
                        </div>
                        {error &&
                            <div className="mt-3 rounded-sm ">
                                <p className="text-center text-red-800 font-bold">
                                    <span></span>
                                    Invalid Credentials</p>
                            </div>}
                    </form>
                    :
                    <div className="bg-white py-10 w-full md:w-1/4 m-4 lg:w-1/4  rounded-2xl shadow-xl " >
                        <form className="flex flex-col justify-center items-center  mt-8 ">
                            <div className="flex justify-center items-center">
                                <h1 className="font-bold text-3xl tracking-widest" >Sign  up</h1>
                            </div>
                            <div className="w-full flex justify-center items-center ">
                                <User2 className="text-gray-500" />
                                <input type="text"
                                    placeholder="Username" name="name"
                                    onChange={handleChange}
                                    className="h-14 w-3/4 bg-transparent border-b-2 border-gray-300  pl-2 focus:outline-none" />
                            </div>
                            <div className="w-full flex justify-center items-center mt-6 ">
                                <Mail className="text-gray-500 " />
                                <input type="text" onChange={handleChange}
                                    placeholder="Mail" name="email" className="h-14 w-3/4 bg-transparent border-b-2 border-gray-300  pl-2 focus:outline-none" />
                            </div>
                            <div className="w-full flex justify-center items-center mt-6 relative">
                                <Lock className="text-gray-500" />
                                <input 
                                    type={showSignupPassword ? "text" : "password"}
                                    placeholder="Create Password" 
                                    onChange={handleChange} 
                                    name="password" 
                                    className="bg-transparent border-b-2 border-gray-300 h-14 w-3/4 pl-2 focus:outline-none" 
                                />
                                <button 
                                    type="button"
                                    className="absolute right-10 text-gray-500"
                                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                                >
                                    {showSignupPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                            <div className="w-full flex justify-center items-center  mt-12 text-white " >
                                <button className="h-12 w-3/4 bg-black rounded-sm font-medium cursor-pointer"
                                    onClick={handlesignup}  >
                                    Sign Up
                                </button>
                            </div>
                            <div className="flex mt-2">
                                <h1 className="" >Existing User ? </h1>
                                <button className="ml-2 font-semibold cursor-pointer hover:text-gray-800" onClick={() => setLogin(true)} > Login</button>
                            </div>
                        </form>
                    </div>
            }
        </div>
    )
}