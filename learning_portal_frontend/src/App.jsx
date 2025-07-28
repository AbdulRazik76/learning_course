import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Login from './pages/login'
import Home from './pages/User/home'
import AdminRoutes from './routes/AdminRoutes'

import AdminSidebar from "./pages/Admin/AdminSidebar";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateCourse from "./pages/Admin/CreateCourse";
import Payments from "./pages/Admin/Payments";
import AddEmployee from "./pages/Admin/AddEmployee";

import ThemeProvider from './context/ThemeProvider'
import Demo from './pages/User/demo'
import { LogOut } from 'lucide-react'
import UserCart from './pages/User/UserCart'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CourseDetails from './pages/User/CourseDetails'



function App() {
  const [login, setLogin] = useState(true);


  return (
    <>
      <div >

        
        {/* Commented routes and router example  */}
        <ToastContainer />
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/home' element={<Home />} />
              <Route path='/cart' element={<UserCart />} />
              <Route path="/course" element={<CourseDetails />} />
              <Route path='/admin' element={<AdminRoutes />}>
                <Route path='dashboard' element={<AdminDashboard />} />
                <Route path='create-category' element={<CreateCategory />} />
                <Route path='create-course' element={<CreateCourse />} />
                <Route path='payments' element={<Payments />} />
                <Route path='add-employee' element={<AddEmployee />} />
                <Route path='logout' element={<LogOut />} />
                <Route path='demo' element={<Demo />} />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
       
      </div>
    </>
  );
}

export default App;




// import React, { useState, useMemo, useCallback, useEffect } from 'react';


// function App() {

//   const [login, setLogin] = useState(true);
//   const [number, setNumber] = useState(0);
//   const [dark, setDark] = useState(false);

//   const [names,setNames]=useState([{name:"ram",phoneNumber:"9360226476",email:"abc@gmail.com",status:0},
//     {name:"rajesh",phoneNumber:"9360226476",email:"abc@gmail.com",status:1},
//     {name:"bala",phoneNumber:"9360226476",email:"abc@gmail.com",status:0},
//   ])
//   const [search,setSearch]=useState("")
//   const [filtered,setfiltered]=useState([])



//    useEffect(()=>{
//     filter()
//    },[search])

// // const data = useMemo(filter(),[search])



// // const data =  useMemo(()=>{
// // filter()
// // },[search])


// function filter() {
//     const newSearch = names.filter(n => n.name.toLowerCase().includes(search.toLowerCase()));
//     setfiltered(newSearch);
//     return newSearch
//   }
  


//   // filtered.map(()=>{

//   // })

//   return (
//     <>
//       <div className=' '>

//         <input placeholder='search a name' value={search} onChange={(e)=>setSearch(e.target.value)} />


// <table className="table-auto w-full  border border-gray-300">
//   <thead>
//     <tr className="bg-gray-200">
//       <th className="border px-4 py-2">Sl.No</th>
//       <th className="border px-4 py-2">Name</th>
//       <th className="border px-4 py-2">Phone Number</th>
//       <th className="border px-4 py-2">Email</th>
//       <th className="border px-4 py-2">Status</th>
//     </tr>
//   </thead>
//   <tbody>
//     {filtered.map((item, index) => (
//       <tr key={index}>
//         <td className="border px-4 py-2">{index + 1}</td>
//         <td className="border px-4 py-2">{item.name}</td>
//         <td className="border px-4 py-2">{item.phoneNumber}</td>
//         <td className="border px-4 py-2">{item.email}</td>
//         <td className="border px-4 py-2">
//           {item.status === 0 ? "Active" : "Inactive"}
//         </td>
//       </tr>
//     ))}
//   </tbody>
// </table>



        
//       </div>
//     </>
//   );
// }

// export default App;



