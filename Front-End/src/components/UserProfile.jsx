import React, { useState, useEffect } from 'react';
import Header from './home/Header';
import ProfileCard from './ProfileCard';
import { useAuth } from '../Context/AuthProvider';

const UserProfile = () => {
  const authContext = useAuth();
  if (!authContext) return null;
  
  const [authUser] = authContext;
  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      fetchUserOrders();
    }
  }, [authUser]);

  const fetchUserOrders = async () => {
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
        setUserOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!authUser) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
            <p className="text-gray-600 mb-6">You need to login to view your profile</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <ProfileCard />
            </div>

            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h3>
                
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.slice(0, 5).map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">Order #{order._id.slice(-8)}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">₹{order.totalAmount}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.products.length} item(s) • {order.paymentMethod}
                        </div>
                      </div>
                    ))}
                    
                    {userOrders.length > 5 && (
                      <div className="text-center pt-4">
                        <button 
                          onClick={() => window.location.href = '/orders'}
                          className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                          View All Orders →
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">No Orders Yet</h4>
                    <p className="text-gray-600 mb-4">Start exploring our delicious menu!</p>
                    <button
                      onClick={() => window.location.href = '/category'}
                      className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Browse Menu
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;