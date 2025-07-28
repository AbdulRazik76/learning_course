import { Routes, Route, Outlet } from "react-router-dom";
import AdminSidebar from "../pages/Admin/AdminSidebar";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import CreateCategory from "../pages/Admin/CreateCategory";
import CreateCourse from "../pages/Admin/CreateCourse";
import Payments from "../pages/Admin/Payments";
import AddEmployee from "../pages/Admin/AddEmployee";
import TopNav from "../pages/Admin/TopNav";

export default function AdminRoutes() {
  return (
    <div className="flex  min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-64"> {/* Adjust margin to match sidebar width */}
      <TopNav/>

        <Outlet />
      </div>
    </div>
  );
}