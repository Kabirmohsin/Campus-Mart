import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import CheckoutForm from '../components/Checkout/CheckoutForm';
import OrderSummary from '../components/Checkout/OrderSummary';
import PaymentMethod from '../components/Checkout/PaymentMethod';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { getCartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    instructions: ''
  });

  const [errors, setErrors] = useState({});

  const cartItems = getCartItems();
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 5.00 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateForm()) {
      setCurrentStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const orderData = {
        userId: user.id,
        items: cartItems,
        shippingInfo: formData,
        paymentMethod,
        subtotal,
        shipping,
        tax,
        totalAmount: total,
        status: 'pending'
      };

      const order = createOrder(orderData);
      clearCart();
      
      toast.success('Order placed successfully!');
      navigate(`/order/${order._id}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`ml-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              Shipping
            </div>
          </div>
          
          <div className={`w-16 h-0.5 mx-4 ${
            currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
          }`}></div>
          
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <div className={`ml-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              Payment
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {currentStep === 1 && (
              <>
                <CheckoutForm
                  formData={formData}
                  onChange={setFormData}
                  errors={errors}
                />
                
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <PaymentMethod
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                />
                
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back to Shipping
                  </button>
                  
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="small" />
                        <span>Placing Order...</span>
                      </>
                    ) : (
                      <span>Place Order</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary items={cartItems} />
        </div>
      </div>
    </div>
  );
};

export default Checkout;