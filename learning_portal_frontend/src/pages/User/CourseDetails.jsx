import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlay, FaRegClock, FaStar, FaChevronLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CourseDetails = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(0);
  const [progress, setProgress] = useState({});

  const courseId = localStorage.getItem('course_id');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`http://localhost:5000/api/course/get-course`, {
          courseId
        });

        console.log("details", response.data.getCourse);
        
        setCourse(response.data.getCourse);
        
        // Initialize progress
        const initialProgress = {};
        if (response.data.getCourse.videos) {
          response.data.getCourse.videos.forEach((_, index) => {
            initialProgress[index] = false;
          });
        }
        setProgress(initialProgress);
      } catch (error) {
        toast.error('Failed to load course details');
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const markAsComplete = (videoIndex) => {
    setProgress(prev => ({
      ...prev,
      [videoIndex]: !prev[videoIndex]
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Parse video titles from JSON string if needed
  const parseVideoTitle = (title) => {
    try {
      if (typeof title === 'string') {
        const parsed = JSON.parse(title);
        return Array.isArray(parsed) ? parsed.join(" - ") : title;
      }
      return title;
    } catch {
      return title;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Video Player */}
          <div className="lg:w-2/3">
            <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6">
              {course.videos && course.videos[activeVideo] ? (
                <div className="w-full h-full flex items-center justify-center">
                  <video 
                    controls
                    className="w-full h-full"
                    poster={course.images[0] ? `http://localhost:5000${course.images[0]}` : undefined}
                  >
                    <source src={`http://localhost:5000${course.videos[activeVideo].url}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                  <p>No video available</p>
                </div>
              )}
            </div>

            {/* Current Video Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-2">
                {course.videos && course.videos[activeVideo] ? 
                  parseVideoTitle(course.videos[activeVideo].title) : 
                  'Video Title'}
              </h2>
              <div className="flex items-center text-gray-600 mb-4">
                <FaRegClock className="mr-1" />
                <span className="text-sm">
                  {course.duration || '00:00'}
                </span>
              </div>
              <p className="text-gray-700">
                {course.description || 'No description available'}
              </p>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">About This Course</h2>
              <p className="text-gray-700 mb-4">{course.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-gray-600">Duration</h3>
                  <p>{course.duration}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Level</h3>
                  <p>{course.level}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Price</h3>
                  <p>${course.price}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Status</h3>
                  <p>{course.status ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Course Curriculum */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-bold text-lg">Course Content</h2>
                <p className="text-sm text-gray-600">
                  {course.videos?.length || 0} videos
                </p>
              </div>
              
              <div className="divide-y">
                {course.videos?.map((video, index) => (
                  <div 
                    key={index}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${activeVideo === index ? 'bg-blue-50' : ''}`}
                    onClick={() => setActiveVideo(index)}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 pt-1">
                        {progress[index] ? (
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <FaPlay className="text-gray-400 text-xs" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{parseVideoTitle(video.title)}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FaRegClock className="mr-1" />
                          <span>00:00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {course.videos && course.videos.length > 0 && (
                <div className="p-4 border-t">
                  <button
                    onClick={() => markAsComplete(activeVideo)}
                    className={`w-full py-2 px-4 rounded-md ${progress[activeVideo] ? 'bg-green-100 text-green-800' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {progress[activeVideo] ? 'Completed' : 'Mark as Complete'}
                  </button>
                </div>
              )}
            </div>

            {/* Course Images */}
            {course.images && course.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm mt-6 overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-bold text-lg">Course Images</h2>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  {course.images.map((image, index) => (
                    <div key={index} className="rounded-md overflow-hidden">
                      <img 
                        src={`http://localhost:5000${image}`} 
                        alt={`Course preview ${index + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;