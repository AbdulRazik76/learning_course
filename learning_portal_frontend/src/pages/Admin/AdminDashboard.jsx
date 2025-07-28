import { useContext, useEffect, useState } from "react";
import { Themecontext } from "../../context/themeContext";
import axios from "axios";
import StatsCard from "../../components/dashboard/StatsCard";
import CourseTableComponent from "../../components/dashboard/CourseTable";

export default function AdminDashboard() {
  // Fake data for the dashboard
  const { dark, toggleTheme, themestyles } = useContext(Themecontext);
  const [stats,setStats] = useState([
    { name: 'Total Courses', value:0, change: '', changeType: '' },
    { name: 'Total Students', value: '2,843', change: '', changeType: '' },
    { name: 'Total Payments', value: '$24,589', change: '+8.2%', changeType: 'positive' },
    { name: 'Pending Approvals', value: '23', change: '-3%', changeType: 'negative' },
  ])
  


  const [recentCourses,setRecentCourses] = useState([]) 

  const recentPayments = [
    { id: '#INV-001', student: 'Alex Johnson', amount: '$149', date: '2023-05-15', status: 'completed' },
    { id: '#INV-002', student: 'Maria Garcia', amount: '$199', date: '2023-05-14', status: 'completed' },
    { id: '#INV-003', student: 'James Wilson', amount: '$99', date: '2023-05-13', status: 'pending' },
    { id: '#INV-004', student: 'Sarah Lee', amount: '$249', date: '2023-05-12', status: 'completed' },
  ];

  




  return (
    <div className={`p-6 min-h-screen ${dark ? 'bg-gray-900' : 'bg-gray-100'}`} style={themestyles}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Admin Dashboard</h1>
        {/* <button 
          onClick={toggleTheme}
          className={`px-4 py-2 rounded-md ${dark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button> */}
      </div>
      
      {/* Stats Cards */}
    <StatsCard stats={stats} setStats={setStats} dark={dark} setRecentCourses={setRecentCourses}/>

      {/* Recent Courses */}
   <CourseTableComponent recentCourses={recentCourses} dark={dark} />

      {/* Recent Payments */}
      <div className={`rounded-lg shadow p-6 ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>Recent Payments</h2>
          <button className={`text-sm font-medium ${dark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-500'}`}>Invoice</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-500'}`}>Student</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-500'}`}>Amount</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-500'}`}>Date</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {recentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{payment.id}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${dark ? 'text-gray-300' : 'text-gray-500'}`}>{payment.student}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${dark ? 'text-gray-300' : 'text-gray-500'}`}>{payment.amount}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${dark ? 'text-gray-300' : 'text-gray-500'}`}>{payment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${payment.status === 'completed' 
                        ? (dark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') 
                        : (dark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800')}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}