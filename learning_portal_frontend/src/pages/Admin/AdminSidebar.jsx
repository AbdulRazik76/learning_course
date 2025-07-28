import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderPlus,
  BookPlus,
  CreditCard,
  UserPlus,
  LogOut
} from 'lucide-react';

const AdminSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    {
      name: 'Admin Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/admin/dashboard'
    },
    {
      name: 'Create Category',
      icon: <FolderPlus className="h-5 w-5" />,
      path: '/admin/create-category'
    },
    {
      name: 'Create Course',
      icon: <BookPlus className="h-5 w-5" />,
      path: '/admin/create-course'
    },
    {
      name: 'Payments',
      icon: <CreditCard className="h-5 w-5" />,
      path: '/admin/payments'
    },
    {
      name: 'Add Employee',
      icon: <UserPlus className="h-5 w-5" />,
      path: '/admin/add-employee'
    },
    {
      name: 'Logout',
      icon: <LogOut className="h-5 w-5" />,
      path: '/admin/logout'
    }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`bg-black text-white h-screen fixed transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {isSidebarOpen && (
          <h1 className="text-xl font-bold">Admin Panel</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-lg bg-gray-700 hover:bg-gray-600"
        >
          {isSidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-white text-black'
                    : 'hover:bg-gray-700'
                } ${!isSidebarOpen ? 'justify-center' : ''}`}
              >
                <span className="mr-3">{item.icon}</span>
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;