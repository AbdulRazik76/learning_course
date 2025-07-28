import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiUpload, FiX } from 'react-icons/fi';
import axios from 'axios';

export default function CreateCourse() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    category: "",
    price: "",
    duration: "",
    level: "Beginner",
    status: true,
    description: "",
  });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoTitles, setVideoTitles] = useState(['']);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [isEditingLoading, setIsEditingLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/category/get-category');
        setCategories(res.data.category_get);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (isModalOpen) {
      fetchCategories();
    }
  }, [isModalOpen]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/course/get-course');
      if (response.data.getCourse) {
        setCourses(response.data.getCourse);
        setFilteredCourses(response.data.getCourse);
      }
    } catch (err) {
      alert("Error while fetching courses");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.name.toLowerCase().includes(term.toLowerCase()) ||
        (course.category && course.category.category_name && course.category.category_name.toLowerCase().includes(term.toLowerCase())) ||
        course.description.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/course/update-status/${id}`, {
        status: !currentStatus
      });
      if (response.data.success) {
        fetchCourse();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCourse((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3 - images.length);
    const previews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleVideoUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedVideos = [...videos];
      updatedVideos[index] = file;
      setVideos(updatedVideos);
    }
  };

  const addVideoField = () => {
    if (videos.length < 5) {
      setVideoTitles([...videoTitles, '']);
    }
  };

  const removeVideoField = (index) => {
    const updatedTitles = [...videoTitles];
    const updatedVideos = [...videos];
    
    updatedTitles.splice(index, 1);
    updatedVideos.splice(index, 1);
    
    setVideoTitles(updatedTitles);
    setVideos(updatedVideos);
  };

  const handleVideoTitleChange = (index, value) => {
    const updatedTitles = [...videoTitles];
    updatedTitles[index] = value;
    setVideoTitles(updatedTitles);
  };

  const handleEdit = async (courseId) => {
    setIsEditingLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/course/get-course`,{
        courseId
      });
      const course = response.data.getCourse;
      
      setEditingCourseId(courseId);
      setIsEditMode(true);
      setIsModalOpen(true);
      
      setNewCourse({
        name: course.name,
        category: course.category._id,
        price: course.price,
        duration: course.duration,
        level: course.level,
        status: course.status,
        description: course.description
      });

      if (course.images && course.images.length > 0) {
        const previews = course.images.map(image => ({
          name: image.split('/').pop(),
          url: `http://localhost:5000${image}`
        }));
        setImagePreviews(previews);
      } else {
        setImagePreviews([]);
      }

      if (course.videos && course.videos.length > 0) {
        setVideoTitles(course.videos.map(video => {
          try {
            if (typeof video.title === 'string') {
              const parsed = JSON.parse(video.title);
              return Array.isArray(parsed) ? parsed.join(" - ") : video.title;
            }
            return video.title;
          } catch {
            return video.title;
          }
        }));
      } else {
        setVideoTitles(['']);
      }

    } catch (err) {
      console.error("Error fetching course for edit:", err);
      alert("Failed to load course for editing");
    } finally {
      setIsEditingLoading(false);
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingCourseId(null);
    setNewCourse({
      name: "",
      category: "",
      price: "",
      duration: "",
      level: "Beginner",
      status: true,
      description: ""
    });
    setImages([]);
    setImagePreviews([]);
    setVideos([]);
    setVideoTitles(['']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newCourse.name);
    formData.append('category', newCourse.category);
    formData.append('price', newCourse.price);
    formData.append('duration', newCourse.duration);
    formData.append('level', newCourse.level);
    formData.append('status', newCourse.status);
    formData.append('description', newCourse.description);

    images.forEach((image) => {
      formData.append('images', image);
    });

    videos.forEach((video) => {
      if (video) {
        formData.append('videos', video);
      }
    });

    formData.append('videoTitles', JSON.stringify(videoTitles));

    try {
      let response;
      if (isEditMode) {
        response = await axios.put(
          `http://localhost:5000/api/course/update-course/${editingCourseId}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        response = await axios.post(
          'http://localhost:5000/api/course/create-course',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }

      alert(response.data.message);
      resetForm();
      fetchCourse();
    } catch (err) {
      let errorMessage = "Operation failed";
      if (err.response) {
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 413) {
          errorMessage = "File size too large. Please upload smaller files.";
        }
      }
      alert(errorMessage);
      console.error("Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/course/delete-course/${id}`);
        if (response) {
          alert("Deleted successfully");
          fetchCourse();
        }
      } catch (err) {
        alert("Error " + err);
        console.log("Error ", err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiPlus className="mr-2" /> Add Course
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses by name, category or description..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <tr key={course._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.category?.category_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={course.status}
                        onChange={() => toggleStatus(course._id, course.status)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-sm font-medium">
                        {course.status ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(course._id)} 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      disabled={isEditingLoading}
                    >
                      {isEditingLoading ? 'Loading...' : <FiEdit />}
                    </button>
                    <button onClick={() => handleDelete(course._id)} className="text-red-600 hover:text-red-900">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  No courses found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? 'Edit Course' : 'Add New Course'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Course Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={newCourse.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter course name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Category*</label>
                  <select
                    name="category"
                    value={newCourse.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Price ($)*</label>
                  <input
                    type="number"
                    name="price"
                    value={newCourse.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Duration*</label>
                  <input
                    type="text"
                    name="duration"
                    value={newCourse.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. 8 weeks"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Level*</label>
                  <select
                    name="level"
                    value={newCourse.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="status"
                      checked={newCourse.status}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-2 text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Description*</label>
                <textarea
                  name="description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter course description"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Course Images (Max 3)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-24 h-24">
                        <img
                          src={preview.url}
                          alt={preview.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {imagePreviews.length < 3 && (
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (Max 5MB each)</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={imagePreviews.length >= 3}
                      />
                    </label>
                  )}
                </div>
                {imagePreviews.length >= 3 && (
                  <p className="mt-2 text-sm text-gray-500">Maximum 3 images reached</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Course Videos (Max 5)</label>
                <div className="space-y-4">
                  {videoTitles.map((title, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => handleVideoTitleChange(index, e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder={`Video ${index + 1} title`}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md">
                          <FiUpload className="inline mr-1" />
                          Upload
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleVideoUpload(e, index)}
                            className="hidden"
                          />
                        </label>
                        {videos[index] && (
                          <span className="text-sm text-gray-600 truncate max-w-xs">
                            {videos[index].name}
                          </span>
                        )}
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeVideoField(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {videoTitles.length < 5 && (
                    <button
                      type="button"
                      onClick={addVideoField}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <FiPlus className="mr-1" /> Add another video
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={
                    !newCourse.name ||
                    !newCourse.category ||
                    !newCourse.price ||
                    !newCourse.duration ||
                    !newCourse.description
                  }
                >
                  {isEditMode ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}