import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { 
  FiShoppingCart, 
  FiTrash2, 
  FiArrowLeft,
  FiZap,
  FiCheckCircle
} from 'react-icons/fi';
import { UserContext } from '../../context/userContext';
import { Link } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentModal from './PaymentModal';

const UserCart = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const { user } = useContext(UserContext);
    const user_id = user?._id || "685c07d604a1e6a7ca29c366";

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cart/get-cart/${user_id}`);
                const data = response.data;
                setCart(data.cartItems.filter(item => item.course_id !== null));
                setTotal(data.total);
            } catch (err) {
                console.error("Failed to fetch cart:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [user_id]);

    const handleRemove = async (courseId) => {
        setIsRemoving(true);
        try {
            const response = await axios.delete(`http://localhost:5000/api/cart/delete-cart/${user_id}/${courseId}`);
            if (response.status === 200) {
                const removedItem = cart.find(item => item.course_id._id === courseId);
                setCart(cart.filter(item => item.course_id._id !== courseId));
                setTotal(total - (removedItem?.course_id?.price || 0));
            }
        } catch (err) {
            console.error("Failed to remove item:", err);
        } finally {
            setIsRemoving(false);
        }
    };

    const handleBuyNow = (course) => {
        setShowPaymentModal(true);
        setPaymentStatus('processing');
    };

    const handleCheckout = () => {
        setShowPaymentModal(true);
        setPaymentStatus('processing');
    };

    const simulatePayment = () => {
        setIsProcessingPayment(true);
        setTimeout(() => {
            const isSuccess = Math.random() > 0.2;
            setPaymentStatus(isSuccess ? 'success' : 'failed');
            
            if (isSuccess) {
                setTimeout(() => {
                    setCart([]);
                    setTotal(0);
                }, 2000);
            }
        }, 3000);
    };
    
    const updateCartStatus = async()=>{
       try {
          await axios.post()
       } catch (error) {
        console.log("error : ",error);
        
       }
    }
    const closePaymentModal = () => {
        setShowPaymentModal(false);
        setPaymentStatus(null);
        setIsProcessingPayment(false);
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <PulseLoader color="#3B82F6" size={15} />
            <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
    );

    if (cart.length === 0 && !showPaymentModal) return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-50"
        >
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
                {paymentStatus === 'success' ? (
                    <>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <FiCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6">
                            Your courses have been added to your account. Start learning now!
                        </p>
                        <Link 
                            to="/my-courses" 
                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                        >
                            Go to My Courses
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="relative mx-auto w-20 h-20 mb-6">
                            <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center">
                                <FiShoppingCart className="text-3xl text-blue-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">
                            Looks like you haven't added any courses yet. Start exploring our catalog!
                        </p>
                        <Link 
                            to="/home" 
                            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white hover:bg-gray-900 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                        >
                            Browse Courses
                        </Link>
                    </>
                )}
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <PaymentModal
                showPaymentModal={showPaymentModal}
                closePaymentModal={closePaymentModal}
                paymentStatus={paymentStatus}
                isProcessingPayment={isProcessingPayment}
                simulatePayment={simulatePayment}
                total={total}
                setPaymentStatus={setPaymentStatus}
            />

            <div className="max-w-7xl mx-auto">
                <div className="flex items-center mb-8">
                    <Link 
                        to="/home"
                        className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FiArrowLeft size={20} />
                    </Link>
                    <div className="relative mr-3">
                        <FiShoppingCart className="text-3xl text-blue-600" />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cart.length}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3">
                        <motion.div 
                            layout
                            className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100"
                        >
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div 
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                        className="flex flex-col sm:flex-row group hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Image */}
                                        <div className="sm:w-1/3 h-48 sm:h-40 overflow-hidden relative">
                                            <img 
                                                src={`http://localhost:5000/${item.course_id.images[0]}`} 
                                                alt={item.course_id.name} 
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.course_id.name}</h3>
                                                <p className="text-sm text-gray-500 mb-2">{item.course_id.duration}</p>
                                                <p className="text-lg font-bold text-blue-600">${item.course_id.price.toFixed(2)}</p>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleBuyNow(item.course_id)}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-2 px-4 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                                                >
                                                    <FiZap className="inline" />
                                                    Buy Now
                                                </motion.button>
                                                
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleRemove(item.course_id._id)}
                                                    disabled={isRemoving}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-all shadow-sm hover:shadow disabled:opacity-50"
                                                >
                                                    {isRemoving ? (
                                                        <PulseLoader color="#6B7280" size={8} />
                                                    ) : (
                                                        <>
                                                            <FiTrash2 className="inline" />
                                                            Remove
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-medium text-green-500">$0.00</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4 flex justify-between">
                                    <span className="font-bold text-gray-800">Total</span>
                                    <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCheckout}
                                className="w-full bg-black text-white hover:bg-gray-900 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                                disabled={cart.length === 0}
                            >
                                Checkout All Items
                            </motion.button>
                            
                            <p className="text-xs text-gray-500 mt-3 text-center">
                                By completing your purchase, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                            </p>

                            {/* Payment methods */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h4 className="text-sm font-medium text-gray-500 mb-3">We accept</h4>
                                <div className="flex justify-center gap-4">
                                    <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-800">VISA</span>
                                    </div>
                                    <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                                        <span className="text-xs font-bold text-red-800">MC</span>
                                    </div>
                                    <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-400">PP</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCart;