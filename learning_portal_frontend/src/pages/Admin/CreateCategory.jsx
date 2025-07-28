import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiEdit, FiTrash, FiTrash2 } from 'react-icons/fi';

export default function CreateCategory() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategory, setNewCategory] = useState({
    name: '',
    status: true
  });
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: '',
    name: '',
    status: true
  });

  // Handle search functionality
  useEffect(() => {
    const results = categories.filter(category =>
      category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(results);
  }, [searchTerm, categories]);

  const handleCreateCategory = async() => {
    try{
      if (newCategory.name.trim() !== '') {
        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        setCategories([...categories, { ...newCategory, id: newId }]);
        
        try {
          await axios.post('http://localhost:5000/api/category/create-category', {
            category_name: newCategory.name,
            status: newCategory.status ? 1 : 0 
          });
          alert("Successfully Inserted");
        } catch (err) {
          alert("Something went wrong");
        }
        
        setNewCategory({ name: '', status: true });
        setShowModal(false);
      }
    } catch(err) {
      console.error("Error : ",err)
    }
  };

  const handleUpdateCategory = async () => {
    try {
      await axios.put(`http://localhost:5000/api/category/update-category/${currentCategory.id}`, {
        category_name: currentCategory.name,
        status: currentCategory.status ? 1 : 0
      });


      
      
      // Update local state
      // setCategories(categories.map(cat => 
      //   cat._id === currentCategory.id ? 
      //   { ...cat, category_name: currentCategory.name, status: currentCategory.status } : 
      //   cat
      // ));
      
      setEditModal(false);
      alert("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category");
    }
  };

  const handleDeleteCategory = (id) => {
    console.log("id",id);
    axios.delete(`http://localhost:5000/api/category/delete-category/${id}`)
      .then(() => {
        setCategories(categories.filter(cat => cat._id !== id));
        alert("Category deleted successfully");
      })
      .catch(err => {
        console.error("Error deleting category:", err);
        alert("Failed to delete category");
      });
  };

  const openEditModal = (category) => {
    setCurrentCategory({
      id: category._id,
      name: category.category_name,
      status: category.status
    });


    setEditModal(true);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/category/get-category');
        console.log(res.data.category_get);
        setCategories(res.data.category_get);
        setFilteredCategories(res.data.category_get);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Course Categories</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Create Category
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl.no</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{i + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.category_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {category.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-900 hover:bg-red-50 px-2 py-1 rounded transition duration-200"
                      >
                      <FiTrash2/>
                      </button>
                      <button 
                        onClick={() => openEditModal(category)}
                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 rounded transition duration-200"
                      >
                        <FiEdit/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Category Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 backdrop-blur flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Create New Category</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Enter category name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-6 flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCategory.status}
                      onChange={(e) => setNewCategory({ ...newCategory, status: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Active Status</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Create Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editModal && (
          <div className="fixed inset-0 z-50 backdrop-blur flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Edit Category</h2>
                  <button
                    onClick={() => setEditModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={currentCategory.name}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                    placeholder="Enter category name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-6 flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentCategory.status}
                      onChange={(e) => setCurrentCategory({ ...currentCategory, status: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Active Status</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Update Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}