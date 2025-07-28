import { useState } from 'react';
import axios from "axios"
import { useEffect } from 'react';
import { FiEdit, FiTrash, FiTrash2 } from 'react-icons/fi';

export default function AddEmployee() {
  // Dummy employee data


  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for the form
const [newEmployee, setNewEmployee] = useState({
  name: '',
  email: '',
  phone: '',
  designation: '',
  profilePhoto: null,
  skills: []
});

const [skillInput, setSkillInput] = useState('');
const [errors, setErrors] = useState({});

useEffect(()=>{
fetchEmployee()

},[])


const fetchEmployee = async () =>{

  try{
   const response = await axios.get('http://localhost:5000/api/employee/get-employee')
    if(response.data.fetchEmployee){
       setEmployees(response.data.fetchEmployee)
    }
  }

  catch(err){

    console.log("Error : " ,err);
    
  }
}
// Handlers for skills
const addSkill = () => {
  if (skillInput.trim() && !newEmployee.skills.includes(skillInput.trim())) {
    setNewEmployee({
      ...newEmployee,
      skills: [...newEmployee.skills, skillInput.trim()]
    });
    setSkillInput('');
  }
};

const removeSkill = (index) => {
  const updatedSkills = [...newEmployee.skills];
  updatedSkills.splice(index, 1);
  setNewEmployee({
    ...newEmployee,
    skills: updatedSkills
  });
};

// Handler for file upload
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setNewEmployee({
      ...newEmployee,
      profilePhoto: file
    });
  }
};





  // Departments for dropdown
  const departments = [
    'Engineering',
    'Marketing',
    'HR',
    'Finance',
    'Operations',
    'Sales',
    'Design'
  ];

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input change for new employee form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!newEmployee.name.trim()) newErrors.name = 'Name is required';
    if (!newEmployee.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!newEmployee.department) newErrors.department = 'Department is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const formData = new FormData();
  formData.append('name', newEmployee.name);
  formData.append('phone', newEmployee.phone);
  formData.append('email', newEmployee.email);
  formData.append('designation', newEmployee.designation);

  if (newEmployee.profilePhoto) {
    formData.append('profilePhoto', newEmployee.profilePhoto);
  }

  newEmployee.skills.forEach((skill, index) => {
  formData.append(`skills[${index}]`, skill);
});

  // Debug formData
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  try {
    const response = await axios.post(
      'http://localhost:5000/api/employee/insert-employee',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    setIsModalOpen(false);
    fetchEmployee();
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      designation: '',
      profilePhoto: null,
      skills: []
    });
    setErrors({});
  } catch (err) {
    console.error("Error", err);
    alert("Failed to add employee");
  }
};


  // Delete employee
  const handleDelete = async(id) => {
    
    try{
      const response = await axios.delete(`http://localhost:5000/api/employee/delete-employee/${id}`)
       alert("Deleted successfully")
       fetchEmployee()

    }
    catch(err){
     console.log("Error : ",err);
     
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Employee Management</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Add Employee
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sl.no
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Designation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skills
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee,index) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index+1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {employee.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.email}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.designation}
                  </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.skills}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3"><FiEdit/></button>
                    <button 
                      onClick={() => handleDelete(employee._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      
                      <FiTrash2/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No employees found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
    {isModalOpen && (
  <div className="fixed inset-0 z-50 backdrop-blur flex items-center justify-center p-4">
    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div className="flex justify-between items-start p-4 border-b">
        <h3 className="text-xl font-semibold text-gray-900">Add New Employee</h3>
        <button 
          onClick={() => {
            setIsModalOpen(false);
            setErrors({});
          }}
          className="text-gray-400 hover:text-gray-500"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newEmployee.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter full name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={newEmployee.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter email address"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Phone Field */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={newEmployee.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter phone number"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        {/* Designation Field */}
        <div className="mb-4">
          <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
            Designation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={newEmployee.designation}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.designation ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter designation"
          />
          {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
        </div>

        {/* Profile Photo Upload */}
        <div className="mb-4">
          <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 mb-1">
            Profile Photo
          </label>
          <input
  type="file"
  id="profilePhoto"
  name="profilePhoto"
  onChange={handleFileChange}  // ✅ use this
  className="w-full px-3 py-2 border border-gray-300 rounded-md"
  accept="image/*"
/>

        </div>

        {/* Skills Field */}
        <div className="mb-6">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Skills (comma separated)
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={newEmployee.skills.join(', ')}
            onChange={(e) => handleInputChange({
              target: {
                name: 'skills',
                value: e.target.value.split(',').map(skill => skill.trim())
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., JavaScript, React, Node.js"
          />
        </div>
        
        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
              setErrors({});
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}