import { useState, useRef, useEffect, useContext } from 'react';
import { FiBell, FiUser, FiChevronDown, FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { Themecontext } from '../../context/themeContext';
import { Sun, Sunrise } from 'lucide-react';
import { BsFillCloudSunFill } from 'react-icons/bs';

export default function TopNav() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {dark,setDark,toggleTheme} =useContext(Themecontext)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown only when clicking the chevron icon
  const handleChevronClick = (e) => {
    e.stopPropagation();
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className={`shadow-sm w-full h-16 flex items-center px-4 md:px-6 justify-between sticky top-0 z-50
    ${dark ? 'bg-black':'bg-white'}`}>
      {/* Left section - Mobile menu button (for sidebar toggle) */}
      <div className="flex items-center">
        <button className="md:hidden text-gray-600 hover:text-gray-900 mr-4">
          <FiMenu size={24} />
        </button>
      </div>

      {/* Right section - Notifications and profile */}
      <div className="flex items-center space-x-4">
        {/* Notification button */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
          <FiBell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
         { dark ?  <FiMoon size={20} onClick={toggleTheme} className='cursor-pointer' /> : 
         <FiSun size={20} onClick={toggleTheme} className='cursor-pointer' />  }
        </button>

        
        
        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <FiUser size={16} />
            </div>
            <span className="hidden md:inline-block font-medium text-sm">Admin</span>
            <button 
              onClick={handleChevronClick}
              className="focus:outline-none"
            >
              <FiChevronDown className={`transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`} />
            </button>
          </div>


          
          {/* Dropdown menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <a 
                href="#" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileOpen(false)}
              >
                Your Profile
              </a>
              <a 
                href="#" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileOpen(false)}
              >
                Settings
              </a>
              <a 
                href="#" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileOpen(false)}
              >
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}