import React, { useState, useEffect } from 'react';
import Header from './home/Header';
import { useAuth } from '../Context/AuthProvider';

const UserOrders = () => {
  const authContext = useAuth();
  if (!authContext) return null;
  
  const [authUser] = authContext;
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (authUser) {
      fetchOrders();
    }
  }, [authUser]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/user/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!authUser) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
            <p className="text-gray-600 mb-6">You need to login to view your orders</p>
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
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            <button 
              onClick={() => window.location.href = '/profile'}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              ← Back to Profile
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">₹{order.totalAmount}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Items Ordered:</h4>
                          <div className="space-y-2">
                            {order.products.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {item.product?.name || 'Product'} × {item.quantity}
                                </span>
                                <span className="text-gray-800">
                                  ₹{(item.product?.price * item.quantity || 0).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Delivery Details:</h4>
                          <div className="text-sm text-gray-600">
                            <p>{order.address?.street}</p>
                            <p>{order.address?.city}, {order.address?.state}</p>
                            <p>{order.address?.zipCode}, {order.address?.country}</p>
                            <p className="mt-2">
                              <span className="font-medium">Payment:</span> {order.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <button 
                          onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                          className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                        >
                          {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                        </button>
                        
                        {order.status === 'delivered' && (
                          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors">
                            Reorder
                          </button>
                        )}
                      </div>

                      {selectedOrder === order._id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-800 mb-2">Order Details:</h5>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Order Placed</span>
                              <span>{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Status</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                            </div>
                            {order.updatedAt !== order.createdAt && (
                              <div className="flex justify-between">
                                <span>Last Updated</span>
                                <span>{new Date(order.updatedAt).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-8xl mb-6">🍽️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
              <p className="text-gray-600 mb-8">
                You haven't placed any orders yet. Start exploring our delicious menu!
              </p>
              <button
                onClick={() => window.location.href = '/category'}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Browse Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserOrders;