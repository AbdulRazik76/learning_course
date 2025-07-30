import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheckCircle, 
  FiX, 
  FiCreditCard,
  FiAlertCircle,
  FiZap
} from 'react-icons/fi';
import { PulseLoader } from 'react-spinners';

const PaymentModal = ({ 
  showPaymentModal, 
  closePaymentModal, 
  paymentStatus, 
  isProcessingPayment, 
  simulatePayment,
  total
}) => {
  return (
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
                  <p className="text-gray-600 mb-2">Scan this QR code with your payment app</p>
                  <p className="text-sm text-gray-500 mb-6">Or wait for automatic processing...</p>
                  <PulseLoader color="#3B82F6" size={10} />
                  <p className="mt-4 text-sm text-gray-500">Simulating payment processing...</p>
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
                    Thank you for your purchase. Your courses are now available in your account.
                  </p>
                  <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-6 text-left">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Transaction ID:</span>
                      <span>{Math.random().toString(36).substring(2, 15)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Amount:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closePaymentModal}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Continue Learning
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
                    We couldn't process your payment. Please try again or use a different payment method.
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
  );
};

export default PaymentModal;