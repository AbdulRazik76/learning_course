import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaCheckCircle, FaChevronLeft, FaChevronRight, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCreditCard, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";

export default function ProductsList({ user }) {
  const [courses, setCourses] = useState([]);
  const [currentIndices, setCurrentIndices] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("processing");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [filteredCourses,setFilteredCourses]=useState([])
  const intervalRefs = useRef({});
  const navigate = useNavigate();
  const {searchCourse,setSearchCourse} =useSearch();

  useEffect(() => {
    fetchCourse();
    return () => {
      Object.values(intervalRefs.current).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, [user?._id]);

  useEffect(()=>{
     const newCourses = courses.filter((item)=>
     item.name.toLowerCase().includes(searchCourse.toLowerCase()) 
     )
     setFilteredCourses(newCourses)
  },[searchCourse])

 const fetchCourse = async () => {
  try {
    // Reset state before fetching
    setCourses([]);
    setCurrentIndices({});
    
    const response = await axios.post('http://localhost:5000/api/course/get-course-user', {
      user_id: user?._id,
    });
    
    const courseList = response.data.getCourse;

    if (courseList) {
      setCourses(courseList);
      setFilteredCourses(courseList)
      
      // Initialize indices
      const indices = {};
      courseList.forEach((course, index) => {
        indices[index] = 0;
      });
      setCurrentIndices(indices);
      
      // Start auto-slide for courses with multiple images
      courseList.forEach((course, index) => {
        if (course.images && course.images.length > 1) {
          startAutoSlide(courseList, index);
        }
      });
    }
  } catch (err) {
    toast.error("Error while fetching courses");
    console.error("Fetch Course Error:", err);
  }
};

  const startAutoSlide = (courseList, productIndex) => {
    if (intervalRefs.current[productIndex]) {
      clearInterval(intervalRefs.current[productIndex]);
    }

    intervalRefs.current[productIndex] = setInterval(() => {
      setCurrentIndices(prev => ({
        ...prev,
        [productIndex]: (prev[productIndex] + 1) % courseList[productIndex].images.length
      }));
    }, 3000);
  };

  const nextImage = (productIndex) => {
    setCurrentIndices(prev => ({
      ...prev,
      [productIndex]: (prev[productIndex] + 1) % courses[productIndex].images.length
    }));
    if (courses[productIndex]?.images.length > 1) {
      startAutoSlide(courses, productIndex);
    }
  };

  const prevImage = (productIndex) => {
    setCurrentIndices(prev => ({
      ...prev,
      [productIndex]:
        prev[productIndex] === 0
          ? courses[productIndex].images.length - 1
          : prev[productIndex] - 1
    }));
    if (courses[productIndex]?.images.length > 1) {
      startAutoSlide(courses, productIndex);
    }
  };

  const handleSliderHover = (productIndex) => {
    if (intervalRefs.current[productIndex]) {
      clearInterval(intervalRefs.current[productIndex]);
    }
  };

  const handleSliderLeave = (productIndex) => {
    if (courses[productIndex]?.images.length > 1) {
      startAutoSlide(courses, productIndex);
    }
  };

  const addToCart = async (id) => {
    console.log("add to cart");

    try {
      const response = await axios.post(`http://localhost:5000/api/cart/insert-cart`, {
        user_id: user._id,
        course_id: id
      });
      if (response) {
        toast.success("Course added to cart successfully");
        fetchCourse(); // Refresh the course list to update status
      }
    } catch (err) {
      toast.error("Error adding to cart");
      console.error(err);
    }
  };

  const openPaymentModal = (course) => {
    setSelectedCourse(course);
    setPaymentStatus("processing");
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setIsProcessingPayment(false);
  };

  const simulatePayment = async () => {
    if (!selectedCourse || !selectedCourse._id) {
      console.error("Course not selected");
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(async () => {
      const isSuccess = Math.random() > 0.3;
      setPaymentStatus(isSuccess ? "success" : "failed");

      if (isSuccess) {
        try {
          await addToCart(selectedCourse._id);
          await handleBuy(selectedCourse._id);
        } catch (error) {
          console.error("Error processing purchase:", error);
          setPaymentStatus("failed");
        }
      }

      setIsProcessingPayment(false);
    }, 2000);
  };


  const handleBuy = async (id) => {
    console.log("handle buy");

    try {
      await axios.post('http://localhost:5000/api/cart/update-cart', {
        user_id: user._id,
        course_id: [id]
      });
      fetchCourse(); // Refresh the course list to update status
    } catch (error) {
      console.error("Error purchasing course:", error);
    }
  };

  const navigateToCourseDetails = (courseId) => {
    localStorage.setItem('course_id', courseId)
    navigate(`/course`);
  };

  return (
    <div>
      <div className="text-center">
        <h1 className="text-xl mt-6 italic">Trusted by over 16,000 millions of learners around the world</h1>
        <h1 className="font-bold text-3xl mt-6 tracking-widest">Popular Courses</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 mt-6 max-w-7xl mx-auto">
        {filteredCourses.map((item, index) => (
          <div key={index} className="bg-white shadow-xl rounded-xl overflow-hidden relative group">
            {/* Status badge */}
            {item.status === 1 && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                Purchased
              </div>
            )}
            {item.status === 0 && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                In Cart
              </div>
            )}

            {/* Image Slider Container */}
            <div
              className="relative h-48 w-full overflow-hidden"
              onMouseEnter={() => handleSliderHover(index)}
              onMouseLeave={() => handleSliderLeave(index)}
            >
              <img
                src={`http://localhost:5000/${item.images[currentIndices[index]].replace(/^\/?/, '')
                  }`}
                className="h-full w-full object-cover"
                alt={item.name}
              />

              {item.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage(index);
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage(index);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}

              {item.images.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {item.images.map((_, imgIndex) => (
                    <div
                      key={imgIndex}
                      className={`w-2 h-2 rounded-full ${currentIndices[index] === imgIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="p-6">
              <p className="text-xl font-semibold">{item.name}</p>
              <p className="font-semibold mt-2">${item.price}</p>
              <p className="text-sm text-gray-600 mt-1">{item.duration}</p>

              {user ? (
                <div className="flex gap-x-2 mt-4">
                  {item.status === 1 ? (
                    <button
                      onClick={() => navigateToCourseDetails(item._id)}
                      className="bg-green-100 text-green-800 h-10 w-full rounded-md hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle /> Start Learning
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => openPaymentModal(item)}
                        className="bg-black text-white h-10 w-28 rounded-md cursor-pointer hover:bg-gray-800 transition-colors"
                        disabled={item.status === 0}
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => item.status !== 0 && addToCart(item._id)}
                        className={`h-10 w-28 rounded-md border-2 flex items-center justify-center gap-2 ${item.status === 0
                            ? "bg-blue-50 border-blue-200 text-blue-800 cursor-default"
                            : "border-black hover:bg-gray-50 cursor-pointer"
                          }`}
                      >
                        {item.status === 0 ? (
                          <>
                            <FaShoppingCart /> Added
                          </>
                        ) : (
                          "Add to cart"
                        )}
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex gap-x-2 mt-4">
                  <button className="bg-black text-white h-10 w-full rounded-md cursor-pointer hover:bg-gray-800 transition-colors">
                    View Details
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {paymentStatus === 'processing' ? 'Complete Payment' :
                      paymentStatus === 'success' ? 'Payment Successful' : 'Payment Failed'}
                  </h3>
                  <button
                    onClick={closePaymentModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {paymentStatus === 'processing' && (
                  <div className="text-center py-6">
                    <div className="relative mx-auto w-64 h-64 mb-6 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid grid-cols-5 gap-1 p-4">
                          {Array(25).fill(0).map((_, i) => (
                            <div
                              key={i}
                              className={`w-5 h-5 rounded-sm ${Math.random() > 0.3 ? 'bg-blue-600' : 'bg-white'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FiCreditCard className="text-blue-200 text-5xl" />
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">You're purchasing: {selectedCourse?.name}</p>
                    <p className="text-xl font-bold mb-4">${selectedCourse?.price}</p>
                    <p className="text-sm text-gray-500 mb-6">Select your payment method...</p>
                    <PulseLoader color="#3B82F6" size={10} />
                    <p className="mt-4 text-sm text-gray-500">Processing payment...</p>
                    {!isProcessingPayment && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={simulatePayment}
                        className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                      >
                        Simulate Payment
                      </motion.button>
                    )}
                  </div>
                )}

                {paymentStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6"
                  >
                    <div className="relative mx-auto w-20 h-20 mb-6">
                      <div className="absolute inset-0 bg-green-100 rounded-full flex items-center justify-center">
                        <FiCheckCircle className="text-3xl text-green-500" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h4>
                    <p className="text-gray-600 mb-6">
                      Thank you for purchasing "{selectedCourse?.name}". The course is now available in your account.
                    </p>
                    <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-6 text-left">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Course:</span>
                        <span>{selectedCourse?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Amount:</span>
                        <span>${selectedCourse?.price}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        closePaymentModal();
                        navigateToCourseDetails(selectedCourse._id);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                    >
                      Start Learning
                    </motion.button>
                  </motion.div>
                )}

                {paymentStatus === 'failed' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6"
                  >
                    <div className="relative mx-auto w-20 h-20 mb-6">
                      <div className="absolute inset-0 bg-red-100 rounded-full flex items-center justify-center">
                        <FiAlertCircle className="text-3xl text-red-500" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Payment Failed</h4>
                    <p className="text-gray-600 mb-6">
                      We couldn't process your payment for "{selectedCourse?.name}". Please try again or use a different payment method.
                    </p>
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentStatus('processing')}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                      >
                        Try Again
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={closePaymentModal}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium transition-all shadow-sm hover:shadow"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}