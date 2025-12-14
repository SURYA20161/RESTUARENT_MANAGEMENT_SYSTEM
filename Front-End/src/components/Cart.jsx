import  { useState, useEffect } from 'react';
import Header from './home/Header';
import { useAuth } from '../Context/AuthProvider';

const Cart = () => {
  const authContext = useAuth();
  if (!authContext) return null;
  
  const [authUser] = authContext;
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (authUser) {
      fetchCart();
    }
  }, [authUser]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/cart/${authUser._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart?.items || []);
        calculateTotal(data.cart?.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
    setTotal(totalAmount);
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      
      if (response.ok) {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/cart/remove', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      });
      
      if (response.ok) {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (!authUser) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
            <p className="text-gray-600 mb-6">You need to login to view your cart</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
            <button 
              onClick={() => window.location.href = '/profile'}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              ← Back to Profile
            </button>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-6">Cart Items ({cartItems.length})</h2>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img 
                          src={item.product?.imageUrl || '/placeholder-food.jpg'} 
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.product?.name}</h3>
                          <p className="text-gray-600">₹{item.product?.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{(item.product?.price * item.quantity).toFixed(2)}</p>
                          <button 
                            onClick={() => removeItem(item.product._id)}
                            className="text-red-600 hover:text-red-700 text-sm mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹50.00</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{(total + 50).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.location.href = `/checkout/${authUser._id}`}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-8xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <button 
                onClick={() => window.location.href = '/category'}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;