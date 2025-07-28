import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu as MenuIcon, UserCircle, LogOut, Settings, ShoppingCart, BookOpen } from "lucide-react";
import { UserContext } from "../../context/userContext";
import axios from "axios";

export default function Navbar({ token, handleLogout }) {
    const [userProfileOpen, setUserProfileOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    const navOptions = ["home", "courses", "about", "contact"];
    const { user } = useContext(UserContext);

    // Fetch cart count when component mounts or when token changes
    useEffect(() => {
        if (token) {
            // Replace this with your actual API call to get cart count
            fetchCartCount();
        } else {
            setCartCount(0);
        }
    }, [token]);

    const fetchCartCount = async () => {

        const user_id = user._id
        try {
            const response = await axios.get(`http://localhost:5000/api/cart/cart-count/${user_id}`);
         
            setCartCount(response.data.cartCount);
 
        } catch (error) {
            console.error("Error fetching cart count:", error);
        }
    };

    const handleProfileClick = () => {
        setUserProfileOpen(!userProfileOpen);
    };

    return (
        <div className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-12 items-center py-4">
                    {/* Logo - Replaced with stylish text logo */}
                    <div className="col-span-6 sm:col-span-3">
                        <div 
                            className="text-2xl font-bold cursor-pointer"
                            onClick={() => navigate("/")}
                        >
                            <span className="text-blue-600">Edu</span>
                            <span className="text-black">Hub</span>
                            <span className="text-xs font-normal text-gray-500 block">Learn Without Limits</span>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <div className="hidden xl:flex col-span-6 justify-center space-x-10 text-black font-medium">
                        {navOptions.map((item, index) => (
                            <span
                                key={index}
                                className="cursor-pointer hover:text-gray-600 transition"
                            >
                                {item.toUpperCase()}
                            </span>
                        ))}
                    </div>

                    {/* Desktop User Profile / Login */}
                    <div className="hidden xl:flex col-span-3 justify-end items-center space-x-4">
                        {token ? (
                            <>
                                <div className="flex items-center space-x-4">
                                    <BookOpen 
                                        size={24} 
                                        className="cursor-pointer hover:text-gray-700" 
                                        onClick={() => navigate("/my-courses")}
                                        title="My Courses"
                                    />
                                    <div className="relative">
                                        <ShoppingCart 
                                            size={24} 
                                            className="cursor-pointer hover:text-gray-700" 
                                            onClick={() => navigate("/cart")}
                                            title="Cart"
                                        />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <UserCircle
                                            size={30}
                                            className="cursor-pointer hover:text-gray-700"
                                            onClick={handleProfileClick}
                                        />
                                        {userProfileOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                                                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                                    Hello, {user?.name || "User"}
                                                </div>
                                                <a
                                                    href="#"
                                                    className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                                                >
                                                    <Settings size={16} className="mr-2" />
                                                    Settings
                                                </a>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                                >
                                                    <LogOut size={16} className="mr-2" />
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <button
                                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                                onClick={() => navigate("/")}
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Icon */}
                    <div className="flex xl:hidden col-span-6 justify-end">
                        <MenuIcon
                            size={30}
                            className="cursor-pointer"
                            onClick={() => setOpen(!open)}
                        />
                        {/* Mobile cart badge */}
                        {token && cartCount > 0 && (
                            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center xl:hidden">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {open && (
                    <div className="xl:hidden bg-white shadow-lg rounded-md mt-2 z-50">
                        <ul className="text-center space-y-4 py-4 font-medium text-black">
                            {navOptions.map((item, index) => (
                                <li
                                    key={index}
                                    className="hover:bg-gray-100 py-2 cursor-pointer"
                                >
                                    {item.toUpperCase()}
                                </li>
                            ))}
                            {token ? (
                                <>
                                    <li 
                                        className="hover:bg-gray-100 py-2 cursor-pointer"
                                        onClick={() => navigate("/my-courses")}
                                    >
                                        MY COURSES
                                    </li>
                                    <li 
                                        className="hover:bg-gray-100 py-2 cursor-pointer flex items-center justify-center gap-1"
                                        onClick={() => navigate("/cart")}
                                    >
                                        CART {cartCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        )}
                                    </li>
                                    <li className="hover:bg-gray-100 py-2 cursor-pointer">PROFILE</li>
                                    <li
                                        className="hover:bg-gray-100 py-2 cursor-pointer text-red-500"
                                        onClick={handleLogout}
                                    >
                                        LOGOUT
                                    </li>
                                </>
                            ) : (
                                <li
                                    className="bg-black text-white py-2 w-[120px] mx-auto rounded hover:bg-gray-800 cursor-pointer"
                                    onClick={() => navigate("/")}
                                >
                                    LOGIN
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}